import { lstat, mkdir, readdir, rename, rm, writeFile } from "node:fs/promises";
import { resolve, join, dirname, basename, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { JsonStore, acquireDataLock } from "./json-store.js";
import { importLegacy } from "./import-legacy.js";
import { normalizeConfig, defaultConfig } from "./config.js";
import {
  validateLedger,
  emptyLedger,
  type ExecutionLedger,
  type TargetState,
} from "../../modules/scheduler/ledger.js";
import { ledgerFile } from "../../modules/scheduler/scheduler.js";

export type RollbackOptions = {
  source: string;
  legacy: string;
  destination: string;
};
function combined(a: TargetState | undefined, b: TargetState): TargetState {
  if (a === "SUCCESS" || b === "SUCCESS") return "SUCCESS";
  if (a === "SENDING" || a === "UNKNOWN" || b === "SENDING" || b === "UNKNOWN")
    return "UNKNOWN";
  return b;
}
function merge(
  previous: ExecutionLedger,
  current: ExecutionLedger,
): ExecutionLedger {
  const merged = structuredClone(previous);
  for (const [key, record] of Object.entries(current.records)) {
    const old = merged.records[key];
    const states = { ...old?.targetStates };
    for (const [target, state] of Object.entries(record.targetStates))
      states[target] = combined(states[target], state);
    merged.records[key] = {
      ...record,
      targetStates: states,
      retryCount: Math.max(old?.retryCount ?? 0, record.retryCount),
      updatedAt: Math.max(old?.updatedAt ?? 0, record.updatedAt),
    };
  }
  for (const record of Object.values(merged.records))
    for (const target of Object.keys(record.targetStates))
      if (record.targetStates[target] === "SENDING")
        record.targetStates[target] = "UNKNOWN";
  return validateLedger(merged);
}
export async function exportRollback(options: RollbackOptions) {
  const source = resolve(options.source),
    legacy = resolve(options.legacy),
    destination = resolve(options.destination);
  for (const [a, b] of [
    [source, legacy],
    [source, destination],
    [legacy, destination],
  ] as const)
    if (a === b || a.startsWith(b + sep) || b.startsWith(a + sep))
      throw new Error("新数据、旧数据与回退目标必须为独立目录");
  for (const directory of [source, legacy])
    if (
      !(await lstat(directory)).isDirectory() ||
      (await lstat(directory)).isSymbolicLink()
    )
      throw new Error("数据目录不能是符号链接");
  try {
    const stat = await lstat(destination);
    if (
      stat.isSymbolicLink() ||
      !stat.isDirectory() ||
      (await readdir(destination)).length
    )
      throw new Error("回退目标非空或非法，禁止覆盖");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const release = await acquireDataLock(source);
  await mkdir(dirname(destination), { recursive: true });
  const stage = join(
    dirname(destination),
    "." + basename(destination) + ".rollback-" + randomUUID(),
  );
  try {
    const newer = new JsonStore(source),
      older = new JsonStore(legacy);
    if ((await newer.read(".transaction.json", null)) !== null)
      throw new Error("新服务有未完成事务，先启动恢复再导出");
    const config = normalizeConfig(
      await newer.read("config.json", defaultConfig()),
    );
    normalizeConfig(await older.read("config.json", defaultConfig()));
    await importLegacy({
      source,
      destination: stage,
      timeZone: "Asia/Shanghai",
    });
    const output = new JsonStore(stage);
    let records = 0;
    for (const name of Object.keys(config.bots)) {
      const file = ledgerFile(name);
      const previous = validateLedger(await older.read(file, emptyLedger()));
      const current = validateLedger(await newer.read(file, emptyLedger()));
      const result = merge(previous, current);
      records += Object.keys(result.records).length;
      if (Object.keys(result.records).length)
        await output.update(file, () => result, emptyLedger());
    }
    const report = {
      version: 1,
      createdAt: new Date().toISOString(),
      bots: Object.keys(config.bots),
      records,
      warnings: [
        "仅输出独立回退副本；未覆盖旧服务数据。",
        "恢复 Java 前必须停止新旧服务及自动重启，核对 NapCat 归属、时区和任务。",
        "成功与未决状态均已合并；未知目标需核对实际 QQ 记录，不能直接重发。",
        "日志与 NapCat 工作目录仍需从完整备份恢复。",
      ],
    };
    await writeFile(
      join(stage, "rollback.json"),
      JSON.stringify(report, null, 2) + "\n",
      { mode: 0o600 },
    );
    // 只替换先前确认的空目录；失败会保留旧目录与源数据。
    const { rmdir } = await import("node:fs/promises");
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
