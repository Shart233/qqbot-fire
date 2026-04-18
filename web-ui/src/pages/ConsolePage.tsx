import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { listBots, execCommand } from "../api/endpoints";
import { PageContainer, PageHeader } from "../components/layout-new";
import { Button } from "../components/ui";

const MAX_OUTPUT_LENGTH = 100_000;
const INITIAL_OUTPUT = "QQBot-Fire Web 控制台\n输入 /help 查看命令列表\n";
const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

export default function ConsolePage() {
  const [output, setOutput] = useState<string>(INITIAL_OUTPUT);
  const [command, setCommand] = useState<string>("");
  const [prompt, setPrompt] = useState<string>(">");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useCommandHistory();

  // 从 listBots 推导提示符
  const updatePrompt = useCallback(async () => {
    try {
      const data = await listBots();
      const bots = data?.bots || [];
      if (bots.length === 0) {
        setPrompt(">");
        return;
      }
      const bot = bots[0];
      if (bot.connected && bot.userId) {
        setPrompt(`[${bot.name}:${bot.userId}] >`);
      } else {
        setPrompt(`[${bot.name}] >`);
      }
    } catch {
      setPrompt(">");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载首次刷新提示符
    void updatePrompt();
    inputRef.current?.focus();
  }, [updatePrompt]);

  // 输出变化时自动滚动到底部
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const appendOutput = useCallback((text: string) => {
    setOutput((prev) => {
      const next = prev + text;
      if (next.length > MAX_OUTPUT_LENGTH) {
        return next.slice(next.length - MAX_OUTPUT_LENGTH);
      }
      return next;
    });
  }, []);

  const handleExec = useCallback(async () => {
    const raw = command.trim();
    if (!raw) return;
    const cmd = raw.startsWith("/") ? raw : "/" + raw;
    history.push(cmd);
    appendOutput(`${prompt} ${cmd}\n`);
    setCommand("");
    try {
      const data = await execCommand(cmd);
      if (data && typeof data.output === "string") {
        appendOutput(data.output);
      }
    } catch (err) {
      appendOutput(`错误: ${(err as Error).message}\n`);
    }
    updatePrompt();
  }, [command, prompt, history, appendOutput, updatePrompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleExec();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const v = history.navigateUp();
        if (v !== null) setCommand(v);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const v = history.navigateDown();
        setCommand(v ?? "");
      }
    },
    [handleExec, history],
  );

  const handleClear = useCallback(() => {
    setOutput(INITIAL_OUTPUT);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="控制台"
        description="交互式命令行"
        actions={
          <Button size="sm" variant="ghost" onClick={handleClear}>
            清屏
          </Button>
        }
      />
      <div className="flex flex-col" style={{ height: "calc(100vh - 210px)" }}>
        <motion.div
          ref={outputRef}
          onClick={focusInput}
          className="flex-1 rounded-t-xl border border-white/10 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <pre className="font-mono text-[0.82rem] leading-relaxed p-3.5 m-0 whitespace-pre-wrap break-all text-emerald-300">
            {output}
          </pre>
        </motion.div>
        <motion.div
          className="flex items-center rounded-b-xl border border-t-0 border-white/10 bg-[rgba(0,0,0,0.35)] px-3.5 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
        >
          <span className="font-mono text-[0.82rem] text-[#a2bdff] mr-2 select-none whitespace-nowrap">
            {prompt}
          </span>
          <input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入命令，Enter 执行"
            className="flex-1 bg-transparent border-none outline-none font-mono text-[0.82rem] text-white placeholder:text-neutral-500"
          />
        </motion.div>
      </div>
    </PageContainer>
  );
}
