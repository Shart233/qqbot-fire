import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import { runAction } from "../api/client";
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
    const data = await runAction(`Bot "${name}" 已添加`, () => addBot(name));
    if (data !== null) {
      setAddName("");
      appendLog(`添加 Bot: ${name}`);
      loadBots();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const data = await runAction(`Bot "${target}" 已删除`, () =>
      deleteBot(target),
    );
    if (data !== null) {
      appendLog(`删除 Bot: ${target}`);
      setDeleteTarget(null);
      loadBots();
    }
  };

  const handleToggle = async (name: string, connect: boolean) => {
    const data = await runAction(
      `${name} ${connect ? "已连接" : "已断开"}`,
      () => (connect ? connectBot(name) : disconnectBot(name)),
    );
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
    const target = configBot;
    const data = await runAction(`配置已保存：${target}`, () =>
      updateBotConfig(target, {
        mode: configData.mode,
        wsUrl: configData.wsUrl,
        httpUrl: configData.httpUrl,
        wsToken: configData.wsToken,
        httpToken: configData.httpToken,
      }),
    );
    setConfigSaving(false);
    if (data !== null) {
      appendLog(`更新配置: ${target}`);
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
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="新 Bot 名称"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 sm:w-48 sm:flex-none"
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
          {/* 手机卡片：< sm */}
          <div className="sm:hidden space-y-3">
            {cachedBots.map((bot) => (
              <Card key={bot.name} variant="glass" padding="md">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {bot.name}
                      </span>
                      {bot.name === activeBotName && (
                        <Badge variant="success" size="sm">
                          当前
                        </Badge>
                      )}
                      <Badge
                        variant={bot.mode === "ws" ? "primary" : "warning"}
                        size="sm"
                      >
                        {bot.mode.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="font-mono text-xs text-[var(--color-text-muted)] truncate">
                      {bot.mode === "ws" ? bot.wsUrl : bot.httpUrl}
                    </div>
                  </div>
                  <Badge
                    variant={bot.connected ? "success" : "default"}
                    size="sm"
                    dot
                    pulse={bot.connected}
                    className="flex-shrink-0"
                  >
                    {bot.connected ? "在线" : "离线"}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleShowConfig(bot.name)}
                  >
                    配置
                  </Button>
                  {bot.connected ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => handleToggle(bot.name, false)}
                    >
                      断开
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1"
                      onClick={() => handleToggle(bot.name, true)}
                    >
                      连接
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-1"
                    onClick={() => setDeleteTarget(bot.name)}
                  >
                    删除
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* 桌面表格：≥ sm */}
          <Card
            variant="glass"
            padding="none"
            className="overflow-hidden hidden sm:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--glass-border)]">
                    <th className="text-left px-5 py-3 font-medium">名称</th>
                    <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                      模式
                    </th>
                    <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">
                      地址
                    </th>
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
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[var(--color-text-primary)] font-medium">
                              {bot.name}
                            </span>
                            {bot.name === activeBotName && (
                              <Badge variant="success" size="sm">
                                当前
                              </Badge>
                            )}
                            <span className="md:hidden">
                              <Badge
                                variant={
                                  bot.mode === "ws" ? "primary" : "warning"
                                }
                                size="sm"
                              >
                                {bot.mode.toUpperCase()}
                              </Badge>
                            </span>
                          </div>
                          <span className="text-[var(--color-text-muted)] font-mono text-xs truncate max-w-[220px] lg:hidden">
                            {bot.mode === "ws" ? bot.wsUrl : bot.httpUrl}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <Badge
                          variant={bot.mode === "ws" ? "primary" : "warning"}
                          size="sm"
                        >
                          {bot.mode.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
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
                        <div className="flex items-center gap-1.5 justify-end whitespace-nowrap">
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
