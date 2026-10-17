import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createApp } from "../server/src/bootstrap.js";

test("日志尾部读取保持中文和行号，禁止越界与符号链接", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-logs-"));
  await mkdir(join(dataDir, "logs"));
  await writeFile(join(dataDir, "logs/server.log"), "第一行\n第二行\n第三行\n");
  await writeFile(join(dataDir, "secret.log"), "敏感数据");
  await symlink(join(dataDir, "secret.log"), join(dataDir, "logs/link.log"));
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
  assert.deepEqual(
    (
      await app.inject({
        url: "/api/logs/read?file=server.log&lines=2",
        headers,
      })
    ).json(),
    {
      ok: true,
      data: {
        file: "server.log",
        lines: ["第二行", "第三行"],
        total: 3,
        from: 1,
      },
    },
  );
  assert.equal(
    (await app.inject({ url: "/api/logs/read?file=..%2Fsecret.log", headers }))
      .statusCode,
    400,
  );
  assert.equal(
    (await app.inject({ url: "/api/logs/read?file=link.log", headers }))
      .statusCode,
    400,
  );
  const list = (await app.inject({ url: "/api/logs/list", headers })).json()
    .data;
  assert.deepEqual(
    list.map((file: { name: string }) => file.name),
    ["server.log"],
  );
  assert.equal((await app.inject("/api/logs/list")).statusCode, 401);
});
