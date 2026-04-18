import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// 按钮样式 - 专业 SaaS 风格，柔和光晕
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[#6a8dff] to-[#4a6de8] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#7a9dff] hover:to-[#5a7dff] active:from-[#4a6de8] active:to-[#3a5dd1] shadow-[0_4px_12px_-2px_rgba(90,125,255,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
  secondary:
    "bg-[rgba(255,255,255,0.06)] text-[var(--color-text-primary)] border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[var(--glass-border-hover)] backdrop-blur-md",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-text-primary)]",
  danger:
    "bg-gradient-to-b from-[#f87171] to-[#dc2626] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#fca5a5] hover:to-[#ef4444] shadow-[0_4px_12px_-2px_rgba(239,68,68,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
  success:
    "bg-gradient-to-b from-[#34d399] to-[#059669] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#6ee7b7] hover:to-[#10b981] shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
        inline-flex items-center justify-center
        font-medium whitespace-nowrap select-none
        transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
        {...rest}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
