import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/src/bootstrap.js";

test("控制台复用业务服务，别名切换 Bot、任务编辑与敏感值遮蔽", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-console-"));
  const app = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await app.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const setup = await app.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  const run = async (command: string) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/console/exec",
      headers,
      payload: { command },
    });
    assert.equal(response.statusCode, 200, response.body);
    return response.json().data.output as string;
  };
  assert.match(await run("/h"), /定时|schedule/);
  await run("/b new sample");
  await run("/set wstoken do-not-print-this-token");
  const output = await run("/show");
  assert.equal(output.includes("do-not-print-this-token"), false);
  await run("/sch add morning 23:59 private 42,43 中文消息 包含空格");
  await run("/sch off morning");
  const tasks = (
    await app.inject({ url: "/api/bots/sample/schedules", headers })
  ).json().data;
  assert.equal(tasks[0].message, "中文消息 包含空格");
  assert.equal(tasks[0].enabled, false);
  await run("/bot rename sample renamed");
  assert.equal(
    (await app.inject({ url: "/api/bots", headers })).json().data.activeBot,
    "renamed",
  );
  assert.match(await run("/bot remove renamed"), /renamed/);
  assert.match(await run("/quit"), /Web|控制台|关闭/);
  assert.equal((await app.inject("/health")).statusCode, 200);
  assert.match(await run("/unknown"), /未知命令/);
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/api/console/exec",
        payload: { command: "/h" },
      })
    ).statusCode,
    401,
  );
});
