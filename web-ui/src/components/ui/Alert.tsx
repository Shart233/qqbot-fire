import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { bg: string; border: string; text: string; icon: string }
> = {
  info: {
    bg: "bg-[rgba(90,125,255,0.08)]",
    border: "border-[rgba(90,125,255,0.3)]",
    text: "text-[#93b3ff]",
    icon: "#5a7dff",
  },
  success: {
    bg: "bg-[rgba(34,197,94,0.08)]",
    border: "border-[rgba(34,197,94,0.3)]",
    text: "text-[#86efac]",
    icon: "#22c55e",
  },
  warning: {
    bg: "bg-[rgba(251,191,36,0.08)]",
    border: "border-[rgba(251,191,36,0.3)]",
    text: "text-[#fde68a]",
    icon: "#fbbf24",
  },
  error: {
    bg: "bg-[rgba(239,68,68,0.08)]",
    border: "border-[rgba(239,68,68,0.3)]",
    text: "text-[#fca5a5]",
    icon: "#ef4444",
  },
};

/**
 * 提示框：四种语义色，可关闭
 */
export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  className = "",
}: AlertProps) {
  const s = variantStyles[variant];
  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-lg border ${s.bg} ${s.border} px-4 py-3 backdrop-blur-sm ${className}`}
    >
      <div className="mt-0.5 flex-shrink-0">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: s.icon, boxShadow: `0 0 8px ${s.icon}` }}
        />
      </div>
      <div className={`flex-1 text-sm ${s.text}`}>
        {title && <div className="mb-0.5 font-medium">{title}</div>}
        {children && <div className="text-[13px] opacity-90">{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex-shrink-0 rounded-md p-1 text-neutral-400 transition hover:bg-white/5 hover:text-white"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
