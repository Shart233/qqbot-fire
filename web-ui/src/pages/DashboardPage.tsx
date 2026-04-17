import { useState, useEffect, useCallback } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { toast } from "@heroui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInterval } from "../hooks/useInterval";
import { useAppStore } from "../stores/app-store";
import {
  listBots,
  connectBot,
  disconnectBot,
  connectAll,
  disconnectAll,
} from "../api/endpoints";
import PageHeader from "../components/shared/PageHeader";
import EmptyState from "../components/shared/EmptyState";
import GlassCard from "../components/shared/GlassCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { cachedBots, setCachedBots, appendLog } = useAppStore();
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    const data = await listBots();
    if (data) {
      setCachedBots(data.bots || [], data.activeBot);
    }
    setLoading(false);
  }, [setCachedBots]);

  useEffect(() => {
    loadDashboard(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadDashboard]);

  // Auto-refresh every 5s
  useInterval(loadDashboard, 5000);

  const handleToggleBot = async (name: string, connect: boolean) => {
    const data = connect ? await connectBot(name) : await disconnectBot(name);
    if (data !== null) {
      toast.success(`${name} ${connect ? "已连接" : "已断开"}`);
      appendLog(`${name} ${connect ? "连接成功" : "已断开"}`);
      loadDashboard();
    }
  };

  const handleConnectAll = async () => {
    const data = await connectAll();
    if (data !== null) {
      toast.success("全部连接完成");
      loadDashboard();
    }
  };

  const handleDisconnectAll = async () => {
    const data = await disconnectAll();
    if (data !== null) {
      toast.success("全部断开完成");
      loadDashboard();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="仪表盘">
        <Button
          size="sm"
          variant="ghost"
          className="text-success"
          onPress={handleConnectAll}
        >
          全部连接
        </Button>
        <Button size="sm" variant="danger-soft" onPress={handleDisconnectAll}>
          全部断开
        </Button>
      </PageHeader>

      {cachedBots.length === 0 ? (
        <EmptyState message="暂无 Bot 实例，请在 Bot 管理中添加" />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {cachedBots.map((bot) => (
            <GlassCard key={bot.name} className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-text-primary font-semibold text-sm truncate">
                  {bot.name}
                </span>
                <Chip
                  size="sm"
                  variant="soft"
                  color={bot.mode === "ws" ? "accent" : "warning"}
                >
                  {bot.mode.toUpperCase()}
                </Chip>
              </div>
              <div className="text-sm text-text-secondary space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full inline-block ${bot.connected ? "bg-success animate-[pulse-dot_2s_ease_infinite]" : "bg-text-muted"}`}
                  />
                  <span>{bot.connected ? "已连接" : "未连接"}</span>
                </div>
                {bot.connected ? (
                  <>
                    <div>QQ: {bot.userId || "-"}</div>
                    <div>昵称: {bot.nickname || "-"}</div>
                  </>
                ) : (
                  <div className="text-text-muted truncate text-xs">
                    {bot.mode === "ws" ? bot.wsUrl : bot.httpUrl}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-auto pt-1">
                {bot.connected ? (
                  <Button
                    size="sm"
                    variant="danger-soft"
                    className="rounded-xl"
                    onPress={() => handleToggleBot(bot.name, false)}
                  >
                    断开
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-success rounded-xl"
                    onPress={() => handleToggleBot(bot.name, true)}
                  >
                    连接
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onPress={() => navigate("/bots")}
                >
                  管理
                </Button>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}
    </div>
  );
}
