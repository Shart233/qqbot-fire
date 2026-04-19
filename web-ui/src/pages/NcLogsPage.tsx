import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useInterval } from "../hooks/useInterval";
import { listNapCatInstances, getNapCatLog } from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Select, Spinner } from "../components/ui";
import LogViewer from "../components/shared/LogViewer";
import type { NapCatInstance } from "../api/types";

export default function NcLogsPage() {
  const [searchParams] = useSearchParams();
  const [instances, setInstances] = useState<NapCatInstance[]>([]);
  const [selected, setSelected] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listNapCatInstances({ silent: true }).then((data) => {
      const list = data || [];
      setInstances(list);
      const fromUrl = searchParams.get("instance");
      const fromStorage = localStorage.getItem("select_ncLogSelect") || "";
      const initial = fromUrl || fromStorage;
      if (initial && list.some((i) => i.name === initial)) {
        setSelected(initial);
      }
      setLoading(false);
    });
  }, [searchParams]);

  const loadLog = useCallback(
    async (silent: boolean = false) => {
      if (!selected) return;
      localStorage.setItem("select_ncLogSelect", selected);
      const data = await getNapCatLog(selected, { silent });
      if (data && data.lines) {
        setLines(data.lines);
      }
    },
    [selected],
  );

  useEffect(() => {
    if (selected) loadLog(true); // eslint-disable-line react-hooks/set-state-in-effect -- 初始加载静默
  }, [selected, loadLog]);

  useInterval(() => loadLog(true), autoRefresh ? 2000 : null);

  const options = [
    { value: "", label: "选择实例..." },
    ...instances.map((i) => ({
      value: i.name,
      label: `${i.name} (QQ:${i.qqUin || "?"})`,
    })),
  ];

  return (
    <PageContainer>
      <PageHeader
        title="NapCat 日志"
        description="NapCat 实例运行日志"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <div className="min-w-[200px]">
              <Select
                options={options}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                fullWidth
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-neutral-400 select-none">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-[#5a7dff]"
              />
              <span>自动刷新</span>
            </label>
            <Button size="sm" variant="ghost" onClick={() => loadLog(false)}>
              刷新
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <LogViewer lines={lines} tall emptyMessage="无日志" />
      )}
    </PageContainer>
  );
}
