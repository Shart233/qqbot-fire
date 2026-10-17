import type { JsonStore } from "../../infrastructure/storage/json-store.js";
import { ScheduleTaskSchema, type ScheduleTask } from "@qqbot/contracts";
import { Value } from "@sinclair/typebox/value";
import type { Clock } from "../../infrastructure/clock/clock.js";
import { isUnknownOutcome } from "@qqbot/onebot";
import { ApiError } from "../../http/errors.js";
import {
  dateInZone,
  addDays,
  occurrence,
  occurrenceKey,
  nextWake,
} from "./planner.js";
import {
  validateLedger,
  emptyLedger,
  type ExecutionLedger,
  type ExecutionRecord,
  type TargetState,
} from "./ledger.js";

export type SchedulerOptions = {
  clock: Clock;
  timeZone: string;
  connected: () => boolean;
  connect: (signal: AbortSignal) => Promise<boolean>;
  send: (
    type: "group" | "private",
    id: number,
    message: string,
    identity?: unknown,
  ) => Promise<void>;
  stop: (identity?: unknown) => Promise<void>;
  identity?: () => unknown;
  onError?: (error: unknown) => void;
  policy?: Partial<SchedulerPolicy>;
};
export type SchedulerPolicy = {
  prewarmLeadMs: number;
  retryDelayMs: number;
  maxRetries: number;
  catchUpMaxDelayMs: number;
  retentionDays: number;
  resendRounds: number;
  resendGapMs: number;
  sendGapMs: number;
  unknownLingerMs: number;
};
const defaults: SchedulerPolicy = {
  prewarmLeadMs: 240_000,
  retryDelayMs: 180_000,
  maxRetries: 2,
  catchUpMaxDelayMs: 23 * 3600_000,
  retentionDays: 14,
  resendRounds: 2,
  resendGapMs: 3000,
  sendGapMs: 1000,
  unknownLingerMs: 900_000,
};
export type NormalizedTask = ScheduleTask & {
  enabled: boolean;
  autoConnect: boolean;
  autoStopAfterSend: boolean;
};
type PendingStop = { at: number; identity: unknown; task: string };
export function scheduleFile(bot: string) {
  return bot === "default" ? "schedules.json" : `schedules_${bot}.json`;
}
export function ledgerFile(bot: string) {
  return bot === "default"
    ? "schedules_state.json"
    : `schedules_state_${bot}.json`;
}
function normalizeTask(input: unknown): NormalizedTask {
  if (
    !Value.Check(ScheduleTaskSchema, input) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)
  )
    throw new ApiError(400, "任务格式非法，时间必须为 HH:mm");
  return {
    ...input,
    targets: [...new Set(input.targets)],
    enabled: input.enabled ?? true,
    autoConnect: input.autoConnect ?? false,
    autoStopAfterSend: input.autoStopAfterSend ?? false,
  };
}
export class Scheduler {
  private queue: Promise<unknown> = Promise.resolve();
  private readonly attempted = new Set<string>();
  private readonly prewarmed = new Set<string>();
  private pendingStop: PendingStop | undefined;
  private stopWork: Promise<void> | undefined;
  private loopWork: Promise<void> | undefined;
  private readonly cancel = new AbortController();
  private sleepCancel: AbortController | undefined;
  private busy = false;
  private closed = false;
  private lastPruneDate = "";
  private readonly policy: SchedulerPolicy;
  constructor(
    readonly name: string,
    private readonly store: JsonStore,
    private readonly options: SchedulerOptions,
  ) {
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(name))
      throw new ApiError(400, "非法 Bot 名称");
    // 旧命名在 Bot 名称为 state/state_* 时会与其他 Bot 的账本冲突。
    if (name === "state" || name.startsWith("state_"))
      throw new ApiError(400, "Bot 名称与任务账本文件名冲突");
    this.policy = { ...defaults, ...options.policy };
    dateInZone(options.clock.now(), options.timeZone);
  }
  private serial<T>(action: () => Promise<T>): Promise<T> {
    if (this.closed) throw new ApiError(503, "调度器已停止");
    const work = this.queue
      .catch(() => {})
      .then(async () => {
        this.busy = true;
        try {
          return await action();
        } finally {
          this.busy = false;
        }
      });
    this.queue = work;
    return work;
  }
  async initialize() {
    await this.list();
    const ledger = await this.readLedger();
    let changed = false;
    const oldest = addDays(
      dateInZone(this.options.clock.now(), this.options.timeZone),
      -this.policy.retentionDays,
    );
    for (const [key, record] of Object.entries(ledger.records)) {
      if (record.date < oldest) {
        delete ledger.records[key];
        changed = true;
        continue;
      }
      for (const target of Object.keys(record.targetStates))
        if (record.targetStates[target] === "SENDING") {
          record.targetStates[target] = "UNKNOWN";
          changed = true;
        }
    }
    if (changed)
      await this.store.update(
        ledgerFile(this.name),
        (raw) => {
          validateLedger(raw);
          return ledger;
        },
        emptyLedger(),
      );
    this.lastPruneDate = dateInZone(
      this.options.clock.now(),
      this.options.timeZone,
    );
    this.attempted.clear();
    this.prewarmed.clear();
    this.wake();
  }
  async list(): Promise<NormalizedTask[]> {
    const raw: unknown = await this.store.read(scheduleFile(this.name), []);
    if (!Array.isArray(raw)) throw new Error("任务文件应为数组");
    const tasks = raw.map(normalizeTask);
    if (new Set(tasks.map((task) => task.name)).size !== tasks.length)
      throw new Error("任务名重复");
    return tasks;
  }
  async upsert(input: ScheduleTask) {
    const incoming = normalizeTask(input);
    await this.store.update<NormalizedTask[]>(
      scheduleFile(this.name),
      (raw) => {
        const tasks = raw.map(normalizeTask);
        const prior = tasks.find((task) => task.name === incoming.name);
        const task = {
          ...incoming,
          enabled: input.enabled ?? prior?.enabled ?? true,
          autoConnect: input.autoConnect ?? prior?.autoConnect ?? false,
          autoStopAfterSend:
            input.autoStopAfterSend ?? prior?.autoStopAfterSend ?? false,
        };
        return [...tasks.filter((item) => item.name !== incoming.name), task];
      },
      [],
    );
    for (const key of this.prewarmed)
      if (key.endsWith("|" + incoming.name)) this.prewarmed.delete(key);
    this.wake();
  }
  async remove(name: string) {
    let found = false;
    await this.store.update<NormalizedTask[]>(
      scheduleFile(this.name),
      (raw) => {
        const tasks = raw.map(normalizeTask);
        found = tasks.some((task) => task.name === name);
        return tasks.filter((task) => task.name !== name);
      },
      [],
    );
    if (!found) throw new ApiError(404, `任务 '${name}' 不存在`);
    if (this.pendingStop?.task === name) this.pendingStop = undefined;
    this.wake();
  }
  async setFlags(
    name: string,
    patch: { enabled?: boolean; autoConnect?: boolean },
  ) {
    let found = false;
    await this.store.update<NormalizedTask[]>(
      scheduleFile(this.name),
      (raw) =>
        raw.map(normalizeTask).map((task) => {
          if (task.name !== name) return task;
          found = true;
          return { ...task, ...patch };
        }),
      [],
    );
    if (!found) throw new ApiError(404, `任务 '${name}' 不存在`);
    this.wake();
  }
  private readLedger() {
    return this.store
      .read<ExecutionLedger>(ledgerFile(this.name), emptyLedger())
      .then(validateLedger);
  }
  private async changeRecord(
    task: NormalizedTask,
    date: string,
    change: (record: ExecutionRecord) => void,
  ) {
    await this.store.update(
      ledgerFile(this.name),
      (raw) => {
        const ledger = validateLedger(raw);
        const key = occurrenceKey(date, task.name);
        let record = ledger.records[key];
        if (!record) {
          record = {
            date,
            taskName: task.name,
            targetStates: {},
            retryCount: 0,
            nextRetryAt: 0,
            updatedAt: 0,
          };
          ledger.records[key] = record;
        }
        change(record);
        record.updatedAt = Math.round(this.options.clock.now());
        return ledger;
      },
      emptyLedger(),
    );
  }
  private mark(
    task: NormalizedTask,
    date: string,
    target: number,
    state: TargetState,
  ) {
    return this.changeRecord(task, date, (record) => {
      record.targetStates[String(target)] = state;
    });
  }
  private pending(task: NormalizedTask, record: ExecutionRecord | undefined) {
    return task.targets.filter(
      (target) =>
        !record?.targetStates[String(target)] ||
        record.targetStates[String(target)] === "FAILED",
    );
  }
  private settled(task: NormalizedTask, record: ExecutionRecord | undefined) {
    return Boolean(
      record &&
        ((record.retryCount >= this.policy.maxRetries &&
          record.nextRetryAt === 0) ||
          !this.pending(task, record).length),
    );
  }
  async trigger(name: string) {
    await this.serial(async () => {
      const task = (await this.list()).find((task) => task.name === name);
      if (!task) throw new ApiError(404, `任务 '${name}' 不存在`);
      const date = dateInZone(this.options.clock.now(), this.options.timeZone);
      this.attempted.add(occurrenceKey(date, name));
      await this.execute(task, date);
    });
    this.processStops();
    this.wake();
  }
  private async execute(task: NormalizedTask, date: string) {
    const initial = (await this.readLedger()).records[
      occurrenceKey(date, task.name)
    ];
    let pending = this.pending(task, initial);
    if (!pending.length) return;
    let ready = this.options.connected();
    if (task.autoConnect) {
      try {
        ready = await this.options.connect(this.cancel.signal);
      } catch {
        ready = false;
        /* 连接失败由持久化重试策略处理。 */
      }
    }
    if (this.cancel.signal.aborted) return;
    if (!ready || !this.options.connected()) {
      if (task.autoConnect) await this.retry(task, date);
      return;
    }
    const identity = this.options.identity?.();
    for (
      let round = 0;
      round <= this.policy.resendRounds && pending.length;
      round++
    ) {
      if (round)
        await this.options.clock.sleep(
          this.policy.resendGapMs,
          this.cancel.signal,
        );
      const failed: number[] = [];
      for (const target of pending) {
        if (this.cancel.signal.aborted) return;
        if (
          !this.options.connected() ||
          identity !== this.options.identity?.()
        ) {
          failed.push(target);
          await this.mark(task, date, target, "FAILED");
          continue;
        }
        // 发送前落盘失败必须直接抛出；成功后的落盘失败也不能改写成 FAILED。
        await this.mark(task, date, target, "SENDING");
        let unknown = false,
          failedSend = false;
        try {
          await this.options.send(
            task.targetType,
            target,
            task.message,
            identity,
          );
        } catch (error) {
          unknown = isUnknownOutcome(error);
          failedSend = !unknown;
        }
        if (unknown) await this.mark(task, date, target, "UNKNOWN");
        else if (failedSend) {
          await this.mark(task, date, target, "FAILED");
          failed.push(target);
        } else {
          await this.mark(task, date, target, "SUCCESS");
          await this.options.clock.sleep(
            this.policy.sendGapMs,
            this.cancel.signal,
          );
        }
      }
      pending = failed;
      if (!this.options.connected()) break;
    }
    if (pending.length) {
      await this.retry(task, date);
      return;
    }
    await this.changeRecord(task, date, (record) => {
      record.nextRetryAt = 0;
    });
    this.scheduleStop(task, date, identity);
  }
  private async retry(task: NormalizedTask, date: string) {
    const record = (await this.readLedger()).records[
      occurrenceKey(date, task.name)
    ];
    const count = record?.retryCount ?? 0;
    if (count >= this.policy.maxRetries) {
      await this.changeRecord(task, date, (current) => {
        current.nextRetryAt = 0;
      });
      this.scheduleStop(task, date, this.options.identity?.());
    } else
      await this.changeRecord(task, date, (current) => {
        current.retryCount = count + 1;
        current.nextRetryAt = Math.round(
          this.options.clock.now() + this.policy.retryDelayMs,
        );
      });
  }
  private scheduleStop(task: NormalizedTask, date: string, identity: unknown) {
    if (!task.autoStopAfterSend) return;
    // 读取结果后排定停止，不在调度循环内等待进程退出。
    const work = this.readLedger().then((ledger) => {
      const record = ledger.records[occurrenceKey(date, task.name)];
      const unknown = task.targets.some((target) =>
        ["UNKNOWN", "SENDING"].includes(
          record?.targetStates[String(target)] ?? "",
        ),
      );
      const at =
        this.options.clock.now() + (unknown ? this.policy.unknownLingerMs : 0);
      this.pendingStop = {
        at:
          this.pendingStop && this.pendingStop.identity === identity
            ? Math.max(at, this.pendingStop.at)
            : at,
        identity,
        task: task.name,
      };
    });
    this.stopWork = work.then(() => {});
    this.stopWork.catch((error) => this.options.onError?.(error));
  }
  private processStops() {
    if (this.closed || this.busy) return;
    const prior = this.stopWork ?? Promise.resolve();
    const work = prior
      .catch(() => {})
      .then(async () => {
        const stop = this.pendingStop;
        if (
          !stop ||
          stop.at > this.options.clock.now() ||
          this.busy ||
          this.closed
        )
          return;
        if (stop.identity !== this.options.identity?.()) {
          this.pendingStop = undefined;
          return;
        }
        const tasks = await this.list();
        const now = this.options.clock.now(),
          date = dateInZone(now, this.options.timeZone);
        for (const record of Object.values((await this.readLedger()).records)) {
          if (
            record.nextRetryAt &&
            record.date >= addDays(date, -1) &&
            record.date <= date &&
            tasks.some((task) => task.enabled && task.name === record.taskName)
          ) {
            stop.at = Math.max(now + 1000, record.nextRetryAt + 1000);
            return;
          }
        }
        for (const task of tasks) {
          if (!task.enabled || !task.autoConnect) continue;
          let target = occurrence(date, task.time, this.options.timeZone);
          if (
            target <= now ||
            this.attempted.has(occurrenceKey(date, task.name))
          )
            target = occurrence(
              addDays(date, 1),
              task.time,
              this.options.timeZone,
            );
          if (target - now <= this.policy.prewarmLeadMs) {
            stop.at = target + 1000;
            return;
          }
        }
        this.pendingStop = undefined;
        await this.options.stop(stop.identity);
      });
    this.stopWork = work;
    work.catch((error) => this.options.onError?.(error));
  }
  async drainStops() {
    await this.stopWork?.catch((error) => {
      throw error;
    });
    this.processStops();
    await this.stopWork;
  }
  async tick() {
    await this.serial(async () => {
      const tasks = await this.list();
      const now = this.options.clock.now(),
        today = dateInZone(now, this.options.timeZone);
      let ledger = await this.readLedger();
      if (this.lastPruneDate !== today) {
        const cutoff = addDays(today, -this.policy.retentionDays);
        if (
          Object.values(ledger.records).some((record) => record.date < cutoff)
        )
          ledger = await this.store.update(
            ledgerFile(this.name),
            (raw) => {
              const current = validateLedger(raw);
              for (const [key, record] of Object.entries(current.records))
                if (record.date < cutoff) delete current.records[key];
              return current;
            },
            emptyLedger(),
          );
        this.lastPruneDate = today;
      }
      const oldest = addDays(today, -1);
      for (const key of this.attempted)
        if (key.slice(0, 10) < oldest) this.attempted.delete(key);
      for (const key of this.prewarmed)
        if (key.slice(0, 10) < today) this.prewarmed.delete(key);
      for (const record of Object.values(ledger.records)) {
        if (
          record.date < oldest ||
          record.date > today ||
          !record.nextRetryAt ||
          record.nextRetryAt > now
        )
          continue;
        const task = tasks.find((task) => task.name === record.taskName);
        if (!task?.enabled) continue;
        this.attempted.add(occurrenceKey(record.date, task.name));
        await this.execute(task, record.date);
      }
      for (const task of tasks) {
        if (!task.enabled) continue;
        const target = occurrence(today, task.time, this.options.timeZone),
          key = occurrenceKey(today, task.name);
        const current = (await this.readLedger()).records[key];
        if (this.settled(task, current)) {
          this.attempted.add(key);
          continue;
        }
        if (current?.nextRetryAt) {
          this.attempted.add(key);
          continue;
        }
        const delayed = now - target;
        if (
          delayed >= 0 &&
          delayed <= this.policy.catchUpMaxDelayMs &&
          !this.attempted.has(key)
        ) {
          this.attempted.add(key);
          await this.execute(task, today);
        }
      }
      for (const task of tasks) {
        if (!task.enabled || !task.autoConnect) continue;
        let date = today,
          target = occurrence(date, task.time, this.options.timeZone);
        if (
          target <= now ||
          this.attempted.has(occurrenceKey(date, task.name))
        ) {
          date = addDays(date, 1);
          target = occurrence(date, task.time, this.options.timeZone);
        }
        const key = occurrenceKey(date, task.name);
        if (target - now > this.policy.prewarmLeadMs || this.prewarmed.has(key))
          continue;
        this.prewarmed.add(key);
        if (!this.options.connected())
          try {
            await this.options.connect(this.cancel.signal);
          } catch {
            /* 触发时仍按正常重试策略连接。 */
          }
      }
    });
    this.processStops();
  }
  async nextWake() {
    const tasks = await this.list(),
      now = this.options.clock.now();
    let wake = nextWake(
      tasks,
      now,
      this.options.timeZone,
      this.prewarmed,
      this.attempted,
      this.policy.prewarmLeadMs,
    );
    const today = dateInZone(now, this.options.timeZone),
      oldest = addDays(today, -1);
    for (const record of Object.values((await this.readLedger()).records))
      if (
        record.date >= oldest &&
        record.date <= today &&
        record.nextRetryAt &&
        tasks.some((task) => task.enabled && task.name === record.taskName)
      )
        wake = Math.min(wake, Math.max(now + 50, record.nextRetryAt));
    if (this.pendingStop)
      wake = Math.min(wake, Math.max(now + 100, this.pendingStop.at));
    return wake;
  }
  reschedule() {
    this.wake();
  }
  start() {
    if (this.loopWork || this.closed) return;
    this.loopWork = this.loop();
  }
  private wake() {
    this.sleepCancel?.abort();
  }
  private async loop() {
    while (!this.cancel.signal.aborted) {
      try {
        await this.tick();
        const wait = Math.max(
          100,
          (await this.nextWake()) - this.options.clock.now(),
        );
        this.sleepCancel = new AbortController();
        await this.options.clock.sleep(
          wait,
          AbortSignal.any([this.cancel.signal, this.sleepCancel.signal]),
        );
      } catch (error) {
        if (this.cancel.signal.aborted) break;
        if ((error as Error).name === "AbortError") continue;
        this.options.onError?.(error);
        await this.options.clock
          .sleep(5000, this.cancel.signal)
          .catch(() => {});
      }
    }
  }
  async close() {
    this.closed = true;
    this.cancel.abort();
    this.wake();
    this.pendingStop = undefined;
    await this.queue.catch(() => {});
    await this.loopWork;
    await this.stopWork?.catch(() => {});
  }
}
