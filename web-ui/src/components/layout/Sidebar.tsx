import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { path: '/dashboard', icon: '📊', label: '仪表盘' },
  { path: '/bots', icon: '🤖', label: 'Bot 管理' },
  { path: '/messages', icon: '✉️', label: '消息发送' },
  { path: '/contacts', icon: '👥', label: '好友与群' },
  { path: '/schedules', icon: '⏰', label: '定时任务' },
  { path: '/napcat', icon: '🖥️', label: 'NapCat 管理' },
  { path: '/nc-logs', icon: '📝', label: 'NapCat 日志' },
  { path: '/console', icon: '💻', label: '控制台' },
  { path: '/server-logs', icon: '📋', label: '服务端日志' },
  { path: '/logs', icon: '📜', label: '操作日志' },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-60 bg-sidebar-bg backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturate)]
        flex flex-col border-r border-border-theme
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-[var(--shadow-md)]
      `}>
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-theme">
          <motion.span
            className="text-2xl"
            whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
          >🔥</motion.span>
          <span className="text-lg font-bold text-text-primary tracking-wide">QQBot-Fire</span>
        </div>
        <nav className="flex-1 flex flex-col py-2 px-2 gap-0.5 overflow-y-auto">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2.5
                  text-sm select-none transition-colors duration-200
                  rounded-lg
                  ${isActive
                    ? 'bg-accent/15 text-accent font-medium shadow-sm'
                    : 'text-text-secondary hover:bg-white/8 hover:text-text-primary'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
        <div className="mt-auto py-3 px-5 text-center border-t border-border-theme">
          <span className="text-xs text-text-muted">v2.0</span>
        </div>
      </aside>
    </>
  )
}
