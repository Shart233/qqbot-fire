import { createConnection } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { performance } from "node:perf_hooks";
import type { BotService } from "./service.js";
import type { NapCatService } from "../napcat/service.js";

export type ConnectionPolicy = {
  portTimeoutMs?: number;
  connectTimeoutMs?: number;
  onlineTimeoutMs?: number;
  pollMs?: number;
};

async function portReady(url: URL, signal: AbortSignal): Promise<boolean> {
  signal.throwIfAborted();
  return new Promise<boolean>((resolve) => {
    const socket = createConnection({
      host: url.hostname.replace(/^\[|\]$/g, ""),
      port: Number(
        url.port || (["https:", "wss:"].includes(url.protocol) ? 443 : 80),
      ),
      signal,
    });
    const done = (ready: boolean) => {
      socket.destroy();
      resolve(ready);
    };
    socket.setTimeout(1000);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}
async function cancellable<T>(
  work: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  signal.throwIfAborted();
  let abort: () => void = () => {};
  try {
    return await Promise.race([
      work,
      new Promise<never>((_, reject) => {
        abort = () => reject(signal.reason);
        signal.addEventListener("abort", abort, { once: true });
      }),
    ]);
  } finally {
    signal.removeEventListener("abort", abort);
  }
}

/** 端口就绪和账号上线分别等待；超时不保留可误用的离线连接。 */
export async function connectWhenReady(
  bots: BotService,
  napcat: NapCatService,
  name: string,
  signal: AbortSignal,
  policy: ConnectionPolicy = {},
): Promise<boolean> {
  const pollMs = policy.pollMs ?? 1000;
  let identity = bots.connectionIdentity(name);
  try {
    signal.throwIfAborted();
    const instance = await bots.instanceName(name);
    if (
      instance &&
      napcat.mode === "managed" &&
      !(await napcat.list()).some(
        (item) => item.name === instance && item.alive,
      )
    )
      await napcat.start(instance);
    signal.throwIfAborted();
    if (!bots.isConnected(name)) {
      const config = await bots.getConfig(name);
      const url = new URL(
        config.mode === "http" ? config.httpUrl : config.wsUrl,
      );
      const portSignal = AbortSignal.any([
        signal,
        AbortSignal.timeout(policy.portTimeoutMs ?? 120_000),
      ]);
      while (!(await portReady(url, portSignal)))
        await delay(pollMs, undefined, { signal: portSignal });
      const connectSignal = AbortSignal.any([
        signal,
        AbortSignal.timeout(policy.connectTimeoutMs ?? 10_000),
      ]);
      await bots.connect(name, false, connectSignal);
      identity = bots.connectionIdentity(name);
    }
    const onlineSignal = AbortSignal.any([
      signal,
      AbortSignal.timeout(policy.onlineTimeoutMs ?? 30_000),
    ]);
    const deadline = performance.now() + (policy.onlineTimeoutMs ?? 30_000);
    while (performance.now() < deadline) {
      onlineSignal.throwIfAborted();
      if (identity !== bots.connectionIdentity(name)) return false;
      try {
        const status = await cancellable(
          bots.call(name, "get_status"),
          onlineSignal,
        );
        if (
          status &&
          typeof status === "object" &&
          "online" in status &&
          status.online === true
        )
          return true;
      } catch {
        onlineSignal.throwIfAborted();
      }
      await delay(pollMs, undefined, { signal: onlineSignal });
    }
  } catch {
    /* 调度器按连接失败策略持久化重试；取消不产生额外发送。 */
  }
  if (identity) await bots.disconnectIfCurrent(name, identity);
  return false;
}
