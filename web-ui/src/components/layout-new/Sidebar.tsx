import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  group?: string;
}

// SVG 图标集合 - 线性风格
const icons = {
  dashboard: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  bots: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M12 3v3" />
    </svg>
  ),
  messages: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  contacts: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  schedule: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  napcat: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3 5 5 .5-3.5 3.5 1 5-5.5-2.5L6.5 16l1-5L4 7.5 9 7z" />
    </svg>
  ),
  console: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  logs: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  ncLogs: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="7" y1="13" x2="13" y2="13" />
      <line x1="7" y1="16" x2="11" y2="16" />
    </svg>
  ),
  serverLogs: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="6" rx="1.5" />
      <rect x="2" y="14" width="20" height="6" rx="1.5" />
      <line x1="6" y1="7" x2="6.01" y2="7" />
      <line x1="6" y1="17" x2="6.01" y2="17" />
    </svg>
  ),
};

const navItems: NavItem[] = [
  { to: "/dashboard", label: "仪表盘", icon: icons.dashboard, group: "概览" },
  { to: "/bots", label: "Bot 实例", icon: icons.bots, group: "机器人" },
  { to: "/messages", label: "消息", icon: icons.messages, group: "机器人" },
  { to: "/contacts", label: "联系人", icon: icons.contacts, group: "机器人" },
  {
    to: "/schedules",
    label: "定时任务",
    icon: icons.schedule,
    group: "机器人",
  },
  { to: "/napcat", label: "NapCat", icon: icons.napcat, group: "系统" },
  { to: "/console", label: "控制台", icon: icons.console, group: "系统" },
  {
    to: "/nc-logs",
    label: "NapCat 日志",
    icon: icons.ncLogs,
    group: "日志",
  },
  {
    to: "/server-logs",
    label: "服务端日志",
    icon: icons.serverLogs,
    group: "日志",
  },
  { to: "/logs", label: "操作日志", icon: icons.logs, group: "日志" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const groups = Array.from(new Set(navItems.map((i) => i.group ?? ""))).filter(
    Boolean,
  ) as string[];

  return (
    <>
      {/* 移动端遮罩 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-60 shrink-0
          bg-[rgba(15,20,25,0.72)] backdrop-blur-[20px] backdrop-saturate-150
          border-r border-[var(--glass-border)]
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo 区 */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--glass-border)]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#5a7dff] to-[#ec4899] flex items-center justify-center shadow-[var(--shadow-glow-primary)]">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
              QQBot Fire
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              Control Console
            </span>
          </div>
        </div>

        {/* 导航 */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map((group) => (
            <div key={group}>
              <h4 className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {group}
              </h4>
              <ul className="space-y-0.5">
                {navItems
                  .filter((i) => i.group === group)
                  .map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) => `
                        group flex items-center gap-3 px-3 h-9 rounded-md
                        text-sm transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                        ${
                          isActive
                            ? "bg-gradient-to-r from-[rgba(90,125,255,0.18)] to-[rgba(236,72,153,0.08)] text-white border-l-2 border-[var(--color-primary-500)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-text-primary)]"
                        }
                      `}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* 底部状态 */}
        <div className="p-3 border-t border-[var(--glass-border)]">
          <div className="flex items-center gap-2 px-2 h-8 text-[11px] text-[var(--color-text-muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span>系统运行中</span>
          </div>
        </div>
      </aside>
    </>
  );
}
