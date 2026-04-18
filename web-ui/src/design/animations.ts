// 动画系统 - 克制、流畅、ease-out 为主
export const animations = {
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
    smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
    snappy: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
  easingCss: {
    easeOut: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  duration: {
    instant: 0.1,
    fast: 0.15,
    base: 0.2,
    smooth: 0.3,
    slow: 0.5,
  },
  transition: {
    fast: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
    base: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  variants: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.96 },
    },
  },
};
