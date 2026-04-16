export interface BotInfo {
  name: string
  mode: string
  wsUrl: string
  httpUrl: string
  wsToken: string
  httpToken: string
  connected: boolean
  userId: number | null
  nickname: string | null
}

export interface BotListResponse {
  bots: BotInfo[]
  activeBot: string | null
}

export interface BotConfig {
  name: string
  mode: string
  wsUrl: string
  httpUrl: string
  wsToken: string
  httpToken: string
}

export interface FriendInfo {
  userId: number
  nickname: string
  remark: string
}

export interface GroupInfo {
  groupId: number
  groupName: string
  memberCount: number
  maxMemberCount: number
}

export interface GroupMember {
  userId: number
  nickname: string
  card: string
  role: string
  joinTime: number
  lastSentTime: number
  level: string
}

export interface ScheduleTask {
  name: string
  time: string
  targets: number[]
  targetType: 'group' | 'private'
  message: string
  enabled: boolean
}

export interface NapCatConfig {
  napCatDir: string
  workRoot: string
}

export interface NapCatInstance {
  name: string
  qqUin: string
  wsPort: number
  httpPort: number
  webuiPort: number
  workDir: string
  pid: number
  alive: boolean
  saved: boolean
}

export interface SavedNapCatInstance {
  name: string
  qqUin: string
  webuiPort: number
  running: boolean
}

export interface LogReadResponse {
  file: string
  lines: string[]
  total: number
  from: number
}

export interface LogFileInfo {
  name: string
  size: number
  modified: number
}

export interface ConsoleExecResponse {
  output: string
}

export interface DiscoverResponse {
  discovered: string[]
  created: number
  total: number
}
