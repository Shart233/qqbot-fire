import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAppStore } from "../../stores/app-store";
import { listBots, setActiveBot } from "../../api/endpoints";
import { useInterval } from "../../hooks/useInterval";

const titles: Record<string, string> = {
  dashboard: "运行总览",
  bots: "Bot 实例",
  messages: "消息发送",
  contacts: "好友与群",
  schedules: "定时任务",
  napcat: "NapCat 管理",
  "nc-login": "QQ 扫码登录",
  console: "控制台",
  "nc-logs": "NapCat 日志",
  "server-logs": "服务端日志",
  logs: "操作日志",
  settings: "设置",
};
export default function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const { cachedBots, activeBotName, setCachedBots } = useAppStore();
  const [reachable, setReachable] = useState<boolean | null>(null);
  const [switching, setSwitching] = useState(false);
  const refresh = useCallback(async () => {
    const data = await listBots({ silent: true });
    setReachable(Boolean(data));
    if (data) setCachedBots(data.bots, data.activeBot);
  }, [setCachedBots]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 首次挂载读取远端状态
    void refresh();
  }, [refresh]);
  useInterval(refresh, 10000);
  const switchBot = async (name: string) => {
    setSwitching(true);
    const result = await setActiveBot(name);
    if (result) setCachedBots(cachedBots, result.activeBot);
    setSwitching(false);
  };
  return (
    <header className="workspace-header h-[72px] shrink-0 flex items-center justify-between gap-3 px-4 lg:px-8 border-b border-[var(--glass-border)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-md hover:bg-[var(--color-bg-hover)]"
          aria-label="打开导航菜单"
        >
          ☰
        </button>
        <div className="text-sm truncate">
          <span className="hidden sm:inline text-[var(--color-text-muted)]">
            工作台 <span className="mx-3">/</span>
          </span>
          <span>{titles[pathname.slice(1)] ?? "工作台"}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 min-w-0">
        <span className="hidden xl:inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: reachable
                ? "var(--color-success)"
                : "var(--color-warning)",
            }}
          />
          {reachable === null
            ? "正在检查"
            : reachable
              ? "服务可用"
              : "连接中断"}
        </span>
        <label className="min-w-0">
          <span className="sr-only">当前操作 Bot</span>
          <select
            value={activeBotName ?? ""}
            onChange={(e) => {
              void switchBot(e.target.value);
            }}
            disabled={switching || !cachedBots.length}
            className="h-9 max-w-[150px] sm:max-w-[200px] rounded-md border border-[var(--glass-border)] bg-[var(--color-bg-elevated)] px-2 text-xs"
          >
            {!cachedBots.length && <option value="">暂无 Bot</option>}
            {cachedBots.map((bot) => (
              <option key={bot.name} value={bot.name}>
                {bot.name} · {bot.connected ? "已连接" : "已断开"}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label={
            resolvedTheme === "dark" ? "切换到浅色主题" : "切换到深色主题"
          }
          className="h-9 w-9 shrink-0 rounded-md border border-[var(--glass-border)] hover:bg-[var(--color-bg-hover)]"
        >
          {resolvedTheme === "dark" ? "☼" : "☾"}
        </button>
      </div>
    </header>
  );
}
