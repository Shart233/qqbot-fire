import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("编译后入口可在不同工作目录运行，实际 HTTP 可访问，退出释放数据锁", async (t) => {
  const dataDir = await mkdtemp(join(tmpdir(), "qqbot-lifecycle-"));
  const listener = createServer();
  await new Promise<void>((resolve) =>
    listener.listen(0, "127.0.0.1", resolve),
  );
  const port = (listener.address() as { port: number }).port;
  await new Promise<void>((resolve) => listener.close(() => resolve()));
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../server/dist/main.js", import.meta.url))],
    {
      cwd: tmpdir(),
      env: {
        ...process.env,
        DATA_DIR: dataDir,
        PORT: String(port),
        HOST: "127.0.0.1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout.on("data", (value) => {
    output += value.toString();
  });
  child.stderr.on("data", (value) => {
    output += value.toString();
  });
  const exited = once(child, "exit");
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null)
      child.kill("SIGKILL");
    await exited;
    await rm(dataDir, { recursive: true, force: true });
  });
  let response: Response | undefined;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline && child.exitCode === null) {
    try {
      response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  assert.ok(response?.ok, output);
  assert.deepEqual(await response.json(), {
    status: "ok",
    implementation: "typescript",
    scheduling: false,
    timeZone: "Asia/Shanghai",
  });
  assert.deepEqual(
    await (await fetch(`http://127.0.0.1:${port}/api/auth/status`)).json(),
    { ok: true, data: { initialized: false } },
  );
  assert.equal((await fetch(`http://127.0.0.1:${port}/api/bots`)).status, 401);
  child.kill("SIGTERM");
  const result = await exited;
  assert.equal(result[0], 0, output);
  assert.equal((await readdir(dataDir)).includes(".writer.lock"), false);
});
