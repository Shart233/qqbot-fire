interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

/**
 * 加载指示器：环形旋转动画
 */
export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="加载中"
      className={`inline-block animate-spin rounded-full border-white/15 border-t-[#5a7dff] ${sizeMap[size]} ${className}`}
    />
  );
}
