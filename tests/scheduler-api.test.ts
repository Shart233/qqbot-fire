import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { createApp } from "../server/src/bootstrap.js";

const task = {
  name: "中文 / 早安",
  time: "23:59",
  targets: [42],
  targetType: "private",
  message: "早安",
  autoConnect: false,
  autoStopAfterSend: false,
};
async function fixture(t: test.TestContext) {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-schedule-api-"));
  let app = await createApp({ dataDir: dir, logger: false });
  t.after(async () => {
    await app.close();
    await rm(dir, { recursive: true, force: true });
  });
  const setup = await app.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  return {
    dir,
    headers,
    get app() {
      return app;
    },
    async restart() {
      await app.close();
      app = await createApp({ dataDir: dir, logger: false });
    },
  };
}

test("任务接口支持中文编码、更新保留开关、重启恢复和非法输入拒绝", async (t) => {
  const f = await fixture(t),
    url = "/api/bots/default/schedules",
    path = url + "/" + encodeURIComponent(task.name);
  assert.equal((await f.app.inject(url)).statusCode, 401);
  const created = await f.app.inject({
    method: "POST",
    url,
    headers: f.headers,
    payload: task,
  });
  assert.equal(created.statusCode, 200, created.body);
  assert.equal(
    (
      await f.app.inject({
        method: "PUT",
        url: path + "/toggle",
        headers: f.headers,
        payload: { enabled: false },
      })
    ).statusCode,
    200,
  );
  assert.equal(
    (
      await f.app.inject({
        method: "PUT",
        url: path + "/autoconnect",
        headers: f.headers,
        payload: { autoConnect: true },
      })
    ).statusCode,
    200,
  );
  const update = await f.app.inject({
    method: "PUT",
    url: path,
    headers: f.headers,
    payload: {
      time: "23:58",
      targets: [43],
      message: "更新",
      targetType: "group",
    },
  });
  assert.equal(update.statusCode, 200, update.body);
  await f.restart();
  const tasks = (await f.app.inject({ url, headers: f.headers })).json().data;
  assert.deepEqual(tasks, [
    {
      ...task,
      time: "23:58",
      targets: [43],
      message: "更新",
      targetType: "group",
      enabled: false,
      autoConnect: true,
    },
  ]);
  assert.equal(
    (
      await f.app.inject({
        method: "POST",
        url,
        headers: f.headers,
        payload: { ...task, time: "25:00" },
      })
    ).statusCode,
    400,
  );
  assert.equal(
    (
      await f.app.inject({
        method: "PUT",
        url: url + "/missing",
        headers: f.headers,
        payload: task,
      })
    ).statusCode,
    404,
  );
  assert.equal(
    (
      await f.app.inject({
        url: "/api/bots/missing/schedules",
        headers: f.headers,
      })
    ).statusCode,
    404,
  );
  assert.equal(
    (await f.app.inject({ method: "DELETE", url: path, headers: f.headers }))
      .statusCode,
    200,
  );
  assert.deepEqual(
    (await f.app.inject({ url, headers: f.headers })).json().data,
    [],
  );
});

test("调度测试发送贯穿真实 HTTP，断开后重连不重投已成功目标", async (t) => {
  const f = await fixture(t);
  let sends = 0;
  const mock = createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    if (req.url === "/send_private_msg") sends++;
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data:
          req.url === "/get_login_info"
            ? { user_id: 12345, nickname: "测试" }
            : { message_id: sends },
      }),
    );
  });
  await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise<void>((resolve) => {
        mock.closeAllConnections();
        mock.close(() => resolve());
      }),
  );
  await f.app.inject({
    method: "PUT",
    url: "/api/bots/default/config",
    headers: f.headers,
    payload: {
      mode: "http",
      httpUrl: `http://127.0.0.1:${(mock.address() as { port: number }).port}`,
    },
  });
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/connect",
    headers: f.headers,
  });
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/schedules",
    headers: f.headers,
    payload: { ...task, name: "send" },
  });
  for (let i = 0; i < 2; i++) {
    const result = await f.app.inject({
      method: "POST",
      url: "/api/bots/default/schedules/send/test",
      headers: f.headers,
    });
    assert.equal(result.statusCode, 200, result.body);
    if (i === 0) {
      await f.app.inject({
        method: "POST",
        url: "/api/bots/default/disconnect",
        headers: f.headers,
      });
      await f.app.inject({
        method: "POST",
        url: "/api/bots/default/connect",
        headers: f.headers,
      });
    }
  }
  assert.equal(sends, 1);
  const ledger = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  );
  assert.equal(
    Object.values(
      ledger.records as Record<
        string,
        { targetStates: Record<string, string> }
      >,
    )[0]!.targetStates["42"],
    "SUCCESS",
  );
});

test("传输丢失响应经 Bot 服务转换后仍是 UNKNOWN，调度不盲目补发", async (t) => {
  const f = await fixture(t);
  let sends = 0;
  const mock = createServer((req, res) => {
    if (req.url === "/send_private_msg") {
      sends++;
      req.socket.destroy();
      return;
    }
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data: { user_id: 12345, nickname: "测试" },
      }),
    );
  });
  await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise<void>((resolve) => {
        mock.closeAllConnections();
        mock.close(() => resolve());
      }),
  );
  await f.app.inject({
    method: "PUT",
    url: "/api/bots/default/config",
    headers: f.headers,
    payload: {
      mode: "http",
      httpUrl: `http://127.0.0.1:${(mock.address() as { port: number }).port}`,
    },
  });
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/connect",
    headers: f.headers,
  });
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/schedules",
    headers: f.headers,
    payload: { ...task, name: "unknown" },
  });
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/schedules/unknown/test",
    headers: f.headers,
  });
  assert.equal(sends, 1);
  const ledger = JSON.parse(
    await readFile(join(f.dir, "schedules_state.json"), "utf8"),
  );
  assert.equal(
    Object.values(
      ledger.records as Record<
        string,
        { targetStates: Record<string, string> }
      >,
    )[0]!.targetStates["42"],
    "UNKNOWN",
  );
});

test("重命名连同任务和成功账本迁移，删除 Bot 后原任务不会被新同名 Bot 复用", async (t) => {
  const f = await fixture(t);
  await f.app.inject({
    method: "POST",
    url: "/api/bots/default/schedules",
    headers: f.headers,
    payload: { ...task, enabled: false },
  });
  const renamed = await f.app.inject({
    method: "PUT",
    url: "/api/bots/default/rename",
    headers: f.headers,
    payload: { newName: "renamed" },
  });
  assert.equal(renamed.statusCode, 200, renamed.body);
  assert.equal(
    (
      await f.app.inject({
        url: "/api/bots/renamed/schedules",
        headers: f.headers,
      })
    ).json().data[0].name,
    task.name,
  );
  await f.restart();
  assert.equal(
    (
      await f.app.inject({
        url: "/api/bots/renamed/schedules",
        headers: f.headers,
      })
    ).json().data.length,
    1,
  );
  assert.equal(
    (
      await f.app.inject({
        method: "DELETE",
        url: "/api/bots/renamed",
        headers: f.headers,
      })
    ).statusCode,
    200,
  );
  await f.app.inject({
    method: "POST",
    url: "/api/bots",
    headers: f.headers,
    payload: { name: "renamed" },
  });
  assert.deepEqual(
    (
      await f.app.inject({
        url: "/api/bots/renamed/schedules",
        headers: f.headers,
      })
    ).json().data,
    [],
  );
});

test("较长中文任务名创建后仍可通过编码路由操作", async (t) => {
  const f = await fixture(t);
  const name = "很长的中文任务".repeat(16);
  const base = "/api/bots/default/schedules";
  assert.equal(
    (
      await f.app.inject({
        method: "POST",
        url: base,
        headers: f.headers,
        payload: { ...task, name },
      })
    ).statusCode,
    200,
  );
  const changed = await f.app.inject({
    method: "PUT",
    url: base + "/" + encodeURIComponent(name) + "/toggle",
    headers: f.headers,
    payload: { enabled: false },
  });
  assert.equal(changed.statusCode, 200, changed.body);
});
