import { useState, useEffect, useCallback } from "react";
import { useInterval } from "../hooks/useInterval";
import { listLogFiles, readLog } from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Input, Select, Spinner } from "../components/ui";
import LogViewer from "../components/shared/LogViewer";
import type { LogFileInfo } from "../api/types";

export default function ServerLogsPage() {
  const [files, setFiles] = useState<LogFileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState("latest.log");
  const [lineCount, setLineCount] = useState("200");
  const [lines, setLines] = useState<string[]>([]);
  const [info, setInfo] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listLogFiles().then((data) => {
      setFiles(data || []);
      setLoading(false);
    });
  }, []);

  const loadLog = useCallback(async () => {
    const numLines = parseInt(lineCount) || 200;
    const data = await readLog(selectedFile, numLines);
    if (data && data.lines) {
      setLines(data.lines);
      setInfo(
        `${data.file} - 显示第 ${data.from + 1} ~ ${data.from + data.lines.length} 行 (共 ${data.total} 行)`,
      );
    }
  }, [selectedFile, lineCount]);

  useEffect(() => {
    loadLog(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadLog]);

  useInterval(loadLog, autoRefresh ? 3000 : null);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="服务端日志"
        description="查看应用运行日志并支持自动刷新"
        actions={
          <div className="flex items-end gap-3 flex-wrap">
            <Select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              options={files.map((f) => ({ value: f.name, label: f.name }))}
              className="min-w-[180px]"
            />
            <Input
              type="number"
              value={lineCount}
              onChange={(e) => setLineCount(e.target.value)}
              placeholder="行数"
              className="w-[110px]"
            />
            <label className="flex h-10 items-center gap-2 cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-text-primary">
              <input
                type="checkbox"
                className="accent-[#5a7dff] h-4 w-4"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              <span>自动刷新</span>
            </label>
            <Button size="sm" variant="ghost" onClick={loadLog}>
              刷新
            </Button>
          </div>
        }
      />

      {info && <div className="mb-1 text-xs text-text-muted">{info}</div>}

      <LogViewer lines={lines} colorized tall />
    </PageContainer>
  );
}
