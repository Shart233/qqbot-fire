import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";
import { BotService } from "../server/src/modules/bots/service.js";
import { NapCatService } from "../server/src/modules/napcat/service.js";
import { ScheduleService } from "../server/src/modules/scheduler/service.js";
import { ConsoleService } from "../server/src/modules/console/service.js";

test("终端接管持续输出实例日志，detach 后不再收到新日志", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-live-console-"));
  const launcher = join(dir, "napcat");
  await mkdir(launcher);
  await writeFile(
    join(launcher, "napcat.mjs"),
    "setInterval(()=>console.log('实时日志'),25)",
  );
  await writeFile(
    join(launcher, "napcat-run.sh"),
    'exec node "$NAPCAT_MAIN_PATH" "$@"\n',
  );
  const store = new JsonStore(join(dir, "data")),
    bots = new BotService(store);
  const napcat = new NapCatService(store, bots),
    schedules = new ScheduleService(store, bots, napcat);
  const lines: string[] = [];
  const consoleService = new ConsoleService(bots, schedules, napcat, {
    async startWeb() {
      return "";
    },
    async stopWeb() {
      return "";
    },
    webStatus: () => "",
    quit() {},
    output: (line) => {
      lines.push(line);
    },
  });
  t.after(async () => {
    consoleService.close();
    await schedules.close();
    await napcat.close();
    await bots.close();
    await rm(dir, { recursive: true, force: true });
  });
  await napcat.updateConfig({ napCatDir: launcher });
  await napcat.start("live", "12345", 0);
  assert.match(
    await consoleService.execute("/napcat attach live", "terminal"),
    /接管实时日志/,
  );
  const deadline = Date.now() + 1500;
  while (lines.length < 2 && Date.now() < deadline)
    await new Promise((r) => setTimeout(r, 25));
  assert.ok(lines.length >= 2);
  assert.ok(lines.every((line) => line.includes("实时日志")));
  await consoleService.execute("/napcat detach", "terminal");
  const count = lines.length;
  await new Promise((r) => setTimeout(r, 100));
  assert.equal(lines.length, count);
});
