import { motion } from 'framer-motion'

export default function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center py-12 text-text-muted text-sm"
    >
      {message}
    </motion.div>
  )
}
