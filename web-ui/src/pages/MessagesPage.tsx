import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../stores/app-store";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { listBots, sendMessage } from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button, Card, Input } from "../components/ui";
import BotSelect from "../components/shared/BotSelect";
import QQHistoryInput from "../components/shared/QQHistoryInput";

// 消息发送页面：群消息 / 私聊消息
export default function MessagesPage() {
  const { setCachedBots, appendLog } = useAppStore();
  const [bot, setBot] = useState("");
  const [msgType, setMsgType] = useLocalStorage("msgType", "group");
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    listBots().then((data) => {
      if (data) setCachedBots(data.bots || [], data.activeBot);
    });
  }, [setCachedBots]);

  const handleSend = async () => {
    if (!bot) {
      appendLog("[错误] 请选择 Bot");
      return;
    }
    const targetNum = parseInt(target, 10);
    if (!Number.isFinite(targetNum) || targetNum <= 0) {
      appendLog("[错误] 请输入有效的目标号码");
      return;
    }
    const trimmedMsg = message.trim();
    if (!trimmedMsg) {
      appendLog("[错误] 请输入消息内容");
      return;
    }

    setSending(true);
    const data = await sendMessage(bot, msgType, targetNum, trimmedMsg);
    setSending(false);

    if (data !== null) {
      appendLog(
        `[${bot}] ${msgType === "group" ? "群" : "私聊"}消息 -> ${target}: ${trimmedMsg}`,
      );
      appendLog("[成功] 消息已发送");
      setMessage("");
    }
  };

  // 未使用但按要求保留导入
  void Input;

  const pillBase =
    "h-9 px-4 rounded-md text-xs border transition-colors cursor-pointer";
  const pillActive =
    "bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.4)]";
  const pillIdle =
    "bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]";

  return (
    <PageContainer>
      <PageHeader title="消息发送" description="发送群消息或私聊消息" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        }}
      >
        <Card variant="glass" padding="lg" className="max-w-2xl">
          <div className="space-y-5">
            {/* Bot 选择 */}
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">
                选择 Bot
              </label>
              <BotSelect
                storageKey="select_msgBotSelect"
                connectedOnly
                value={bot}
                onChange={setBot}
              />
            </div>

            {/* 消息类型 */}
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">
                消息类型
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMsgType("group")}
                  className={`${pillBase} ${msgType === "group" ? pillActive : pillIdle}`}
                >
                  群消息
                </button>
                <button
                  type="button"
                  onClick={() => setMsgType("private")}
                  className={`${pillBase} ${msgType === "private" ? pillActive : pillIdle}`}
                >
                  私聊消息
                </button>
              </div>
            </div>

            {/* 目标 */}
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">
                目标{" "}
                <span className="text-neutral-500">
                  {msgType === "group" ? "(群号)" : "(QQ号)"}
                </span>
              </label>
              <QQHistoryInput
                storageKey="msgTarget"
                placeholder={msgType === "group" ? "群号" : "QQ号"}
                value={target}
                onChange={setTarget}
              />
            </div>

            {/* 消息内容 */}
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">
                消息内容
              </label>
              <textarea
                className="w-full min-h-[88px] rounded-lg border border-white/10 bg-[rgba(0,0,0,0.25)] px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[#5a7dff] focus:outline-none resize-y transition"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入消息内容..."
              />
            </div>

            <Button variant="primary" loading={sending} onClick={handleSend}>
              发送消息
            </Button>
          </div>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
