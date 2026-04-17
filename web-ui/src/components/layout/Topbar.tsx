import { useLocation } from "react-router-dom";
import { Button } from "@heroui/react";
import StatusIndicator from "./StatusIndicator";

const pageTitles: Record<string, string> = {
  "/dashboard": "仪表盘",
  "/bots": "Bot 管理",
  "/messages": "消息发送",
  "/contacts": "好友与群",
  "/schedules": "定时任务",
  "/napcat": "NapCat 管理",
  "/nc-logs": "NapCat 日志",
  "/console": "控制台",
  "/server-logs": "服务端日志",
  "/logs": "操作日志",
};

export default function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "仪表盘";

  return (
    <header className="flex items-center justify-between px-6 bg-topbar-bg backdrop-blur-[var(--glass-blur)] border-b border-border-theme h-[50px] min-h-[50px] shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          onPress={onMenuToggle}
          className="md:hidden text-text-primary"
        >
          <span className="text-xl">☰</span>
        </Button>
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <StatusIndicator />
      </div>
    </header>
  );
}
