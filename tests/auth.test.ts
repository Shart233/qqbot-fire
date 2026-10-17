import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hash } from "bcryptjs";
import { SignJWT } from "jose";
import { createApp } from "../server/src/bootstrap.js";

async function app(t: test.TestContext, initial?: unknown) {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-auth-"));
  if (initial)
    await writeFile(join(dataDir, "config.json"), JSON.stringify(initial));
  const server = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await server.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  return { server, dataDir };
}
const password = "test-password-123";

test("首次设置先持久化再发会话，改密吊销且重启后保留密码", async (t) => {
  const { server, dataDir } = await app(t);
  assert.deepEqual((await server.inject("/api/auth/status")).json(), {
    ok: true,
    data: { initialized: false },
  });
  assert.equal((await server.inject("/api/bots")).statusCode, 401);
  const setup = await server.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password },
  });
  assert.equal(setup.statusCode, 200);
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  assert.equal(
    (await server.inject({ url: "/api/bots", headers })).statusCode,
    200,
  );
  const change = await server.inject({
    method: "POST",
    url: "/api/auth/change-password",
    headers,
    payload: { oldPassword: password, newPassword: "new-password-456" },
  });
  assert.equal(change.statusCode, 200);
  assert.equal(
    (await server.inject({ url: "/api/bots", headers })).statusCode,
    401,
  );
  await server.close();
  const restarted = await createApp({ dataDir, logger: false });
  assert.equal(
    (
      await restarted.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: { password },
      })
    ).statusCode,
    401,
  );
  assert.equal(
    (
      await restarted.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: { password: "new-password-456" },
      })
    ).statusCode,
    200,
  );
  await restarted.close();
});

test("并发初始化只能成功一次，非法请求统一失败包裹", async (t) => {
  const { server } = await app(t);
  const results = await Promise.all(
    Array.from({ length: 3 }, () =>
      server.inject({
        method: "POST",
        url: "/api/auth/setup",
        payload: { password },
      }),
    ),
  );
  assert.deepEqual(results.map((x) => x.statusCode).sort(), [200, 409, 409]);
  const malformed = await server.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: "{",
    headers: { "content-type": "application/json" },
  });
  assert.equal(malformed.statusCode, 400);
  assert.equal(malformed.json().ok, false);
});

test("兼容旧 BCrypt 密码，连续五次错误后限速", async (t) => {
  const { server } = await app(t, {
    bots: {},
    admin: { passwordHash: await hash(password, 10) },
  });
  assert.equal(
    (
      await server.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: { password },
      })
    ).statusCode,
    200,
  );
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await server.inject({
          method: "POST",
          url: "/api/auth/login",
          payload: { password: "错误" },
        })
      ).statusCode,
      401,
    );
  const blocked = await server.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { password },
  });
  assert.equal(blocked.statusCode, 429);
  assert.ok(Number(blocked.headers["retry-after"]) > 0);
});

test("旧 JWT 密钥按 Base64 解码，拒绝旧版本、过期与非管理员身份", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-jwt-"));
  await mkdir(join(dataDir, ".keys"));
  const secret = Buffer.alloc(32, 7);
  await writeFile(join(dataDir, ".keys/jwt.secret"), secret.toString("base64"));
  await writeFile(
    join(dataDir, "config.json"),
    JSON.stringify({
      bots: {},
      admin: { passwordHash: await hash(password, 10), sessionVersion: 3 },
    }),
  );
  const server = await createApp({ dataDir, logger: false });
  t.after(async () => {
    await server.close();
    await rm(dataDir, { recursive: true, force: true });
  });
  for (const [sub, version, exp, expected] of [
    ["admin", 3, "1h", 200],
    ["admin", 2, "1h", 401],
    ["other", 3, "1h", 401],
    ["admin", 3, "-1h", 401],
  ] as const) {
    const token = await new SignJWT({ sessionVersion: version })
      .setSubject(sub)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(exp)
      .sign(secret);
    assert.equal(
      (
        await server.inject({
          url: "/api/bots",
          headers: { authorization: `Bearer ${token}` },
        })
      ).statusCode,
      expected,
    );
  }
});

test("未知接口必须鉴权后报错，静态路由不会伪装 API 成功", async (t) => {
  const { server } = await app(t);
  const result = await server.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password },
  });
  const headers = { authorization: `Bearer ${result.json().data.token}` };
  assert.equal(
    (
      await server.inject({
        method: "POST",
        url: "/api/console/exec",
        headers,
        payload: { command: "/help" },
      })
    ).statusCode,
    200,
  );
  assert.equal(
    (await server.inject({ url: "/api/missing", headers })).statusCode,
    404,
  );
  assert.equal(
    (await server.inject("/api/bots/default/schedules")).statusCode,
    401,
  );
});

test("损坏配置启动失败不覆盖文件，并释放启动时获取的数据锁", async (t) => {
  const { readFile, readdir } = await import("node:fs/promises");
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-corrupt-"));
  t.after(() => rm(dataDir, { recursive: true, force: true }));
  await writeFile(join(dataDir, "config.json"), "{损坏");
  await assert.rejects(createApp({ dataDir, logger: false }));
  assert.equal(await readFile(join(dataDir, "config.json"), "utf8"), "{损坏");
  assert.deepEqual(
    (await readdir(dataDir)).filter((name) => name !== ".writer.guard"),
    ["config.json"],
  );
  const { acquireDataLock } = await import(
    "../server/src/infrastructure/storage/json-store.js"
  );
  const release = await acquireDataLock(dataDir);
  await release();
});
