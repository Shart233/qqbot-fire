import { PageContainer, PageHeader } from "../components/layout-new";
import { Button } from "../components/ui";
import LogViewer from "../components/shared/LogViewer";
import { useAppStore } from "../stores/app-store";

export default function LogsPage() {
  const { operationLogs, clearLogs } = useAppStore();

  return (
    <PageContainer>
      <PageHeader
        title="操作日志"
        description="Web 操作记录"
        actions={
          <Button size="sm" variant="danger" onClick={clearLogs}>
            清空日志
          </Button>
        }
      />
      <LogViewer lines={operationLogs} tall emptyMessage="等待日志..." />
    </PageContainer>
  );
}
