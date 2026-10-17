import type { ScheduleTask } from "@qqbot/contracts";
const formatters = new Map<string, Intl.DateTimeFormat>();
function parts(time: number, zone: string) {
  let formatter = formatters.get(zone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(zone, formatter);
  }
  return Object.fromEntries(
    formatter
      .formatToParts(time)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}
export function dateInZone(time: number, zone: string): string {
  const value = parts(time, zone);
  return `${value.year}-${value.month}-${value.day}`;
}
export function addDays(date: string, amount: number): string {
  return new Date(Date.parse(date + "T12:00:00Z") + amount * 86400_000)
    .toISOString()
    .slice(0, 10);
}
export function occurrence(date: string, time: string, zone: string): number {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  )
    throw new Error("任务日期或时间非法");
  const desired = Date.parse(`${date}T${time}:00Z`);
  let candidate = desired;
  for (let iteration = 0; iteration < 4; iteration++) {
    const value = parts(candidate, zone);
    const apparent = Date.parse(
      `${value.year}-${value.month}-${value.day}T${value.hour}:${value.minute}:${value.second}Z`,
    );
    const difference = desired - apparent;
    if (difference === 0) return candidate;
    candidate += difference;
  }
  throw new Error("该时区的任务时刻不存在，请调整夏令时切换日任务");
}
export function occurrenceKey(date: string, name: string): string {
  return date + "|" + name;
}
export function nextWake(
  tasks: ScheduleTask[],
  now: number,
  zone: string,
  prewarmed: Set<string>,
  settled: Set<string> = new Set(),
  prewarmLeadMs = 240_000,
): number {
  let wake = now + 60_000;
  const today = dateInZone(now, zone);
  for (const task of tasks) {
    if (task.enabled === false) continue;
    let date = today,
      target = occurrence(date, task.time, zone);
    if (target < now || settled.has(occurrenceKey(date, task.name))) {
      date = addDays(date, 1);
      target = occurrence(date, task.time, zone);
    }
    wake = Math.min(wake, target > now ? target : now + 100);
    if (task.autoConnect && !prewarmed.has(occurrenceKey(date, task.name))) {
      const preheat = target - prewarmLeadMs;
      if (preheat > now) wake = Math.min(wake, preheat);
    }
  }
  return Math.max(now + 50, wake);
}
