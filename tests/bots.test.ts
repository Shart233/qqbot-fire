import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/src/bootstrap.js";

test("两个 Bot 使用独立配置发送，活动 Bot 不替代显式发送对象，重启保留加密配置", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-bots-"));
  const messages: { bot: string; target: number; message: unknown }[] = [];
  const mock = createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const params = JSON.parse(raw);
    const bot = req.headers.authorization === "Bearer token-a" ? "a" : "b";
    if (req.url?.startsWith("/send_"))
      messages.push({
        bot,
        target: Number(params.group_id ?? params.user_id),
        message: params.message,
      });
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data:
          req.url === "/get_login_info"
            ? { user_id: bot === "a" ? 1 : 2, nickname: bot }
            : req.url === "/get_friend_list"
              ? [{ user_id: 42, nickname: "好友", remark: "备注" }]
              : { message_id: messages.length },
      }),
    );
  });
  await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
  let server = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await server.close();
    mock.closeAllConnections();
    await new Promise<void>((resolve) => mock.close(() => resolve()));
    await rm(dataDir, { recursive: true, force: true });
  });
  const setup = await server.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  const address = `http://127.0.0.1:${(mock.address() as { port: number }).port}`;
  for (const name of ["a", "b"]) {
    assert.equal(
      (
        await server.inject({
          method: "POST",
          url: "/api/bots",
          headers,
          payload: { name },
        })
      ).statusCode,
      200,
    );
    assert.equal(
      (
        await server.inject({
          method: "PUT",
          url: `/api/bots/${name}/config`,
          headers,
          payload: {
            mode: "http",
            httpUrl: address,
            httpToken: `token-${name}`,
          },
        })
      ).statusCode,
      200,
    );
  }
  await Promise.all(
    ["a", "b"].map((name) =>
      server.inject({
        method: "POST",
        url: `/api/bots/${name}/connect`,
        headers,
      }),
    ),
  );
  await server.inject({ method: "PUT", url: "/api/bots/b/active", headers });
  const responses = await Promise.all(
    ["a", "b"].map((name, i) =>
      server.inject({
        method: "POST",
        url: `/api/bots/${name}/send`,
        headers,
        payload: { type: "private", target: 42 + i, message: `来自${name}` },
      }),
    ),
  );
  assert.deepEqual(
    responses.map((x) => x.statusCode),
    [200, 200],
  );
  assert.deepEqual(
    messages.sort((a, b) => a.bot.localeCompare(b.bot)),
    [
      {
        bot: "a",
        target: 42,
        message: [{ type: "text", data: { text: "来自a" } }],
      },
      {
        bot: "b",
        target: 43,
        message: [{ type: "text", data: { text: "来自b" } }],
      },
    ],
  );
  assert.deepEqual(
    (await server.inject({ url: "/api/bots/a/friends", headers })).json().data,
    [{ userId: 42, nickname: "好友", remark: "备注" }],
  );
  await server.inject({
    method: "POST",
    url: "/api/bots/a/disconnect",
    headers,
  });
  const bots = (await server.inject({ url: "/api/bots", headers })).json().data
    .bots;
  assert.equal(
    bots.find((b: { name: string }) => b.name === "b").connected,
    true,
  );
  const persisted = JSON.parse(
    await readFile(join(dataDir, "config.json"), "utf8"),
  );
  assert.ok(persisted.bots.a.httpToken.startsWith("RSA:"));
  assert.equal(persisted.bots.a.httpToken.includes("token-a"), false);
  await server.close();
  server = await createApp({ dataDir, logger: false });
  assert.equal(
    (await server.inject({ url: "/api/bots/a/config", headers })).json().data
      .httpToken,
    "token-a",
  );
  assert.equal(
    (await server.inject({ url: "/api/bots", headers })).json().data.activeBot,
    "b",
  );
});

test("Bot 名称、标识符校验与不存在对象的响应，不创建逃逸路径", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-validation-"));
  const server = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await server.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const setup = await server.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  for (const name of ["../escape", "非法名字", ""])
    assert.equal(
      (
        await server.inject({
          method: "POST",
          url: "/api/bots",
          headers,
          payload: { name },
        })
      ).statusCode,
      400,
    );
  assert.equal(
    (await server.inject({ url: "/api/bots/missing/config", headers }))
      .statusCode,
    404,
  );
  assert.equal(
    (
      await server.inject({
        method: "POST",
        url: "/api/bots/default/send",
        headers,
        payload: { type: "private", target: 9007199254740992, message: "x" },
      })
    ).statusCode,
    400,
  );
});

test("新 Bot 默认地址与 Java 一致，清空后地址为空", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-defaults-"));
  const server = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await server.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  const result = await server.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${result.json().data.token}` };
  const current = (
    await server.inject({ url: "/api/bots/default/config", headers })
  ).json().data;
  assert.equal(current.wsUrl, "ws://127.0.0.1:3001");
  assert.equal(current.httpUrl, "http://127.0.0.1:6099");
  const cleared = (
    await server.inject({
      method: "POST",
      url: "/api/bots/default/config/clear",
      headers,
    })
  ).json().data;
  assert.equal(cleared.wsUrl, "");
  assert.equal(cleared.httpUrl, "");
});
