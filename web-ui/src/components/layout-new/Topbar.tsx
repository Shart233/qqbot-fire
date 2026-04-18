import { useLocation } from "react-router-dom";
import { Badge } from "../ui/Badge";

const routeTitles: Record<string, { title: string; desc: string }> = {
  "/dashboard": { title: "仪表盘", desc: "系统概览与实时状态" },
  "/bots": { title: "Bot 实例", desc: "管理多个 Bot 连接与配置" },
  "/messages": { title: "消息", desc: "收发消息与事件追踪" },
  "/contacts": { title: "联系人", desc: "好友与群组管理" },
  "/schedules": { title: "定时任务", desc: "NTP 同步的定时消息调度" },
  "/napcat": { title: "NapCat", desc: "NapCat 进程与配置管理" },
  "/console": { title: "控制台", desc: "交互式命令行" },
  "/logs": { title: "日志", desc: "服务端与 NapCat 日志查看" },
};

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const location = useLocation();
  const info = routeTitles[location.pathname] ?? { title: "", desc: "" };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-5 lg:px-7 border-b border-[var(--glass-border)] bg-[rgba(15,20,25,0.6)] backdrop-blur-[16px]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-md hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[var(--color-text-secondary)]"
          aria-label="切换侧边栏"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight truncate">
            {info.title}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] truncate">
            {info.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="success" dot pulse size="sm">
          在线
        </Badge>
      </div>
    </header>
  );
}
