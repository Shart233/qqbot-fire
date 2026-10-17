import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { createApp } from "../server/src/bootstrap.js";

test("外部 NapCat 无共享磁盘也能扫码刷新，凭据加密且重启恢复", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-external-"));
  let refresh = 0,
    logged = false;
  const upstream = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    res.setHeader("content-type", "application/json");
    if (req.url === "/prefix/api/auth/login") {
      assert.equal(
        JSON.parse(body).hash,
        createHash("sha256").update("remote-secret.napcat").digest("hex"),
      );
      res.end(JSON.stringify({ code: 0, data: { Credential: "session" } }));
      return;
    }
    assert.equal(req.headers.authorization, "Bearer session");
    if (req.url === "/prefix/api/QQLogin/RefreshQRcode") {
      refresh++;
      res.end('{"code":0,"data":{}}');
      return;
    }
    if (req.url === "/prefix/api/QQLogin/CheckLoginStatus") {
      res.end(
        JSON.stringify({
          code: 0,
          data: {
            isLogin: logged,
            isOffline: false,
            loginError: "",
            qrcodeurl: "https://qrcode.qq.com/qqapp/qr?test=" + refresh,
          },
        }),
      );
      return;
    }
    res.end('{"code":-1,"message":"unknown"}');
  });
  await new Promise<void>((r) => upstream.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${(upstream.address() as { port: number }).port}/prefix`;
  let app = await createApp({
    dataDir: dir,
    logger: false,
    napcatMode: "external",
  });
  t.after(async () => {
    await app.close();
    upstream.closeAllConnections();
    await new Promise<void>((r) => upstream.close(() => r()));
    await rm(dir, { recursive: true, force: true });
  });
  const setup = await app.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  const payload = {
    name: "remote",
    qqUin: "12345",
    webuiUrl: url,
    webuiToken: "remote-secret",
    wsUrl: "ws://napcat:3001",
    wsToken: "onebot-secret",
  };
  assert.equal(
    (await app.inject({ method: "PUT", url: "/api/napcat/external", payload }))
      .statusCode,
    401,
  );
  const result = await app.inject({
    method: "PUT",
    url: "/api/napcat/external",
    headers,
    payload,
  });
  assert.equal(result.statusCode, 200, result.body);
  assert.equal(
    (await readFile(join(dir, "napcat_instances.json"), "utf8")).includes(
      "remote-secret",
    ),
    false,
  );
  const path = "/api/napcat/instances/remote/login";
  const qr = (await app.inject({ url: path, headers })).json().data;
  assert.equal(qr.state, "qr_ready");
  assert.match(qr.qrImage, /^data:image\/png;base64,/);
  assert.equal(
    (await app.inject({ method: "POST", url: path + "/refresh", headers }))
      .statusCode,
    200,
  );
  assert.notEqual(
    (await app.inject({ url: path, headers })).json().data.qrVersion,
    qr.qrVersion,
  );
  await app.close();
  app = await createApp({
    dataDir: dir,
    logger: false,
    napcatMode: "external",
  });
  logged = true;
  assert.equal(
    (await app.inject({ url: path, headers })).json().data.state,
    "logged_in",
  );
  assert.equal(
    (await app.inject({ url: "/api/bots/qq12345/config", headers })).json().data
      .wsToken,
    "onebot-secret",
  );
  const invalid = await app.inject({
    method: "PUT",
    url: "/api/napcat/external",
    headers,
    payload: { ...payload, webuiUrl: "file:///etc/passwd" },
  });
  assert.equal(invalid.statusCode, 400);
  assert.equal(
    (
      await app.inject({
        method: "POST",
        url: "/api/napcat/stop",
        headers,
        payload: { name: "remote" },
      })
    ).statusCode,
    409,
  );
  await app.inject({
    method: "POST",
    url: "/api/napcat/forget",
    headers,
    payload: { name: "remote" },
  });
  assert.equal((await app.inject({ url: path, headers })).statusCode, 404);
});
