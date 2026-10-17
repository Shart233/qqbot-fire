import type { ReactNode } from "react";
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      <section className="auth-intro" aria-label="QQBot-Fire 工作台">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-500)] text-[#20150f]">
            Q
          </span>
          QQBot-Fire
        </div>
        <div className="relative z-10 max-w-lg py-8">
          <span className="workspace-label">消息 · 连接 · 定时任务</span>
          <h1 className="mt-6 text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
            让每一条消息，
            <br />
            <span className="text-[var(--color-primary-500)]">准时抵达。</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-[var(--color-text-secondary)]">
            在一个工作台里管理 Bot
            连接、编排每日任务，查看实例与消息的运行状态。
          </p>
          <div
            className="mt-10 hidden md:flex items-center gap-3 text-xs text-[var(--color-text-secondary)]"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary-500)]" />
            <span>连接</span>
            <span className="w-10 border-t border-[var(--glass-border)]" />
            <span>任务</span>
            <span className="w-10 border-t border-[var(--glass-border)]" />
            <span>消息</span>
          </div>
        </div>
        <span className="workspace-label">你的 QQ Bot 管理工作台</span>
      </section>
      <div className="auth-form-area">{children}</div>
    </div>
  );
}
