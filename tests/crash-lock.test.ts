import test from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { acquireDataLock } from "../server/src/infrastructure/storage/json-store.js";

test("进程被强制终止后数据锁自动释放，重新启动无需人工删锁", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-crash-lock-"));
  let child: ChildProcess | undefined;
  t.after(async () => {
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
      await once(child, "exit");
    }
    await rm(dir, { recursive: true, force: true });
  });
  const store = fileURLToPath(
    new URL(
      "../server/src/infrastructure/storage/json-store.ts",
      import.meta.url,
    ),
  );
  child = spawn(
    process.execPath,
    [
      "--import",
      "tsx",
      "--input-type=module",
      "-e",
      `const { acquireDataLock }=await import(${JSON.stringify(store)}); await acquireDataLock(process.env.QQBOT_TEST_DATA); console.log('READY'); setInterval(()=>{},1000);`,
    ],
    {
      env: { ...process.env, QQBOT_TEST_DATA: dir },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let output = "";
  child.stdout!.on("data", (bytes) => {
    output += bytes;
  });
  child.stderr!.on("data", (bytes) => {
    output += bytes;
  });
  const deadline = Date.now() + 30000;
  while (
    !output.includes("READY") &&
    Date.now() < deadline &&
    child.exitCode === null
  )
    await new Promise((r) => setTimeout(r, 25));
  assert.ok(output.includes("READY"), output);
  await assert.rejects(acquireDataLock(dir), /数据目录/);
  const exited = once(child, "exit");
  child.kill("SIGKILL");
  await exited;
  assert.ok(await readFile(join(dir, ".writer.lock"), "utf8"));
  await new Promise((r) => setTimeout(r, 100));
  const release = await acquireDataLock(dir);
  await release();
});
