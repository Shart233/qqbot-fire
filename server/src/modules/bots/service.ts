import {
  OneBotClient,
  HttpTransport,
  WsTransport,
  EventDispatcher,
  type EventHandler,
  safeId,
  isUnknownOutcome,
  type Transport,
} from "@qqbot/onebot";
import type { BotInfo, BotConfig, BotListResponse } from "@qqbot/contracts";
import { JsonStore } from "../../infrastructure/storage/json-store.js";
import {
  defaultConfig,
  normalizeConfig,
  emptyBot,
  type Config,
  type StoredBot,
} from "../../infrastructure/storage/config.js";
import { ensureRsa, loadRsa } from "../../infrastructure/crypto/keys.js";
import { ApiError } from "../../http/errors.js";
import { randomUUID } from "node:crypto";
import { Value } from "@sinclair/typebox/value";
import { IdentifierSchema } from "@qqbot/contracts";
import { scheduleFile, ledgerFile } from "../scheduler/scheduler.js";

type Runtime = {
  transport?: Transport;
  login?: { user_id: number; nickname: string };
  queue: Promise<unknown>;
  dispatcher: EventDispatcher;
};
export class BotService {
  private readonly runtimes = new Map<string, Runtime>();
  private rsa: Awaited<ReturnType<typeof loadRsa>> | undefined;
  constructor(private readonly store: JsonStore) {}
  private runtime(name: string): Runtime {
    let runtime = this.runtimes.get(name);
    if (!runtime) {
      runtime = { queue: Promise.resolve(), dispatcher: new EventDispatcher() };
      this.runtimes.set(name, runtime);
    }
    return runtime;
  }
  private async serial<T>(
    name: string,
    action: (runtime: Runtime) => Promise<T>,
  ): Promise<T> {
    const runtime = this.runtime(name);
    const operation = runtime.queue.catch(() => {}).then(() => action(runtime));
    runtime.queue = operation;
    return operation;
  }
  private async config(): Promise<Config> {
    return normalizeConfig(
      await this.store.read("config.json", defaultConfig()),
    );
  }
  private require(config: Config, name: string): StoredBot {
    if (!Object.hasOwn(config.bots, name))
      throw new ApiError(404, `Bot '${name}' 不存在`);
    return config.bots[name]!;
  }
  private async decrypted(name: string, bot: StoredBot): Promise<BotConfig> {
    const encrypted =
      bot.wsToken.startsWith("RSA:") || bot.httpToken.startsWith("RSA:");
    if (encrypted && !this.rsa) this.rsa = await loadRsa(this.store.directory);
    return {
      name,
      mode: bot.mode,
      wsUrl: bot.wsUrl,
      httpUrl: bot.httpUrl,
      wsToken: this.rsa?.decrypt(bot.wsToken) ?? bot.wsToken,
      httpToken: this.rsa?.decrypt(bot.httpToken) ?? bot.httpToken,
    };
  }
  async getConfig(name: string): Promise<BotConfig> {
    return this.decrypted(name, this.require(await this.config(), name));
  }
  private async info(name: string, bot: StoredBot): Promise<BotInfo> {
    const current = await this.decrypted(name, bot);
    const runtime = this.runtimes.get(name);
    const mask = (token: string) =>
      !token ? "" : token.length <= 4 ? "****" : token.slice(0, 4) + "****";
    return {
      ...current,
      wsToken: mask(current.wsToken),
      httpToken: mask(current.httpToken),
      connected: runtime?.transport?.connected ?? false,
      userId: runtime?.login?.user_id ?? 0,
      nickname: runtime?.login?.nickname ?? "",
    };
  }
  async list(): Promise<BotListResponse> {
    const config = await this.config();
    return {
      bots: await Promise.all(
        Object.entries(config.bots).map(([name, bot]) => this.info(name, bot)),
      ),
      activeBot: config.activeBot,
    };
  }
  async add(name: string) {
    if (
      !Value.Check(IdentifierSchema, name) ||
      name === "state" ||
      name.startsWith("state_")
    )
      throw new ApiError(400, "Bot 名称非法或与账本文件名冲突");
    const config = await this.store.update(
      "config.json",
      (raw) => {
        const current = normalizeConfig(raw);
        if (Object.hasOwn(current.bots, name))
          throw new ApiError(409, `Bot '${name}' 已存在`);
        current.bots[name] = emptyBot();
        current.activeBot ??= name;
        return current;
      },
      defaultConfig(),
    );
    return this.info(name, config.bots[name]!);
  }
  async updateConfig(name: string, patch: Partial<Omit<BotConfig, "name">>) {
    return this.serial(name, async () => {
      const config = await this.store.update(
        "config.json",
        async (raw) => {
          const current = normalizeConfig(raw);
          const bot = this.require(current, name);
          for (const [key, value] of Object.entries(patch)) {
            if (key === "mode") {
              bot.mode = value as StoredBot["mode"];
              continue;
            }
            if (key === "wsToken" || key === "httpToken") {
              if (!this.rsa) this.rsa = await ensureRsa(this.store.directory);
              bot[key] = this.rsa.encrypt(value);
            } else if (key === "wsUrl" || key === "httpUrl") {
              if (value) {
                let parsed: URL;
                try {
                  parsed = new URL(value);
                } catch {
                  throw new ApiError(400, "连接地址非法");
                }
                if (
                  !(
                    key === "wsUrl" ? ["ws:", "wss:"] : ["http:", "https:"]
                  ).includes(parsed.protocol)
                )
                  throw new ApiError(400, "连接地址协议非法");
              }
              bot[key] = value;
            }
          }
          return current;
        },
        defaultConfig(),
      );
      return this.decrypted(name, config.bots[name]!);
    });
  }
  async setActive(name: string) {
    await this.store.update(
      "config.json",
      (raw) => {
        const config = normalizeConfig(raw);
        this.require(config, name);
        config.activeBot = name;
        return config;
      },
      defaultConfig(),
    );
    return { activeBot: name };
  }
  async clearConfig(name: string) {
    return this.serial(name, async (runtime) => {
      if (runtime.transport?.connected) throw new ApiError(400, "请先断开连接");
      const config = await this.store.update(
        "config.json",
        (raw) => {
          const current = normalizeConfig(raw);
          const bot = this.require(current, name);
          Object.assign(bot, {
            mode: "ws",
            wsUrl: "",
            httpUrl: "",
            wsToken: "",
            httpToken: "",
          });
          return current;
        },
        defaultConfig(),
      );
      return this.decrypted(name, config.bots[name]!);
    });
  }
  private async closeRuntime(runtime: Runtime) {
    await runtime.transport?.close();
    delete runtime.transport;
    delete runtime.login;
  }
  async connect(name: string, reconnect = false, signal?: AbortSignal) {
    return this.serial(name, async (runtime) => {
      const config = await this.getConfig(name);
      if (reconnect) await this.closeRuntime(runtime);
      if (runtime.transport?.connected) throw new ApiError(400, "已连接");
      await this.closeRuntime(runtime);
      let transport: Transport | undefined;
      const abort = () => {
        void transport?.close();
      };
      signal?.throwIfAborted();
      signal?.addEventListener("abort", abort, { once: true });
      try {
        transport =
          config.mode === "http"
            ? new HttpTransport(config.httpUrl, config.httpToken)
            : new WsTransport(config.wsUrl, config.wsToken);
        if (transport instanceof WsTransport)
          transport.onEvent((event) => {
            if (runtime.dispatcher.hasHandlers())
              void runtime.dispatcher.dispatch(event);
          });
        await transport.connect();
        const login = await new OneBotClient(transport).getLoginInfo();
        signal?.throwIfAborted();
        runtime.login = {
          user_id: safeId(login.user_id),
          nickname: login.nickname ?? "",
        };
        runtime.transport = transport;
        return this.info(name, this.require(await this.config(), name));
      } catch {
        await transport?.close();
        throw new ApiError(500, reconnect ? "重连失败" : "连接失败");
      } finally {
        signal?.removeEventListener("abort", abort);
      }
    });
  }
  async disconnect(name: string) {
    return this.serial(name, async (runtime) => {
      const config = await this.config();
      this.require(config, name);
      await this.closeRuntime(runtime);
      return this.info(name, config.bots[name]!);
    });
  }
  async remove(name: string) {
    return this.serial(name, async (runtime) => {
      await this.closeRuntime(runtime);
      await this.store.transaction(async (read) => {
        const config = normalizeConfig(
          await read("config.json", defaultConfig()),
        );
        this.require(config, name);
        delete config.bots[name];
        if (config.activeBot === name)
          config.activeBot = Object.keys(config.bots)[0] ?? null;
        const changes: Record<string, unknown> = { "config.json": config };
        const archive = randomUUID();
        for (const file of [scheduleFile(name), ledgerFile(name)]) {
          const value = await read<unknown>(file, null);
          if (value !== null) changes[`archived.${archive}.${file}`] = value;
          changes[file] = null;
        }
        return changes;
      });
      await runtime.dispatcher.close();
      this.runtimes.delete(name);
      return { deleted: name };
    });
  }
  async rename(name: string, newName: string) {
    return this.serial(name, async (runtime) => {
      if (
        !Value.Check(IdentifierSchema, newName) ||
        newName === "state" ||
        newName.startsWith("state_")
      )
        throw new ApiError(400, "Bot 名称非法或与账本文件名冲突");
      let result: StoredBot | undefined;
      await this.store.transaction(async (read) => {
        const config = normalizeConfig(
          await read("config.json", defaultConfig()),
        );
        const bot = this.require(config, name);
        if (Object.hasOwn(config.bots, newName))
          throw new ApiError(409, `Bot '${newName}' 已存在`);
        const changes: Record<string, unknown> = {};
        for (const [source, target] of [
          [scheduleFile(name), scheduleFile(newName)],
          [ledgerFile(name), ledgerFile(newName)],
        ] as const) {
          if ((await read<unknown>(target, null)) !== null)
            throw new ApiError(409, "目标 Bot 留有任务或账本，请先核对归属");
          const value = await read<unknown>(source, null);
          if (value !== null) changes[target] = value;
          changes[source] = null;
        }
        config.bots[newName] = bot;
        delete config.bots[name];
        if (config.activeBot === name) config.activeBot = newName;
        result = bot;
        changes["config.json"] = config;
        return changes;
      });
      this.runtimes.set(newName, runtime);
      this.runtimes.delete(name);
      return this.info(newName, result!);
    });
  }
  private async connected(name: string): Promise<Transport> {
    this.require(await this.config(), name);
    const transport = this.runtimes.get(name)?.transport;
    if (!transport?.connected) throw new ApiError(400, `Bot '${name}' 未连接`);
    return transport;
  }
  private async query<T>(
    name: string,
    operation: (client: OneBotClient) => Promise<T>,
  ): Promise<T> {
    try {
      return await operation(new OneBotClient(await this.connected(name)));
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "获取信息失败");
    }
  }
  async onEvent(name: string, handler: EventHandler) {
    await this.getConfig(name);
    return this.runtime(name).dispatcher.addHandler(handler);
  }
  async call(
    name: string,
    action: string,
    params: Record<string, unknown> = {},
  ) {
    return (await this.connected(name)).call(action, params);
  }
  async status(name: string) {
    const login = await this.query(name, (client) => client.getLoginInfo());
    const version = await this.query(name, (client) => client.getVersionInfo());
    return {
      name,
      userId: safeId(login.user_id),
      nickname: login.nickname ?? "",
      appName: version.app_name ?? "",
      appVersion: version.app_version ?? "",
      protocolVersion: version.protocol_version ?? "",
      connected: true,
    };
  }
  async friends(name: string) {
    return (await this.query(name, (client) => client.getFriendList()))
      .filter((v) => v != null)
      .map((v) => ({
        userId: safeId(v.user_id),
        nickname: v.nickname ?? "",
        remark: v.remark ?? "",
      }));
  }
  async groups(name: string) {
    return (await this.query(name, (client) => client.getGroupList()))
      .filter((v) => v != null)
      .map((v) => ({
        groupId: safeId(v.group_id),
        groupName: v.group_name ?? "",
        memberCount: v.member_count,
        maxMemberCount: v.max_member_count,
      }));
  }
  async members(name: string, groupId: number) {
    return (
      await this.query(name, (client) => client.getGroupMemberList(groupId))
    )
      .filter((v) => v != null)
      .map((v) => ({
        userId: safeId(v.user_id),
        nickname: v.nickname ?? "",
        card: v.card ?? "",
        role: v.role ?? "",
        joinTime: v.join_time,
        lastSentTime: v.last_sent_time,
        level: v.level ?? "",
      }));
  }
  isConnected(name: string) {
    return this.runtimes.get(name)?.transport?.connected ?? false;
  }
  connectionIdentity(name: string) {
    return this.runtimes.get(name)?.transport;
  }
  async instanceName(name: string) {
    return this.require(await this.config(), name).napCatInstanceName;
  }
  async disconnectIfCurrent(name: string, identity: unknown) {
    return this.serial(name, async (runtime) => {
      if (runtime.transport !== identity) return false;
      await this.closeRuntime(runtime);
      return true;
    });
  }
  async send(
    name: string,
    type: "group" | "private",
    target: number,
    message: string,
    identity?: unknown,
  ) {
    return this.serial(name, async () => {
      const transport = await this.connected(name);
      if (identity !== undefined && transport !== identity)
        throw new ApiError(409, "连接已变更，本次发送已取消");
      try {
        const client = new OneBotClient(transport);
        const messageId =
          type === "group"
            ? await client.sendGroupMsg(target, message)
            : await client.sendPrivateMsg(target, message);
        return { messageId };
      } catch (error) {
        if (isUnknownOutcome(error))
          throw new ApiError(504, "发送结果未决，请核对 QQ 后再决定是否重发");
        throw new ApiError(500, "发送失败");
      }
    });
  }
  async connectAll() {
    const { bots } = await this.list();
    const results = await Promise.allSettled(
      bots.filter((bot) => !bot.connected).map((bot) => this.connect(bot.name)),
    );
    return {
      connected: results.filter((result) => result.status === "fulfilled")
        .length,
    };
  }
  async disconnectAll() {
    const { bots } = await this.list();
    const connected = bots.filter((bot) => bot.connected);
    await Promise.all(connected.map((bot) => this.disconnect(bot.name)));
    return { disconnected: connected.length };
  }
  async clearAll() {
    await this.disconnectAll();
    await this.store.transaction(async (read) => {
      const config = normalizeConfig(
        await read("config.json", defaultConfig()),
      );
      const changes: Record<string, unknown> = {};
      const archive = randomUUID();
      for (const name of Object.keys(config.bots))
        for (const file of [scheduleFile(name), ledgerFile(name)]) {
          const value = await read<unknown>(file, null);
          if (value !== null) changes[`archived.${archive}.${file}`] = value;
          changes[file] = null;
        }
      config.bots = defaultConfig().bots;
      config.activeBot = "default";
      changes["config.json"] = config;
      return changes;
    });
    for (const runtime of this.runtimes.values())
      await runtime.dispatcher.close();
    this.runtimes.clear();
    return { message: "已清除所有配置" };
  }
  async linkInstance(
    name: string,
    instance: { name: string; qqUin: string },
    patch: Partial<Omit<BotConfig, "name">>,
  ) {
    const current = await this.list();
    const stored = await this.config();
    const linked = Object.entries(stored.bots).find(
      ([, bot]) =>
        bot.napCatInstanceName === instance.name &&
        bot.qqUin === instance.qqUin,
    )?.[0];
    const target = linked ?? name;
    if (!current.bots.some((bot) => bot.name === target))
      await this.add(target);
    await this.updateConfig(target, patch);
    await this.store.update(
      "config.json",
      (raw) => {
        const config = normalizeConfig(raw);
        const bot = this.require(config, target);
        bot.napCatInstanceName = instance.name;
        bot.qqUin = instance.qqUin;
        return config;
      },
      defaultConfig(),
    );
    return target;
  }
  async instanceUsers(instanceName: string): Promise<string[]> {
    return Object.entries((await this.config()).bots)
      .filter(([, bot]) => bot.napCatInstanceName === instanceName)
      .map(([name]) => name);
  }
  async disconnectInstance(instanceName: string) {
    await Promise.all(
      (await this.instanceUsers(instanceName)).map((name) =>
        this.disconnect(name),
      ),
    );
  }
  async close() {
    await Promise.all(
      [...this.runtimes.values()].map((runtime) =>
        runtime.queue
          .catch(() => {})
          .then(async () => {
            await this.closeRuntime(runtime);
            await runtime.dispatcher.close();
          }),
      ),
    );
  }
}
