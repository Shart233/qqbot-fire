import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface Props {
  storageKey: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function QQHistoryInput({
  storageKey,
  placeholder = "QQ 号",
  value,
  onChange,
  className = "",
}: Props) {
  const [history, setHistory] = useLocalStorage<string[]>(
    "qqHistory_" + storageKey,
    [],
  );
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const saveToHistory = (val: string) => {
    val = val.trim();
    if (!val || !/^\d+$/.test(val)) return;
    setHistory((prev) => {
      const next = [val, ...prev.filter((v) => v !== val)];
      return next.slice(0, 20);
    });
  };

  const removeFromHistory = (val: string) => {
    setHistory((prev) => prev.filter((v) => v !== val));
  };

  // Auto-save on blur if value is a valid QQ number
  const handleBlur = () => {
    if (value.trim() && /^\d+$/.test(value.trim())) {
      saveToHistory(value);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 bg-input-bg border border-border-theme text-text-primary rounded-l-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors min-w-0"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="bg-content2 border border-border-theme border-l-0 rounded-r-lg px-2 text-text-muted hover:text-text-primary text-xs cursor-pointer transition-colors"
        >
          ▼
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "top" }}
          className="absolute top-full left-0 right-0 bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-b-xl max-h-[200px] overflow-y-auto z-50 shadow-[var(--shadow-lg)]"
        >
          {history.length === 0 ? (
            <div className="px-3 py-2 text-center text-text-muted text-xs">
              暂无历史记录
            </div>
          ) : (
            history.map((v) => (
              <div
                key={v}
                className="flex justify-between items-center px-3 py-2 hover:bg-white/10 cursor-pointer text-sm text-text-primary transition-colors"
              >
                <span
                  onClick={() => {
                    onChange(v);
                    setOpen(false);
                  }}
                >
                  {v}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(v);
                  }}
                  className="text-text-muted hover:text-accent text-xs px-1 cursor-pointer"
                  style={{ opacity: 1 }}
                >
                  ✕
                </span>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
