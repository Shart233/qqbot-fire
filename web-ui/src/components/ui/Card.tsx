import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type Variant = "glass" | "solid" | "outline";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses: Record<Variant, string> = {
  glass:
    "bg-[var(--glass-medium)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-150 border border-[var(--glass-border)] shadow-[var(--shadow-md),var(--shadow-glass-highlight)]",
  solid:
    "bg-[var(--color-bg-elevated)] border border-[var(--glass-border)] shadow-[var(--shadow-base)]",
  outline: "bg-transparent border border-[var(--glass-border)]",
};

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-7",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "glass",
    interactive = false,
    padding = "md",
    className = "",
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`
        rounded-xl
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${interactive ? "hover:border-[var(--glass-border-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg),var(--shadow-glass-highlight)] cursor-pointer" : ""}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
});

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function CardHeader({
  className = "",
  children,
  ...rest
}: CardSectionProps) {
  return (
    <div className={`mb-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...rest
}: CardSectionProps) {
  return (
    <h3
      className={`text-lg font-semibold text-[var(--color-text-primary)] tracking-tight ${className}`}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...rest
}: CardSectionProps) {
  return (
    <p
      className={`text-sm text-[var(--color-text-secondary)] mt-1 ${className}`}
      {...rest}
    >
      {children}
    </p>
  );
}

export function CardFooter({
  className = "",
  children,
  ...rest
}: CardSectionProps) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-[var(--glass-border)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
