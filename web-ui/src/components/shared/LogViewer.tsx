import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function colorize(line: string): string {
  const escaped = escapeHtml(line);
  if (/ ERROR /.test(line))
    return `<span class="text-red-400">${escaped}</span>`;
  if (/ WARN /.test(line))
    return `<span class="text-yellow-400">${escaped}</span>`;
  if (/ DEBUG /.test(line))
    return `<span class="text-gray-500">${escaped}</span>`;
  return escaped;
}

interface Props {
  lines: string[];
  colorized?: boolean;
  tall?: boolean;
  emptyMessage?: string;
}

export default function LogViewer({
  lines,
  colorized = false,
  tall = false,
  emptyMessage = "暂无日志",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const height = tall
    ? "max-h-[calc(100vh-240px)] min-h-[400px]"
    : "max-h-[420px]";

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={`bg-input-bg border border-border-theme rounded-xl ${height} overflow-y-auto mt-2`}
    >
      <pre className="font-mono text-[0.82rem] leading-relaxed p-3.5 m-0 whitespace-pre-wrap break-all text-text-secondary">
        {lines.length === 0 ? (
          emptyMessage
        ) : colorized ? (
          <span
            dangerouslySetInnerHTML={{ __html: lines.map(colorize).join("\n") }}
          />
        ) : (
          lines.join("\n")
        )}
      </pre>
    </motion.div>
  );
}
