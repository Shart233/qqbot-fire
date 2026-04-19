import type { HTMLAttributes, ReactNode } from "react";

type Variant =
  | "default"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";
type Size = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  pulse?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[rgba(255,255,255,0.08)] text-[var(--color-text-secondary)] border-[var(--glass-border)]",
  primary:
    "bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.3)]",
  accent:
    "bg-[rgba(236,72,153,0.15)] text-[#f8b4dd] border-[rgba(236,72,153,0.3)]",
  success:
    "bg-[rgba(16,185,129,0.15)] text-[#6ee7b7] border-[rgba(16,185,129,0.3)]",
  warning:
    "bg-[rgba(245,158,11,0.15)] text-[#fcd34d] border-[rgba(245,158,11,0.3)]",
  error:
    "bg-[rgba(239,68,68,0.15)] text-[#fca5a5] border-[rgba(239,68,68,0.3)]",
  info: "bg-[rgba(59,130,246,0.15)] text-[#93c5fd] border-[rgba(59,130,246,0.3)]",
};

const dotClasses: Record<Variant, string> = {
  default: "bg-[var(--color-neutral-400)]",
  primary: "bg-[var(--color-primary-500)]",
  accent: "bg-[var(--color-accent-500)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  error: "bg-[var(--color-error)]",
  info: "bg-[var(--color-info)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-5 px-2 text-[10px] gap-1",
  md: "h-6 px-2.5 text-xs gap-1.5",
};

export function Badge({
  variant = "default",
  size = "sm",
  dot = false,
  pulse = false,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center whitespace-nowrap
        font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...rest}
    >
      {dot && (
        <span className="relative flex items-center justify-center">
          {pulse && (
            <span
              className={`absolute inline-flex h-2 w-2 rounded-full opacity-60 animate-ping ${dotClasses[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotClasses[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
