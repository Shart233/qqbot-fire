import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listBots,
  listNapCatInstances,
  listSchedules,
  connectBot,
  disconnectBot,
  connectAll,
  disconnectAll,
} from "../api/endpoints";
import { runAction } from "../api/client";
import { useAppStore } from "../stores/app-store";
import { useInterval } from "../hooks/useInterval";
import type { NapCatInstance, ScheduleTask } from "../api/types";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Badge } from "../components/ui";

type Task = ScheduleTask & { bot: string };
export default function DashboardPage() {
  const { cachedBots, activeBotName, setCachedBots, operationLogs } =
    useAppStore();
  const [tasks, setTasks] = useState<Task[]>([]),
    [instances, setInstances] = useState<NapCatInstance[]>([]);
  const [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(async () => {
    const [bots, nc] = await Promise.all([
      listBots({ silent: true }),
      listNapCatInstances({ silent: true }),
    ]);
    if (!bots) {
      setError(true);
      setReady(true);
      return;
    }
    setCachedBots(bots.bots, bots.activeBot);
    if (nc) setInstances(nc);
    const schedules = await Promise.all(
      bots.bots.map(async (bot) => {
        const values = await listSchedules(bot.name, { silent: true });
        return values?.map((task) => ({ ...task, bot: bot.name })) ?? null;
      }),
    );
    setTasks(schedules.flatMap((value) => value ?? []));
    setError(!nc || schedules.some((value) => value === null));
    setReady(true);
  }, [setCachedBots]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 首次挂载读取远端总览
    void load();
  }, [load]);
  useInterval(load, 10000);
  const action = async (key: string, operation: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await operation();
      await load();
    } finally {
      setBusy(null);
    }
  };
  const enabled = tasks.filter((task) => task.enabled);
  const now = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
  const upcoming = [...enabled]
    .sort(
      (a, b) =>
        (a.time > now ? 0 : 1) - (b.time > now ? 0 : 1) ||
        a.time.localeCompare(b.time),
    )
    .slice(0, 5);
  const online = cachedBots.filter((bot) => bot.connected).length;
  return (
    <PageContainer>
      <div className="workspace-label mb-3">QQBOT-FIRE / 工作台</div>
      <PageHeader
        title="运行总览"
        description="连接、消息与任务，一目了然。"
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              void load();
            }}
          >
            刷新状态 ↻
          </Button>
        }
      />
      {error && (
        <div
          role="status"
          className="mb-5 rounded-md border border-[var(--color-warning)] p-3 text-sm text-[var(--color-warning)]"
        >
          部分状态暂不可用，正在重试。下方保留最近取得的数据。
        </div>
      )}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {[
          ["Bot 实例", cachedBots.length, "独立管理每个连接"],
          ["已连接", online, "当前连接可用的 Bot"],
          ["启用任务", enabled.length, "每日消息计划"],
          [
            "NapCat 运行中",
            instances.filter((item) => item.alive).length,
            "由服务托管的实例",
          ],
        ].map(([label, value, desc], index) => (
          <div key={label} className="workspace-panel p-5">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
              <span>{label}</span>
              <span className="workspace-label">0{index + 1}</span>
            </div>
            <div
              className={`workspace-metric my-4 text-4xl ${index === 1 ? "text-[var(--color-success)]" : ""}`}
            >
              {ready ? value : "—"}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)]">
              {desc}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <section className="workspace-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[var(--glass-border)]">
            <div>
              <h2 className="font-semibold text-sm">Bot 连接</h2>
              <p className="text-xs mt-1 text-[var(--color-text-muted)]">
                {online} / {cachedBots.length} 个已连接
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                loading={busy === "all"}
                onClick={() => {
                  void action("all", () =>
                    runAction("连接请求已完成", connectAll),
                  );
                }}
              >
                全部连接
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={!!busy}
                onClick={() => {
                  void action("all", () =>
                    runAction("断开请求已完成", disconnectAll),
                  );
                }}
              >
                全部断开
              </Button>
            </div>
          </div>
          {cachedBots.length ? (
            cachedBots.map((bot) => (
              <div
                key={bot.name}
                className="flex items-center gap-3 p-5 border-b last:border-0 border-[var(--glass-border)]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--glass-border)] text-[var(--color-text-secondary)] font-mono">
                  {bot.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium truncate">
                    {bot.name}
                    {bot.name === activeBotName && (
                      <span className="text-[10px] font-normal text-[var(--color-primary-500)]">
                        当前
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate font-mono text-[11px] text-[var(--color-text-muted)]">
                    {bot.nickname || "尚未获取账号"} · {bot.mode.toUpperCase()}
                  </div>
                </div>
                <Badge
                  variant={bot.connected ? "success" : "default"}
                  size="sm"
                  dot
                >
                  {bot.connected ? "已连接" : "已断开"}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={busy === bot.name}
                  disabled={!!busy && busy !== bot.name}
                  onClick={() => {
                    void action(bot.name, () =>
                      runAction(bot.connected ? "已断开" : "已连接", () =>
                        bot.connected
                          ? disconnectBot(bot.name)
                          : connectBot(bot.name),
                      ),
                    );
                  }}
                >
                  {bot.connected ? "断开" : "连接"}
                </Button>
              </div>
            ))
          ) : (
            <p className="p-8 text-sm text-[var(--color-text-muted)]">
              尚无 Bot，先添加一个连接。
            </p>
          )}
          <Link
            to="/bots"
            className="flex justify-between px-5 py-4 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)]"
          >
            <span>管理 Bot 与连接配置</span>
            <span>↗</span>
          </Link>
        </section>
        <section className="workspace-panel overflow-hidden">
          <div className="flex justify-between items-start p-5 border-b border-[var(--glass-border)]">
            <div>
              <h2 className="font-semibold text-sm">接下来的任务</h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                计划时间 · 上海时区
              </p>
            </div>
            <Link
              to="/schedules"
              className="text-xs text-[var(--color-primary-500)]"
            >
              管理 ↗
            </Link>
          </div>
          {upcoming.length ? (
            upcoming.map((task) => (
              <div
                key={task.bot + "|" + task.name}
                className="flex gap-4 items-start p-5 border-b last:border-0 border-[var(--glass-border)]"
              >
                <span className="font-mono text-lg text-[var(--color-primary-500)]">
                  {task.time}
                </span>
                <div className="min-w-0">
                  <div className="text-sm truncate">{task.name}</div>
                  <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {task.bot} · {task.targets.length} 个目标 ·{" "}
                    {task.time > now ? "今天" : "明天"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8">
              <p className="text-sm text-[var(--color-text-secondary)]">
                还没有启用的任务
              </p>
              <p className="text-xs leading-6 text-[var(--color-text-muted)] mt-2">
                添加每日计划，为指定的好友或群发送消息。
              </p>
              <Link
                to="/schedules"
                className="mt-5 inline-block text-xs text-[var(--color-primary-500)]"
              >
                创建定时任务 →
              </Link>
            </div>
          )}
        </section>
        <section className="workspace-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold">最近操作</h2>
            <Link to="/logs" className="text-xs text-[var(--color-text-muted)]">
              查看全部 ↗
            </Link>
          </div>
          <div className="space-y-3">
            {operationLogs.length ? (
              operationLogs
                .slice(-5)
                .reverse()
                .map((line, i) => (
                  <p
                    key={i}
                    className="font-mono text-xs text-[var(--color-text-secondary)] break-all"
                  >
                    {line}
                  </p>
                ))
            ) : (
              <p className="text-xs text-[var(--color-text-muted)]">
                当前会话还没有操作记录。
              </p>
            )}
          </div>
        </section>
        <section className="workspace-panel p-5">
          <h2 className="text-sm font-semibold mb-5">常用入口</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["/messages", "发送消息", "选择 Bot 与目标"],
              ["/nc-login", "QQ 扫码", "查看实例登录状态"],
              ["/console", "打开控制台", "通过命令管理"],
              ["/server-logs", "服务端日志", "查看运行记录"],
            ].map(([to, title, description]) => (
              <Link
                key={to}
                to={to!}
                className="rounded-md border border-[var(--glass-border)] p-3 hover:bg-[var(--color-bg-hover)]"
              >
                <div className="text-xs font-medium">{title} ↗</div>
                <div className="text-[10px] text-[var(--color-text-muted)] mt-1.5">
                  {description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
