import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { exportRollback } from "../server/src/infrastructure/storage/rollback.js";
import { Scheduler } from "../server/src/modules/scheduler/scheduler.js";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";
import { SystemClock } from "../server/src/infrastructure/clock/clock.js";

test("切换后成功和未决记录合并回退副本，恢复调度不重发已提交目标", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "qqbot-rollback-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const legacy = join(root, "legacy"),
    source = join(root, "new"),
    destination = join(root, "rollback");
  for (const dir of [legacy, source]) await mkdir(dir);
  const task = {
    name: "daily",
    time: "00:01",
    targetType: "private",
    targets: [11, 22, 33],
    message: "模拟消息",
    enabled: true,
    autoConnect: false,
    autoStopAfterSend: false,
  };
  const config = {
    bots: {
      default: {
        mode: "ws",
        wsUrl: "ws://127.0.0.1:1",
        httpUrl: "",
        wsToken: "",
        httpToken: "",
      },
    },
    activeBot: "default",
  };
  const ledger = (states: Record<string, string>) => ({
    version: 1,
    records: {
      "2026-10-17|daily": {
        date: "2026-10-17",
        taskName: "daily",
        targetStates: states,
        retryCount: 0,
        nextRetryAt: 0,
        updatedAt: Date.parse("2026-10-17T08:00:00+08:00"),
      },
    },
  });
  for (const dir of [legacy, source]) {
    await writeFile(join(dir, "config.json"), JSON.stringify(config));
    await writeFile(join(dir, "schedules.json"), JSON.stringify([task]));
  }
  await writeFile(
    join(legacy, "schedules_state.json"),
    JSON.stringify(ledger({ "11": "SUCCESS" })),
  );
  await writeFile(
    join(source, "schedules_state.json"),
    JSON.stringify(
      ledger({ "11": "FAILED", "22": "SUCCESS", "33": "SENDING" }),
    ),
  );
  const original = await readFile(join(source, "schedules_state.json"), "utf8");
  await exportRollback({ source, legacy, destination });
  const result = JSON.parse(
    await readFile(join(destination, "schedules_state.json"), "utf8"),
  );
  assert.deepEqual(result.records["2026-10-17|daily"].targetStates, {
    "11": "SUCCESS",
    "22": "SUCCESS",
    "33": "UNKNOWN",
  });
  assert.equal(
    await readFile(join(source, "schedules_state.json"), "utf8"),
    original,
  );
  const clock = new SystemClock();
  clock.offset = Date.parse("2026-10-17T08:00:00+08:00") - Date.now();
  let sends = 0;
  const scheduler = new Scheduler("default", new JsonStore(destination), {
    clock,
    timeZone: "Asia/Shanghai",
    connected: () => true,
    connect: async () => true,
    send: async () => {
      sends++;
    },
    stop: async () => {},
  });
  await scheduler.initialize();
  await scheduler.trigger("daily");
  await scheduler.close();
  assert.equal(sends, 0);
  await assert.rejects(
    exportRollback({ source, legacy, destination }),
    /非空|存在/,
  );
});
