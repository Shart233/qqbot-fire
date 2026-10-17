import { object } from "../../infrastructure/storage/config.js";
export type TargetState = "SENDING" | "SUCCESS" | "FAILED" | "UNKNOWN";
export type ExecutionRecord = {
  date: string;
  taskName: string;
  targetStates: Record<string, TargetState>;
  retryCount: number;
  nextRetryAt: number;
  updatedAt: number;
};
export type ExecutionLedger = {
  version: 1;
  records: Record<string, ExecutionRecord>;
};
export const emptyLedger = (): ExecutionLedger => ({ version: 1, records: {} });
export function validateLedger(raw: unknown): ExecutionLedger {
  const ledger = object(raw);
  if (ledger.version !== 1) throw new Error("不支持的执行账本版本");
  for (const [key, value] of Object.entries(object(ledger.records))) {
    const record = object(value);
    if (
      typeof record.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(record.date) ||
      typeof record.taskName !== "string" ||
      key !== record.date + "|" + record.taskName
    )
      throw new Error("执行账本键或日期损坏");
    for (const [target, state] of Object.entries(object(record.targetStates))) {
      if (
        !/^\d+$/.test(target) ||
        !Number.isSafeInteger(Number(target)) ||
        Number(target) <= 0 ||
        !["SENDING", "SUCCESS", "FAILED", "UNKNOWN"].includes(String(state))
      )
        throw new Error("执行账本目标或状态损坏");
    }
    for (const field of ["retryCount", "nextRetryAt", "updatedAt"])
      if (!Number.isSafeInteger(record[field]) || (record[field] as number) < 0)
        throw new Error("执行账本时间或次数损坏");
  }
  return ledger as ExecutionLedger;
}
