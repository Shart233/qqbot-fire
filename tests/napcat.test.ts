import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createServer } from "node:net";
import { createApp } from "../server/src/bootstrap.js";

async function freePort() {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as { port: number }).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return port;
}
async function fixture(
  t: test.TestContext,
  options: { napcatMode?: "managed" | "external" } = {},
) {
  const root = await mkdtemp(join(tmpdir(), "qqbot-napcat-"));
  const dataDir = join(root, "数据");
  const napcatDir = join(root, "NapCat 测试 空格");
  await mkdir(napcatDir);
  await writeFile(
    join(napcatDir, "napcat.mjs"),
    `console.log('模拟实例启动'); setInterval(() => {},1000);`,
  );
  await writeFile(
    join(napcatDir, "napcat-run.sh"),
    'exec node "$NAPCAT_MAIN_PATH" "$@"\n',
  );
  let app = await createApp({ dataDir, logger: false, ...options });
  t.after(async () => {
    await app.close();
    await rm(root, { recursive: true, force: true });
  });
  const setup = await app.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  await app.inject({
    method: "PUT",
    url: "/api/napcat/config",
    headers,
    payload: { napCatDir: napcatDir, workRoot: join(dataDir, "instances") },
  });
  return {
    root,
    dataDir,
    napcatDir,
    headers,
    get app() {
      return app;
    },
    async restart() {
      await app.close();
      app = await createApp({ dataDir, logger: false, ...options });
    },
  };
}

test("NapCat 两个受管进程独立启停，保存恢复不复用旧 PID", async (t) => {
  const f = await fixture(t);
  const ports = [await freePort(), await freePort()];
  for (const [index, name] of ["first", "second"].entries()) {
    const result = await f.app.inject({
      method: "POST",
      url: "/api/napcat/start",
      headers: f.headers,
      payload: { name, qq: String(12345 + index), webuiPort: ports[index] },
    });
    assert.equal(result.statusCode, 200, result.body);
    assert.equal(result.json().data.botName, "qq" + (12345 + index));
    assert.ok(result.json().data.wsPort > 0);
  }
  const all = (
    await f.app.inject({ url: "/api/napcat/instances", headers: f.headers })
  ).json().data;
  assert.equal(all.length, 2);
  assert.ok(
    all.every(
      (instance: { alive: boolean; pid: number }) =>
        instance.alive && instance.pid > 0,
    ),
  );
  const stopped = await f.app.inject({
    method: "POST",
    url: "/api/napcat/stop",
    headers: f.headers,
    payload: { name: "first" },
  });
  assert.equal(stopped.statusCode, 200);
  assert.equal(
    (await f.app.inject({ url: "/api/napcat/instances", headers: f.headers }))
      .json()
      .data.find((i: { name: string }) => i.name === "second").alive,
    true,
  );
  await f.restart();
  const restored = (
    await f.app.inject({ url: "/api/napcat/saved", headers: f.headers })
  ).json().data;
  assert.equal(restored.length, 2);
  assert.ok(restored.every((i: { running: boolean }) => !i.running));
  const login = await f.app.inject({
    url: "/api/napcat/instances/first/login",
    headers: f.headers,
  });
  assert.equal(login.json().data.state, "stopped");
  assert.equal(login.headers["cache-control"], "no-store");
  const restarted = await f.app.inject({
    method: "POST",
    url: "/api/napcat/start",
    headers: f.headers,
    payload: { name: "first" },
  });
  assert.equal(restarted.statusCode, 200, restarted.body);
  assert.equal(
    (await f.app.inject({ url: "/api/napcat/instances", headers: f.headers }))
      .json()
      .data.find((i: { name: string }) => i.name === "first").qqUin,
    "12345",
  );
});

test("端口冲突阻止启动，发现共享与实例配置时保留 Token，遗忘不删除工作目录", async (t) => {
  const f = await fixture(t);
  const listener = createServer();
  await new Promise<void>((resolve) =>
    listener.listen(0, "127.0.0.1", resolve),
  );
  t.after(
    () => new Promise<void>((resolve) => listener.close(() => resolve())),
  );
  const conflict = await f.app.inject({
    method: "POST",
    url: "/api/napcat/start",
    headers: f.headers,
    payload: {
      name: "conflict",
      qq: "12345",
      webuiPort: (listener.address() as { port: number }).port,
    },
  });
  assert.equal(conflict.statusCode, 409);
  assert.deepEqual(
    (
      await f.app.inject({ url: "/api/napcat/instances", headers: f.headers })
    ).json().data,
    [],
  );
  await mkdir(join(f.napcatDir, "config"));
  await writeFile(
    join(f.napcatDir, "config/onebot11_67890.json"),
    JSON.stringify({
      network: {
        websocketServers: [
          { enable: true, host: "0.0.0.0", port: 3001, token: "shared-token" },
        ],
      },
    }),
  );
  await mkdir(join(f.dataDir, "instances/demo/config"), { recursive: true });
  await writeFile(
    join(f.dataDir, "instances/demo/config/onebot11_67890.json"),
    JSON.stringify({
      network: {
        websocketServers: [
          { enable: true, host: "127.0.0.1", port: 3101, token: "" },
        ],
      },
    }),
  );
  const discovered = await f.app.inject({
    method: "POST",
    url: "/api/napcat/discover",
    headers: f.headers,
  });
  assert.equal(discovered.statusCode, 200, discovered.body);
  assert.deepEqual(discovered.json().data.discovered, ["qq67890"]);
  const config = (
    await f.app.inject({ url: "/api/bots/qq67890/config", headers: f.headers })
  ).json().data;
  assert.equal(config.wsUrl, "ws://127.0.0.1:3101");
  assert.equal(config.wsToken, "shared-token");
  assert.ok(
    JSON.parse(
      await readFile(join(f.dataDir, "config.json"), "utf8"),
    ).bots.qq67890.wsToken.startsWith("RSA:"),
  );
});

test("外部模式拒绝进程控制，管理员鉴权和非法参数仍然生效", async (t) => {
  const f = await fixture(t, { napcatMode: "external" });
  assert.equal(
    (
      await f.app.inject({
        method: "POST",
        url: "/api/napcat/start",
        headers: f.headers,
        payload: { name: "demo", qq: "12345" },
      })
    ).statusCode,
    409,
  );
  assert.equal(
    (
      await f.app.inject({
        method: "POST",
        url: "/api/napcat/stop",
        headers: f.headers,
        payload: { name: "all" },
      })
    ).statusCode,
    409,
  );
  assert.equal((await f.app.inject("/api/napcat/instances")).statusCode, 401);
  assert.equal(
    (
      await f.app.inject({
        method: "POST",
        url: "/api/napcat/start",
        headers: f.headers,
        payload: { name: "../escape", qq: "12345" },
      })
    ).statusCode,
    400,
  );
});

test("本地 WebUI 凭据与实际 OneBot Token 一致，重启保留凭据且修正端口", async (t) => {
  const f = await fixture(t);
  const start = async () =>
    f.app.inject({
      method: "POST",
      url: "/api/napcat/start",
      headers: f.headers,
      payload: { name: "secured", qq: "12345", webuiPort: await freePort() },
    });
  const first = await start();
  assert.equal(first.statusCode, 200, first.body);
  const directory = join(f.dataDir, "instances/secured/config");
  const webui = JSON.parse(
    await readFile(join(directory, "webui.json"), "utf8"),
  );
  assert.ok(webui.token.length >= 32);
  assert.equal(webui.host, "127.0.0.1");
  const onebot = JSON.parse(
    await readFile(join(directory, "onebot11_12345.json"), "utf8"),
  );
  const bot = (
    await f.app.inject({ url: "/api/bots/qq12345/config", headers: f.headers })
  ).json().data;
  assert.ok(bot.wsToken.length >= 32);
  assert.equal(onebot.network.websocketServers[0].token, bot.wsToken);
  await f.app.inject({
    method: "POST",
    url: "/api/napcat/stop",
    headers: f.headers,
    payload: { name: "secured" },
  });
  const second = await start();
  assert.equal(second.statusCode, 200, second.body);
  const nextWebui = JSON.parse(
    await readFile(join(directory, "webui.json"), "utf8"),
  );
  assert.equal(nextWebui.token, webui.token);
  assert.equal(nextWebui.port, second.json().data.webuiPort);
});

test("容器默认目录生效，自动恢复保存实例且不重置用户配置", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "qqbot-container-"));
  const dataDir = join(root, "data"),
    napcatDir = join(root, "napcat");
  await mkdir(dataDir);
  await mkdir(napcatDir);
  await writeFile(join(napcatDir, "napcat.mjs"), "setInterval(()=>{},1000)");
  await writeFile(
    join(dataDir, "napcat_instances.json"),
    JSON.stringify([
      { name: "restored", qqUin: "12345", webuiPort: await freePort() },
    ]),
  );
  await writeFile(
    join(napcatDir, "napcat-run.sh"),
    'exec node "$NAPCAT_MAIN_PATH" "$@"\n',
  );
  const app = await createApp({
    dataDir,
    logger: false,
    napcatDefaults: { napcatDir, workRoot: join(dataDir, "instances") },
    napcatAutoStart: true,
  });
  t.after(async () => {
    await app.close();
    await rm(root, { recursive: true, force: true });
  });
  const setup = await app.inject({
    method: "POST",
    url: "/api/auth/setup",
    payload: { password: "test-password-123" },
  });
  const headers = { authorization: `Bearer ${setup.json().data.token}` };
  const config = (
    await app.inject({ url: "/api/napcat/config", headers })
  ).json().data;
  assert.equal(config.napCatDir, napcatDir);
  const instances = (
    await app.inject({ url: "/api/napcat/instances", headers })
  ).json().data;
  assert.equal(
    instances.find((x: { name: string }) => x.name === "restored").alive,
    true,
  );
  await app.inject({
    method: "PUT",
    url: "/api/napcat/config",
    headers,
    payload: { workRoot: join(dataDir, "custom") },
  });
  await app.close();
  const restarted = await createApp({
    dataDir,
    logger: false,
    napcatDefaults: { napcatDir, workRoot: join(dataDir, "instances") },
  });
  try {
    assert.equal(
      (await restarted.inject({ url: "/api/napcat/config", headers })).json()
        .data.workRoot,
      join(dataDir, "custom"),
    );
  } finally {
    await restarted.close();
  }
});
