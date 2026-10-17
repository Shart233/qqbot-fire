import WebSocket from "ws";
import { randomUUID } from "node:crypto";

export class OneBotError extends Error {}
export class UnknownOutcomeError extends OneBotError {
  readonly outcome = "unknown" as const;
}
export function isUnknownOutcome(error: unknown): boolean {
  return (
    error instanceof Error && "outcome" in error && error.outcome === "unknown"
  );
}
export type OneBotEvent = Record<string, unknown>;
export interface Transport {
  readonly connected: boolean;
  connect(): Promise<void>;
  close(): Promise<void>;
  call<T = unknown>(
    action: string,
    params?: Record<string, unknown>,
  ): Promise<T>;
}
export function safeId(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value))
    throw new OneBotError("标识符必须是安全整数");
  return value;
}
function parseJson(text: string): Record<string, unknown> {
  const result: unknown = JSON.parse(text, (_key, value: unknown) => {
    if (
      typeof value === "number" &&
      Number.isInteger(value) &&
      !Number.isSafeInteger(value)
    )
      throw new OneBotError("响应包含不安全整数");
    return value;
  });
  if (!result || typeof result !== "object" || Array.isArray(result))
    throw new OneBotError("OneBot 响应格式非法");
  return result as Record<string, unknown>;
}
function data<T>(response: Record<string, unknown>): T {
  if (response.status === "ok" || response.retcode === 0)
    return response.data as T;
  throw new OneBotError(
    "OneBot API 返回错误：" + String(response.retcode ?? "缺少状态码"),
  );
}
function validateAction(action: string) {
  if (!/^\.?[a-zA-Z0-9_-]+$/.test(action))
    throw new OneBotError("API 动作名非法");
}

export class HttpTransport implements Transport {
  private active = false;
  private debug = false;
  private connecting: Promise<void> | undefined;
  private generation = 0;
  private readonly controllers = new Set<AbortController>();
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  constructor(
    url: string,
    private readonly token = "",
    options: { timeoutMs?: number } = {},
  ) {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol))
      throw new OneBotError("HTTP 地址协议非法");
    this.baseUrl = url.replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }
  get connected(): boolean {
    return this.active;
  }
  async connect(): Promise<void> {
    if (this.active) return;
    if (this.connecting) return this.connecting;
    const generation = ++this.generation;
    const connecting = (async () => {
      try {
        await this.request("get_login_info", {}, false);
        this.debug = false;
      } catch {
        if (generation !== this.generation) throw new OneBotError("连接已取消");
        await this.request("get_login_info", {}, true);
        this.debug = true;
      }
      if (generation !== this.generation) throw new OneBotError("连接已取消");
      this.active = true;
    })();
    this.connecting = connecting;
    try {
      await connecting;
    } finally {
      if (this.connecting === connecting) this.connecting = undefined;
    }
  }
  async close(): Promise<void> {
    this.active = false;
    this.generation++;
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
  }
  async call<T = unknown>(
    action: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    if (!this.active) throw new OneBotError("Bot 未连接");
    validateAction(action);
    return this.request<T>(action, params, this.debug);
  }
  private async request<T>(
    action: string,
    params: Record<string, unknown>,
    debug: boolean,
  ): Promise<T> {
    const controller = new AbortController();
    this.controllers.add(controller);
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(
        this.baseUrl + (debug ? "/api/Debug/call/debug-primary" : "/" + action),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.token
              ? {
                  Authorization: debug
                    ? `Bearer "${this.token}"`
                    : `Bearer ${this.token}`,
                }
              : {}),
          },
          body: JSON.stringify(debug ? { action, params } : params),
          signal: controller.signal,
        },
      );
      if (!response.ok)
        throw new OneBotError("OneBot HTTP 状态：" + response.status);
      try {
        return data<T>(parseJson(await response.text()));
      } catch (error) {
        if (error instanceof OneBotError) throw error;
        throw new UnknownOutcomeError("OneBot 响应无效，结果未决");
      }
    } catch (error) {
      if (controller.signal.aborted)
        throw new UnknownOutcomeError("HTTP 请求超时或中断，结果未决");
      if (error instanceof OneBotError) throw error;
      // 网络中断可能发生在请求提交后，不能把它视为可安全重投。
      throw new UnknownOutcomeError("HTTP 连接异常，结果未决");
    } finally {
      clearTimeout(timer);
      this.controllers.delete(controller);
    }
  }
}

type Pending = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};
export class WsTransport implements Transport {
  private socket: WebSocket | undefined;
  private running = false;
  private generation = 0;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private retryDelay: number;
  private connecting: Promise<void> | undefined;
  private readonly pending = new Map<string, Pending>();
  private readonly handlers = new Set<(event: OneBotEvent) => void>();
  private readonly timeoutMs: number;
  private readonly reconnectMs: number;
  constructor(
    private readonly url: string,
    private readonly token = "",
    options: { timeoutMs?: number; reconnectMs?: number } = {},
  ) {
    const parsed = new URL(url);
    if (!["ws:", "wss:"].includes(parsed.protocol))
      throw new OneBotError("WebSocket 地址协议非法");
    this.timeoutMs = options.timeoutMs ?? 15_000;
    this.reconnectMs = options.reconnectMs ?? 5_000;
    this.retryDelay = this.reconnectMs;
  }
  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
  onEvent(handler: (event: OneBotEvent) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
  async connect(): Promise<void> {
    if (this.connected) return;
    if (this.connecting) return this.connecting;
    this.running = true;
    const generation = ++this.generation;
    const operation = this.open(generation);
    this.connecting = operation;
    try {
      await operation;
    } finally {
      if (this.connecting === operation) this.connecting = undefined;
    }
  }
  private open(generation: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL(this.url);
      if (this.token) url.searchParams.set("access_token", this.token);
      const socket = new WebSocket(url, {
        handshakeTimeout: 10_000,
        maxPayload: 16 * 1024 * 1024,
      });
      this.socket = socket;
      socket.once("open", () => {
        if (!this.running || this.generation !== generation) {
          socket.terminate();
          reject(new OneBotError("连接已取消"));
          return;
        }
        this.retryDelay = this.reconnectMs;
        resolve();
      });
      socket.on("error", () => {
        reject(new OneBotError("WebSocket 连接失败"));
      });
      socket.on("message", (bytes) => {
        if (generation !== this.generation) return;
        let response: Record<string, unknown>;
        try {
          response = parseJson(bytes.toString());
        } catch {
          socket.terminate();
          return;
        }
        if (Object.hasOwn(response, "echo")) {
          const key = String(response.echo);
          const pending = this.pending.get(key);
          if (!pending) return;
          clearTimeout(pending.timer);
          this.pending.delete(key);
          try {
            pending.resolve(data(response));
          } catch (error) {
            pending.reject(error as Error);
          }
        } else if (typeof response.post_type === "string") {
          for (const handler of this.handlers) {
            try {
              handler(response);
            } catch {
              /* 单个处理器异常不能中断其他事件订阅。 */
            }
          }
        }
      });
      socket.once("close", () => {
        reject(new OneBotError("WebSocket 已关闭"));
        if (generation !== this.generation) return;
        this.socket = undefined;
        this.rejectPending();
        if (this.running) this.scheduleReconnect(generation);
      });
    });
  }
  private scheduleReconnect(generation: number) {
    if (this.retryTimer) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = undefined;
      if (!this.running || generation !== this.generation) return;
      this.retryDelay = Math.min(this.retryDelay * 2, 60_000);
      void this.open(generation).catch(() => {});
    }, this.retryDelay);
  }
  private rejectPending() {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(new UnknownOutcomeError("连接中断，已提交请求结果未决"));
    }
    this.pending.clear();
  }
  async close(): Promise<void> {
    this.running = false;
    this.generation++;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = undefined;
    this.rejectPending();
    const socket = this.socket;
    this.socket = undefined;
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          socket.terminate();
          resolve();
        }, 1000);
        socket.once("close", () => {
          clearTimeout(timer);
          resolve();
        });
        if (socket.readyState === WebSocket.OPEN) socket.close();
        else socket.terminate();
      });
    }
  }
  async call<T = unknown>(
    action: string,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    validateAction(action);
    const socket = this.socket;
    if (!socket || socket.readyState !== WebSocket.OPEN)
      throw new OneBotError("WebSocket 未连接");
    const echo = randomUUID();
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(echo);
        reject(new UnknownOutcomeError("WebSocket 响应超时，结果未决"));
      }, this.timeoutMs);
      this.pending.set(echo, {
        resolve: (value) => resolve(value as T),
        reject,
        timer,
      });
      socket.send(JSON.stringify({ action, params, echo }), (error) => {
        if (!error) return;
        clearTimeout(timer);
        this.pending.delete(echo);
        reject(new UnknownOutcomeError("WebSocket 请求提交异常，结果未决"));
      });
    });
  }
}
export { OneBotClient } from "./client.js";
export type * from "./models.js";
export { EventView, EventDispatcher, type EventHandler } from "./events.js";
export { Segments, MessageBuilder } from "./messages.js";
