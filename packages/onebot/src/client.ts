// 由 scripts/migration/generate-onebot-client.py 生成；修改后运行客户端兼容测试。
import { normalizeModel, asMap, responseId } from "./normalize.js";
import { safeId, type Transport } from "./index.js";
import type {
  FriendInfo,
  GroupInfo,
  GroupMember,
  LoginInfo,
  MessageData,
  MessageSegment,
  StrangerInfo,
  VersionInfo,
} from "./models.js";
function segments(input: MessageSegment[] | string) {
  return typeof input === "string"
    ? [{ type: "text", data: { text: input } }]
    : input;
}
function validateNumbers(input: unknown): void {
  if (typeof input === "number" && !Number.isSafeInteger(input))
    throw new Error("参数必须为安全整数");
  if (Array.isArray(input)) for (const value of input) validateNumbers(value);
  else if (input && typeof input === "object")
    for (const value of Object.values(input)) validateNumbers(value);
}
export class OneBotClient {
  constructor(readonly provider: Transport) {}
  getProvider() {
    return this.provider;
  }
  private async invoke<T>(
    action: string,
    params: Record<string, unknown>,
    raw = false,
  ): Promise<T> {
    validateNumbers(params);
    const data = await this.provider.call<unknown>(action, params);
    return (raw ? data : asMap(data)) as T;
  }
  callApi(action: string, params: Record<string, unknown> = {}) {
    return this.invoke<Record<string, unknown>>(action, params);
  }
  callApiRaw(action: string, params: Record<string, unknown> = {}) {
    return this.invoke<unknown>(action, params, true);
  }
  async getLoginInfo(): Promise<LoginInfo> {
    const params = {};
    return normalizeModel<LoginInfo>(
      "LoginInfo",
      await this.invoke<LoginInfo>("get_login_info", params),
    );
  }
  async getVersionInfo(): Promise<VersionInfo> {
    const params = {};
    return normalizeModel<VersionInfo>(
      "VersionInfo",
      await this.invoke<VersionInfo>("get_version_info", params),
    );
  }
  async getStatus(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("get_status", params);
  }
  async canSendImage(): Promise<boolean> {
    const params = {};
    try {
      const data = await this.invoke<Record<string, unknown>>(
        "can_send_image",
        params,
      );
      return data.yes === true;
    } catch {
      return false;
    }
  }
  async canSendRecord(): Promise<boolean> {
    const params = {};
    try {
      const data = await this.invoke<Record<string, unknown>>(
        "can_send_record",
        params,
      );
      return data.yes === true;
    } catch {
      return false;
    }
  }
  async cleanCache(): Promise<void> {
    const params = {};
    await this.invoke<unknown>("clean_cache", params);
  }
  async sendPrivateMsg(
    userId: number,
    message: MessageSegment[] | string,
  ): Promise<number> {
    const params: Record<string, unknown> = {};
    params["user_id"] = String(safeId(userId));
    params["message"] = segments(message);
    const data = await this.invoke<Record<string, unknown>>(
      "send_private_msg",
      params,
    );
    return responseId(data.message_id);
  }
  async sendGroupMsg(
    groupId: number,
    message: MessageSegment[] | string,
  ): Promise<number> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["message"] = segments(message);
    const data = await this.invoke<Record<string, unknown>>(
      "send_group_msg",
      params,
    );
    return responseId(data.message_id);
  }
  async sendMsg(
    messageType: string | null | undefined,
    userId: number | null | undefined,
    groupId: number | null | undefined,
    message: MessageSegment[],
  ): Promise<number> {
    const params: Record<string, unknown> = {};
    if (messageType != null) params["message_type"] = messageType;
    if (userId != null) params["user_id"] = String(safeId(userId));
    if (groupId != null) params["group_id"] = String(safeId(groupId));
    params["message"] = segments(message);
    const data = await this.invoke<Record<string, unknown>>("send_msg", params);
    return responseId(data.message_id);
  }
  async deleteMsg(messageId: number): Promise<void> {
    const params = { message_id: messageId };
    await this.invoke<unknown>("delete_msg", params);
  }
  async getMsg(messageId: number): Promise<MessageData> {
    const params = { message_id: messageId };
    return normalizeModel<MessageData>(
      "MessageData",
      await this.invoke<MessageData>("get_msg", params),
    );
  }
  async markMsgAsRead(messageId: number): Promise<void> {
    const params = { message_id: messageId };
    await this.invoke<unknown>("mark_msg_as_read", params);
  }
  async markAllAsRead(): Promise<void> {
    const params = {};
    await this.invoke<unknown>("_mark_all_as_read", params);
  }
  async getGroupMsgHistory(
    groupId: number,
    count: number,
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["count"] = count;
    const data = await this.invoke<Record<string, unknown>>(
      "get_group_msg_history",
      params,
    );
    return Array.isArray(data.messages)
      ? (data.messages as Record<string, unknown>[])
      : [];
  }
  async sendGroupForwardMsg(
    groupId: number,
    nodes: MessageSegment[],
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["message"] = segments(nodes);
    await this.invoke<unknown>("send_group_forward_msg", params);
  }
  async sendPrivateForwardMsg(
    userId: number,
    nodes: MessageSegment[],
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["user_id"] = String(safeId(userId));
    params["message"] = segments(nodes);
    await this.invoke<unknown>("send_private_forward_msg", params);
  }
  async getFriendList(): Promise<(FriendInfo | null)[]> {
    const params = {};
    const data = await this.invoke<FriendInfo[]>(
      "get_friend_list",
      params,
      true,
    );
    return Array.isArray(data)
      ? data.map((item) => normalizeModel<FriendInfo>("FriendInfo", item))
      : [];
  }
  async getStrangerInfo(userId: number): Promise<StrangerInfo> {
    const params = { user_id: String(safeId(userId)) };
    return normalizeModel<StrangerInfo>(
      "StrangerInfo",
      await this.invoke<StrangerInfo>("get_stranger_info", params),
    );
  }
  async setFriendAddRequest(
    flag: string,
    approve: boolean,
    remark: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["flag"] = flag;
    params["approve"] = approve;
    if (remark != null) params["remark"] = remark;
    await this.invoke<unknown>("set_friend_add_request", params);
  }
  async setFriendRemark(userId: number, remark: string): Promise<void> {
    const params = { user_id: String(safeId(userId)), remark: remark };
    await this.invoke<unknown>("set_friend_remark", params);
  }
  async getGroupList(): Promise<(GroupInfo | null)[]> {
    const params = {};
    const data = await this.invoke<GroupInfo[]>("get_group_list", params, true);
    return Array.isArray(data)
      ? data.map((item) => normalizeModel<GroupInfo>("GroupInfo", item))
      : [];
  }
  async getGroupInfo(groupId: number): Promise<GroupInfo> {
    const params = { group_id: String(safeId(groupId)) };
    return normalizeModel<GroupInfo>(
      "GroupInfo",
      await this.invoke<GroupInfo>("get_group_info", params),
    );
  }
  async getGroupMemberList(groupId: number): Promise<(GroupMember | null)[]> {
    const params = { group_id: String(safeId(groupId)) };
    const data = await this.invoke<GroupMember[]>(
      "get_group_member_list",
      params,
      true,
    );
    return Array.isArray(data)
      ? data.map((item) => normalizeModel<GroupMember>("GroupMember", item))
      : [];
  }
  async getGroupMemberInfo(
    groupId: number,
    userId: number,
  ): Promise<GroupMember> {
    const params = {
      group_id: String(safeId(groupId)),
      user_id: String(safeId(userId)),
    };
    return normalizeModel<GroupMember>(
      "GroupMember",
      await this.invoke<GroupMember>("get_group_member_info", params),
    );
  }
  async setGroupName(groupId: number, groupName: string): Promise<void> {
    const params = { group_id: String(safeId(groupId)), group_name: groupName };
    await this.invoke<unknown>("set_group_name", params);
  }
  async setGroupCard(
    groupId: number,
    userId: number,
    card: string,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      user_id: String(safeId(userId)),
      card: card,
    };
    await this.invoke<unknown>("set_group_card", params);
  }
  async setGroupKick(
    groupId: number,
    userId: number,
    rejectAddRequest: boolean,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["user_id"] = String(safeId(userId));
    params["reject_add_request"] = rejectAddRequest;
    await this.invoke<unknown>("set_group_kick", params);
  }
  async setGroupBan(
    groupId: number,
    userId: number,
    duration: number,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      user_id: String(safeId(userId)),
      duration: duration,
    };
    await this.invoke<unknown>("set_group_ban", params);
  }
  async setGroupWholeBan(groupId: number, enable: boolean): Promise<void> {
    const params = { group_id: String(safeId(groupId)), enable: enable };
    await this.invoke<unknown>("set_group_whole_ban", params);
  }
  async setGroupAdmin(
    groupId: number,
    userId: number,
    enable: boolean,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      user_id: String(safeId(userId)),
      enable: enable,
    };
    await this.invoke<unknown>("set_group_admin", params);
  }
  async setGroupLeave(groupId: number, isDismiss: boolean): Promise<void> {
    const params = { group_id: String(safeId(groupId)), is_dismiss: isDismiss };
    await this.invoke<unknown>("set_group_leave", params);
  }
  async setGroupAddRequest(
    flag: string,
    approve: boolean,
    reason: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["flag"] = flag;
    params["approve"] = approve;
    if (reason != null) params["reason"] = reason;
    await this.invoke<unknown>("set_group_add_request", params);
  }
  async groupPoke(groupId: number, userId: number): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      user_id: String(safeId(userId)),
    };
    await this.invoke<unknown>("group_poke", params);
  }
  async friendPoke(userId: number): Promise<void> {
    const params = { user_id: String(safeId(userId)) };
    await this.invoke<unknown>("friend_poke", params);
  }
  async uploadGroupFile(
    groupId: number,
    file: string,
    name: string,
    folderId: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["file"] = file;
    params["name"] = name;
    if (folderId != null) params["folder_id"] = folderId;
    await this.invoke<unknown>("upload_group_file", params);
  }
  async setSelfLongnick(longNick: string): Promise<void> {
    const params = { longNick: longNick };
    await this.invoke<unknown>("set_self_longnick", params);
  }
  async ocrImage(image: string): Promise<Record<string, unknown>> {
    const params = { image: image };
    return this.invoke<Record<string, unknown>>("ocr_image", params);
  }
  async setMsgEmojiLike(
    messageId: number,
    emojiId: string,
    set: boolean,
  ): Promise<void> {
    const params = { message_id: messageId, emoji_id: emojiId, set: set };
    await this.invoke<unknown>("set_msg_emoji_like", params);
  }
  async fetchEmojiLike(
    messageId: number,
    emojiId: string,
    emojiType: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["message_id"] = messageId;
    params["emoji_id"] = emojiId;
    if (emojiType != null) params["emoji_type"] = emojiType;
    return this.invoke<Record<string, unknown>>("fetch_emoji_like", params);
  }
  async getEmojiLikes(messageId: number): Promise<Record<string, unknown>> {
    const params = { message_id: messageId };
    return this.invoke<Record<string, unknown>>("get_emoji_likes", params);
  }
  async sendLike(userId: number, times: number): Promise<void> {
    const params = { user_id: String(safeId(userId)), times: times };
    await this.invoke<unknown>("send_like", params);
  }
  async getForwardMsg(id: string): Promise<Record<string, unknown>> {
    const params = { id: id };
    return this.invoke<Record<string, unknown>>("get_forward_msg", params);
  }
  async getImage(file: string): Promise<Record<string, unknown>> {
    const params = { file: file };
    return this.invoke<Record<string, unknown>>("get_image", params);
  }
  async getRecord(
    file: string,
    outFormat: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["file"] = file;
    if (outFormat != null) params["out_format"] = outFormat;
    return this.invoke<Record<string, unknown>>("get_record", params);
  }
  async getGroupHonorInfo(
    groupId: number,
    type: string,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)), type: type };
    return this.invoke<Record<string, unknown>>("get_group_honor_info", params);
  }
  async setGroupSpecialTitle(
    groupId: number,
    userId: number,
    specialTitle: string | null | undefined,
    duration: number,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["user_id"] = String(safeId(userId));
    params["special_title"] = specialTitle != null ? specialTitle : "";
    params["duration"] = duration;
    await this.invoke<unknown>("set_group_special_title", params);
  }
  async setGroupAnonymous(groupId: number, enable: boolean): Promise<void> {
    const params = { group_id: String(safeId(groupId)), enable: enable };
    await this.invoke<unknown>("set_group_anonymous", params);
  }
  async setGroupAnonymousBan(
    groupId: number,
    anonymous: unknown | null | undefined,
    flag: string | null | undefined,
    duration: number,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    if (anonymous != null) params["anonymous"] = anonymous;
    if (flag != null) params["flag"] = flag;
    params["duration"] = duration;
    await this.invoke<unknown>("set_group_anonymous_ban", params);
  }
  async setRestart(delay: number): Promise<void> {
    const params = { delay: delay };
    await this.invoke<unknown>("set_restart", params);
  }
  async getCookies(
    domain: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (domain != null) params["domain"] = domain;
    return this.invoke<Record<string, unknown>>("get_cookies", params);
  }
  async getCsrfToken(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("get_csrf_token", params);
  }
  async getCredentials(
    domain: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (domain != null) params["domain"] = domain;
    return this.invoke<Record<string, unknown>>("get_credentials", params);
  }
  async getFriendMsgHistory(
    userId: number,
    count: number,
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, unknown> = {};
    params["user_id"] = String(safeId(userId));
    params["count"] = count;
    const data = await this.invoke<Record<string, unknown>>(
      "get_friend_msg_history",
      params,
    );
    return Array.isArray(data.messages)
      ? (data.messages as Record<string, unknown>[])
      : [];
  }
  async sendForwardMsg(nodes: MessageSegment[]): Promise<void> {
    const params = { message: segments(nodes) };
    await this.invoke<unknown>("send_forward_msg", params);
  }
  async forwardFriendSingleMsg(
    userId: number,
    messageId: number,
  ): Promise<void> {
    const params = { user_id: String(safeId(userId)), message_id: messageId };
    await this.invoke<unknown>("forward_friend_single_msg", params);
  }
  async forwardGroupSingleMsg(
    groupId: number,
    messageId: number,
  ): Promise<void> {
    const params = { group_id: String(safeId(groupId)), message_id: messageId };
    await this.invoke<unknown>("forward_group_single_msg", params);
  }
  async markGroupMsgAsRead(groupId: number): Promise<void> {
    const params = { group_id: String(safeId(groupId)) };
    await this.invoke<unknown>("mark_group_msg_as_read", params);
  }
  async markPrivateMsgAsRead(userId: number): Promise<void> {
    const params = { user_id: String(safeId(userId)) };
    await this.invoke<unknown>("mark_private_msg_as_read", params);
  }
  async getFriendsWithCategory(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_friends_with_category",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getUnidirectionalFriendList(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_unidirectional_friend_list",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async deleteFriend(userId: number): Promise<void> {
    const params = { user_id: String(safeId(userId)) };
    await this.invoke<unknown>("delete_friend", params);
  }
  async getRecentContact(count: number): Promise<Record<string, unknown>[]> {
    const params = { count: count };
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_recent_contact",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getProfileLike(userId: number): Promise<Record<string, unknown>> {
    const params = { user_id: String(safeId(userId)) };
    return this.invoke<Record<string, unknown>>("get_profile_like", params);
  }
  async ncGetUserStatus(userId: number): Promise<Record<string, unknown>> {
    const params = { user_id: String(safeId(userId)) };
    return this.invoke<Record<string, unknown>>("nc_get_user_status", params);
  }
  async getDoubtFriendsAddRequest(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>(
      "get_doubt_friends_add_request",
      params,
    );
  }
  async setDoubtFriendsAddRequest(
    flag: string,
    approve: boolean,
    remark: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["flag"] = flag;
    params["approve"] = approve;
    if (remark != null) params["remark"] = remark;
    await this.invoke<unknown>("set_doubt_friends_add_request", params);
  }
  async getGroupDetailInfo(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>(
      "get_group_detail_info",
      params,
    );
  }
  async getGroupInfoEx(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>("get_group_info_ex", params);
  }
  async setGroupKickMembers(
    groupId: number,
    userIds: string[],
    rejectAddRequest: boolean,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["user_id"] = userIds;
    params["reject_add_request"] = rejectAddRequest;
    await this.invoke<unknown>("set_group_kick_members", params);
  }
  async setGroupPortrait(groupId: number, file: string): Promise<void> {
    const params = { group_id: String(safeId(groupId)), file: file };
    await this.invoke<unknown>("set_group_portrait", params);
  }
  async setGroupRemark(groupId: number, remark: string): Promise<void> {
    const params = { group_id: String(safeId(groupId)), remark: remark };
    await this.invoke<unknown>("set_group_remark", params);
  }
  async sendGroupSign(groupId: number): Promise<void> {
    const params = { group_id: String(safeId(groupId)) };
    await this.invoke<unknown>("send_group_sign", params);
  }
  async setGroupSign(groupId: number): Promise<void> {
    const params = { group_id: String(safeId(groupId)) };
    await this.invoke<unknown>("set_group_sign", params);
  }
  async getGroupShutList(groupId: number): Promise<Record<string, unknown>[]> {
    const params = { group_id: String(safeId(groupId)) };
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_group_shut_list",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getGroupAtAllRemain(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>(
      "get_group_at_all_remain",
      params,
    );
  }
  async setGroupTodo(groupId: number, messageId: number): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      message_id: String(safeId(messageId)),
    };
    await this.invoke<unknown>("set_group_todo", params);
  }
  async getGroupIgnoredNotifies(
    groupId: number,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>(
      "get_group_ignored_notifies",
      params,
    );
  }
  async getGroupIgnoreAddRequest(
    groupId: number,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>(
      "get_group_ignore_add_request",
      params,
    );
  }
  async setGroupAddOption(groupId: number, addOption: number): Promise<void> {
    const params = { group_id: String(safeId(groupId)), add_option: addOption };
    await this.invoke<unknown>("set_group_add_option", params);
  }
  async setGroupRobotAddOption(
    groupId: number,
    addOption: number,
  ): Promise<void> {
    const params = { group_id: String(safeId(groupId)), add_option: addOption };
    await this.invoke<unknown>("set_group_robot_add_option", params);
  }
  async setGroupSearch(groupId: number, enable: boolean): Promise<void> {
    const params = { group_id: String(safeId(groupId)), enable: enable };
    await this.invoke<unknown>("set_group_search", params);
  }
  async getGroupSystemMsg(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("get_group_system_msg", params);
  }
  async getGroupNotice(groupId: number): Promise<Record<string, unknown>[]> {
    const params = { group_id: String(safeId(groupId)) };
    const data = await this.invoke<Record<string, unknown>[]>(
      "_get_group_notice",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async sendGroupNotice(
    groupId: number,
    content: string,
    image: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["content"] = content;
    if (image != null) params["image"] = image;
    await this.invoke<unknown>("_send_group_notice", params);
  }
  async delGroupNotice(groupId: number, noticeId: string): Promise<void> {
    const params = { group_id: String(safeId(groupId)), notice_id: noticeId };
    await this.invoke<unknown>("_del_group_notice", params);
  }
  async getEssenceMsgList(groupId: number): Promise<Record<string, unknown>[]> {
    const params = { group_id: String(safeId(groupId)) };
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_essence_msg_list",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async setEssenceMsg(messageId: number): Promise<void> {
    const params = { message_id: messageId };
    await this.invoke<unknown>("set_essence_msg", params);
  }
  async deleteEssenceMsg(messageId: number): Promise<void> {
    const params = { message_id: messageId };
    await this.invoke<unknown>("delete_essence_msg", params);
  }
  async uploadPrivateFile(
    userId: number,
    file: string,
    name: string,
  ): Promise<void> {
    const params = { user_id: String(safeId(userId)), file: file, name: name };
    await this.invoke<unknown>("upload_private_file", params);
  }
  async getGroupFileSystemInfo(
    groupId: number,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>(
      "get_group_file_system_info",
      params,
    );
  }
  async getGroupRootFiles(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)) };
    return this.invoke<Record<string, unknown>>("get_group_root_files", params);
  }
  async getGroupFilesByFolder(
    groupId: number,
    folderId: string,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: String(safeId(groupId)), folder_id: folderId };
    return this.invoke<Record<string, unknown>>(
      "get_group_files_by_folder",
      params,
    );
  }
  async getGroupFileUrl(
    groupId: number,
    fileId: string,
    busid: number,
  ): Promise<Record<string, unknown>> {
    const params = {
      group_id: String(safeId(groupId)),
      file_id: fileId,
      busid: busid,
    };
    return this.invoke<Record<string, unknown>>("get_group_file_url", params);
  }
  async createGroupFileFolder(
    groupId: number,
    name: string,
    parentId: string | null | undefined,
  ): Promise<void> {
    const params: Record<string, unknown> = {};
    params["group_id"] = String(safeId(groupId));
    params["name"] = name;
    if (parentId != null) params["parent_id"] = parentId;
    await this.invoke<unknown>("create_group_file_folder", params);
  }
  async deleteGroupFile(
    groupId: number,
    fileId: string,
    busid: number,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      file_id: fileId,
      busid: busid,
    };
    await this.invoke<unknown>("delete_group_file", params);
  }
  async deleteGroupFolder(groupId: number, folderId: string): Promise<void> {
    const params = { group_id: String(safeId(groupId)), folder_id: folderId };
    await this.invoke<unknown>("delete_group_folder", params);
  }
  async renameGroupFile(
    groupId: number,
    fileId: string,
    busid: number,
    newName: string,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      file_id: fileId,
      busid: busid,
      new_name: newName,
    };
    await this.invoke<unknown>("rename_group_file", params);
  }
  async moveGroupFile(
    groupId: number,
    fileId: string,
    busid: number,
    parentId: string,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      file_id: fileId,
      busid: busid,
      parent_id: parentId,
    };
    await this.invoke<unknown>("move_group_file", params);
  }
  async transGroupFile(
    groupId: number,
    fileId: string,
    busid: number,
  ): Promise<void> {
    const params = {
      group_id: String(safeId(groupId)),
      file_id: fileId,
      busid: busid,
    };
    await this.invoke<unknown>("trans_group_file", params);
  }
  async getPrivateFileUrl(
    userId: number,
    fileId: string,
  ): Promise<Record<string, unknown>> {
    const params = { user_id: String(safeId(userId)), file_id: fileId };
    return this.invoke<Record<string, unknown>>("get_private_file_url", params);
  }
  async downloadFile(
    url: string | null | undefined,
    base64: string | null | undefined,
    threadCount: number,
    headers: Record<string, string> | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (url != null) params["url"] = url;
    if (base64 != null) params["base64"] = base64;
    params["thread_count"] = threadCount;
    if (headers != null) params["headers"] = headers;
    return this.invoke<Record<string, unknown>>("download_file", params);
  }
  async getFile(fileId: string): Promise<Record<string, unknown>> {
    const params = { file_id: fileId };
    return this.invoke<Record<string, unknown>>("get_file", params);
  }
  async getQunAlbumList(
    groupId: number,
    attachInfo: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    if (attachInfo != null) params["attach_info"] = attachInfo;
    return this.invoke<Record<string, unknown>>("get_qun_album_list", params);
  }
  async getGroupAlbumMediaList(
    groupId: number,
    albumId: string,
    attachInfo: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    params["album_id"] = albumId;
    if (attachInfo != null) params["attach_info"] = attachInfo;
    return this.invoke<Record<string, unknown>>(
      "get_group_album_media_list",
      params,
    );
  }
  async uploadImageToQunAlbum(
    groupId: number,
    albumId: string,
    albumName: string,
    file: string,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    params["album_id"] = albumId;
    params["album_name"] = albumName;
    params["file"] = file;
    return this.invoke<Record<string, unknown>>(
      "upload_image_to_qun_album",
      params,
    );
  }
  async delGroupAlbumMedia(
    groupId: number,
    albumId: string,
    lloc: string,
  ): Promise<Record<string, unknown>> {
    const params = { group_id: groupId, album_id: albumId, lloc: lloc };
    return this.invoke<Record<string, unknown>>(
      "del_group_album_media",
      params,
    );
  }
  async setGroupAlbumMediaLike(
    groupId: number,
    albumId: string,
    lloc: string,
    id: string,
    set: boolean,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    params["album_id"] = albumId;
    params["lloc"] = lloc;
    params["id"] = id;
    params["set"] = set;
    return this.invoke<Record<string, unknown>>(
      "set_group_album_media_like",
      params,
    );
  }
  async doGroupAlbumComment(
    groupId: number,
    albumId: string,
    lloc: string,
    content: string,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    params["album_id"] = albumId;
    params["lloc"] = lloc;
    params["content"] = content;
    return this.invoke<Record<string, unknown>>(
      "do_group_album_comment",
      params,
    );
  }
  async setQqAvatar(file: string): Promise<Record<string, unknown>> {
    const params = { file: file };
    return this.invoke<Record<string, unknown>>("set_qq_avatar", params);
  }
  async setQqProfile(
    nickname: string,
    personalNote: string | null | undefined,
    sex: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["nickname"] = nickname;
    if (personalNote != null) params["personal_note"] = personalNote;
    if (sex != null) params["sex"] = sex;
    return this.invoke<Record<string, unknown>>("set_qq_profile", params);
  }
  async setOnlineStatus(
    status: number,
    extStatus: number,
    batteryStatus: number,
  ): Promise<Record<string, unknown>> {
    const params = {
      status: status,
      ext_status: extStatus,
      battery_status: batteryStatus,
    };
    return this.invoke<Record<string, unknown>>("set_online_status", params);
  }
  async setDiyOnlineStatus(
    faceId: number,
    faceType: number,
    wording: string,
  ): Promise<Record<string, unknown>> {
    const params = { face_id: faceId, face_type: faceType, wording: wording };
    return this.invoke<Record<string, unknown>>(
      "set_diy_online_status",
      params,
    );
  }
  async getOnlineClients(noCache: boolean): Promise<Record<string, unknown>[]> {
    const params = { no_cache: noCache };
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_online_clients",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async setInputStatus(
    userId: number,
    eventType: number,
  ): Promise<Record<string, unknown>> {
    const params = { user_id: userId, event_type: eventType };
    return this.invoke<Record<string, unknown>>("set_input_status", params);
  }
  async translateEn2Zh(words: string[]): Promise<Record<string, unknown>> {
    const params = { words: words };
    return this.invoke<Record<string, unknown>>("translate_en2zh", params);
  }
  async getAiCharacters(
    groupId: number,
    chatType: number,
  ): Promise<Record<string, unknown>[]> {
    const params = { group_id: groupId, chat_type: chatType };
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_ai_characters",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getAiRecord(
    character: string,
    groupId: number,
    text: string,
  ): Promise<Record<string, unknown>> {
    const params = { character: character, group_id: groupId, text: text };
    return this.invoke<Record<string, unknown>>("get_ai_record", params);
  }
  async sendGroupAiRecord(
    character: string,
    groupId: number,
    text: string,
  ): Promise<Record<string, unknown>> {
    const params = { character: character, group_id: groupId, text: text };
    return this.invoke<Record<string, unknown>>("send_group_ai_record", params);
  }
  async arkShareGroup(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: groupId };
    return this.invoke<Record<string, unknown>>("ArkShareGroup", params);
  }
  async arkSharePeer(
    userId: number | null | undefined,
    groupId: number | null | undefined,
    phoneNumber: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (userId != null) params["user_id"] = userId;
    if (groupId != null) params["group_id"] = groupId;
    params["phone_number"] = phoneNumber != null ? phoneNumber : "";
    return this.invoke<Record<string, unknown>>("ArkSharePeer", params);
  }
  async sendGroupArkShare(groupId: number): Promise<Record<string, unknown>> {
    const params = { group_id: groupId };
    return this.invoke<Record<string, unknown>>("send_group_ark_share", params);
  }
  async sendArkShare(
    userId: number | null | undefined,
    groupId: number | null | undefined,
    phoneNumber: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (userId != null) params["user_id"] = userId;
    if (groupId != null) params["group_id"] = groupId;
    params["phone_number"] = phoneNumber != null ? phoneNumber : "";
    return this.invoke<Record<string, unknown>>("send_ark_share", params);
  }
  async getMiniAppArk(
    type: string,
    title: string,
    desc: string,
    picUrl: string,
    jumpUrl: string,
    webUrl: string | null | undefined,
    rawArkData: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["type"] = type;
    params["title"] = title;
    params["desc"] = desc;
    params["picUrl"] = picUrl;
    params["jumpUrl"] = jumpUrl;
    if (webUrl != null) params["webUrl"] = webUrl;
    if (rawArkData != null) params["rawArkData"] = rawArkData;
    return this.invoke<Record<string, unknown>>("get_mini_app_ark", params);
  }
  async getRkey(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_rkey",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getRkeyServer(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("get_rkey_server", params);
  }
  async ncGetRkey(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "nc_get_rkey",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getClientkey(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("get_clientkey", params);
  }
  async checkUrlSafely(url: string): Promise<Record<string, unknown>> {
    const params = { url: url };
    return this.invoke<Record<string, unknown>>("check_url_safely", params);
  }
  async getRobotUinRange(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_robot_uin_range",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async ncGetPacketStatus(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("nc_get_packet_status", params);
  }
  async botExit(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>("bot_exit", params);
  }
  async sendPoke(
    userId: number,
    groupId: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["user_id"] = userId;
    if (groupId != null) params["group_id"] = groupId;
    return this.invoke<Record<string, unknown>>("send_poke", params);
  }
  async sendPacket(
    cmd: string,
    data: string,
    rsp: boolean,
  ): Promise<Record<string, unknown>> {
    const params = { cmd: cmd, data: data, rsp: rsp };
    return this.invoke<Record<string, unknown>>("send_packet", params);
  }
  async clickInlineKeyboardButton(
    groupId: number,
    botAppid: string,
    buttonId: string,
    callbackData: string,
    msgSeq: string,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["group_id"] = groupId;
    params["bot_appid"] = botAppid;
    params["button_id"] = buttonId;
    params["callback_data"] = callbackData;
    params["msg_seq"] = msgSeq;
    return this.invoke<Record<string, unknown>>(
      "click_inline_keyboard_button",
      params,
    );
  }
  async fetchCustomFace(count: number): Promise<string[]> {
    const params = { count: count };
    const data = await this.invoke<string[]>("fetch_custom_face", params, true);
    return Array.isArray(data) ? data : [];
  }
  async getModelShow(
    model: string | null | undefined,
  ): Promise<Record<string, unknown>[]> {
    const params: Record<string, unknown> = {};
    if (model != null) params["model"] = model;
    const data = await this.invoke<Record<string, unknown>[]>(
      "_get_model_show",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async setModelShow(
    model: string,
    modelShow: string,
  ): Promise<Record<string, unknown>> {
    const params = { model: model, model_show: modelShow };
    return this.invoke<Record<string, unknown>>("_set_model_show", params);
  }
  async handleQuickOperation(
    context: Record<string, unknown>,
    operation: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const params = { context: context, operation: operation };
    return this.invoke<Record<string, unknown>>(
      ".handle_quick_operation",
      params,
    );
  }
  async createCollection(
    rawData: string,
    brief: string,
  ): Promise<Record<string, unknown>> {
    const params = { rawData: rawData, brief: brief };
    return this.invoke<Record<string, unknown>>("create_collection", params);
  }
  async getCollectionList(
    category: string,
    count: number,
  ): Promise<Record<string, unknown>> {
    const params = { category: category, count: String(safeId(count)) };
    return this.invoke<Record<string, unknown>>("get_collection_list", params);
  }
  async createFlashTask(
    files: unknown,
    name: string | null | undefined,
    thumbPath: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["files"] = files;
    if (name != null) params["name"] = name;
    if (thumbPath != null) params["thumb_path"] = thumbPath;
    return this.invoke<Record<string, unknown>>("create_flash_task", params);
  }
  async getFlashFileList(filesetId: string): Promise<Record<string, unknown>> {
    const params = { fileset_id: filesetId };
    return this.invoke<Record<string, unknown>>("get_flash_file_list", params);
  }
  async getFlashFileUrl(
    filesetId: string,
    fileName: string | null | undefined,
    fileIndex: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["fileset_id"] = filesetId;
    if (fileName != null) params["file_name"] = fileName;
    if (fileIndex != null) params["file_index"] = fileIndex;
    return this.invoke<Record<string, unknown>>("get_flash_file_url", params);
  }
  async sendFlashMsg(
    filesetId: string,
    userId: number | null | undefined,
    groupId: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["fileset_id"] = filesetId;
    if (userId != null) params["user_id"] = userId;
    if (groupId != null) params["group_id"] = groupId;
    return this.invoke<Record<string, unknown>>("send_flash_msg", params);
  }
  async getShareLink(filesetId: string): Promise<Record<string, unknown>> {
    const params = { fileset_id: filesetId };
    return this.invoke<Record<string, unknown>>("get_share_link", params);
  }
  async getFilesetInfo(filesetId: string): Promise<Record<string, unknown>> {
    const params = { fileset_id: filesetId };
    return this.invoke<Record<string, unknown>>("get_fileset_info", params);
  }
  async getFilesetId(shareCode: string): Promise<Record<string, unknown>> {
    const params = { share_code: shareCode };
    return this.invoke<Record<string, unknown>>("get_fileset_id", params);
  }
  async downloadFileset(filesetId: string): Promise<Record<string, unknown>> {
    const params = { fileset_id: filesetId };
    return this.invoke<Record<string, unknown>>("download_fileset", params);
  }
  async getOnlineFileMsg(userId: number): Promise<Record<string, unknown>> {
    const params = { user_id: userId };
    return this.invoke<Record<string, unknown>>("get_online_file_msg", params);
  }
  async sendOnlineFile(
    userId: number,
    filePath: string,
    fileName: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["user_id"] = userId;
    params["file_path"] = filePath;
    if (fileName != null) params["file_name"] = fileName;
    return this.invoke<Record<string, unknown>>("send_online_file", params);
  }
  async sendOnlineFolder(
    userId: number,
    folderPath: string,
    folderName: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["user_id"] = userId;
    params["folder_path"] = folderPath;
    if (folderName != null) params["folder_name"] = folderName;
    return this.invoke<Record<string, unknown>>("send_online_folder", params);
  }
  async receiveOnlineFile(
    userId: number,
    msgId: string,
    elementId: string,
  ): Promise<Record<string, unknown>> {
    const params = { user_id: userId, msg_id: msgId, element_id: elementId };
    return this.invoke<Record<string, unknown>>("receive_online_file", params);
  }
  async refuseOnlineFile(
    userId: number,
    msgId: string,
    elementId: string,
  ): Promise<Record<string, unknown>> {
    const params = { user_id: userId, msg_id: msgId, element_id: elementId };
    return this.invoke<Record<string, unknown>>("refuse_online_file", params);
  }
  async cancelOnlineFile(
    userId: number,
    msgId: string,
  ): Promise<Record<string, unknown>> {
    const params = { user_id: userId, msg_id: msgId };
    return this.invoke<Record<string, unknown>>("cancel_online_file", params);
  }
  async downloadFileStream(
    file: string | null | undefined,
    fileId: string | null | undefined,
    chunkSize: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (file != null) params["file"] = file;
    if (fileId != null) params["file_id"] = fileId;
    if (chunkSize != null) params["chunk_size"] = chunkSize;
    return this.invoke<Record<string, unknown>>("download_file_stream", params);
  }
  async downloadFileRecordStream(
    file: string | null | undefined,
    fileId: string | null | undefined,
    chunkSize: number | null | undefined,
    outFormat: string | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (file != null) params["file"] = file;
    if (fileId != null) params["file_id"] = fileId;
    if (chunkSize != null) params["chunk_size"] = chunkSize;
    if (outFormat != null) params["out_format"] = outFormat;
    return this.invoke<Record<string, unknown>>(
      "download_file_record_stream",
      params,
    );
  }
  async downloadFileImageStream(
    file: string | null | undefined,
    fileId: string | null | undefined,
    chunkSize: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    if (file != null) params["file"] = file;
    if (fileId != null) params["file_id"] = fileId;
    if (chunkSize != null) params["chunk_size"] = chunkSize;
    return this.invoke<Record<string, unknown>>(
      "download_file_image_stream",
      params,
    );
  }
  async uploadFileStream(
    streamId: string,
    chunkData: string | null | undefined,
    chunkIndex: number | null | undefined,
    totalChunks: number | null | undefined,
    fileSize: number | null | undefined,
    expectedSha256: string | null | undefined,
    isComplete: boolean | null | undefined,
    filename: string | null | undefined,
    reset: boolean | null | undefined,
    verifyOnly: boolean | null | undefined,
    fileRetention: number | null | undefined,
  ): Promise<Record<string, unknown>> {
    const params: Record<string, unknown> = {};
    params["stream_id"] = streamId;
    if (chunkData != null) params["chunk_data"] = chunkData;
    if (chunkIndex != null) params["chunk_index"] = chunkIndex;
    if (totalChunks != null) params["total_chunks"] = totalChunks;
    if (fileSize != null) params["file_size"] = fileSize;
    if (expectedSha256 != null) params["expected_sha256"] = expectedSha256;
    if (isComplete != null) params["is_complete"] = isComplete;
    if (filename != null) params["filename"] = filename;
    if (reset != null) params["reset"] = reset;
    if (verifyOnly != null) params["verify_only"] = verifyOnly;
    params["file_retention"] = fileRetention != null ? fileRetention : 300000;
    return this.invoke<Record<string, unknown>>("upload_file_stream", params);
  }
  async testDownloadStream(error: boolean): Promise<Record<string, unknown>> {
    const params = { error: error };
    return this.invoke<Record<string, unknown>>("test_download_stream", params);
  }
  async cleanStreamTempFile(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>(
      "clean_stream_temp_file",
      params,
    );
  }
  async getGuildList(): Promise<Record<string, unknown>[]> {
    const params = {};
    const data = await this.invoke<Record<string, unknown>[]>(
      "get_guild_list",
      params,
      true,
    );
    return Array.isArray(data) ? data : [];
  }
  async getGuildServiceProfile(): Promise<Record<string, unknown>> {
    const params = {};
    return this.invoke<Record<string, unknown>>(
      "get_guild_service_profile",
      params,
    );
  }
}
