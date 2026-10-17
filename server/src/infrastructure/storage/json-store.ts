import { open, readFile, mkdir, rename, unlink, lstat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { acquireOsLock } from "./file-lock.js";
import { randomUUID } from "node:crypto";

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}

export class JsonStore {
  readonly directory: string;
  constructor(directory: string) {
    this.directory = resolve(directory);
  }

  private path(name: string): string {
    if (!/^[a-zA-Z0-9_.-]+$/.test(name) || name === "." || name === "..")
      throw new Error("非法数据文件路径");
    return join(this.directory, name);
  }

  async read<T>(name: string, fallback?: T): Promise<T> {
    const path = this.path(name);
    try {
      if ((await lstat(path)).isSymbolicLink())
        throw new Error("数据文件不能是符号链接");
      return JSON.parse(await readFile(path, "utf8")) as T;
    } catch (error) {
      if (isMissing(error) && fallback !== undefined)
        return structuredClone(fallback);
      throw error;
    }
  }

  private queue: Promise<unknown> = Promise.resolve();
  private transactionFailed = false;
  private serial<T>(work: () => Promise<T>): Promise<T> {
    const next = this.queue.catch(() => {}).then(work);
    this.queue = next;
    return next;
  }
  private async syncDirectory() {
    if (process.platform === "win32") return;
    const directory = await open(this.directory, "r");
    try {
      await directory.sync();
    } finally {
      await directory.close();
    }
  }
  private async write(name: string, value: unknown) {
    const destination = this.path(name);
    try {
      if ((await lstat(destination)).isSymbolicLink())
        throw new Error("数据文件不能是符号链接");
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    await mkdir(this.directory, { recursive: true });
    const serialized = JSON.stringify(value, null, 2);
    if (serialized === undefined) throw new Error("数据无法序列化");
    const temp = this.path(`.${name}.${randomUUID()}.tmp`);
    try {
      const file = await open(temp, "wx", 0o600);
      try {
        await file.writeFile(serialized + "\n", "utf8");
        await file.sync();
      } finally {
        await file.close();
      }
      await rename(temp, destination);
      await this.syncDirectory();
    } finally {
      await unlink(temp).catch((error) => {
        if (!isMissing(error)) throw error;
      });
    }
  }
  async update<T>(
    name: string,
    change: (value: T) => T | Promise<T>,
    fallback: T,
  ): Promise<T> {
    this.path(name);
    return this.serial(async () => {
      if (this.transactionFailed)
        throw new Error("数据事务未完成，请重启以恢复");
      const value = await change(await this.read<T>(name, fallback));
      await this.write(name, value);
      return value;
    });
  }
  private async apply(changes: Record<string, unknown>) {
    for (const [name, value] of Object.entries(changes)) {
      if (value === null) {
        try {
          if ((await lstat(this.path(name))).isSymbolicLink())
            throw new Error("数据文件不能是符号链接");
          await unlink(this.path(name));
        } catch (error) {
          if (!isMissing(error)) throw error;
        }
      } else await this.write(name, value);
    }
    await this.syncDirectory();
    await unlink(this.path(".transaction.json"));
    await this.syncDirectory();
  }
  private validateChanges(
    changes: unknown,
  ): asserts changes is Record<string, unknown> {
    if (!changes || typeof changes !== "object" || Array.isArray(changes))
      throw new Error("事务日志格式损坏");
    for (const name of Object.keys(changes)) {
      this.path(name);
      if (name.startsWith(".")) throw new Error("事务不能覆盖内部文件");
    }
  }
  async transaction(
    prepare: (
      read: <T>(name: string, fallback: T) => Promise<T>,
    ) => Promise<Record<string, unknown>>,
  ) {
    return this.serial(async () => {
      if (this.transactionFailed)
        throw new Error("数据事务未完成，请重启以恢复");
      const changes = await prepare((name, fallback) =>
        this.read(name, fallback),
      );
      this.validateChanges(changes);
      // 日志提交后只允许前滚；进程崩溃时启动恢复会重放同一组最终值。
      await this.write(".transaction.json", { version: 1, changes });
      try {
        await this.apply(changes);
      } catch (error) {
        this.transactionFailed = true;
        throw error;
      }
    });
  }
  async recover() {
    return this.serial(async () => {
      const journal = await this.read<{
        version: number;
        changes: unknown;
      } | null>(".transaction.json", null);
      if (!journal) return;
      if (journal.version !== 1) throw new Error("不支持的事务日志版本");
      this.validateChanges(journal.changes);
      await this.apply(journal.changes);
      this.transactionFailed = false;
    });
  }
}

export async function acquireDataLock(
  directory: string,
): Promise<() => Promise<void>> {
  await mkdir(directory, { recursive: true });
  const path = join(directory, ".writer.lock");
  const supported =
    process.platform === "linux" || process.platform === "win32";
  const releaseGuard = supported
    ? await acquireOsLock(join(directory, ".writer.guard"))
    : async () => {};
  let handle;
  try {
    try {
      if ((await lstat(path)).isSymbolicLink())
        throw new Error("数据目录锁不能是符号链接");
      const previous = JSON.parse(await readFile(path, "utf8")) as {
        version?: number;
        platform?: string;
      };
      if (
        !supported ||
        previous.version !== 2 ||
        previous.platform !== process.platform
      )
        throw new Error(
          "数据目录已被占用或存在旧版锁；确认旧服务退出后再移除 .writer.lock",
        );
      // 只有取得同平台的系统独占锁后，才可回收崩溃留下的新版标记。
      await unlink(path);
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
    handle = await open(path, "wx", 0o600);
    await handle.writeFile(
      JSON.stringify({
        version: 2,
        platform: process.platform,
        pid: process.pid,
        startedAt: new Date().toISOString(),
      }),
    );
    await handle.sync();
  } catch (error) {
    if (handle) {
      await handle.close();
      await unlink(path).catch(() => {});
    }
    await releaseGuard();
    throw error;
  }
  let released = false;
  return async () => {
    if (released) return;
    released = true;
    try {
      await handle.close();
      await unlink(path);
    } finally {
      await releaseGuard();
    }
  };
}
