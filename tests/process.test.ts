import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { OwnedProcess } from "../server/src/infrastructure/process/owned-process.js";

test(
  "停止进程会清理关闭了输出管道且忽略 TERM 的子进程",
  { skip: process.platform === "win32" },
  async (t) => {
    const dir = await mkdtemp(join(tmpdir(), "qqbot-process-"));
    const script = join(dir, "parent.cjs"),
      pidfile = join(dir, "child.pid");
    await writeFile(
      script,
      `const {spawn}=require('node:child_process'); const fs=require('node:fs');
const child=spawn(process.execPath,['-e','process.on("SIGTERM",()=>{});setInterval(()=>{},1000)'],{stdio:'ignore'});
fs.writeFileSync(process.argv[2],String(child.pid)); setInterval(()=>{},1000);`,
    );
    const owned = new OwnedProcess(
      {
        command: process.execPath,
        args: [script, pidfile],
        cwd: dir,
        env: process.env,
      },
      () => {},
    );
    let pid = 0;
    t.after(async () => {
      await owned.stop();
      if (pid)
        try {
          process.kill(pid, "SIGKILL");
        } catch {
          /* 已经退出。 */
        }
      await rm(dir, { recursive: true, force: true });
    });
    await owned.ready();
    pid = Number(await readFile(pidfile, "utf8"));
    await new Promise((r) => setTimeout(r, 100));
    await owned.stop();
    const deadline = Date.now() + 1000;
    let alive = true;
    while (Date.now() < deadline) {
      try {
        const status = await readFile(`/proc/${pid}/stat`, "utf8");
        alive = !/\) Z /.test(status);
      } catch {
        alive = false;
      }
      if (!alive) break;
      await new Promise((r) => setTimeout(r, 20));
    }
    assert.equal(
      alive,
      false,
      "不能因父进程已经退出而遗留独立输出的 QQ 子进程",
    );
  },
);

test(
  "缺少 Linux QQ 或有效启动器时给出明确错误，不把 Shell 模块当普通 Node 程序",
  { skip: process.platform === "win32" },
  async (t) => {
    const { buildLaunch } = await import(
      "../server/src/infrastructure/process/owned-process.js"
    );
    const dir = await mkdtemp(join(tmpdir(), "qqbot-no-launcher-"));
    t.after(() => rm(dir, { recursive: true, force: true }));
    await writeFile(join(dir, "napcat.mjs"), "// 占位入口\n");
    await assert.rejects(buildLaunch(dir, dir, "12345", 6099), /QQ|启动器/);
  },
);

test(
  "启动器自行退出时立即清理其子进程，不留到下次启动再按旧 PID 操作",
  { skip: process.platform !== "linux" },
  async (t) => {
    const dir = await mkdtemp(join(tmpdir(), "qqbot-exit-tree-"));
    const script = join(dir, "parent.cjs"),
      pidfile = join(dir, "child.pid");
    await writeFile(
      script,
      `const {spawn}=require('node:child_process'); const fs=require('node:fs');
const child=spawn(process.execPath,['-e','process.on("SIGTERM",()=>{});setInterval(()=>{},1000)'],{stdio:'ignore'});
fs.writeFileSync(process.argv[2],String(child.pid)); setTimeout(()=>process.exit(0),250);`,
    );
    const owned = new OwnedProcess(
      {
        command: process.execPath,
        args: [script, pidfile],
        cwd: dir,
        env: process.env,
      },
      () => {},
    );
    let pid = 0;
    t.after(async () => {
      await owned.stop();
      if (pid)
        try {
          process.kill(pid, "SIGKILL");
        } catch {}
      await rm(dir, { recursive: true, force: true });
    });
    await owned.ready();
    pid = Number(await readFile(pidfile, "utf8"));
    await owned.exited;
    const deadline = Date.now() + 2200;
    let alive = true;
    while (Date.now() < deadline) {
      try {
        alive = !/\) Z /.test(await readFile(`/proc/${pid}/stat`, "utf8"));
      } catch {
        alive = false;
      }
      if (!alive) break;
      await new Promise((r) => setTimeout(r, 25));
    }
    assert.equal(alive, false);
  },
);
