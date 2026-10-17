import { createInterface, type Interface } from "node:readline";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createApp } from "./bootstrap.js";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const dataDir = resolve(
  process.env.DATA_DIR ?? resolve(projectRoot, "data/typescript"),
);
if (dataDir === resolve(projectRoot))
  throw new Error("新服务不能直接使用旧项目根目录作为数据目录，请先导入副本");
let terminal: Interface | undefined;
let currentPort: number;
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 9989);
if (!Number.isSafeInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT 必须是有效端口");
function booleanEnv(name: string, fallback: boolean) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error(name + " 必须为 true 或 false");
}
const napcatMode = process.env.NAPCAT_MODE ?? "managed";
if (napcatMode !== "managed" && napcatMode !== "external")
  throw new Error("NAPCAT_MODE 必须为 managed 或 external");
currentPort = port;
const app = await createApp({
  consoleRuntime: {
    output: (line) => {
      process.stdout.write(line);
    },
    quit: () => {
      setImmediate(() => {
        void shutdown();
      });
    },
    webStatus: () =>
      app.server.listening
        ? `Web 服务正在运行：${host}:${currentPort}`
        : "Web 服务已停止",
    stopWeb: async (): Promise<string> => {
      if (app.server.listening)
        await new Promise<void>((resolve, reject) => {
          app.server.close((error) => (error ? reject(error) : resolve()));
          app.server.closeAllConnections();
        });
      return "Web 服务已停止，Bot 与调度器继续运行";
    },
    startWeb: async (requested?: number): Promise<string> => {
      if (app.server.listening)
        return `Web 服务正在运行：${host}:${currentPort}`;
      const target = requested ?? currentPort;
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error) => reject(error);
        app.server.once("error", onError);
        app.server.listen(target, host, () => {
          app.server.off("error", onError);
          resolve();
        });
      });
      currentPort = target;
      return `Web 服务已启动：${host}:${currentPort}`;
    },
  },
  dataDir,
  logger: true,
  napcatMode,
  ...(process.env.NAPCAT_DIR
    ? {
        napcatDefaults: {
          napcatDir: process.env.NAPCAT_DIR,
          workRoot:
            process.env.NAPCAT_WORK_ROOT ??
            resolve(dataDir, "napcat-instances"),
        },
      }
    : {}),
  napcatAutoStart: booleanEnv("NAPCAT_AUTOSTART", false),
  scheduler: {
    enabled: booleanEnv("SCHEDULING_ENABLED", false),
    timeZone: process.env.TZ ?? "Asia/Shanghai",
  },
  ntpEnabled: booleanEnv("NTP_ENABLED", true),
  ...(process.env.NTP_SERVERS
    ? {
        ntpServers: process.env.NTP_SERVERS.split(",")
          .map((host) => host.trim())
          .filter(Boolean),
      }
    : {}),
  staticDir: resolve(
    process.env.STATIC_DIR ?? resolve(projectRoot, "web-ui/dist"),
  ),
});
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  terminal?.close();
  process.stdin.pause();
  await app.close();
}
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => {
    void shutdown().catch(() => {
      process.exitCode = 1;
    });
  });
try {
  await app.listen({ host, port });
  if (booleanEnv("CONSOLE_ENABLED", !!process.stdin.isTTY)) {
    terminal = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: !!process.stdin.isTTY,
    });
    let work: Promise<unknown> = Promise.resolve();
    terminal.on("line", (line) => {
      work = work
        .then(async () => {
          if (stopping) return;
          process.stdout.write(await app.executeConsole(line));
          if (!stopping && process.stdin.isTTY) terminal?.prompt();
        })
        .catch((error) => {
          app.log.error({ err: error }, "终端命令失败");
        });
    });
    terminal.on("SIGINT", () => {
      void shutdown();
    });
    terminal.setPrompt("qqbot> ");
    if (process.stdin.isTTY) terminal.prompt();
  }
} catch (error) {
  await app.close();
  throw error;
}
