import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useCommandHistory } from "../hooks/useCommandHistory";
import { listBots, execCommand } from "../api/endpoints";
import PageHeader from "../components/shared/PageHeader";

export default function ConsolePage() {
  const MAX_OUTPUT_LENGTH = 100_000;
  const [output, setOutput] = useState(
    "QQBot-Fire Web 控制台\n输入 /help 查看命令列表\n",
  );
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState(">");
  const { push, navigateUp, navigateDown } = useCommandHistory();
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [output]);

  const updatePrompt = useCallback(async () => {
    const data = await listBots();
    if (data && data.activeBot) {
      const bot = (data.bots || []).find((b) => b.name === data.activeBot);
      if (bot && bot.connected && bot.userId) {
        setPrompt(`[${bot.name}:${bot.userId}] >`);
      } else if (bot) {
        setPrompt(`[${bot.name}] >`);
      } else {
        setPrompt(">");
      }
    }
  }, []);

  useEffect(() => {
    updatePrompt(); // eslint-disable-line react-hooks/set-state-in-effect
    inputRef.current?.focus();
  }, [updatePrompt]);

  const handleExec = async () => {
    let command = input.trim();
    if (!command) return;

    // Auto-add / prefix if missing
    if (!command.startsWith("/")) command = "/" + command;

    setInput("");
    push(command);

    // Echo command
    setOutput((prev) => {
      const next = prev + "> " + command + "\n";
      return next.length > MAX_OUTPUT_LENGTH
        ? next.slice(-MAX_OUTPUT_LENGTH)
        : next;
    });

    // Execute
    const data = await execCommand(command);
    if (data && data.output) {
      setOutput((prev) => {
        const next =
          prev + data.output + (data.output.endsWith("\n") ? "" : "\n");
        return next.length > MAX_OUTPUT_LENGTH
          ? next.slice(-MAX_OUTPUT_LENGTH)
          : next;
      });
    }

    // Update prompt based on active bot
    updatePrompt();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleExec();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const cmd = navigateUp();
      if (cmd !== null) setInput(cmd);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const cmd = navigateDown();
      if (cmd !== null) setInput(cmd);
    }
  };

  const handleClear = () => {
    setOutput("QQBot-Fire Web 控制台\n输入 /help 查看命令列表\n");
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
      <PageHeader title="控制台">
        <button
          className="text-sm text-text-muted hover:text-text-primary cursor-pointer transition-colors"
          onClick={handleClear}
        >
          清屏
        </button>
      </PageHeader>

      {/* Terminal Output */}
      <motion.div
        ref={outputRef}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 bg-input-bg border border-border-theme rounded-t-2xl overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        <pre className="font-mono text-[0.82rem] leading-relaxed p-3.5 m-0 whitespace-pre-wrap break-all text-success">
          {output}
        </pre>
      </motion.div>

      {/* Terminal Input */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex items-center bg-input-bg border border-t-0 border-border-theme rounded-b-2xl px-3.5 py-2"
      >
        <span className="font-mono text-[0.82rem] text-accent mr-2 select-none whitespace-nowrap">
          {prompt}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none font-mono text-[0.82rem] text-text-primary placeholder:text-text-muted"
          placeholder="输入命令..."
          autoComplete="off"
          spellCheck={false}
        />
      </motion.div>
    </div>
  );
}
