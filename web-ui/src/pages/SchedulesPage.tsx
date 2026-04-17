import { useState, useEffect, useCallback } from "react";
import { Button, Switch, Spinner, Table } from "@heroui/react";
import { toast } from "@heroui/react";
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
import PageHeader from "../components/shared/PageHeader";
import BotSelect from "../components/shared/BotSelect";
import EmptyState from "../components/shared/EmptyState";
import SimpleModal from "../components/shared/SimpleModal";
import type { ScheduleTask } from "../api/types";

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
      toast.danger("请选择 Bot");
      return;
    }
    if (!name.trim() || !time || !targets.trim() || !message.trim()) {
      toast.danger("请填写所有字段");
      return;
    }
    const targetNums = targets
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (targetNums.length === 0) {
      toast.danger("目标格式错误");
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
      toast.success("任务已添加");
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
      toast.danger("目标格式错误");
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
      toast.success("任务已更新");
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
      toast.danger("切换失败");
      loadScheduleList();
    }
  };

  const handleTest = async (taskName: string) => {
    const data = await testSchedule(bot, taskName);
    if (data !== null) {
      toast.success("已触发测试");
      appendLog(`测试定时任务: ${taskName}`);
    }
  };

  const handleDelete = async (taskName: string) => {
    const data = await deleteSchedule(bot, taskName);
    if (data !== null) {
      toast.success("已删除");
      appendLog(`删除定时任务: ${taskName}`);
      loadScheduleList();
    }
  };

  return (
    <div>
      <PageHeader title="定时任务">
        <BotSelect
          storageKey="select_scheduleBotSelect"
          value={bot}
          onChange={setBot}
        />
      </PageHeader>

      {!bot ? (
        <EmptyState message="请选择 Bot" />
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <>
          {/* Schedule Table */}
          {schedules.length === 0 ? (
            <EmptyState message="暂无定时任务" />
          ) : (
            <div className="mb-6">
              <Table>
                <Table.Content aria-label="定时任务列表">
                  <Table.Header>
                    <Table.Column isRowHeader>任务名</Table.Column>
                    <Table.Column>时间</Table.Column>
                    <Table.Column>目标</Table.Column>
                    <Table.Column>消息</Table.Column>
                    <Table.Column>启用</Table.Column>
                    <Table.Column>操作</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {schedules.map((t) => (
                      <Table.Row key={t.name} id={t.name}>
                        <Table.Cell>{t.name}</Table.Cell>
                        <Table.Cell>{t.time}</Table.Cell>
                        <Table.Cell>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-md mr-1.5 bg-opacity-20 font-medium"
                            style={{
                              background:
                                t.targetType === "group"
                                  ? "rgba(59,130,246,0.15)"
                                  : "rgba(168,85,247,0.15)",
                              color:
                                t.targetType === "group"
                                  ? "#3b82f6"
                                  : "#a855f7",
                            }}
                          >
                            {t.targetType === "group" ? "群" : "好友"}
                          </span>
                          {(t.targets || []).join(", ")}
                        </Table.Cell>
                        <Table.Cell>
                          <span className="max-w-[200px] truncate inline-block">
                            {t.message}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Switch
                            size="sm"
                            isSelected={t.enabled}
                            onChange={(val: boolean) =>
                              handleToggle(t.name, val)
                            }
                          >
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                          </Switch>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-primary"
                              onPress={() => handleShowEdit(t)}
                            >
                              编辑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-warning"
                              onPress={() => handleTest(t.name)}
                            >
                              测试
                            </Button>
                            <Button
                              size="sm"
                              variant="danger-soft"
                              onPress={() => handleDelete(t.name)}
                            >
                              删除
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            </div>
          )}

          {/* Add Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-2xl p-5"
          >
            <h3 className="text-base font-semibold text-text-primary mb-4">
              添加定时任务
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-text-muted mb-1 block">
                  任务名称
                </label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder="任务名称"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">
                  执行时间 (HH:mm)
                </label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">
                  目标类型
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                      targetType === "group"
                        ? "bg-accent text-white border-accent"
                        : "bg-input-bg text-text-muted border-border-theme hover:border-accent"
                    }`}
                    onClick={() => setTargetType("group")}
                  >
                    群
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                      targetType === "private"
                        ? "bg-accent text-white border-accent"
                        : "bg-input-bg text-text-muted border-border-theme hover:border-accent"
                    }`}
                    onClick={() => setTargetType("private")}
                  >
                    好友
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">
                  {targetType === "group"
                    ? "群号 (逗号分隔)"
                    : "QQ号 (逗号分隔)"}
                </label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder={
                    targetType === "group" ? "123456,789012" : "123456,789012"
                  }
                  value={targets}
                  onChange={(e) => setTargets(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-text-muted mb-1 block">
                  消息内容
                </label>
                <input
                  className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
                  placeholder="消息内容"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  size="md"
                  isSelected={autoConnect}
                  onChange={(val: boolean) => setAutoConnect(val)}
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
                <label className="text-sm text-text-primary">
                  自动连接（到点自动启动 NapCat 并连接 Bot）
                </label>
              </div>
            </div>
            <Button variant="primary" onPress={handleAdd}>
              添加任务
            </Button>
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
            <Button variant="ghost" onPress={() => setEditTask(null)}>
              取消
            </Button>
            <Button
              variant="primary"
              isDisabled={editSaving}
              onPress={handleEditSave}
            >
              {editSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              任务名称
            </label>
            <input
              className="bg-input-bg border border-border-theme text-text-muted rounded-xl px-3 py-2 text-sm outline-none w-full cursor-not-allowed"
              value={editTask?.name || ""}
              disabled
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              执行时间 (HH:mm)
            </label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              目标类型
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                  editTargetType === "group"
                    ? "bg-accent text-white border-accent"
                    : "bg-input-bg text-text-muted border-border-theme hover:border-accent"
                }`}
                onClick={() => setEditTargetType("group")}
              >
                群
              </button>
              <button
                type="button"
                className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                  editTargetType === "private"
                    ? "bg-accent text-white border-accent"
                    : "bg-input-bg text-text-muted border-border-theme hover:border-accent"
                }`}
                onClick={() => setEditTargetType("private")}
              >
                好友
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              {editTargetType === "group"
                ? "群号 (逗号分隔)"
                : "QQ号 (逗号分隔)"}
            </label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              placeholder="123456,789012"
              value={editTargets}
              onChange={(e) => setEditTargets(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">
              消息内容
            </label>
            <input
              className="bg-input-bg border border-border-theme text-text-primary rounded-xl px-3 py-2 text-sm outline-none focus:border-accent transition-colors w-full"
              placeholder="消息内容"
              value={editMessage}
              onChange={(e) => setEditMessage(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              size="md"
              isSelected={editAutoConnect}
              onChange={(val: boolean) => setEditAutoConnect(val)}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
            <label className="text-sm text-text-primary">
              自动连接（到点自动启动 NapCat 并连接 Bot）
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              size="md"
              isSelected={editAutoStopAfterSend}
              onChange={(val: boolean) => setEditAutoStopAfterSend(val)}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
            <label className="text-sm text-text-primary">
              发送完自动停止（发送完消息后自动停止 NapCat 并断开连接）
            </label>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
