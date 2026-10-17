import { create } from "zustand";
import type { BotInfo } from "../api/types";

interface AppState {
  botContextVersion: number;
  botSwitchPending: boolean;
  cachedBots: BotInfo[];
  activeBotName: string | null;
  setCachedBots: (bots: BotInfo[], active: string | null) => void;

  operationLogs: string[];
  appendLog: (msg: string) => void;
  clearLogs: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  botContextVersion: 0,
  botSwitchPending: false,
  cachedBots: [],
  activeBotName: null,
  setCachedBots: (bots, active) =>
    set((state) => ({
      cachedBots: bots,
      activeBotName: state.botSwitchPending ? state.activeBotName : active,
    })),

  operationLogs: [],
  appendLog: (msg) =>
    set((state) => ({
      operationLogs: [
        ...state.operationLogs,
        `[${new Date().toLocaleTimeString()}] ${msg}`,
      ].slice(-500),
    })),
  clearLogs: () => set({ operationLogs: [] }),
}));
