import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";
import { Scheduler } from "../server/src/modules/scheduler/scheduler.js";
import { UnknownOutcomeError } from "../packages/onebot/src/index.js";
import type { Clock } from "../server/src/infrastructure/clock/clock.js";
import {
  nextWake,
  dateInZone,
} from "../server/src/modules/scheduler/planner.js";

class FakeClock implements Clock {
  constructor(public time: number) {}
  now() {
    return this.time;
  }
  monotonic() {
    return this.time;
  }
  async sleep(ms: number) {
    this.time += ms;
  }
}
const task = {
  name: "morning",
  time: "05:00",
  targets: [11, 22, 33],
  targetType: "private" as const,
  message: "测试",
  enabled: true,
  autoConnect: true,
  autoStopAfterSend: false,
};
async function setup(
  t: test.TestContext,
  send: (id: number) => Promise<void>,
  extra: Record<string, unknown> = {},
) {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-schedule-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const clock = new FakeClock(Date.parse("2026-10-13T05:00:00+08:00"));
  const scheduler = new Scheduler("default", new JsonStore(dir), {
    clock,
    timeZone: "Asia/Shanghai",
    connected: () => true,
    connect: async () => true,
    send: async (_type, id) => send(id),
    stop: async () => {},
    ...extra,
  });
  await scheduler.initialize();
  await scheduler.upsert(task);
  return { dir, clock, scheduler };
}

test("每个目标发出前落盘 SENDING，成功与未知目标不重投，明确失败才补发", async (t) => {
  let dir = "";
  const calls: number[] = [];
  const f = await setup(t, async (id) => {
    const ledger = JSON.parse(
      await readFile(join(dir, "schedules_state.json"), "utf8"),
    );
    assert.equal(
      ledger.records["2026-10-13|morning"].targetStates[String(id)],
      "SENDING",
    );
    calls.push(id);
    if (id === 22) throw new UnknownOutcomeError("超时");
    if (id === 33 && calls.filter((value) => value === 33).length === 1)
      throw new Error("明确失败");
  });
  dir = f.dir;
  await f.scheduler.trigger("morning");
  await f.scheduler.trigger("morning");
  assert.deepEqual(calls, [11, 22, 33, 33]);
  const ledger = JSON.parse(
    await readFile(join(dir, "schedules_state.json"), "utf8"),
  );
  assert.deepEqual(ledger.records["2026-10-13|morning"].targetStates, {
    "11": "SUCCESS",
    "22": "UNKNOWN",
    "33": "SUCCESS",
  });
});

test("崩溃前发送中恢复为 UNKNOWN，重启只发送未尝试目标", async (t) => {
  const calls: number[] = [];
  const f = await setup(t, async (id) => {
    calls.push(id);
  });
  await writeFile(
    join(f.dir, "schedules_state.json"),
    JSON.stringify({
      version: 1,
      records: {
        "2026-10-13|morning": {
          date: "2026-10-13",
          taskName: "morning",
          targetStates: { "11": "SUCCESS", "22": "SENDING" },
          retryCount: 0,
          nextRetryAt: 0,
          updatedAt: f.clock.time,
        },
      },
    }),
  );
  await f.scheduler.initialize();
  await f.scheduler.trigger("morning");
  assert.deepEqual(calls, [33]);
  assert.equal(
    JSON.parse(await readFile(join(f.dir, "schedules_state.json"), "utf8"))
      .records["2026-10-13|morning"].targetStates["22"],
    "UNKNOWN",
  );
});

test("坏账本或发送前持久化失败阻止实际发送", async (t) => {
  let sends = 0;
  const f = await setup(t, async () => {
    sends++;
  });
  await writeFile(join(f.dir, "schedules_state.json"), "{损坏");
  await assert.rejects(f.scheduler.trigger("morning"));
  assert.equal(sends, 0);
  await rm(join(f.dir, "schedules_state.json"));
  await mkdir(join(f.dir, "schedules_state.json"));
  await assert.rejects(f.scheduler.trigger("morning"));
  assert.equal(sends, 0);
});

test("连接失败重试次数和时间落盘，跨午夜恢复最多两次", async (t) => {
  let connects = 0;
  const f = await setup(t, async () => {}, {
    connected: () => false,
    connect: async () => {
      connects++;
      return false;
    },
  });
  await f.scheduler.upsert({ ...task, time: "23:59" });
  f.clock.time = Date.parse("2026-10-13T23:59:00+08:00");
  await f.scheduler.tick();
  let record = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  ).records["2026-10-13|morning"];
  assert.equal(record.retryCount, 1);
  assert.equal(record.nextRetryAt, Date.parse("2026-10-14T00:02:00+08:00"));
  f.clock.time = record.nextRetryAt;
  await f.scheduler.initialize();
  await f.scheduler.tick();
  record = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  ).records["2026-10-13|morning"];
  assert.equal(record.retryCount, 2);
  f.clock.time = record.nextRetryAt;
  await f.scheduler.tick();
  await f.scheduler.tick();
  assert.equal(connects, 3);
  assert.equal(
    JSON.parse(await readFile(join(f.dir, "schedules_state.json"), "utf8"))
      .records["2026-10-13|morning"].nextRetryAt,
    0,
  );
});

test("手动和自动执行互斥，自动停止后下一天任务仍能触发", async (t) => {
  const sends: number[] = [];
  let stops = 0;
  let connected = true;
  const f = await setup(
    t,
    async (id) => {
      sends.push(id);
    },
    {
      connected: () => connected,
      connect: async () => {
        connected = true;
        return true;
      },
      stop: async () => {
        stops++;
        connected = false;
      },
    },
  );
  await f.scheduler.upsert({ ...task, targets: [11], autoStopAfterSend: true });
  await Promise.all([f.scheduler.tick(), f.scheduler.trigger("morning")]);
  await f.scheduler.drainStops();
  assert.deepEqual(sends, [11]);
  assert.equal(stops, 1);
  f.clock.time = Date.parse("2026-10-14T05:00:00+08:00");
  await f.scheduler.tick();
  await f.scheduler.drainStops();
  assert.deepEqual(sends, [11, 11]);
  assert.equal(stops, 2);
});

test("未决滞留十五分钟，新的预热任务阻止误停", async (t) => {
  let stops = 0;
  const f = await setup(
    t,
    async () => {
      throw new UnknownOutcomeError("超时");
    },
    {
      stop: async () => {
        stops++;
      },
    },
  );
  await f.scheduler.upsert({ ...task, targets: [11], autoStopAfterSend: true });
  await f.scheduler.trigger("morning");
  await f.scheduler.drainStops();
  assert.equal(stops, 0);
  f.clock.time += 14 * 60_000;
  await f.scheduler.tick();
  await f.scheduler.drainStops();
  assert.equal(stops, 0);
  await f.scheduler.upsert({
    ...task,
    name: "next",
    time: "05:18",
    targets: [44],
    autoStopAfterSend: false,
  });
  f.clock.time += 60_000;
  await f.scheduler.tick();
  await f.scheduler.drainStops();
  assert.equal(stops, 0);
});

test("午夜预热与分钟边界等待为正，默认上海时区独立于主机时区", () => {
  const now = Date.parse("2026-10-13T23:56:00+08:00");
  assert.equal(dateInZone(now, "Asia/Shanghai"), "2026-10-13");
  assert.equal(
    nextWake([{ ...task, time: "00:01" }], now, "Asia/Shanghai", new Set()),
    Date.parse("2026-10-13T23:57:00+08:00"),
  );
  const near = Date.parse("2026-10-13T04:59:59.900+08:00");
  assert.equal(
    nextWake(
      [{ ...task, autoConnect: false }],
      near,
      "Asia/Shanghai",
      new Set(),
    ),
    Date.parse("2026-10-13T05:00:00+08:00"),
  );
});

test("自动停止耗时不能阻塞调度主循环的下一次等待", async (t) => {
  let release!: () => void;
  const stopping = new Promise<void>((resolve) => {
    release = resolve;
  });
  let waits = 0;
  const f = await setup(t, async () => {}, { stop: () => stopping });
  await f.scheduler.upsert({ ...task, targets: [11], autoStopAfterSend: true });
  await f.scheduler.trigger("morning");
  f.clock.sleep = async (_ms: number, signal?: AbortSignal) => {
    waits++;
    await new Promise<void>((resolve, reject) => {
      if (signal?.aborted) {
        reject(signal.reason);
        return;
      }
      signal?.addEventListener("abort", () => resolve(), { once: true });
    });
  };
  f.scheduler.start();
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.ok(waits > 0, "停止仍在等待时调度器应能继续安排下一次唤醒");
  } finally {
    release();
    await f.scheduler.close();
  }
});

test("后续成功任务不能缩短同连接 UNKNOWN 目标的滞留保护", async (t) => {
  let stops = 0;
  const f = await setup(
    t,
    async (id) => {
      if (id === 11) throw new UnknownOutcomeError("未知");
    },
    {
      stop: async () => {
        stops++;
      },
    },
  );
  await f.scheduler.upsert({ ...task, targets: [11], autoStopAfterSend: true });
  await f.scheduler.trigger("morning");
  await f.scheduler.upsert({
    ...task,
    name: "second",
    targets: [22],
    autoStopAfterSend: true,
  });
  await f.scheduler.trigger("second");
  await f.scheduler.drainStops();
  assert.equal(stops, 0);
});

test("过期的重试账本不会让调度器持续以百毫秒唤醒", async (t) => {
  const f = await setup(t, async () => {});
  await writeFile(
    join(f.dir, "schedules_state.json"),
    JSON.stringify({
      version: 1,
      records: {
        "2026-10-11|morning": {
          date: "2026-10-11",
          taskName: "morning",
          targetStates: {},
          retryCount: 1,
          nextRetryAt: Date.parse("2026-10-11T05:03:00+08:00"),
          updatedAt: Date.parse("2026-10-11T05:00:00+08:00"),
        },
      },
    }),
  );
  await f.scheduler.upsert({ ...task, time: "06:00", autoConnect: false });
  assert.equal(
    await f.scheduler.nextWake(),
    Date.parse("2026-10-13T05:01:00+08:00"),
  );
});

test("其他任务待重试期间不停止共享的 Bot 连接", async (t) => {
  let stops = 0;
  const f = await setup(
    t,
    async (id) => {
      if (id === 11) throw new Error("明确失败");
    },
    {
      stop: async () => {
        stops++;
      },
      policy: { resendRounds: 0, sendGapMs: 0 },
    },
  );
  await f.scheduler.upsert({ ...task, targets: [11] });
  await f.scheduler.trigger("morning");
  await f.scheduler.upsert({
    ...task,
    name: "done",
    targets: [22],
    autoStopAfterSend: true,
  });
  await f.scheduler.trigger("done");
  await f.scheduler.drainStops();
  assert.equal(stops, 0);
});

test("持续运行跨过保留期限后清理旧账本，无需依赖重启", async (t) => {
  const f = await setup(t, async () => {});
  await f.scheduler.trigger("morning");
  await f.scheduler.setFlags("morning", { enabled: false });
  f.clock.time = Date.parse("2026-10-28T05:00:00+08:00");
  await f.scheduler.tick();
  const ledger = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  );
  assert.deepEqual(ledger.records, {});
});
