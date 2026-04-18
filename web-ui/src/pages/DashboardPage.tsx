import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInterval } from "../hooks/useInterval";
import { useAppStore } from "../stores/app-store";
import {
  listBots,
  connectBot,
  disconnectBot,
  connectAll,
  disconnectAll,
} from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Card, Badge, Spinner } from "../components/ui";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { cachedBots, setCachedBots, appendLog } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const data = await listBots();
    if (data) setCachedBots(data.bots || [], data.activeBot);
    setLoading(false);
  }, [setCachedBots]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载首次加载仪表盘
    void loadDashboard();
  }, [loadDashboard]);

  useInterval(loadDashboard, 5000);

  const handleToggle = async (name: string, connect: boolean) => {
    setBusy(name);
    const data = connect ? await connectBot(name) : await disconnectBot(name);
    if (data !== null) {
      appendLog(`${name} ${connect ? "连接成功" : "已断开"}`);
      loadDashboard();
    }
    setBusy(null);
  };

  const handleConnectAll = async () => {
    setBusy("__all__");
    if ((await connectAll()) !== null) loadDashboard();
    setBusy(null);
  };

  const handleDisconnectAll = async () => {
    setBusy("__all__");
    if ((await disconnectAll()) !== null) loadDashboard();
    setBusy(null);
  };

  const total = cachedBots.length;
  const online = cachedBots.filter((b) => b.connected).length;
  const offline = total - online;

  return (
    <PageContainer>
      <PageHeader
        title="仪表盘"
        description="Bot 实例概览与连接状态"
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleConnectAll}
              loading={busy === "__all__"}
            >
              全部连接
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDisconnectAll}
              loading={busy === "__all__"}
            >
              全部断开
            </Button>
          </>
        }
      />

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Bot 总数" value={total} tone="primary" />
        <StatCard label="在线" value={online} tone="success" />
        <StatCard label="离线" value={offline} tone="neutral" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : cachedBots.length === 0 ? (
        <Card variant="glass" padding="lg">
          <div className="text-center py-12">
            <p className="text-sm text-[var(--color-text-secondary)]">
              暂无 Bot 实例
            </p>
            <Button
              size="sm"
              variant="primary"
              className="mt-4"
              onClick={() => navigate("/bots")}
            >
              前往添加
            </Button>
          </div>
        </Card>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {cachedBots.map((bot) => (
            <motion.div
              key={bot.name}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                variant="glass"
                padding="md"
                interactive
                className="h-full flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
                    {bot.name}
                  </span>
                  <Badge
                    variant={bot.mode === "ws" ? "primary" : "warning"}
                    size="sm"
                  >
                    {bot.mode.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={bot.connected ? "success" : "default"}
                      size="sm"
                      dot
                      pulse={bot.connected}
                    >
                      {bot.connected ? "已连接" : "未连接"}
                    </Badge>
                  </div>
                  {bot.connected ? (
                    <>
                      <div>
                        QQ:{" "}
                        <span className="text-[var(--color-text-primary)]">
                          {bot.userId ?? "-"}
                        </span>
                      </div>
                      <div className="truncate">
                        昵称:{" "}
                        <span className="text-[var(--color-text-primary)]">
                          {bot.nickname || "-"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="truncate text-[var(--color-text-muted)]">
                      {bot.mode === "ws" ? bot.wsUrl : bot.httpUrl}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-1">
                  {bot.connected ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggle(bot.name, false)}
                      loading={busy === bot.name}
                    >
                      断开
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleToggle(bot.name, true)}
                      loading={busy === bot.name}
                    >
                      连接
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate("/bots")}
                  >
                    管理
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "success" | "neutral";
}) {
  const toneMap = {
    primary: "text-[#a2bdff]",
    success: "text-[#6ee7b7]",
    neutral: "text-[var(--color-text-secondary)]",
  };
  return (
    <Card variant="glass" padding="md">
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-semibold tracking-tight ${toneMap[tone]}`}
      >
        {value}
      </div>
    </Card>
  );
}
