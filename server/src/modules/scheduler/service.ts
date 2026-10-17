import type { ScheduleTask } from "@qqbot/contracts";
import type { JsonStore } from "../../infrastructure/storage/json-store.js";
import { SystemClock, type Clock } from "../../infrastructure/clock/clock.js";
import { ApiError } from "../../http/errors.js";
import type { BotService } from "../bots/service.js";
import type { NapCatService } from "../napcat/service.js";
import { Scheduler, type SchedulerPolicy } from "./scheduler.js";
import { connectWhenReady, type ConnectionPolicy } from "../bots/readiness.js";

export type ScheduleServiceOptions = {
  enabled?: boolean;
  connection?: ConnectionPolicy;
  clock?: Clock;
  timeZone?: string;
  policy?: Partial<SchedulerPolicy>;
  onError?: (error: unknown) => void;
};
export class ScheduleService {
  private readonly schedulers = new Map<string, Promise<Scheduler>>();
  private closed = false;
  private readonly suspended = new Set<string>();
  private mutation: Promise<unknown> = Promise.resolve();
  readonly clock: Clock;
  readonly timeZone: string;
  readonly enabled: boolean;
  constructor(
    private readonly store: JsonStore,
    private readonly bots: BotService,
    private readonly napcat: NapCatService,
    private readonly options: ScheduleServiceOptions = {},
  ) {
    this.clock = options.clock ?? new SystemClock();
    this.timeZone = options.timeZone ?? "Asia/Shanghai";
    this.enabled = options.enabled ?? false;
  }
  async initialize() {
    for (const bot of (await this.bots.list()).bots) await this.get(bot.name);
  }
  async get(name: string): Promise<Scheduler> {
    if (this.closed) throw new ApiError(503, "调度服务已停止");
    if (this.suspended.has(name))
      throw new ApiError(409, "Bot 正在变更，请稍后重试");
    await this.bots.getConfig(name);
    let current = this.schedulers.get(name);
    if (!current) {
      current = (async () => {
        const scheduler = new Scheduler(name, this.store, {
          clock: this.clock,
          timeZone: this.timeZone,
          connected: () => this.bots.isConnected(name),
          identity: () => this.bots.connectionIdentity(name),
          connect: (signal) =>
            connectWhenReady(
              this.bots,
              this.napcat,
              name,
              signal,
              this.options.connection,
            ),
          send: async (type, id, message, identity) => {
            await this.bots.send(name, type, id, message, identity);
          },
          stop: async (identity) => {
            const instance = await this.bots.instanceName(name);
            if (!(await this.bots.disconnectIfCurrent(name, identity))) return;
            if (
              instance &&
              this.napcat.mode === "managed" &&
              !(await this.bots.instanceUsers(instance)).some((other) =>
                this.bots.isConnected(other),
              ) &&
              (await this.napcat.list()).some(
                (item) => item.name === instance && item.alive,
              )
            )
              await this.napcat.stop(instance);
          },
          ...(this.options.policy ? { policy: this.options.policy } : {}),
          ...(this.options.onError ? { onError: this.options.onError } : {}),
        });
        await scheduler.initialize();
        if (this.enabled) scheduler.start();
        return scheduler;
      })();
      this.schedulers.set(name, current);
      current.catch(() => {
        if (this.schedulers.get(name) === current) this.schedulers.delete(name);
      });
    }
    return current;
  }
  async list(name: string) {
    return (await this.get(name)).list();
  }
  async save(name: string, task: ScheduleTask, existing?: string) {
    const scheduler = await this.get(name);
    if (
      existing !== undefined &&
      !(await scheduler.list()).some((task) => task.name === existing)
    )
      throw new ApiError(404, `任务 '${existing}' 不存在`);
    await scheduler.upsert({ ...task, name: existing ?? task.name });
  }
  private serial<T>(action: () => Promise<T>) {
    const work = this.mutation.catch(() => {}).then(action);
    this.mutation = work;
    return work;
  }
  renameBot(name: string, newName: string) {
    return this.serial(async () => {
      this.suspended.add(name);
      this.suspended.add(newName);
      await this.suspend(name);
      try {
        return await this.bots.rename(name, newName);
      } finally {
        this.suspended.delete(name);
        this.suspended.delete(newName);
        const all = (await this.bots.list()).bots;
        for (const bot of all)
          if (bot.name === name || bot.name === newName)
            await this.get(bot.name);
      }
    });
  }
  removeBot(name: string) {
    return this.serial(async () => {
      this.suspended.add(name);
      await this.suspend(name);
      try {
        return await this.bots.remove(name);
      } finally {
        this.suspended.delete(name);
      }
    });
  }
  clearBots() {
    return this.serial(async () => {
      const names = (await this.bots.list()).bots.map((bot) => bot.name);
      for (const name of names) this.suspended.add(name);
      try {
        for (const name of names) await this.suspend(name);
        return await this.bots.clearAll();
      } finally {
        this.suspended.clear();
        await this.initialize();
      }
    });
  }
  async suspend(name: string) {
    const scheduler = this.schedulers.get(name);
    this.schedulers.delete(name);
    if (scheduler) await (await scheduler).close();
  }
  async close() {
    this.closed = true;
    for (const scheduler of this.schedulers.values())
      await (await scheduler).close();
    this.schedulers.clear();
  }
  async recalibrate() {
    for (const scheduler of this.schedulers.values())
      (await scheduler).reschedule();
  }
}
