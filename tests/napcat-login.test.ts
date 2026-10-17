import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, writeFile, rm, utimes } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { NapCatLoginClient } from "../server/src/modules/napcat/login.js";

async function fixture(t: test.TestContext) {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-login-"));
  await mkdir(join(dir, "config"));
  await mkdir(join(dir, "cache"));
  await writeFile(join(dir, "config/webui.json"), '{"token":"webui-secret"}');
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j6V8AAAAASUVORK5CYII=",
    "base64",
  );
  await writeFile(join(dir, "cache/qrcode.png"), png);
  let authenticated = 0;
  let refreshes = 0;
  let invalidate = false;
  let loggedIn = false;
  let loginError = "";
  const server = createServer(async (req, res) => {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const payload = JSON.parse(raw);
    res.setHeader("content-type", "application/json");
    if (req.url === "/api/auth/login") {
      assert.equal(
        payload.hash,
        createHash("sha256").update("webui-secret.napcat").digest("hex"),
      );
      authenticated++;
      res.end(
        JSON.stringify({
          code: 0,
          data: { Credential: "session-" + authenticated },
        }),
      );
      return;
    }
    if (invalidate) {
      invalidate = false;
      res.end('{"code":-1,"message":"Unauthorized"}');
      return;
    }
    assert.equal(req.headers.authorization, "Bearer session-" + authenticated);
    if (req.url === "/api/QQLogin/RefreshQRcode") {
      refreshes++;
      res.end('{"code":0,"data":{}}');
      return;
    }
    res.end(
      JSON.stringify({
        code: 0,
        data: { isLogin: loggedIn, isOffline: false, loginError },
      }),
    );
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const client = new NapCatLoginClient({
    name: "test",
    qqUin: "12345",
    workDir: dir,
    webuiPort: (server.address() as { port: number }).port,
    startedAt: Date.now() - 1000,
    alive: () => true,
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(dir, { recursive: true, force: true });
  });
  return {
    client,
    dir,
    png,
    get authenticated() {
      return authenticated;
    },
    get refreshes() {
      return refreshes;
    },
    invalidate() {
      invalidate = true;
    },
    loggedIn() {
      loggedIn = true;
    },
    expire() {
      loginError = "二维码已过期";
    },
  };
}

test("NapCat 登录摘要、凭据缓存、过期重登、刷新和已登录状态", async (t) => {
  const f = await fixture(t);
  const first = await f.client.status();
  assert.equal(first.state, "qr_ready");
  assert.equal(
    first.qrImage,
    "data:image/png;base64," + f.png.toString("base64"),
  );
  assert.equal(first.canRefresh, true);
  assert.equal(f.authenticated, 1);
  await Promise.all([f.client.status(), f.client.status()]);
  assert.equal(f.authenticated, 1);
  f.invalidate();
  assert.equal((await f.client.status()).state, "qr_ready");
  assert.equal(f.authenticated, 2);
  await f.client.refresh();
  assert.equal(f.refreshes, 1);
  f.loggedIn();
  const login = await f.client.status();
  assert.equal(login.state, "logged_in");
  assert.equal(login.qrImage, "");
});

test("过期、旧进程缓存和超大二维码不展示，刷新只影响登录请求", async (t) => {
  const f = await fixture(t);
  f.expire();
  const expired = await f.client.status();
  assert.equal(expired.state, "error");
  assert.equal(expired.qrImage, "");
  await f.client.refresh();
  assert.equal(f.refreshes, 1);
  await utimes(join(f.dir, "cache/qrcode.png"), new Date(0), new Date(0));
  assert.equal((await f.client.status()).qrImage, "");
  await writeFile(
    join(f.dir, "cache/qrcode.png"),
    Buffer.alloc(1024 * 1024 + 1),
  );
  assert.equal((await f.client.status()).qrImage, "");
});
