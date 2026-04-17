import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex items-center justify-between mb-4 flex-wrap gap-2"
    >
      <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      {children && (
        <div className="flex items-center gap-2 flex-wrap">{children}</div>
      )}
    </motion.div>
  );
}
