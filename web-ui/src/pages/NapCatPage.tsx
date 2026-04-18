import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../stores/app-store";
import {
  getNapCatConfig,
  setNapCatConfig,
  listNapCatInstances,
  startNapCat,
  stopNapCat,
  discoverNapCat,
  forgetNapCat,
  updateSavedNapCat,
} from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Card, Input, Modal, Spinner, Badge } from "../components/ui";
import EmptyState from "../components/shared/EmptyState";
import QQHistoryInput from "../components/shared/QQHistoryInput";
import type { NapCatInstance } from "../api/types";

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function NapCatPage() {
  const navigate = useNavigate();
  const { appendLog } = useAppStore();
  const [config, setConfig] = useState<{ napCatDir: string; workRoot: string }>(
    {
      napCatDir: "",
      workRoot: "",
    },
  );
  const [instances, setInstances] = useState<NapCatInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const [ncName, setNcName] = useState("");
  const [ncQQ, setNcQQ] = useState("");
  const [ncWebuiPort, setNcWebuiPort] = useState("");

  const [editName, setEditName] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    qqUin: string;
    webuiPort: string;
  } | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const matchedSaved = useMemo(() => {
    const trimmed = ncName.trim();
    if (!trimmed) return null;
    return (
      instances.find((i) => i.name === trimmed && i.saved && !i.alive) || null
    );
  }, [ncName, instances]);

  const loadPage = useCallback(async () => {
    const [cfg, inst] = await Promise.all([
      getNapCatConfig(),
      listNapCatInstances(),
    ]);
    if (cfg) setConfig(cfg);
    setInstances(inst || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPage(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadPage]);

  const runningInstances = useMemo(
    () => instances.filter((i) => i.alive),
    [instances],
  );
  const savedOnlyInstances = useMemo(
    () => instances.filter((i) => !i.alive && i.saved),
    [instances],
  );

  const handleSaveConfig = async () => {
    const data = await setNapCatConfig(config);
    if (data !== null) {
      appendLog("[成功] NapCat 配置已保存");
    }
  };

  const handleStart = async () => {
    const name = ncName.trim();
    if (!name) {
      appendLog("[错误] 请填写实例名称");
      return;
    }
    if (matchedSaved) {
      const data = await startNapCat(name);
      if (data !== null) {
        appendLog(`[成功] 从记忆启动: ${name}`);
        appendLog(`NapCat ${name} 从记忆启动`);
        setNcName("");
        setNcQQ("");
        setNcWebuiPort("");
        loadPage();
      }
      return;
    }
    if (!ncQQ.trim()) {
      appendLog("[错误] 请填写 QQ 号（或输入已记忆的实例名称直接启动）");
      return;
    }
    const webuiPort = parseInt(ncWebuiPort) || 6099;
    const data = await startNapCat(name, ncQQ.trim(), webuiPort);
    if (data !== null) {
      appendLog(`[成功] NapCat 实例 ${name} 已启动`);
      appendLog(`NapCat ${name} (QQ:${ncQQ.trim()}) 已启动`);
      setNcName("");
      setNcQQ("");
      setNcWebuiPort("");
      loadPage();
    }
  };

  const handleStartSaved = async (name: string) => {
    const data = await startNapCat(name);
    if (data !== null) {
      appendLog(`[成功] 从记忆启动: ${name}`);
      appendLog(`NapCat ${name} 从记忆启动`);
      loadPage();
    }
  };

  const handleRestart = async (name: string) => {
    const stopped = await stopNapCat(name);
    if (stopped !== null) {
      const started = await startNapCat(name);
      if (started !== null) {
        appendLog(`[成功] 已重新启动: ${name}`);
        appendLog(`NapCat ${name} 已重新启动`);
      }
      loadPage();
    }
  };

  const handleStop = async (name: string) => {
    const data = await stopNapCat(name);
    if (data !== null) {
      appendLog(`[成功] 已停止 ${name}`);
      loadPage();
    }
  };

  const handleStopAll = async () => {
    const data = await stopNapCat("all");
    if (data !== null) {
      appendLog("[成功] 已停止所有实例");
      loadPage();
    }
  };

  const handleForget = async (name: string) => {
    const data = await forgetNapCat(name);
    if (data !== null) {
      appendLog(`[成功] 已删除: ${name}`);
      loadPage();
    }
  };

  const handleForgetAll = async () => {
    const data = await forgetNapCat("all");
    if (data !== null) {
      appendLog("[成功] 已删除全部实例");
      loadPage();
    }
  };

  const handleShowEdit = (instance: NapCatInstance) => {
    setEditData({
      qqUin: instance.qqUin,
      webuiPort: String(instance.webuiPort || 6099),
    });
    setEditName(instance.name);
  };

  const handleEditRunning = async (instance: NapCatInstance) => {
    const data = await stopNapCat(instance.name);
    if (data !== null) {
      appendLog(`[成功] 已停止 ${instance.name}，请编辑后重新启动`);
      await loadPage();
      handleShowEdit(instance);
    }
  };

  const handleEditSave = async () => {
    if (!editName || !editData) return;
    setEditSaving(true);
    const webuiPort = parseInt(editData.webuiPort) || 6099;
    const data = await updateSavedNapCat(editName, editData.qqUin, webuiPort);
    setEditSaving(false);
    if (data !== null) {
      appendLog(`[成功] 已更新: ${editName}`);
      appendLog(`NapCat ${editName} 配置已更新`);
      setEditName(null);
      loadPage();
    }
  };

  const handleDiscover = async () => {
    const data = await discoverNapCat();
    if (data !== null) {
      appendLog(
        `[成功] 发现完成: 新建 ${data.created || 0} 个，共 ${data.total || 0} 个 Bot`,
      );
      appendLog(`NapCat 自动发现: 新建 ${data.created || 0} 个`);
    }
  };

  const navigateToLog = (name: string) => {
    navigate(`/nc-logs?instance=${encodeURIComponent(name)}`);
  };

  return (
    <PageContainer>
      <PageHeader
        title="NapCat 管理"
        description="NapCat 进程与配置管理"
        actions={
          <Button size="sm" variant="secondary" onClick={handleDiscover}>
            自动发现
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Card variant="glass" padding="lg">
              <h3 className="text-base font-semibold text-neutral-100 mb-4">
                NapCat 配置
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="NapCat 目录"
                  placeholder="NapCat 安装目录"
                  value={config.napCatDir}
                  onChange={(e) =>
                    setConfig({ ...config, napCatDir: e.target.value })
                  }
                />
                <Input
                  label="工作目录"
                  placeholder="工作目录根路径"
                  value={config.workRoot}
                  onChange={(e) =>
                    setConfig({ ...config, workRoot: e.target.value })
                  }
                />
              </div>
              <Button size="sm" variant="primary" onClick={handleSaveConfig}>
                保存配置
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06, ease: EASE }}
          >
            <Card variant="glass" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-neutral-100">
                  运行中实例
                </h3>
                {runningInstances.length > 0 ? (
                  <Button size="sm" variant="danger" onClick={handleStopAll}>
                    停止全部
                  </Button>
                ) : null}
              </div>
              {runningInstances.length === 0 ? (
                <EmptyState message="暂无运行中的实例" />
              ) : (
                <Card
                  variant="glass"
                  padding="none"
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-400">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            名称
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            QQ
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            WS 端口
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            HTTP 端口
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            PID
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            记忆
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {runningInstances.map((i) => (
                          <tr key={i.name} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-neutral-200">
                              {i.name}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.qqUin}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.wsPort}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.httpPort}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.pid}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.saved ? (
                                <Badge variant="primary" size="sm">
                                  已记忆
                                </Badge>
                              ) : (
                                <span className="text-xs text-neutral-500">
                                  未记忆
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigateToLog(i.name)}
                                >
                                  日志
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleEditRunning(i)}
                                >
                                  编辑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleRestart(i.name)}
                                >
                                  重启
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleStop(i.name)}
                                >
                                  停止
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </Card>
          </motion.div>

          {savedOnlyInstances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.09, ease: EASE }}
            >
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-neutral-100">
                    记忆实例 (已停止)
                  </h3>
                  {savedOnlyInstances.length > 1 ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleForgetAll}
                    >
                      删除全部
                    </Button>
                  ) : null}
                </div>
                <Card
                  variant="glass"
                  padding="none"
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-400">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            名称
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            QQ
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            WebUI 端口
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {savedOnlyInstances.map((i) => (
                          <tr key={i.name} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-neutral-200">
                              {i.name}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.qqUin}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              {i.webuiPort}
                            </td>
                            <td className="px-4 py-3 text-neutral-200">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleStartSaved(i.name)}
                                >
                                  启动
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleShowEdit(i)}
                                >
                                  编辑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleForget(i.name)}
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
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
          >
            <Card variant="glass" padding="lg">
              <h3 className="text-base font-semibold text-neutral-100 mb-4">
                启动新实例
              </h3>
              {matchedSaved && (
                <div className="mb-4 px-3 py-2 rounded-lg border border-[rgba(90,125,255,0.3)] bg-[rgba(90,125,255,0.08)] text-sm text-[#a2bdff]">
                  匹配到记忆实例: QQ {matchedSaved.qqUin}, WebUI 端口{" "}
                  {matchedSaved.webuiPort} — 点击启动将直接从记忆恢复
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Input
                  label="实例名称"
                  placeholder="实例名称"
                  value={ncName}
                  onChange={(e) => setNcName(e.target.value)}
                />
                <div>
                  <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
                    QQ 号{" "}
                    {matchedSaved && (
                      <span className="text-[#a2bdff] ml-1">(自动填充)</span>
                    )}
                  </label>
                  <QQHistoryInput
                    storageKey="ncQQ"
                    placeholder={matchedSaved ? matchedSaved.qqUin : "QQ 号"}
                    value={ncQQ}
                    onChange={setNcQQ}
                  />
                </div>
                <Input
                  label={matchedSaved ? "WebUI 端口 (自动填充)" : "WebUI 端口"}
                  placeholder={
                    matchedSaved ? String(matchedSaved.webuiPort) : "6099"
                  }
                  value={ncWebuiPort}
                  onChange={(e) => setNcWebuiPort(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handleStart}>
                {matchedSaved ? "从记忆启动" : "启动实例"}
              </Button>
            </Card>
          </motion.div>
        </div>
      )}

      <Modal
        open={editName !== null}
        onClose={() => setEditName(null)}
        title={`编辑实例 - ${editName}`}
        size="md"
        footer={
          <>
            <Button size="sm" variant="ghost" onClick={() => setEditName(null)}>
              取消
            </Button>
            <Button
              size="sm"
              variant="primary"
              loading={editSaving}
              onClick={handleEditSave}
            >
              保存
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="实例名称" value={editName || ""} disabled />
          <div>
            <label className="text-xs font-medium text-neutral-300 mb-1.5 block">
              QQ 号
            </label>
            <QQHistoryInput
              storageKey="ncQQ"
              placeholder="QQ 号"
              value={editData?.qqUin || ""}
              onChange={(v) =>
                editData && setEditData({ ...editData, qqUin: v })
              }
            />
          </div>
          <Input
            label="WebUI 端口"
            placeholder="6099"
            value={editData?.webuiPort || ""}
            onChange={(e) =>
              editData &&
              setEditData({ ...editData, webuiPort: e.target.value })
            }
          />
        </div>
      </Modal>
    </PageContainer>
  );
}
