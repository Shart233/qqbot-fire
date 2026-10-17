import { randomBytes } from "node:crypto";
import { constants } from "node:fs";
import { mkdir, lstat, readFile, appendFile, copyFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createServer, type Server } from "node:net";
import { JsonStore } from "../../infrastructure/storage/json-store.js";
import {
  defaultConfig,
  normalizeConfig,
} from "../../infrastructure/storage/config.js";
import {
  buildLaunch,
  OwnedProcess,
} from "../../infrastructure/process/owned-process.js";
import { ApiError } from "../../http/errors.js";
import { NapCatLoginClient } from "./login.js";
import { discoverAll, readOneBotConfig, mergeConfig } from "./discovery.js";
import type { BotService } from "../bots/service.js";
import { ensureRsa, loadRsa } from "../../infrastructure/crypto/keys.js";
import type {
  ExternalNapCat,
  BotConfig,
  NapCatInstance,
} from "@qqbot/contracts";

type SavedInstance = {
  name: string;
  qqUin: string;
  webuiPort: number;
  external?: { webuiUrl: string; token: string };
};
type Runtime = SavedInstance & {
  wsPort: number;
  httpPort: number;
  workDir: string;
  process: OwnedProcess;
  login: NapCatLoginClient;
  lines: string[];
  logQueue: Promise<void>;
  logBytes: number;
};
export type NapCatMode = "managed" | "external";
function externalUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ApiError(400, "WebUI 地址无效");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new ApiError(400, "WebUI 地址需为 HTTP 或 HTTPS 服务地址");
  return url;
}
function identifier(name: string) {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(name))
    throw new ApiError(400, "非法 NapCat 实例名");
}
function qq(qqUin: string) {
  if (!/^[1-9]\d{0,15}$/.test(qqUin) || !Number.isSafeInteger(Number(qqUin)))
    throw new ApiError(400, "QQ 号必须是安全整数");
}
async function reserve(
  port: number,
): Promise<{ port: number; release: () => Promise<void> }> {
  const server: Server = createServer();
  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, "127.0.0.1", resolve);
    });
  } catch {
    throw new ApiError(409, "端口已被占用：" + port);
  }
  const actual = (server.address() as { port: number }).port;
  return {
    port: actual,
    release: () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}
export class NapCatService {
  private readonly subscribers = new Map<string, Set<(line: string) => void>>();
  private readonly externalClients = new Map<string, NapCatLoginClient>();
  private readonly runtimes = new Map<string, Runtime>();
  private queue: Promise<unknown> = Promise.resolve();
  private closed = false;
  constructor(
    private readonly store: JsonStore,
    private readonly bots: BotService,
    readonly mode: NapCatMode = "managed",
  ) {}
  private serial<T>(action: () => Promise<T>): Promise<T> {
    if (this.closed) throw new ApiError(503, "服务正在停止");
    const operation = this.queue.catch(() => {}).then(action);
    this.queue = operation;
    return operation;
  }
  private async saved(): Promise<SavedInstance[]> {
    const saved: unknown = await this.store.read("napcat_instances.json", []);
    if (!Array.isArray(saved)) throw new Error("保存实例文件应为数组");
    const names = new Set<string>();
    for (const item of saved) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.name !== "string" ||
        typeof item.qqUin !== "string"
      )
        throw new Error("保存实例格式损坏");
      identifier(item.name);
      qq(item.qqUin);
      if (
        !Number.isInteger(item.webuiPort) ||
        item.webuiPort < 1 ||
        item.webuiPort > 65535 ||
        names.has(item.name)
      )
        throw new Error("保存实例端口或名称损坏");
      if (item.external) {
        externalUrl(item.external.webuiUrl);
        if (
          typeof item.external.token !== "string" ||
          !item.external.token.startsWith("RSA:")
        )
          throw new Error("外部实例凭据格式损坏");
      }
      names.add(item.name);
    }
    return saved as SavedInstance[];
  }
  async validate() {
    await this.saved();
  }
  async config() {
    const config = normalizeConfig(
      await this.store.read("config.json", defaultConfig()),
    );
    return {
      napCatDir: config.napCatDir ?? "",
      workRoot: config.napCatWorkRoot ?? "",
    };
  }
  async updateConfig(patch: { napCatDir?: string; workRoot?: string }) {
    await this.store.update(
      "config.json",
      (raw) => {
        const config = normalizeConfig(raw);
        if (patch.napCatDir !== undefined) config.napCatDir = patch.napCatDir;
        if (patch.workRoot !== undefined)
          config.napCatWorkRoot = patch.workRoot;
        return config;
      },
      defaultConfig(),
    );
    return { message: "NapCat 配置已更新" };
  }
  private async paths() {
    const config = await this.config();
    if (!config.napCatDir) throw new ApiError(400, "请先设置 NapCat 目录");
    return {
      napcatDir: resolve(config.napCatDir),
      workRoot: resolve(
        config.workRoot || join(this.store.directory, "napcat-instances"),
      ),
    };
  }
  async listSaved() {
    return (await this.saved()).map((item) => ({
      name: item.name,
      qqUin: item.qqUin,
      webuiPort: item.webuiPort,
      external: !!item.external,
      running: this.runtimes.get(item.name)?.process.alive ?? false,
    }));
  }
  private async token(runtime: Runtime) {
    try {
      const path = join(runtime.workDir, "config/webui.json");
      const stat = await lstat(path);
      if (stat.isSymbolicLink() || stat.size > 64 * 1024) return "";
      const value = JSON.parse(await readFile(path, "utf8")) as {
        token?: unknown;
      };
      return typeof value.token === "string" ? value.token : "";
    } catch {
      return "";
    }
  }
  async list(): Promise<NapCatInstance[]> {
    const saved = await this.saved();
    const results: NapCatInstance[] = [];
    for (const runtime of this.runtimes.values())
      results.push({
        name: runtime.name,
        qqUin: runtime.qqUin,
        wsPort: runtime.wsPort,
        httpPort: runtime.httpPort,
        webuiPort: runtime.webuiPort,
        webuiToken: await this.token(runtime),
        workDir: runtime.workDir,
        pid: runtime.process.pid,
        alive: runtime.process.alive,
        saved: saved.some((item) => item.name === runtime.name),
      });
    for (const item of saved)
      if (!this.runtimes.has(item.name))
        results.push({
          name: item.name,
          qqUin: item.qqUin,
          webuiPort: item.webuiPort,
          ...(item.external
            ? { external: true, webuiUrl: item.external.webuiUrl }
            : {}),
          wsPort: 0,
          httpPort: 0,
          webuiToken: "",
          workDir: "",
          pid: 0,
          alive: false,
          saved: true,
        });
    return results;
  }
  private requireManaged() {
    if (this.mode === "external")
      throw new ApiError(
        409,
        "外部模式不管理 NapCat 进程，请在其所属环境中启动或停止",
      );
  }
  start(name: string, requestedQQ?: string, requestedPort?: number) {
    identifier(name);
    return this.serial(async () => {
      this.requireManaged();
      const old = this.runtimes.get(name);
      if (old?.process.alive)
        throw new ApiError(409, `实例 '${name}' 已在运行中`);
      if (old) {
        await old.process.stop();
        this.runtimes.delete(name);
      }
      const saved = (await this.saved()).find((item) => item.name === name);
      if (saved?.external)
        throw new ApiError(409, "外部实例请在其所属环境管理进程");
      const qqUin = requestedQQ || saved?.qqUin;
      if (!qqUin)
        throw new ApiError(400, "缺少 name 或 qq 参数 (记忆中也没有此实例)");
      qq(qqUin);
      const { napcatDir, workRoot } = await this.paths();
      const workDir = join(workRoot, name);
      try {
        if ((await lstat(workDir)).isSymbolicLink())
          throw new ApiError(400, "实例目录不能是符号链接");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      const shared = await readOneBotConfig(
        join(napcatDir, "config", `onebot11_${qqUin}.json`),
      );
      const local = await readOneBotConfig(
        join(workDir, "config", `onebot11_${qqUin}.json`),
      );
      const discovered =
        shared && local ? mergeConfig(shared, local) : (local ?? shared);
      const reservations: Awaited<ReturnType<typeof reserve>>[] = [];
      let process: OwnedProcess | undefined;
      try {
        // 已有实例尚未绑定端口时也参与冲突检查，防止连续点击分配重复端口。
        const used = new Set(
          [...this.runtimes.values()]
            .filter((item) => item.process.alive)
            .flatMap((item) => [item.wsPort, item.httpPort, item.webuiPort]),
        );
        const select = async (port: number) => {
          if (port && used.has(port))
            throw new ApiError(409, "端口已被本服务实例占用：" + port);
          const selected = await reserve(port);
          reservations.push(selected);
          used.add(selected.port);
          return selected.port;
        };
        const webuiPort = await select(
          requestedPort ?? saved?.webuiPort ?? 6099,
        );
        const wsPort = await select(discovered?.wsPort ?? 0);
        const httpPort = await select(discovered?.httpPort ?? 0);
        await mkdir(join(workDir, "config"), { recursive: true, mode: 0o700 });
        const localStore = new JsonStore(join(workDir, "config"));
        const wsToken = discovered?.wsToken || randomBytes(24).toString("hex");
        const httpToken =
          discovered?.httpToken || randomBytes(24).toString("hex");
        await localStore.update<Record<string, unknown>>(
          `onebot11_${qqUin}.json`,
          (raw) => {
            const network = (raw.network ?? {}) as Record<string, unknown>;
            const configure = (key: string, port: number, token: string) => {
              const servers = Array.isArray(network[key])
                ? ([...network[key]] as Record<string, unknown>[])
                : [];
              const index = servers.findIndex((item) => item.enable === true);
              const prior = index < 0 ? {} : servers[index]!;
              const entry = {
                ...prior,
                name: prior.name ?? key,
                enable: true,
                host: "127.0.0.1",
                port,
                token,
              };
              if (index < 0) servers.push(entry);
              else servers[index] = entry;
              network[key] = servers;
            };
            configure("websocketServers", wsPort, wsToken);
            configure("httpServers", httpPort, httpToken);
            return { ...raw, network };
          },
          {},
        );
        await localStore.update<Record<string, unknown>>(
          "webui.json",
          (raw) => ({
            ...raw,
            host: "127.0.0.1",
            port: webuiPort,
            token:
              typeof raw.token === "string" && raw.token
                ? raw.token
                : randomBytes(24).toString("hex"),
          }),
          {},
        );
        // 默认核心配置来自镜像，实例中已有配置永不覆盖。
        try {
          await copyFile(
            join(napcatDir, "config/napcat.json"),
            join(workDir, "config/napcat.json"),
            constants.COPYFILE_EXCL,
          );
        } catch (error) {
          if (
            !["ENOENT", "EEXIST"].includes(
              (error as NodeJS.ErrnoException).code ?? "",
            )
          )
            throw error;
        }
        await mkdir(join(workDir, "home"), { recursive: true, mode: 0o700 });
        const launch = await buildLaunch(napcatDir, workDir, qqUin, webuiPort);
        await mkdir(join(this.store.directory, "logs"), { recursive: true });
        const lines: string[] = [];
        let logQueue: Promise<void> = Promise.resolve();
        let bytes = 0;
        const onLine = (line: string) => {
          for (const receive of this.subscribers.get(name) ?? []) {
            try {
              receive(line);
            } catch {
              /* 一个日志订阅失败不影响实例。 */
            }
          }
          lines.push(line);
          if (lines.length > 500) lines.shift();
          const length = Buffer.byteLength(line) + 1;
          if (bytes + length > 10 * 1024 * 1024) return;
          bytes += length;
          logQueue = logQueue
            .then(() =>
              appendFile(
                join(this.store.directory, "logs", `napcat-${name}.log`),
                line + "\n",
                { mode: 0o600 },
              ),
            )
            .catch(() => {});
          const runtime = this.runtimes.get(name);
          if (runtime) {
            runtime.logQueue = logQueue;
            runtime.logBytes = bytes;
          }
        };
        for (const reservation of reservations) await reservation.release();
        reservations.length = 0;
        process = new OwnedProcess(launch, onLine);
        await process.ready();
        const login = new NapCatLoginClient({
          name,
          qqUin,
          webuiPort,
          workDir,
          startedAt: process.startedAt,
          alive: () => process!.alive,
        });
        const runtime: Runtime = {
          name,
          qqUin,
          webuiPort,
          wsPort,
          httpPort,
          workDir,
          process,
          login,
          lines,
          logQueue,
          logBytes: bytes,
        };
        this.runtimes.set(name, runtime);
        await this.store.update<SavedInstance[]>(
          "napcat_instances.json",
          (items) => [
            ...items.filter((item) => item.name !== name),
            { name, qqUin, webuiPort },
          ],
          [],
        );
        const patch: Partial<Omit<BotConfig, "name">> = {
          mode: "ws",
          wsUrl: `ws://127.0.0.1:${wsPort}`,
          httpUrl: `http://127.0.0.1:${httpPort}`,
          wsToken,
          httpToken,
        };
        const botName = await this.bots.linkInstance(
          "qq" + qqUin,
          { name, qqUin },
          patch,
        );
        return {
          name,
          qq: qqUin,
          wsPort,
          httpPort,
          webuiPort,
          webuiToken: await this.token(runtime),
          botName,
        };
      } catch (error) {
        if (process) await process.stop();
        this.runtimes.delete(name);
        throw error;
      } finally {
        for (const reservation of reservations) await reservation.release();
      }
    });
  }
  stop(name: string) {
    if (name.toLowerCase() !== "all") identifier(name);
    return this.serial(async () => {
      this.requireManaged();
      if (name.toLowerCase() === "all") {
        for (const current of [...this.runtimes.keys()])
          await this.stopOne(current);
        return { message: "已停止所有实例" };
      }
      if (!this.runtimes.has(name))
        throw new ApiError(404, `实例 '${name}' 不存在或已停止`);
      await this.stopOne(name);
      return { stopped: name };
    });
  }
  private async stopOne(name: string) {
    const runtime = this.runtimes.get(name);
    if (!runtime) return;
    await this.bots.disconnectInstance(name);
    await runtime.process.stop();
    await runtime.logQueue;
    this.runtimes.delete(name);
  }
  async updateSaved(
    name: string,
    patch: { qqUin?: string; webuiPort?: number },
  ) {
    identifier(name);
    return this.serial(async () => {
      if (this.runtimes.get(name)?.process.alive)
        throw new ApiError(400, `实例 '${name}' 正在运行，请先停止再编辑`);
      const current = (await this.saved()).find((item) => item.name === name);
      if (!current) throw new ApiError(404, `记忆中没有实例 '${name}'`);
      if (current.external)
        throw new ApiError(409, "请通过外部实例配置更新此实例");
      const value = { ...current, ...patch };
      qq(value.qqUin);
      await this.store.update<SavedInstance[]>(
        "napcat_instances.json",
        (items) => items.map((item) => (item.name === name ? value : item)),
        [],
      );
      return { updated: name };
    });
  }
  async forget(name: string) {
    if (name.toLowerCase() !== "all") identifier(name);
    return this.serial(async () => {
      const saved = await this.saved();
      if (
        name.toLowerCase() !== "all" &&
        !saved.some((item) => item.name === name)
      )
        throw new ApiError(404, `记忆中没有实例 '${name}'`);
      await this.store.update<SavedInstance[]>(
        "napcat_instances.json",
        (items) =>
          name.toLowerCase() === "all"
            ? []
            : items.filter((item) => item.name !== name),
        [],
      );
      if (name.toLowerCase() === "all") this.externalClients.clear();
      else this.externalClients.delete(name);
      return { forgotten: name.toLowerCase() === "all" ? saved.length : name };
    });
  }
  async login(name: string) {
    identifier(name);
    const runtime = this.runtimes.get(name);
    if (runtime) return runtime.login.status();
    const saved = (await this.saved()).find((item) => item.name === name);
    if (!saved) throw new ApiError(404, "NapCat 实例不存在或尚未启动");
    if (saved.external) return (await this.externalClient(saved)).status();
    return {
      name,
      qqUin: saved.qqUin,
      state: "stopped",
      message: "实例尚未启动，请先启动再扫码",
      qrImage: "",
      qrVersion: "",
      canRefresh: false,
    };
  }
  async refresh(name: string) {
    identifier(name);
    const runtime = this.runtimes.get(name);
    if (!runtime?.process.alive) {
      const saved = (await this.saved()).find((item) => item.name === name);
      if (saved?.external) {
        await (await this.externalClient(saved)).refresh();
        return { message: "已请求刷新二维码，请等待新图片" };
      }
      throw new ApiError(404, "NapCat 实例不存在或尚未启动");
    }
    try {
      await runtime.login.refresh();
      return { message: "已请求刷新二维码，请等待新图片" };
    } catch {
      throw new ApiError(
        502,
        "二维码刷新失败，请稍后重试；若 QQ 已离线，请重启此实例",
      );
    }
  }
  private async externalClient(saved: SavedInstance) {
    let client = this.externalClients.get(saved.name);
    if (!client) {
      const remote = saved.external!;
      client = new NapCatLoginClient({
        name: saved.name,
        qqUin: saved.qqUin,
        workDir: "",
        webuiPort: saved.webuiPort,
        startedAt: 0,
        alive: () => true,
        webuiUrl: remote.webuiUrl,
        token: async () =>
          (await loadRsa(this.store.directory)).decrypt(remote.token),
      });
      this.externalClients.set(saved.name, client);
    }
    return client;
  }
  registerExternal(input: ExternalNapCat) {
    identifier(input.name);
    qq(input.qqUin);
    const url = externalUrl(input.webuiUrl);
    return this.serial(async () => {
      if (this.runtimes.has(input.name))
        throw new ApiError(409, "同名托管实例存在，请先停止并更换名称");
      const saved = await this.saved();
      if (saved.some((item) => item.name === input.name && !item.external))
        throw new ApiError(409, "同名实例已保存，请使用其他名称");
      const rsa = await ensureRsa(this.store.directory);
      // 连接地址由 Bot 服务校验并加密保存，WebUI 凭据独立保存。
      const botName = await this.bots.linkInstance(
        "qq" + input.qqUin,
        { name: input.name, qqUin: input.qqUin },
        {
          ...(input.wsUrl ? { mode: "ws" as const, wsUrl: input.wsUrl } : {}),
          ...(input.httpUrl
            ? {
                httpUrl: input.httpUrl,
                ...(!input.wsUrl ? { mode: "http" as const } : {}),
              }
            : {}),
          ...(input.wsToken !== undefined ? { wsToken: input.wsToken } : {}),
          ...(input.httpToken !== undefined
            ? { httpToken: input.httpToken }
            : {}),
        },
      );
      await this.store.update<SavedInstance[]>(
        "napcat_instances.json",
        (items) => [
          ...items.filter((item) => item.name !== input.name),
          {
            name: input.name,
            qqUin: input.qqUin,
            webuiPort: Number(
              url.port || (url.protocol === "https:" ? 443 : 80),
            ),
            external: {
              webuiUrl: url.href.replace(/\/$/, ""),
              token: rsa.encrypt(input.webuiToken),
            },
          },
        ],
        [],
      );
      this.externalClients.delete(input.name);
      return { name: input.name, botName };
    });
  }
  subscribe(name: string, receive: (line: string) => void) {
    this.log(name);
    let listeners = this.subscribers.get(name);
    if (!listeners) {
      listeners = new Set();
      this.subscribers.set(name, listeners);
    }
    listeners.add(receive);
    return () => {
      listeners.delete(receive);
      if (!listeners.size) this.subscribers.delete(name);
    };
  }
  log(name: string) {
    identifier(name);
    const runtime = this.runtimes.get(name);
    if (!runtime) throw new ApiError(404, `实例 '${name}' 不存在`);
    return { name, lines: [...runtime.lines] };
  }
  discover() {
    return this.serial(async () => {
      const { napcatDir, workRoot } = await this.paths();
      const found = await discoverAll(napcatDir, workRoot);
      const previous = await this.bots.list();
      const discovered: string[] = [];
      let created = 0;
      for (const item of found) {
        qq(item.qqUin);
        const name = "qq" + item.qqUin;
        discovered.push(name);
        if (!previous.bots.some((bot) => bot.name === name)) {
          await this.bots.add(name);
          created++;
        }
        const patch: Partial<Omit<BotConfig, "name">> = {
          mode: item.wsPort ? "ws" : "http",
        };
        if (item.wsPort) {
          patch.wsUrl = `ws://${item.wsHost.includes(":") ? "[" + item.wsHost + "]" : item.wsHost}:${item.wsPort}`;
          patch.wsToken = item.wsToken;
        }
        if (item.httpPort) {
          patch.httpUrl = `http://${item.httpHost.includes(":") ? "[" + item.httpHost + "]" : item.httpHost}:${item.httpPort}`;
          patch.httpToken = item.httpToken;
        }
        await this.bots.updateConfig(name, patch);
      }
      return {
        discovered,
        created,
        total: (await this.bots.list()).bots.length,
      };
    });
  }
  async close() {
    this.closed = true;
    this.subscribers.clear();
    await this.queue.catch(() => {});
    for (const name of [...this.runtimes.keys()]) await this.stopOne(name);
  }
}
