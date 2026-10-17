export interface FriendInfo {
  userId: number;
  nickname: string;
  remark: string;
}

export interface GroupInfo {
  groupId: number;
  groupName: string;
  memberCount: number;
  maxMemberCount: number;
}

export interface GroupMember {
  userId: number;
  nickname: string;
  card: string;
  role: string;
  joinTime: number;
  lastSentTime: number;
  level: string;
}

export interface NapCatConfig {
  napCatDir: string;
  workRoot: string;
}

export interface SavedNapCatInstance {
  name: string;
  qqUin: string;
  webuiPort: number;
  running: boolean;
}

export interface NapCatLoginStatus {
  name: string;
  qqUin: string;
  state: "stopped" | "waiting" | "qr_ready" | "logged_in" | "error";
  message: string;
  qrImage: string;
  qrVersion: string;
  canRefresh: boolean;
}

export interface LogReadResponse {
  file: string;
  lines: string[];
  total: number;
  from: number;
}

export interface LogFileInfo {
  name: string;
  size: number;
  modified: number;
}

export interface ConsoleExecResponse {
  output: string;
}

export interface DiscoverResponse {
  discovered: string[];
  created: number;
  total: number;
}
