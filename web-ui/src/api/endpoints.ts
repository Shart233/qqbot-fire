import { apiCall } from "./client";
import type {
  BotListResponse,
  BotInfo,
  BotConfig,
  FriendInfo,
  GroupInfo,
  GroupMember,
  ScheduleTask,
  NapCatConfig,
  NapCatInstance,
  LogReadResponse,
  LogFileInfo,
  ConsoleExecResponse,
  DiscoverResponse,
} from "./types";

const enc = encodeURIComponent;

// Bot CRUD
export const listBots = (opts?: { silent?: boolean }) =>
  apiCall<BotListResponse>("GET", "/api/bots", undefined, opts);
export const addBot = (name: string) =>
  apiCall<BotInfo>("POST", "/api/bots", { name });
export const deleteBot = (name: string) =>
  apiCall<{ deleted: string }>("DELETE", `/api/bots/${enc(name)}`);
export const renameBot = (name: string, newName: string) =>
  apiCall<BotInfo>("PUT", `/api/bots/${enc(name)}/rename`, { newName });
export const setActiveBot = (name: string) =>
  apiCall<{ activeBot: string }>("PUT", `/api/bots/${enc(name)}/active`);

// Config
export const getBotConfig = (name: string) =>
  apiCall<BotConfig>("GET", `/api/bots/${enc(name)}/config`);
export const updateBotConfig = (name: string, config: Partial<BotConfig>) =>
  apiCall<BotConfig>("PUT", `/api/bots/${enc(name)}/config`, config);
export const clearAllConfig = () =>
  apiCall<{ message: string }>("POST", "/api/config/clear");
export const clearBotConfig = (name: string) =>
  apiCall<BotConfig>("POST", `/api/bots/${enc(name)}/config/clear`);

// Connection
export const connectBot = (name: string) =>
  apiCall<BotInfo>("POST", `/api/bots/${enc(name)}/connect`);
export const disconnectBot = (name: string) =>
  apiCall<BotInfo>("POST", `/api/bots/${enc(name)}/disconnect`);
export const reconnectBot = (name: string) =>
  apiCall<BotInfo>("POST", `/api/bots/${enc(name)}/reconnect`);
export const connectAll = () =>
  apiCall<{ connected: number }>("POST", "/api/connect-all");
export const disconnectAll = () =>
  apiCall<{ disconnected: number }>("POST", "/api/disconnect-all");

// Status & Info
export const getFriends = (name: string) =>
  apiCall<FriendInfo[]>("GET", `/api/bots/${enc(name)}/friends`);
export const getGroups = (name: string) =>
  apiCall<GroupInfo[]>("GET", `/api/bots/${enc(name)}/groups`);
export const getGroupMembers = (name: string, groupId: number) =>
  apiCall<GroupMember[]>(
    "GET",
    `/api/bots/${enc(name)}/groups/${groupId}/members`,
  );

// Messages
export const sendMessage = (
  name: string,
  type: string,
  target: number,
  message: string,
) =>
  apiCall<{ messageId: number }>("POST", `/api/bots/${enc(name)}/send`, {
    type,
    target,
    message,
  });

// Schedules
export const listSchedules = (name: string) =>
  apiCall<ScheduleTask[]>("GET", `/api/bots/${enc(name)}/schedules`);
export const addSchedule = (
  name: string,
  task: {
    name: string;
    time: string;
    targets: number[];
    targetType: "group" | "private";
    message: string;
    autoConnect?: boolean;
    autoStopAfterSend?: boolean;
  },
) =>
  apiCall<{ message: string }>(
    "POST",
    `/api/bots/${enc(name)}/schedules`,
    task,
  );
export const deleteSchedule = (botName: string, taskName: string) =>
  apiCall<{ deleted: string }>(
    "DELETE",
    `/api/bots/${enc(botName)}/schedules/${enc(taskName)}`,
  );
export const toggleSchedule = (
  botName: string,
  taskName: string,
  enabled: boolean,
) =>
  apiCall<{ task: string; enabled: boolean }>(
    "PUT",
    `/api/bots/${enc(botName)}/schedules/${enc(taskName)}/toggle`,
    { enabled },
  );
export const testSchedule = (botName: string, taskName: string) =>
  apiCall<{ message: string }>(
    "POST",
    `/api/bots/${enc(botName)}/schedules/${enc(taskName)}/test`,
  );
export const updateSchedule = (
  botName: string,
  taskName: string,
  task: {
    time: string;
    targets: number[];
    targetType: "group" | "private";
    message: string;
    autoConnect?: boolean;
    autoStopAfterSend?: boolean;
  },
) =>
  apiCall<{ updated: string }>(
    "PUT",
    `/api/bots/${enc(botName)}/schedules/${enc(taskName)}`,
    task,
  );
export const toggleAutoConnect = (
  botName: string,
  taskName: string,
  autoConnect: boolean,
) =>
  apiCall<{ task: string; autoConnect: boolean }>(
    "PUT",
    `/api/bots/${enc(botName)}/schedules/${enc(taskName)}/autoconnect`,
    { autoConnect },
  );

// NapCat
export const getNapCatConfig = () =>
  apiCall<NapCatConfig>("GET", "/api/napcat/config");
export const setNapCatConfig = (config: Partial<NapCatConfig>) =>
  apiCall<{ message: string }>("PUT", "/api/napcat/config", config);
export const startNapCat = (name: string, qq?: string, webuiPort?: number) =>
  apiCall<{
    name: string;
    qq: string;
    wsPort: number;
    httpPort: number;
    webuiPort: number;
    webuiToken?: string;
    botName: string;
  }>("POST", "/api/napcat/start", {
    name,
    ...(qq ? { qq } : {}),
    ...(webuiPort ? { webuiPort } : {}),
  });
export const stopNapCat = (name: string) =>
  apiCall<{ stopped?: string; message?: string }>("POST", "/api/napcat/stop", {
    name,
  });
export const listNapCatInstances = (opts?: { silent?: boolean }) =>
  apiCall<NapCatInstance[]>("GET", "/api/napcat/instances", undefined, opts);
export const getNapCatLog = (name: string, opts?: { silent?: boolean }) =>
  apiCall<{ name: string; lines: string[] }>(
    "GET",
    `/api/napcat/instances/${enc(name)}/log`,
    undefined,
    opts,
  );
export const discoverNapCat = () =>
  apiCall<DiscoverResponse>("POST", "/api/napcat/discover");
export const forgetNapCat = (name: string) =>
  apiCall<{ forgotten: string | number }>("POST", "/api/napcat/forget", {
    name,
  });
export const updateSavedNapCat = (
  name: string,
  qqUin: string,
  webuiPort: number,
) =>
  apiCall<{ updated: string }>("PUT", "/api/napcat/saved", {
    name,
    qqUin,
    webuiPort,
  });

// Console
export const execCommand = (command: string) =>
  apiCall<ConsoleExecResponse>("POST", "/api/console/exec", { command });

// Server Logs
export const listLogFiles = (opts?: { silent?: boolean }) =>
  apiCall<LogFileInfo[]>("GET", "/api/logs/list", undefined, opts);
export const readLog = (
  file: string,
  lines: number,
  opts?: { silent?: boolean },
) =>
  apiCall<LogReadResponse>(
    "GET",
    `/api/logs/read?file=${enc(file)}&lines=${lines}`,
    undefined,
    opts,
  );
