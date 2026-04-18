import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import {
  listBots,
  addBot,
  deleteBot,
  connectBot,
  disconnectBot,
  getBotConfig,
  updateBotConfig,
} from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  Spinner,
} from "../components/ui";
import type { BotConfig } from "../api/types";

export default function BotsPage() {
  const { cachedBots, activeBotName, setCachedBots, appendLog } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [addName, setAddName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [configBot, setConfigBot] = useState<string | null>(null);
  const [configData, setConfigData] = useState<BotConfig | null>(null);
  const [configSaving, setConfigSaving] = useState(false);

  const loadBots = useCallback(async () => {
    const data = await listBots();
    if (data) setCachedBots(data.bots || [], data.activeBot);
    setLoading(false);
  }, [setCachedBots]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载首次加载数据
    void loadBots();
  }, [loadBots]);

  const handleAdd = async () => {
    const name = addName.trim();
    if (!name) return;
    const data = await addBot(name);
    if (data !== null) {
      setAddName("");
      appendLog(`添加 Bot: ${name}`);
      loadBots();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const data = await deleteBot(deleteTarget);
    if (data !== null) {
      appendLog(`删除 Bot: ${deleteTarget}`);
      setDeleteTarget(null);
      loadBots();
    }
  };

  const handleToggle = async (name: string, connect: boolean) => {
    const data = connect ? await connectBot(name) : await disconnectBot(name);
    if (data !== null) {
      appendLog(`${name} ${connect ? "连接成功" : "已断开"}`);
      loadBots();
    }
  };

  const handleShowConfig = async (name: string) => {
    const cfg = await getBotConfig(name);
    if (cfg) {
      setConfigData({ ...cfg });
      setConfigBot(name);
    }
  };

  const handleSaveConfig = async () => {
    if (!configBot || !configData) return;
    setConfigSaving(true);
    const data = await updateBotConfig(configBot, {
      mode: configData.mode,
      wsUrl: configData.wsUrl,
      httpUrl: configData.httpUrl,
      wsToken: configData.wsToken,
      httpToken: configData.httpToken,
    });
    setConfigSaving(false);
    if (data !== null) {
      appendLog(`更新配置: ${configBot}`);
      setConfigBot(null);
      loadBots();
    }
  };

  const updateCfg = (patch: Partial<BotConfig>) => {
    if (configData) setConfigData({ ...configData, ...patch });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Bot 实例"
        description="管理多个 Bot 连接与配置"
        actions={
          <div className="flex items-center gap-2">
            <Input
              placeholder="新 Bot 名称"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-48"
              fullWidth={false}
            />
            <Button size="sm" variant="primary" onClick={handleAdd}>
              添加
            </Button>
          </div>
        }
      />
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : cachedBots.length === 0 ? (
        <Card variant="glass" padding="lg">
          <p className="text-center py-12 text-sm text-[var(--color-text-secondary)]">
            暂无 Bot，使用上方输入框添加
          </p>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--glass-border)]">
                    <th className="text-left px-5 py-3 font-medium">名称</th>
                    <th className="text-left px-5 py-3 font-medium">模式</th>
                    <th className="text-left px-5 py-3 font-medium">地址</th>
                    <th className="text-left px-5 py-3 font-medium">状态</th>
                    <th className="text-right px-5 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cachedBots.map((bot) => (
                    <tr
                      key={bot.name}
                      className="border-b border-[var(--glass-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--color-text-primary)] font-medium">
                            {bot.name}
                          </span>
                          {bot.name === activeBotName && (
                            <Badge variant="success" size="sm">
                              当前
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={bot.mode === "ws" ? "primary" : "warning"}
                          size="sm"
                        >
                          {bot.mode.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[var(--color-text-secondary)] truncate inline-block max-w-[260px] font-mono text-xs">
                          {bot.mode === "ws" ? bot.wsUrl : bot.httpUrl}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          variant={bot.connected ? "success" : "default"}
                          size="sm"
                          dot
                          pulse={bot.connected}
                        >
                          {bot.connected ? "在线" : "离线"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 justify-end flex-wrap">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleShowConfig(bot.name)}
                          >
                            配置
                          </Button>
                          {bot.connected ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggle(bot.name, false)}
                            >
                              断开
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleToggle(bot.name, true)}
                            >
                              连接
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setDeleteTarget(bot.name)}
                          >
                            删除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="确认删除"
        description={`确定要删除 Bot "${deleteTarget ?? ""}" 吗？此操作不可恢复。`}
        size="sm"
        footer={
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              取消
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              删除
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          相关配置和调度任务将一同移除。
        </p>
      </Modal>

      <Modal
        open={configBot !== null}
        onClose={() => setConfigBot(null)}
        title={`配置 · ${configBot ?? ""}`}
        size="lg"
        footer={
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfigBot(null)}
            >
              取消
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveConfig}
              loading={configSaving}
            >
              保存
            </Button>
          </>
        }
      >
        {configData && (
          <div className="space-y-4">
            <Select
              label="连接模式"
              value={configData.mode}
              onChange={(e) => updateCfg({ mode: e.target.value })}
              options={[
                { value: "ws", label: "WebSocket" },
                { value: "http", label: "HTTP" },
              ]}
            />
            <Input
              label="WebSocket 地址"
              value={configData.wsUrl || ""}
              onChange={(e) => updateCfg({ wsUrl: e.target.value })}
              placeholder="ws://host:port"
            />
            <Input
              label="HTTP 地址"
              value={configData.httpUrl || ""}
              onChange={(e) => updateCfg({ httpUrl: e.target.value })}
              placeholder="http://host:port"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="WS Token"
                type="password"
                value={configData.wsToken || ""}
                onChange={(e) => updateCfg({ wsToken: e.target.value })}
              />
              <Input
                label="HTTP Token"
                type="password"
                value={configData.httpToken || ""}
                onChange={(e) => updateCfg({ httpToken: e.target.value })}
              />
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
