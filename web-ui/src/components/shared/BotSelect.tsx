import { useEffect } from "react";
import { Select, ListBox } from "@heroui/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useAppStore } from "../../stores/app-store";
import type { Key } from "react-aria-components";

interface Props {
  storageKey: string;
  connectedOnly?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function BotSelect({
  storageKey,
  connectedOnly = false,
  value,
  onChange,
}: Props) {
  const cachedBots = useAppStore((s) => s.cachedBots);
  const [saved, setSaved] = useLocalStorage(storageKey, "");

  const filteredBots = connectedOnly
    ? cachedBots.filter((b) => b.connected)
    : cachedBots;

  // Restore saved value on mount
  useEffect(() => {
    if (!value && saved && filteredBots.some((b) => b.name === saved)) {
      onChange(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectionChange = (key: Key | null) => {
    const v = String(key ?? "");
    onChange(v);
    setSaved(v);
  };

  return (
    <Select
      selectedKey={value || null}
      onSelectionChange={handleSelectionChange}
      placeholder="选择 Bot..."
      className="min-w-[180px]"
    >
      <Select.Trigger className="bg-input-bg border border-border-theme text-text-primary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {filteredBots.map((b) => (
            <ListBox.Item
              key={b.name}
              id={b.name}
              textValue={`${b.name}${b.connected ? ` (QQ:${b.userId || "?"})` : " (未连接)"}`}
            >
              {b.name}
              {b.connected ? ` (QQ:${b.userId || "?"})` : " (未连接)"}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
