import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createServer as tcpServer } from "node:net";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";
import { BotService } from "../server/src/modules/bots/service.js";
import { NapCatService } from "../server/src/modules/napcat/service.js";
import { ScheduleService } from "../server/src/modules/scheduler/service.js";

async function fixture(
  t: test.TestContext,
  onlineTimeoutMs = 5000,
  connectTimeoutMs = 5000,
) {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-ready-"));
  const store = new JsonStore(dir),
    bots = new BotService(store);
  const napcat = new NapCatService(store, bots, "external");
  const schedules = new ScheduleService(store, bots, napcat, {
    connection: {
      portTimeoutMs: 5000,
      onlineTimeoutMs,
      connectTimeoutMs,
      pollMs: 10,
    },
    policy: { sendGapMs: 0, resendRounds: 0 },
  });
  let seen: () => void = () => {};
  const statusSeen = new Promise<void>((resolve) => {
    seen = resolve;
  });
  let online = false,
    sent = 0,
    sentOffline = false;
  const server = createServer((req, res) => {
    if (req.url === "/get_status") seen();
    if (req.url === "/send_private_msg") {
      sent++;
      if (!online) sentOffline = true;
    }
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data:
          req.url === "/get_login_info"
            ? { user_id: 12345, nickname: "模拟" }
            : req.url === "/get_status"
              ? { online }
              : { message_id: 99 },
      }),
    );
  });
  const reservation = tcpServer();
  await new Promise<void>((r) => reservation.listen(0, "127.0.0.1", r));
  const port = (reservation.address() as { port: number }).port;
  await new Promise<void>((r) => reservation.close(() => r()));
  await bots.updateConfig("default", {
    mode: "http",
    httpUrl: `http://127.0.0.1:${port}`,
  });
  const scheduler = await schedules.get("default");
  await scheduler.upsert({
    name: "daily",
    time: "23:59",
    targetType: "private",
    targets: [42],
    message: "冷启动",
    autoConnect: true,
  });
  t.after(async () => {
    await schedules.close();
    await napcat.close();
    await bots.close();
    server.closeAllConnections();
    if (server.listening)
      await new Promise<void>((r) => server.close(() => r()));
    await rm(dir, { recursive: true, force: true });
  });
  return {
    dir,
    statusSeen,
    bots,
    schedules,
    scheduler,
    server,
    listen: () => new Promise<void>((r) => server.listen(port, "127.0.0.1", r)),
    online: () => {
      online = true;
    },
    get sent() {
      return sent;
    },
    get sentOffline() {
      return sentOffline;
    },
  };
}

test("冷启动等待端口和 QQ 上线后才发送，不把握手完成当上线", async (t) => {
  const f = await fixture(t);
  const trigger = f.scheduler.trigger("daily");
  await new Promise((r) => setTimeout(r, 80));
  await f.listen();
  await f.statusSeen;
  assert.equal(f.sent, 0);
  f.online();
  await trigger;
  assert.equal(f.sent, 1);
  assert.equal(f.sentOffline, false);
});

test("已连接但 QQ 离线时不发送，超时进入连接重试而非消息重投", async (t) => {
  const f = await fixture(t, 80);
  await f.listen();
  await f.bots.connect("default");
  await f.scheduler.trigger("daily");
  assert.equal(f.sent, 0);
  const ledger = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  );
  const record = Object.values(ledger.records)[0] as {
    targetStates: unknown;
    nextRetryAt: number;
  };
  assert.deepEqual(record.targetStates, {});
  assert.ok(record.nextRetryAt > 0);
});

test("关闭服务取消冷启动等待，不等待端口超时", async (t) => {
  const f = await fixture(t);
  const trigger = f.scheduler.trigger("daily");
  await new Promise((r) => setTimeout(r, 50));
  const before = Date.now();
  await f.schedules.close();
  await trigger;
  assert.ok(Date.now() - before < 350);
  assert.equal(f.sent, 0);
});

test("端口开放但 OneBot 握手无响应时限时退出，不阻塞任务队列", async (t) => {
  const f = await fixture(t, 5000, 100);
  f.server.removeAllListeners("request");
  f.server.on("request", () => {});
  await f.listen();
  const trigger = f.scheduler.trigger("daily");
  const completed = await Promise.race([
    trigger.then(() => true),
    new Promise<boolean>((r) => setTimeout(() => r(false), 700)),
  ]);
  assert.equal(completed, true);
  assert.equal(f.sent, 0);
});
