import { forwardRef, useId, type SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

/**
 * 原生 select 包装，与 Input 视觉保持一致
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, hint, error, options, fullWidth, className = "", id, ...rest },
    ref,
  ) {
    const reactId = useId();
    const autoId = id ?? `sel-${reactId}`;
    const errored = Boolean(error);
    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={autoId}
            className="mb-1.5 block text-xs font-medium text-neutral-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={autoId}
            className={`h-10 w-full appearance-none rounded-lg border bg-[rgba(0,0,0,0.25)] px-3 pr-9 text-sm text-white backdrop-blur-sm transition outline-none ${errored ? "border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.25)]" : "border-white/10 focus:border-[#5a7dff] focus:ring-[3px] focus:ring-[rgba(90,125,255,0.25)]"} ${className}`}
            {...rest}
          >
            {options.map((o) => (
              <option
                key={o.value}
                value={o.value}
                disabled={o.disabled}
                className="bg-[#1a1f2e] text-white"
              >
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
        {error ? (
          <p className="mt-1 text-xs text-[#fca5a5]">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-neutral-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
