import { useEffect, useRef } from "react";

export function useInterval(
  callback: () => void | Promise<void>,
  delay: number | null,
) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    let disposed = false;
    let running = false;
    const refresh = async () => {
      if (disposed || running || document.hidden) return;
      running = true;
      try {
        await savedCallback.current();
      } finally {
        running = false;
      }
    };
    const id = setInterval(() => {
      void refresh();
    }, delay);
    const visibility = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [delay]);
}
