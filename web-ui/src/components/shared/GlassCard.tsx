import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
}

export default function GlassCard({ children, className = '', hover = true, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: delay / 1000 }}
      whileHover={hover ? { scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`
        bg-card-bg backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]
        border border-border-theme rounded-2xl
        shadow-[var(--shadow-md)]
        ${hover ? 'hover:shadow-[var(--shadow-lg)] hover:border-border-hover transition-[box-shadow,border-color] duration-300' : 'transition-all duration-300'}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
