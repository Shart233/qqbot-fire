import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ message, icon, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      className="py-16 text-center"
    >
      {icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400">
          {icon}
        </div>
      )}
      <div className="text-sm text-neutral-400">{message}</div>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </motion.div>
  );
}
