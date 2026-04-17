import { Button } from "@heroui/react";
import { useAppStore } from "../stores/app-store";
import PageHeader from "../components/shared/PageHeader";
import LogViewer from "../components/shared/LogViewer";

export default function LogsPage() {
  const { operationLogs, clearLogs } = useAppStore();

  return (
    <div>
      <PageHeader title="操作日志">
        <Button size="sm" variant="danger-soft" onPress={clearLogs}>
          清空日志
        </Button>
      </PageHeader>

      <LogViewer
        lines={operationLogs.length > 0 ? operationLogs : []}
        tall
        emptyMessage="等待日志..."
      />
    </div>
  );
}
