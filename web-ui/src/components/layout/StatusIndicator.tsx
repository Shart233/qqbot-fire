import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/app-store'

export default function StatusIndicator() {
  const cachedBots = useAppStore(s => s.cachedBots)
  const online = cachedBots.filter(b => b.connected).length
  const total = cachedBots.length

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center gap-2 text-sm text-text-secondary"
    >
      <span className={`w-2 h-2 rounded-full inline-block ${online > 0 ? 'bg-success animate-[pulse-dot_2s_infinite]' : 'bg-text-muted'}`} />
      <span>{online}/{total} 在线</span>
    </motion.div>
  )
}
