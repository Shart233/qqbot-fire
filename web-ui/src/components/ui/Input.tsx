import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    leftIcon,
    rightIcon,
    fullWidth = true,
    className = "",
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  const hasError = Boolean(error);

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full h-10 rounded-lg
            bg-[rgba(0,0,0,0.25)] backdrop-blur-sm
            border transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            text-sm text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? "pl-10" : "pl-3.5"}
            ${rightIcon ? "pr-10" : "pr-3.5"}
            ${
              hasError
                ? "border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_rgba(90,125,255,0.15)]"
            }
            ${className}
          `}
          {...rest}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
      {(hint || error) && (
        <p
          className={`mt-1.5 text-xs ${hasError ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
});
