import { setTimeout as delay } from "node:timers/promises";
export interface Clock {
  now(): number;
  monotonic(): number;
  sleep(ms: number, signal?: AbortSignal): Promise<void>;
}
export class SystemClock implements Clock {
  offset = 0;
  now() {
    return Date.now() + this.offset;
  }
  monotonic() {
    return performance.now();
  }
  async sleep(ms: number, signal?: AbortSignal) {
    if (ms < 0 || !Number.isFinite(ms)) throw new Error("等待时长非法");
    await delay(ms, undefined, signal ? { signal } : {});
  }
}
