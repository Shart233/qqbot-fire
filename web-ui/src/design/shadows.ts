// 多层柔和阴影 - 避免硬阴影与霓虹光
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  base: "0 2px 4px 0 rgba(0, 0, 0, 0.35), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
  md: "0 4px 8px -2px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.25)",
  lg: "0 10px 20px -4px rgba(0, 0, 0, 0.45), 0 4px 8px -4px rgba(0, 0, 0, 0.3)",
  xl: "0 20px 40px -8px rgba(0, 0, 0, 0.5), 0 8px 16px -8px rgba(0, 0, 0, 0.35)",
  glowPrimary:
    "0 0 0 1px rgba(90, 125, 255, 0.3), 0 4px 16px -4px rgba(90, 125, 255, 0.35)",
  glowAccent:
    "0 0 0 1px rgba(236, 72, 153, 0.3), 0 4px 16px -4px rgba(236, 72, 153, 0.35)",
  glowSuccess:
    "0 0 0 1px rgba(16, 185, 129, 0.3), 0 4px 16px -4px rgba(16, 185, 129, 0.3)",
  glowError:
    "0 0 0 1px rgba(239, 68, 68, 0.3), 0 4px 16px -4px rgba(239, 68, 68, 0.3)",
  inner: "inset 0 1px 2px 0 rgba(0, 0, 0, 0.4)",
  innerLg: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.45)",
  glassHighlight: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
};
