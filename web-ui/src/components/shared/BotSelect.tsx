import { useEffect, useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAppStore } from "../../stores/app-store";
import { setActiveBot } from "../../api/endpoints";
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
  const [, setSaved] = useLocalStorage(storageKey, "");

  const filteredBots = useMemo(
    () => (connectedOnly ? cachedBots.filter((b) => b.connected) : cachedBots),
    [cachedBots, connectedOnly],
  );

  const activeBotName = useAppStore((s) => s.activeBotName);
  const setCachedBots = useAppStore((s) => s.setCachedBots);
  useEffect(() => {
    const active = filteredBots.find((bot) => bot.name === activeBotName)?.name;
    const next = active ?? "";
    if (next !== value) onChange(next);
  }, [activeBotName, filteredBots, value, onChange]);

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

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    if (!next) {
      onChange("");
      return;
    }
    const result = await setActiveBot(next);
    if (result) {
      setCachedBots(cachedBots, result.activeBot);
      onChange(next);
      setSaved(next);
    }
  };

  return (
    <div className="min-w-[180px]">
      <Select
        aria-label="选择 Bot"
        options={options}
        value={value}
        onChange={handleChange}
        fullWidth
      />
    </div>
  );
}
