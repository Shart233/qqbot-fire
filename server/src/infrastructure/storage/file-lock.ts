import { spawn } from "node:child_process";
import { open, lstat } from "node:fs/promises";

/** 锁由操作系统持有；主进程退出后，管道关闭使辅助进程释放锁。 */
export async function acquireOsLock(
  path: string,
): Promise<() => Promise<void>> {
  try {
    if ((await lstat(path)).isSymbolicLink())
      throw new Error("数据目录锁不能是符号链接");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  try {
    const file = await open(path, "wx", 0o600);
    await file.close();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST")
      throw new Error("数据目录锁无法访问");
  }
  const windows = process.platform === "win32";
  const script = `$ErrorActionPreference='Stop'; try { $f=[System.IO.File]::Open($env:QQBOT_LOCK_GUARD,'OpenOrCreate','ReadWrite','None') } catch { exit 73 }; try { [Console]::Out.WriteLine('LOCKED'); [Console]::Out.Flush(); [Console]::In.ReadToEnd() | Out-Null } finally { $f.Dispose() }`;
  const child = spawn(
    windows ? "powershell.exe" : "flock",
    windows
      ? [
          "-NoProfile",
          "-NonInteractive",
          "-EncodedCommand",
          Buffer.from(script, "utf16le").toString("base64"),
        ]
      : [
          "--exclusive",
          "--nonblock",
          "--conflict-exit-code",
          "73",
          path,
          "sh",
          "-c",
          "printf 'LOCKED\\n'; cat >/dev/null",
        ],
    {
      env: { ...process.env, QQBOT_LOCK_GUARD: path },
      // Windows 隐藏窗口时保留管道，独立控制台会使 PowerShell 提前结束。
      detached: !windows,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  let released = false,
    ready = false;
  const exited = new Promise<void>((resolve) =>
    child.once("close", () => resolve()),
  );
  child.stdin.on("error", () => {});
  child.stderr.resume();
  child.once("exit", () => {
    // 丢失系统锁后不能继续写入，交由部署环境重启并恢复事务。
    if (ready && !released) process.exit(1);
  });
  const release = async () => {
    if (released) return;
    released = true;
    child.stdin.end();
    const timer = setTimeout(() => {
      child.kill();
    }, 2000);
    try {
      await exited;
    } finally {
      clearTimeout(timer);
    }
  };
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("获取系统文件锁超时")),
        10_000,
      );
      let buffer = "";
      child.stdout.on("data", (bytes) => {
        buffer += bytes.toString();
        if (buffer.includes("LOCKED")) {
          ready = true;
          clearTimeout(timer);
          resolve();
        }
      });
      child.once("error", () => {
        clearTimeout(timer);
        reject(
          new Error(
            "系统文件锁不可用：Linux 需要 flock，Windows 需要 PowerShell",
          ),
        );
      });
      child.once("close", () => {
        clearTimeout(timer);
        if (!ready) reject(new Error("数据目录已被其他服务占用"));
      });
    });
    return release;
  } catch (error) {
    await release();
    throw error;
  }
}
