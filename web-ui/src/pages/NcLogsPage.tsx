import { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Select, ListBox, Switch } from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import { useInterval } from "../hooks/useInterval";
import { listNapCatInstances, getNapCatLog } from "../api/endpoints";
import PageHeader from "../components/shared/PageHeader";
import LogViewer from "../components/shared/LogViewer";
import type { NapCatInstance } from "../api/types";
import type { Key } from "react-aria-components";

export default function NcLogsPage() {
  const [searchParams] = useSearchParams();
  const [instances, setInstances] = useState<NapCatInstance[]>([]);
  const [selected, setSelected] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load instances on mount
  useEffect(() => {
    listNapCatInstances().then((data) => {
      const list = data || [];
      setInstances(list);
      // Auto-select from URL param or localStorage
      const fromUrl = searchParams.get("instance");
      const fromStorage = localStorage.getItem("select_ncLogSelect") || "";
      const initial = fromUrl || fromStorage;
      if (initial && list.some((i) => i.name === initial)) {
        setSelected(initial);
      }
      setLoading(false);
    });
  }, [searchParams]);

  const loadLog = useCallback(async () => {
    if (!selected) return;
    localStorage.setItem("select_ncLogSelect", selected);
    const data = await getNapCatLog(selected);
    if (data && data.lines) {
      setLines(data.lines);
    }
  }, [selected]);

  useEffect(() => {
    if (selected) loadLog(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [selected, loadLog]);

  // Auto-refresh every 2s
  useInterval(loadLog, autoRefresh ? 2000 : null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="NapCat 日志">
        <div className="flex items-center gap-3">
          <Select
            selectedKey={selected || null}
            onSelectionChange={(key: Key | null) =>
              setSelected(String(key ?? ""))
            }
            placeholder="选择实例..."
            className="min-w-[180px]"
          >
            <Select.Trigger className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {instances.map((i) => (
                  <ListBox.Item
                    key={i.name}
                    id={i.name}
                    textValue={`${i.name} (QQ:${i.qqUin || "?"})`}
                  >
                    {i.name} (QQ:{i.qqUin || "?"})
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Switch
            size="sm"
            isSelected={autoRefresh}
            onChange={(isSelected: boolean) => setAutoRefresh(isSelected)}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <span className="text-sm text-text-muted">自动刷新</span>
            </Switch.Content>
          </Switch>
          <Button size="sm" variant="ghost" onPress={loadLog}>
            刷新
          </Button>
        </div>
      </PageHeader>

      <LogViewer lines={lines} tall emptyMessage="无日志" />
    </div>
  );
}
