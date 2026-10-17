// 由 Java 协议模型生成，字段保持 OneBot 原名。
export type MessageSegment = { type: string; data: Record<string, unknown> };
export interface FriendInfo {
  user_id: number;
  nickname: string | null;
  remark: string | null;
  sex: string | null;
  level: number;
  age: number;
  qid: string | null;
}
export interface GroupInfo {
  group_id: number;
  group_name: string | null;
  group_remark: string | null;
  member_count: number;
  max_member_count: number;
  group_all_shut: boolean;
}
export interface GroupMember {
  group_id: number;
  user_id: number;
  nickname: string | null;
  card: string | null;
  sex: string | null;
  age: number;
  area: string | null;
  join_time: number;
  last_sent_time: number;
  level: string | null;
  qq_level: number;
  role: string | null;
  title: string | null;
  shut_up_timestamp: number;
  is_robot: boolean;
}
export interface LoginInfo {
  user_id: number;
  nickname: string | null;
}
export interface MessageData {
  time: number;
  message_id: number;
  message_seq: number;
  real_id: number;
  user_id: number;
  group_id: number;
  message_type: string | null;
  sender: Sender | null;
  message: Record<string, unknown>[] | null;
  raw_message: string | null;
  font: number;
  sub_type: string | null;
  group_name: string | null;
}
export interface Sender {
  user_id: number;
  nickname: string | null;
  card: string | null;
  role: string | null;
  sex: string | null;
  age: number;
  area: string | null;
  level: string | null;
  title: string | null;
}
export interface StrangerInfo {
  user_id: number;
  nickname: string | null;
  sex: string | null;
  age: number;
  qid: string | null;
  level: number;
  login_days: number;
}
export interface VersionInfo {
  app_name: string | null;
  app_version: string | null;
  protocol_version: string | null;
}
