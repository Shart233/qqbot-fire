import { useEffect, useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAppStore } from "../../stores/app-store";
import { Select } from "../ui";

interface Props {
  storageKey: string;
  connectedOnly?: boolean;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Bot 选择下拉框：封装 localStorage 持久化与 cachedBots 过滤逻辑。
 */
export default function BotSelect({
  storageKey,
  connectedOnly = false,
  value,
  onChange,
}: Props) {
  const cachedBots = useAppStore((s) => s.cachedBots);
  const [saved, setSaved] = useLocalStorage(storageKey, "");

  const filteredBots = useMemo(
    () => (connectedOnly ? cachedBots.filter((b) => b.connected) : cachedBots),
    [cachedBots, connectedOnly],
  );

  // 挂载时恢复上次选择
  useEffect(() => {
    if (!value && saved && filteredBots.some((b) => b.name === saved)) {
      onChange(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const options = useMemo(
    () => [
      { value: "", label: "选择 Bot..." },
      ...filteredBots.map((b) => ({
        value: b.name,
        label: `${b.name}${b.connected ? ` (QQ:${b.userId || "?"})` : " (未连接)"}`,
      })),
    ],
    [filteredBots],
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    onChange(v);
    setSaved(v);
  };

  return (
    <div className="min-w-[180px]">
      <Select
        options={options}
        value={value}
        onChange={handleChange}
        fullWidth
      />
    </div>
  );
}
