import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import {
  listBots,
  listSchedules,
  addSchedule,
  deleteSchedule,
  toggleSchedule,
  testSchedule,
  updateSchedule,
} from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Card, Badge, Input, Spinner } from "../components/ui";
import BotSelect from "../components/shared/BotSelect";
import EmptyState from "../components/shared/EmptyState";
import SimpleModal from "../components/shared/SimpleModal";
import type { ScheduleTask } from "../api/types";

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function SchedulesPage() {
  const { setCachedBots, appendLog } = useAppStore();
  const [bot, setBot] = useState("");
  const [schedules, setSchedules] = useState<ScheduleTask[]>([]);
  const [loading, setLoading] = useState(false);

  // Add form
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [targets, setTargets] = useState("");
  const [targetType, setTargetType] = useState<"group" | "private">("private");
  const [message, setMessage] = useState("");
  const [autoConnect, setAutoConnect] = useState(true);

  // Edit modal
  const [editTask, setEditTask] = useState<ScheduleTask | null>(null);
  const [editTime, setEditTime] = useState("");
  const [editTargets, setEditTargets] = useState("");
  const [editTargetType, setEditTargetType] = useState<"group" | "private">(
    "private",
  );
  const [editMessage, setEditMessage] = useState("");
  const [editAutoConnect, setEditAutoConnect] = useState(false);
  const [editAutoStopAfterSend, setEditAutoStopAfterSend] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    listBots().then((data) => {
      if (data) setCachedBots(data.bots || [], data.activeBot);
    });
  }, [setCachedBots]);

  const loadScheduleList = useCallback(async () => {
    if (!bot) {
      setSchedules([]);
      return;
    }
    setLoading(true);
    const data = await listSchedules(bot);
    setSchedules(data || []);
    setLoading(false);
  }, [bot]);

  useEffect(() => {
    loadScheduleList(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadScheduleList]);

  const handleAdd = async () => {
    if (!bot) {
      appendLog("[错误] 请选择 Bot");
      return;
    }
    if (!name.trim() || !time || !targets.trim() || !message.trim()) {
      appendLog("[错误] 请填写所有字段");
      return;
    }
    const targetNums = targets
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (targetNums.length === 0) {
      appendLog("[错误] 目标格式错误");
      return;
    }
    const data = await addSchedule(bot, {
      name: name.trim(),
      time,
      targets: targetNums,
      targetType,
      message: message.trim(),
      autoConnect,
    });
    if (data !== null) {
      appendLog(`添加定时任务: ${name.trim()}`);
      setName("");
      setTime("");
      setTargets("");
      setTargetType("private");
      setMessage("");
      setAutoConnect(true);
      loadScheduleList();
    }
  };

  const handleShowEdit = (task: ScheduleTask) => {
    setEditTask(task);
    setEditTime(task.time);
    setEditTargets((task.targets || []).join(", "));
    setEditTargetType(task.targetType);
    setEditMessage(task.message);
    setEditAutoConnect(task.autoConnect);
    setEditAutoStopAfterSend(task.autoStopAfterSend ?? false);
  };

  const handleEditSave = async () => {
    if (!editTask || !bot) return;
    const nums = editTargets
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (nums.length === 0) {
      appendLog("[错误] 目标格式错误");
      return;
    }
    setEditSaving(true);
    const data = await updateSchedule(bot, editTask.name, {
      time: editTime,
      targets: nums,
      targetType: editTargetType,
      message: editMessage.trim(),
      autoConnect: editAutoConnect,
      autoStopAfterSend: editAutoStopAfterSend,
    });
    setEditSaving(false);
    if (data !== null) {
      appendLog(`编辑定时任务: ${editTask.name}`);
      setEditTask(null);
      loadScheduleList();
    }
  };

  const handleToggle = async (taskName: string, enabled: boolean) => {
    const data = await toggleSchedule(bot, taskName, enabled);
    if (data !== null) {
      loadScheduleList();
    } else {
      appendLog("[错误] 切换失败");
      loadScheduleList();
    }
  };

  const handleTest = async (taskName: string) => {
    const data = await testSchedule(bot, taskName);
    if (data !== null) {
      appendLog(`[成功] 测试定时任务: ${taskName}`);
    }
  };

  const handleDelete = async (taskName: string) => {
    const data = await deleteSchedule(bot, taskName);
    if (data !== null) {
      appendLog(`[成功] 删除定时任务: ${taskName}`);
      loadScheduleList();
    }
  };

  const pillClass = (active: boolean) =>
    `h-9 px-4 rounded-md text-xs border transition-colors ${
      active
        ? "bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.4)]"
        : "bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]"
    }`;

  return (
    <PageContainer>
      <PageHeader
        title="定时任务"
        description="Bot 定时消息管理"
        actions={
          <BotSelect
            storageKey="select_scheduleBotSelect"
            value={bot}
            onChange={setBot}
          />
        }
      />

      {!bot ? (
        <EmptyState message="请选择 Bot" />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Schedule Table (桌面) / 卡片列表 (手机) */}
          {schedules.length === 0 ? (
            <EmptyState message="暂无定时任务" />
          ) : (
            <>
              {/* 手机卡片：< sm */}
              <div className="sm:hidden space-y-3 mb-6">
                {schedules.map((t) => (
                  <Card key={t.name} variant="glass" padding="md">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className="font-medium text-text-primary truncate">
                          {t.name}
                        </span>
                        <Badge
                          variant={t.targetType === "group" ? "info" : "accent"}
                          size="sm"
                        >
                          {t.targetType === "group" ? "群" : "好友"}
                        </Badge>
                      </div>
                      <input
                        type="checkbox"
                        className="accent-[#5a7dff] w-4 h-4 cursor-pointer flex-shrink-0 mt-1"
                        checked={t.enabled}
                        onChange={(e) => handleToggle(t.name, e.target.checked)}
                      />
                    </div>
                    <div className="grid grid-cols-[56px_1fr] gap-y-1.5 text-xs mb-3">
                      <span className="text-neutral-400">时间</span>
                      <span className="text-text-primary">{t.time}</span>
                      <span className="text-neutral-400">目标</span>
                      <span className="text-text-primary truncate">
                        {(t.targets || []).join(", ")}
                      </span>
                      <span className="text-neutral-400">消息</span>
                      <span className="text-text-primary line-clamp-2 break-all">
                        {t.message}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-white/5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => handleShowEdit(t)}
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        onClick={() => handleTest(t.name)}
                      >
                        测试
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => handleDelete(t.name)}
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
                className="overflow-hidden mb-6 hidden sm:block"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="bg-white/[0.03] border-b border-white/10">
                      <tr className="text-left text-xs text-neutral-400 uppercase tracking-wider">
                        <th className="px-4 py-3">任务名</th>
                        <th className="px-4 py-3">时间</th>
                        <th className="px-4 py-3 hidden md:table-cell">目标</th>
                        <th className="px-4 py-3 hidden lg:table-cell">消息</th>
                        <th className="px-4 py-3 hidden sm:table-cell">启用</th>
                        <th className="px-4 py-3">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((t) => (
                        <tr
                          key={t.name}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 text-text-primary">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{t.name}</span>
                                <span className="sm:hidden">
                                  <input
                                    type="checkbox"
                                    className="accent-[#5a7dff] w-4 h-4 cursor-pointer align-middle"
                                    checked={t.enabled}
                                    onChange={(e) =>
                                      handleToggle(t.name, e.target.checked)
                                    }
                                  />
                                </span>
                              </div>
                              <div className="flex items-center gap-2 md:hidden text-xs text-neutral-400">
                                <Badge
                                  variant={
                                    t.targetType === "group" ? "info" : "accent"
                                  }
                                  size="sm"
                                >
                                  {t.targetType === "group" ? "群" : "好友"}
                                </Badge>
                                <span className="truncate max-w-[180px]">
                                  {(t.targets || []).join(", ")}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-text-primary whitespace-nowrap">
                            {t.time}
                          </td>
                          <td className="px-4 py-3 text-text-primary hidden md:table-cell">
                            <Badge
                              variant={
                                t.targetType === "group" ? "info" : "accent"
                              }
                              size="sm"
                              className="mr-2"
                            >
                              {t.targetType === "group" ? "群" : "好友"}
                            </Badge>
                            {(t.targets || []).join(", ")}
                          </td>
                          <td className="px-4 py-3 text-text-primary hidden lg:table-cell">
                            <span className="max-w-[200px] truncate inline-block">
                              {t.message}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <input
                              type="checkbox"
                              className="accent-[#5a7dff] w-4 h-4 cursor-pointer"
                              checked={t.enabled}
                              onChange={(e) =>
                                handleToggle(t.name, e.target.checked)
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleShowEdit(t)}
                              >
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleTest(t.name)}
                              >
                                测试
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(t.name)}
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
            </>
          )}

          {/* Add Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Card variant="glass" padding="md">
              <h3 className="text-base font-semibold text-text-primary mb-4">
                添加定时任务
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="任务名称"
                  placeholder="任务名称"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="执行时间 (HH:mm)"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <div>
                  <label className="text-sm text-text-muted mb-1 block">
                    目标类型
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={pillClass(targetType === "group")}
                      onClick={() => setTargetType("group")}
                    >
                      群
                    </button>
                    <button
                      type="button"
                      className={pillClass(targetType === "private")}
                      onClick={() => setTargetType("private")}
                    >
                      好友
                    </button>
                  </div>
                </div>
                <Input
                  label={
                    targetType === "group"
                      ? "群号 (逗号分隔)"
                      : "QQ号 (逗号分隔)"
                  }
                  placeholder="123456,789012"
                  value={targets}
                  onChange={(e) => setTargets(e.target.value)}
                />
                <Input
                  label="消息内容"
                  placeholder="消息内容"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <label className="flex items-center gap-2 cursor-pointer self-end pb-2">
                  <input
                    type="checkbox"
                    className="accent-[#5a7dff] w-4 h-4"
                    checked={autoConnect}
                    onChange={(e) => setAutoConnect(e.target.checked)}
                  />
                  <span className="text-sm text-text-primary">
                    自动连接（到点自动启动 NapCat 并连接 Bot）
                  </span>
                </label>
              </div>
              <Button variant="primary" onClick={handleAdd}>
                添加任务
              </Button>
            </Card>
          </motion.div>
        </>
      )}

      {/* Edit Modal */}
      <SimpleModal
        isOpen={editTask !== null}
        onClose={() => setEditTask(null)}
        title="编辑定时任务"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setEditTask(null)}>
              取消
            </Button>
            <Button
              variant="primary"
              disabled={editSaving}
              onClick={handleEditSave}
            >
              {editSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <Input label="任务名称" value={editTask?.name || ""} disabled />
          <Input
            label="执行时间 (HH:mm)"
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
          />
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              目标类型
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={pillClass(editTargetType === "group")}
                onClick={() => setEditTargetType("group")}
              >
                群
              </button>
              <button
                type="button"
                className={pillClass(editTargetType === "private")}
                onClick={() => setEditTargetType("private")}
              >
                好友
              </button>
            </div>
          </div>
          <Input
            label={
              editTargetType === "group" ? "群号 (逗号分隔)" : "QQ号 (逗号分隔)"
            }
            placeholder="123456,789012"
            value={editTargets}
            onChange={(e) => setEditTargets(e.target.value)}
          />
          <Input
            label="消息内容"
            placeholder="消息内容"
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#5a7dff] w-4 h-4"
              checked={editAutoConnect}
              onChange={(e) => setEditAutoConnect(e.target.checked)}
            />
            <span className="text-sm text-text-primary">
              自动连接（到点自动启动 NapCat 并连接 Bot）
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#5a7dff] w-4 h-4"
              checked={editAutoStopAfterSend}
              onChange={(e) => setEditAutoStopAfterSend(e.target.checked)}
            />
            <span className="text-sm text-text-primary">
              发送完自动停止（发送完消息后自动停止 NapCat 并断开连接）
            </span>
          </label>
        </div>
      </SimpleModal>
    </PageContainer>
  );
}
