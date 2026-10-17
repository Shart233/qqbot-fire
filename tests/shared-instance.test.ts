import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createServer } from "node:http";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";
import { BotService } from "../server/src/modules/bots/service.js";
import { NapCatService } from "../server/src/modules/napcat/service.js";
import { ScheduleService } from "../server/src/modules/scheduler/service.js";
import {
  normalizeConfig,
  defaultConfig,
} from "../server/src/infrastructure/storage/config.js";

test("两个 Bot 共享实例时，任务自动停止不会关闭另一 Bot 的进程或连接", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-shared-"));
  const store = new JsonStore(dir);
  const bots = new BotService(store),
    napcat = new NapCatService(store, bots);
  const schedules = new ScheduleService(store, bots, napcat, {
    policy: { sendGapMs: 0, resendRounds: 0 },
  });
  const mock = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data:
          req.url === "/get_login_info"
            ? { user_id: 12345, nickname: "模拟" }
            : { message_id: 99 },
      }),
    );
  });
  t.after(async () => {
    await schedules.close();
    await napcat.close();
    await bots.close();
    mock.closeAllConnections();
    await new Promise<void>((resolve) => mock.close(() => resolve()));
    await rm(dir, { recursive: true, force: true });
  });
  await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${(mock.address() as { port: number }).port}`;
  const launcher = join(dir, "napcat");
  await mkdir(launcher);
  await writeFile(join(launcher, "napcat.mjs"), "setInterval(()=>{},1000);");
  await writeFile(
    join(launcher, "napcat-run.sh"),
    'exec node "$NAPCAT_MAIN_PATH" "$@"\n',
  );
  await napcat.updateConfig({
    napCatDir: launcher,
    workRoot: join(dir, "instances"),
  });
  await napcat.start("shared", "12345", 0);
  await bots.add("other");
  await store.update(
    "config.json",
    (raw) => {
      const config = normalizeConfig(raw);
      config.bots.other!.napCatInstanceName = "shared";
      config.bots.other!.qqUin = "12345";
      return config;
    },
    defaultConfig(),
  );
  for (const name of ["qq12345", "other"]) {
    await bots.updateConfig(name, { mode: "http", httpUrl: url });
    await bots.connect(name);
  }
  const scheduler = await schedules.get("qq12345");
  await scheduler.upsert({
    name: "daily",
    time: "23:59",
    targetType: "private",
    targets: [42],
    message: "模拟消息",
    autoStopAfterSend: true,
  });
  await scheduler.trigger("daily");
  await scheduler.drainStops();
  assert.equal(bots.isConnected("qq12345"), false);
  assert.equal(bots.isConnected("other"), true);
  assert.equal(
    (await napcat.list()).find((item) => item.name === "shared")?.alive,
    true,
  );
});
