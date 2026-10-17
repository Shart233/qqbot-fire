import {
  readdir,
  readFile,
  lstat,
  mkdir,
  rename,
  rm,
  rmdir,
  writeFile,
} from "node:fs/promises";
import { resolve, join, dirname, basename, sep } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { Value } from "@sinclair/typebox/value";
import { ScheduleTaskSchema } from "@qqbot/contracts";
import { normalizeConfig, object } from "./config.js";
import { loadRsa, base64 } from "../crypto/keys.js";
import { acquireDataLock } from "./json-store.js";

export type ImportOptions = {
  source: string;
  destination: string;
  checkOnly?: boolean;
  timeZone?: string;
};
export type ImportReport = {
  version: number;
  imported: boolean;
  sourceTimeZone: string;
  files: { name: string; sha256: string }[];
  warnings: string[];
};

export async function importLegacy(
  options: ImportOptions,
): Promise<ImportReport> {
  const source = resolve(options.source);
  const destination = resolve(options.destination);
  if (
    source === destination ||
    destination.startsWith(source + sep) ||
    source.startsWith(destination + sep)
  )
    throw new Error("源目录和目标目录必须独立");
  try {
    if ((await lstat(destination)).isSymbolicLink())
      throw new Error("目标目录不能是符号链接");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if ((await lstat(source)).isSymbolicLink())
    throw new Error("导入源不能是符号链接");
  const files = new Map<string, Buffer>();
  const collect = async (name: string) => {
    const path = join(source, name);
    const stat = await lstat(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 32 * 1024 * 1024)
      throw new Error("导入文件非法或超过大小限制");
    files.set(name, await readFile(path));
  };
  for (const entry of await readdir(source)) {
    if (
      entry === "config.json" ||
      entry === "napcat_instances.json" ||
      /^schedules(?:_state)?(?:_[a-zA-Z0-9_-]{1,64})?\.json$/.test(entry)
    )
      await collect(entry);
  }
  if (!files.has("config.json")) throw new Error("缺少旧 config.json");
  try {
    const keyDirectory = await lstat(join(source, ".keys"));
    if (keyDirectory.isSymbolicLink() || !keyDirectory.isDirectory())
      throw new Error("密钥目录非法");
    for (const name of ["public.key", "private.key", "jwt.secret"]) {
      try {
        await collect(".keys/" + name);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const parse = (name: string): unknown => {
    try {
      return JSON.parse(files.get(name)!.toString("utf8"));
    } catch {
      throw new Error("导入文件 JSON 损坏：" + name);
    }
  };
  const config = normalizeConfig(parse("config.json"));
  const encrypted = Object.values(config.bots).some(
    (bot) => bot.wsToken.startsWith("RSA:") || bot.httpToken.startsWith("RSA:"),
  );
  if (
    encrypted ||
    files.has(".keys/private.key") ||
    files.has(".keys/public.key")
  ) {
    if (!files.has(".keys/private.key") || !files.has(".keys/public.key"))
      throw new Error("缺失 RSA 密钥");
    const rsa = await loadRsa(source);
    for (const bot of Object.values(config.bots)) {
      rsa.decrypt(bot.wsToken);
      rsa.decrypt(bot.httpToken);
    }
  }
  if (
    files.has(".keys/jwt.secret") &&
    base64(files.get(".keys/jwt.secret")!.toString("utf8")).length < 32
  )
    throw new Error("JWT 密钥长度不足");
  for (const name of files.keys()) {
    if (name.startsWith("schedules_state")) {
      const ledger = object(parse(name));
      if (ledger.version !== 1) throw new Error("不支持的账本版本");
      for (const value of Object.values(object(ledger.records))) {
        const record = object(value);
        if (
          typeof record.date !== "string" ||
          typeof record.taskName !== "string"
        )
          throw new Error("执行账本日期或任务名损坏");
        for (const [target, state] of Object.entries(
          object(record.targetStates),
        )) {
          if (!Number.isSafeInteger(Number(target)) || Number(target) <= 0)
            throw new Error("账本目标必须是安全整数");
          if (
            !["SENDING", "SUCCESS", "FAILED", "UNKNOWN"].includes(String(state))
          )
            throw new Error("执行账本目标状态损坏");
        }
        for (const field of ["retryCount", "nextRetryAt", "updatedAt"])
          if (
            !Number.isSafeInteger(record[field]) ||
            (record[field] as number) < 0
          )
            throw new Error("执行账本时间或重试次数损坏");
      }
    } else if (name.startsWith("schedules")) {
      const tasks = parse(name);
      if (!Array.isArray(tasks)) throw new Error("任务文件应为数组");
      const names = new Set<string>();
      for (const task of tasks) {
        if (
          Array.isArray(task.targets) &&
          task.targets.some((id: unknown) => !Number.isSafeInteger(id))
        )
          throw new Error("任务目标必须是安全整数");
        if (!Value.Check(ScheduleTaskSchema, task))
          throw new Error("任务格式非法");
        if (names.has(task.name)) throw new Error("任务名重复");
        names.add(task.name);
      }
    } else if (name === "napcat_instances.json") {
      // 保存格式由 NapCat 阶段继续核对；此处只允许合法 JSON，不恢复旧 PID。
      const saved = parse(name);
      if (!saved || typeof saved !== "object")
        throw new Error("NapCat 保存实例格式非法");
    }
  }
  const report: ImportReport = {
    version: 1,
    imported: false,
    sourceTimeZone:
      options.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    files: [...files].map(([name, value]) => ({
      name,
      sha256: createHash("sha256").update(value).digest("hex"),
    })),
    warnings: [
      "仅导入配置、密钥、任务、账本及已保存实例；日志与 NapCat 工作目录保留在源目录，切换前需另行备份。",
      "导入不会启动实例或调度任务；管理员需要重新登录。",
    ],
  };
  if (report.sourceTimeZone !== "Asia/Shanghai")
    report.warnings.push(
      "旧环境时区与默认 Asia/Shanghai 不同，启用调度前必须确认执行时刻。",
    );
  try {
    if ((await readdir(destination)).length)
      throw new Error("目标目录非空，禁止重复导入或覆盖");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (options.checkOnly) return report;
  await mkdir(dirname(destination), { recursive: true });
  const release = await acquireDataLock(
    join(dirname(destination), "." + basename(destination) + ".import-lock"),
  );
  const stage = join(
    dirname(destination),
    "." + basename(destination) + ".import-" + randomUUID(),
  );
  try {
    await mkdir(join(stage, "legacy-backup/.keys"), {
      recursive: true,
      mode: 0o700,
    });
    await mkdir(join(stage, ".keys"), { mode: 0o700 });
    for (const [name, value] of files) {
      await writeFile(join(stage, "legacy-backup", name), value, {
        mode: 0o600,
      });
      await writeFile(
        join(stage, name),
        name === "config.json" ? JSON.stringify(config, null, 2) + "\n" : value,
        { mode: 0o600 },
      );
    }
    report.imported = true;
    await writeFile(
      join(stage, "migration.json"),
      JSON.stringify(report, null, 2),
      { mode: 0o600 },
    );
    // 目标为空目录时先移除；最终替换在同一文件系统内进行。
    await rmdir(destination).catch((error) => {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    });
    await rename(stage, destination);
    return report;
  } finally {
    await rm(stage, { recursive: true, force: true });
    await release();
  }
}
