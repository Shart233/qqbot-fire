import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

test("终端可以停止和重启 Web，Web 停止期间控制台可用，quit 正常退出", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-terminal-"));
  const reservation = createServer();
  await new Promise<void>((r) => reservation.listen(0, "127.0.0.1", r));
  const port = (reservation.address() as { port: number }).port;
  await new Promise<void>((r) => reservation.close(() => r()));
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../server/dist/main.js", import.meta.url))],
    {
      env: {
        ...process.env,
        DATA_DIR: dir,
        PORT: String(port),
        HOST: "127.0.0.1",
        CONSOLE_ENABLED: "true",
        SCHEDULING_ENABLED: "false",
      },
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });
  const exited = once(child, "exit");
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null)
      child.kill("SIGKILL");
    await exited;
    await rm(dir, { recursive: true, force: true });
  });
  const waitFor = async (predicate: () => boolean, timeoutMs = 5000) => {
    const deadline = Date.now() + timeoutMs;
    while (!predicate() && Date.now() < deadline)
      await new Promise((r) => setTimeout(r, 25));
    assert.ok(predicate(), output);
  };
  await waitFor(() => output.includes("Server listening"), 30000);
  child.stdin.write("/web stop\n");
  await waitFor(() => output.includes("Web 服务已停止"));
  await assert.rejects(fetch(`http://127.0.0.1:${port}/health`));
  child.stdin.write("/bot add terminal\n/web start " + port + "\n");
  await waitFor(() => output.includes("Web 服务已启动"));
  assert.equal((await fetch(`http://127.0.0.1:${port}/health`)).status, 200);
  assert.ok(output.includes("terminal"));
  child.stdin.write("/quit\n");
  await waitFor(() => child.exitCode !== null);
  assert.equal((await exited)[0], 0, output);
});
