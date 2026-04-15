package onebot.client;

import onebot.message.MessageBuilder;
import onebot.message.MessageSegment;
import onebot.model.*;
import onebot.util.ConvertUtil;
import onebot.util.GsonFactory;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;

/**
 * NapCat OneBot 11 高层 API 客户端
 *
 * 支持两种模式:
 * - WebSocket 模式: 基于 OneBotConnection，同时接收事件和调用 API
 * - HTTP 模式: 基于 OneBotHttpConnection，仅调用 API (不接收事件)
 *
 * 用法 (WebSocket):
 *   var conn = new OneBotConnection("ws://127.0.0.1:3001", "token", dispatcher);
 *   var bot = new OneBotClient(conn);
 *
 * 用法 (HTTP):
 *   var http = new OneBotHttpConnection("http://127.0.0.1:6099", "token");
 *   var bot = new OneBotClient(http);
 */
public class OneBotClient {

    private static final Logger logger = LogManager.getLogger(OneBotClient.class);

    private final ApiProvider provider;

    /** 构造 (WebSocket 模式) */
    public OneBotClient(OneBotConnection connection) {
        this.provider = connection;
        logger.info("OneBotClient 初始化完成 (WebSocket 模式)");
    }

    /** 构造 (HTTP 模式) */
    public OneBotClient(OneBotHttpConnection httpConnection) {
        this.provider = httpConnection;
        logger.info("OneBotClient 初始化完成 (HTTP 模式)");
    }

    /** 获取底层 API 提供者 */
    public ApiProvider getProvider() {
        return provider;
    }

    // ==================== 通用调用 ====================

    /** 调用 API (返回 data 为 Map) */
    public Map<String, Object> callApi(String action, Map<String, Object> params) {
        return provider.callApi(action, params);
    }

    /** 调用 API (返回 data 为任意类型, 包括 List) */
    public Object callApiRaw(String action, Map<String, Object> params) {
        return provider.callApiRaw(action, params);
    }

    // ==================== 系统接口 ====================

    /** 获取登录号信息 */
    public LoginInfo getLoginInfo() {
        var data = callApi("get_login_info", null);
        return GsonFactory.convert(data, LoginInfo.class);
    }

    /** 获取版本信息 */
    public VersionInfo getVersionInfo() {
        var data = callApi("get_version_info", null);
        return GsonFactory.convert(data, VersionInfo.class);
    }

    /** 获取运行状态 */
    public Map<String, Object> getStatus() {
        return callApi("get_status", null);
    }

    /** 是否可以发送图片 */
    public boolean canSendImage() {
        try {
            var data = callApi("can_send_image", null);
            return Boolean.TRUE.equals(data.get("yes"));
        } catch (Exception e) { return false; }
    }

    /** 是否可以发送语音 */
    public boolean canSendRecord() {
        try {
            var data = callApi("can_send_record", null);
            return Boolean.TRUE.equals(data.get("yes"));
        } catch (Exception e) { return false; }
    }

    /** 清理缓存 */
    public void cleanCache() {
        callApi("clean_cache", null);
    }

    // ==================== 消息接口 ====================

    /** 发送私聊消息 (纯文本) */
    public long sendPrivateMsg(long userId, String text) {
        return sendPrivateMsg(userId, MessageBuilder.create().text(text).build());
    }

    /** 发送私聊消息 (消息段) */
    public long sendPrivateMsg(long userId, List<MessageSegment> message) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", String.valueOf(userId));
        params.put("message", segmentsToList(message));
        var data = callApi("send_private_msg", params);
        return ConvertUtil.toLong(data.get("message_id"));
    }

    /** 发送群消息 (纯文本) */
    public long sendGroupMsg(long groupId, String text) {
        return sendGroupMsg(groupId, MessageBuilder.create().text(text).build());
    }

    /** 发送群消息 (消息段) */
    public long sendGroupMsg(long groupId, List<MessageSegment> message) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("message", segmentsToList(message));
        var data = callApi("send_group_msg", params);
        return ConvertUtil.toLong(data.get("message_id"));
    }

    /** 发送消息 (自动判断类型) */
    public long sendMsg(String messageType, Long userId, Long groupId, List<MessageSegment> message) {
        var params = new LinkedHashMap<String, Object>();
        if (messageType != null) params.put("message_type", messageType);
        if (userId != null) params.put("user_id", String.valueOf(userId));
        if (groupId != null) params.put("group_id", String.valueOf(groupId));
        params.put("message", segmentsToList(message));
        var data = callApi("send_msg", params);
        return ConvertUtil.toLong(data.get("message_id"));
    }

    /** 撤回消息 */
    public void deleteMsg(long messageId) {
        callApi("delete_msg", Map.of("message_id", messageId));
    }

    /** 获取消息 */
    public MessageData getMsg(long messageId) {
        var data = callApi("get_msg", Map.of("message_id", messageId));
        return GsonFactory.convert(data, MessageData.class);
    }

    /** 标记消息已读 */
    public void markMsgAsRead(long messageId) {
        callApi("mark_msg_as_read", Map.of("message_id", messageId));
    }

    /** 标记所有消息已读 */
    public void markAllAsRead() {
        callApi("_mark_all_as_read", null);
    }

    /** 获取群历史消息 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGroupMsgHistory(long groupId, int count) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("count", count);
        var data = callApi("get_group_msg_history", params);
        Object messages = data.get("messages");
        return messages instanceof List ? (List<Map<String, Object>>) messages : List.of();
    }

    // ==================== 合并转发 ====================

    /** 发送群合并转发消息 */
    public void sendGroupForwardMsg(long groupId, List<MessageSegment> nodes) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("message", segmentsToList(nodes));
        callApi("send_group_forward_msg", params);
    }

    /** 发送私聊合并转发消息 */
    public void sendPrivateForwardMsg(long userId, List<MessageSegment> nodes) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", String.valueOf(userId));
        params.put("message", segmentsToList(nodes));
        callApi("send_private_forward_msg", params);
    }

    // ==================== 好友接口 ====================

    /** 获取好友列表 */
    @SuppressWarnings("unchecked")
    public List<FriendInfo> getFriendList() {
        var data = callApiRaw("get_friend_list", null);
        if (data instanceof List list) {
            return GsonFactory.convertList((List<?>) list, FriendInfo.class);
        }
        return List.of();
    }

    /** 获取陌生人信息 */
    public StrangerInfo getStrangerInfo(long userId) {
        var data = callApi("get_stranger_info", Map.of("user_id", String.valueOf(userId)));
        return GsonFactory.convert(data, StrangerInfo.class);
    }

    /** 处理加好友请求 */
    public void setFriendAddRequest(String flag, boolean approve, String remark) {
        var params = new LinkedHashMap<String, Object>();
        params.put("flag", flag);
        params.put("approve", approve);
        if (remark != null) params.put("remark", remark);
        callApi("set_friend_add_request", params);
    }

    /** 设置好友备注 */
    public void setFriendRemark(long userId, String remark) {
        callApi("set_friend_remark", Map.of(
                "user_id", String.valueOf(userId), "remark", remark));
    }

    // ==================== 群组接口 ====================

    /** 获取群列表 */
    @SuppressWarnings("unchecked")
    public List<GroupInfo> getGroupList() {
        var data = callApiRaw("get_group_list", null);
        if (data instanceof List list) {
            return GsonFactory.convertList((List<?>) list, GroupInfo.class);
        }
        return List.of();
    }

    /** 获取群信息 */
    public GroupInfo getGroupInfo(long groupId) {
        var data = callApi("get_group_info", Map.of("group_id", String.valueOf(groupId)));
        return GsonFactory.convert(data, GroupInfo.class);
    }

    /** 获取群成员列表 */
    @SuppressWarnings("unchecked")
    public List<GroupMember> getGroupMemberList(long groupId) {
        var data = callApiRaw("get_group_member_list", Map.of("group_id", String.valueOf(groupId)));
        if (data instanceof List list) {
            return GsonFactory.convertList((List<?>) list, GroupMember.class);
        }
        return List.of();
    }

    /** 获取群成员信息 */
    public GroupMember getGroupMemberInfo(long groupId, long userId) {
        var data = callApi("get_group_member_info", Map.of(
                "group_id", String.valueOf(groupId),
                "user_id", String.valueOf(userId)));
        return GsonFactory.convert(data, GroupMember.class);
    }

    /** 设置群名称 */
    public void setGroupName(long groupId, String groupName) {
        callApi("set_group_name", Map.of(
                "group_id", String.valueOf(groupId), "group_name", groupName));
    }

    /** 设置群名片 */
    public void setGroupCard(long groupId, long userId, String card) {
        callApi("set_group_card", Map.of(
                "group_id", String.valueOf(groupId),
                "user_id", String.valueOf(userId),
                "card", card));
    }

    /** 踢出群成员 */
    public void setGroupKick(long groupId, long userId, boolean rejectAddRequest) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("user_id", String.valueOf(userId));
        params.put("reject_add_request", rejectAddRequest);
        callApi("set_group_kick", params);
    }

    /** 群禁言 (duration=0 为解除禁言) */
    public void setGroupBan(long groupId, long userId, int duration) {
        callApi("set_group_ban", Map.of(
                "group_id", String.valueOf(groupId),
                "user_id", String.valueOf(userId),
                "duration", duration));
    }

    /** 全群禁言 */
    public void setGroupWholeBan(long groupId, boolean enable) {
        callApi("set_group_whole_ban", Map.of(
                "group_id", String.valueOf(groupId), "enable", enable));
    }

    /** 设置群管理员 */
    public void setGroupAdmin(long groupId, long userId, boolean enable) {
        callApi("set_group_admin", Map.of(
                "group_id", String.valueOf(groupId),
                "user_id", String.valueOf(userId),
                "enable", enable));
    }

    /** 退出群 */
    public void setGroupLeave(long groupId, boolean isDismiss) {
        callApi("set_group_leave", Map.of(
                "group_id", String.valueOf(groupId), "is_dismiss", isDismiss));
    }

    /** 处理加群请求 */
    public void setGroupAddRequest(String flag, boolean approve, String reason) {
        var params = new LinkedHashMap<String, Object>();
        params.put("flag", flag);
        params.put("approve", approve);
        if (reason != null) params.put("reason", reason);
        callApi("set_group_add_request", params);
    }

    /** 戳一戳 (群) */
    public void groupPoke(long groupId, long userId) {
        callApi("group_poke", Map.of(
                "group_id", String.valueOf(groupId), "user_id", String.valueOf(userId)));
    }

    /** 戳一戳 (好友) */
    public void friendPoke(long userId) {
        callApi("friend_poke", Map.of("user_id", String.valueOf(userId)));
    }

    // ==================== 文件接口 ====================

    /** 上传群文件 */
    public void uploadGroupFile(long groupId, String file, String name, String folderId) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("file", file);
        params.put("name", name);
        if (folderId != null) params.put("folder_id", folderId);
        callApi("upload_group_file", params);
    }

    // ==================== 扩展接口 ====================

    /** 设置个性签名 */
    public void setSelfLongnick(String longNick) {
        callApi("set_self_longnick", Map.of("longNick", longNick));
    }

    /** OCR 图片识别 */
    public Map<String, Object> ocrImage(String image) {
        return callApi("ocr_image", Map.of("image", image));
    }

    // ==================== 消息表情 ====================

    /** 设置消息表情回应 */
    public void setMsgEmojiLike(long messageId, String emojiId, boolean set) {
        callApi("set_msg_emoji_like", Map.of(
                "message_id", messageId, "emoji_id", emojiId, "set", set));
    }

    /** 获取表情回应详情 */
    public Map<String, Object> fetchEmojiLike(long messageId, String emojiId, String emojiType) {
        var params = new LinkedHashMap<String, Object>();
        params.put("message_id", messageId);
        params.put("emoji_id", emojiId);
        if (emojiType != null) params.put("emoji_type", emojiType);
        return callApi("fetch_emoji_like", params);
    }

    /** 获取消息表情回应列表 */
    public Map<String, Object> getEmojiLikes(long messageId) {
        return callApi("get_emoji_likes", Map.of("message_id", messageId));
    }

    // ==================== OneBot 11 标准补全 ====================

    /** 点赞 */
    public void sendLike(long userId, int times) {
        callApi("send_like", Map.of("user_id", String.valueOf(userId), "times", times));
    }

    /** 获取合并转发消息内容 */
    public Map<String, Object> getForwardMsg(String id) {
        return callApi("get_forward_msg", Map.of("id", id));
    }

    /** 获取图片信息 */
    public Map<String, Object> getImage(String file) {
        return callApi("get_image", Map.of("file", file));
    }

    /** 获取语音文件 */
    public Map<String, Object> getRecord(String file, String outFormat) {
        var params = new LinkedHashMap<String, Object>();
        params.put("file", file);
        if (outFormat != null) params.put("out_format", outFormat);
        return callApi("get_record", params);
    }

    /** 获取群荣誉信息 */
    public Map<String, Object> getGroupHonorInfo(long groupId, String type) {
        return callApi("get_group_honor_info", Map.of(
                "group_id", String.valueOf(groupId), "type", type));
    }

    /** 设置群专属头衔 */
    public void setGroupSpecialTitle(long groupId, long userId, String specialTitle, int duration) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("user_id", String.valueOf(userId));
        params.put("special_title", specialTitle != null ? specialTitle : "");
        params.put("duration", duration);
        callApi("set_group_special_title", params);
    }

    /** 群匿名开关 */
    public void setGroupAnonymous(long groupId, boolean enable) {
        callApi("set_group_anonymous", Map.of(
                "group_id", String.valueOf(groupId), "enable", enable));
    }

    /** 匿名用户禁言 */
    public void setGroupAnonymousBan(long groupId, Object anonymous, String flag, int duration) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        if (anonymous != null) params.put("anonymous", anonymous);
        if (flag != null) params.put("flag", flag);
        params.put("duration", duration);
        callApi("set_group_anonymous_ban", params);
    }

    /** 重启 OneBot 实现 */
    public void setRestart(int delay) {
        callApi("set_restart", Map.of("delay", delay));
    }

    /** 获取 Cookies */
    public Map<String, Object> getCookies(String domain) {
        var params = new LinkedHashMap<String, Object>();
        if (domain != null) params.put("domain", domain);
        return callApi("get_cookies", params);
    }

    /** 获取 CSRF Token */
    public Map<String, Object> getCsrfToken() {
        return callApi("get_csrf_token", null);
    }

    /** 获取 QQ 相关接口凭证 */
    public Map<String, Object> getCredentials(String domain) {
        var params = new LinkedHashMap<String, Object>();
        if (domain != null) params.put("domain", domain);
        return callApi("get_credentials", params);
    }

    // ==================== NapCat 消息扩展 ====================

    /** 获取好友历史消息 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getFriendMsgHistory(long userId, int count) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", String.valueOf(userId));
        params.put("count", count);
        var data = callApi("get_friend_msg_history", params);
        Object messages = data.get("messages");
        return messages instanceof List ? (List<Map<String, Object>>) messages : List.of();
    }

    /** 通用合并转发 */
    public void sendForwardMsg(List<MessageSegment> nodes) {
        callApi("send_forward_msg", Map.of("message", segmentsToList(nodes)));
    }

    /** 转发单条消息到好友 */
    public void forwardFriendSingleMsg(long userId, long messageId) {
        callApi("forward_friend_single_msg", Map.of(
                "user_id", String.valueOf(userId), "message_id", messageId));
    }

    /** 转发单条消息到群 */
    public void forwardGroupSingleMsg(long groupId, long messageId) {
        callApi("forward_group_single_msg", Map.of(
                "group_id", String.valueOf(groupId), "message_id", messageId));
    }

    /** 标记群消息已读 */
    public void markGroupMsgAsRead(long groupId) {
        callApi("mark_group_msg_as_read", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 标记私聊消息已读 */
    public void markPrivateMsgAsRead(long userId) {
        callApi("mark_private_msg_as_read", Map.of("user_id", String.valueOf(userId)));
    }

    // ==================== NapCat 好友扩展 ====================

    /** 获取分组好友列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getFriendsWithCategory() {
        var data = callApiRaw("get_friends_with_category", null);
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 获取单向好友列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getUnidirectionalFriendList() {
        var data = callApiRaw("get_unidirectional_friend_list", null);
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 删除好友 */
    public void deleteFriend(long userId) {
        callApi("delete_friend", Map.of("user_id", String.valueOf(userId)));
    }

    /** 获取最近联系人 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRecentContact(int count) {
        var data = callApiRaw("get_recent_contact", Map.of("count", count));
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 获取资料点赞列表 */
    public Map<String, Object> getProfileLike(long userId) {
        return callApi("get_profile_like", Map.of("user_id", String.valueOf(userId)));
    }

    /** 获取用户在线状态 */
    public Map<String, Object> ncGetUserStatus(long userId) {
        return callApi("nc_get_user_status", Map.of("user_id", String.valueOf(userId)));
    }

    /** 获取疑似好友添加请求 */
    public Map<String, Object> getDoubtFriendsAddRequest() {
        return callApi("get_doubt_friends_add_request", null);
    }

    /** 处理疑似好友添加请求 */
    public void setDoubtFriendsAddRequest(String flag, boolean approve, String remark) {
        var params = new LinkedHashMap<String, Object>();
        params.put("flag", flag);
        params.put("approve", approve);
        if (remark != null) params.put("remark", remark);
        callApi("set_doubt_friends_add_request", params);
    }

    // ==================== NapCat 群组扩展 ====================

    /** 获取群详细信息 */
    public Map<String, Object> getGroupDetailInfo(long groupId) {
        return callApi("get_group_detail_info", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 获取群扩展信息 */
    public Map<String, Object> getGroupInfoEx(long groupId) {
        return callApi("get_group_info_ex", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 批量踢出群成员 */
    public void setGroupKickMembers(long groupId, List<String> userIds, boolean rejectAddRequest) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("user_id", userIds);
        params.put("reject_add_request", rejectAddRequest);
        callApi("set_group_kick_members", params);
    }

    /** 设置群头像 */
    public void setGroupPortrait(long groupId, String file) {
        callApi("set_group_portrait", Map.of(
                "group_id", String.valueOf(groupId), "file", file));
    }

    /** 设置群备注 */
    public void setGroupRemark(long groupId, String remark) {
        callApi("set_group_remark", Map.of(
                "group_id", String.valueOf(groupId), "remark", remark));
    }

    /** 群打卡/签到 */
    public void sendGroupSign(long groupId) {
        callApi("send_group_sign", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 设置群签到 */
    public void setGroupSign(long groupId) {
        callApi("set_group_sign", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 获取群禁言列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGroupShutList(long groupId) {
        var data = callApiRaw("get_group_shut_list", Map.of("group_id", String.valueOf(groupId)));
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 获取群 @全体成员 剩余次数 */
    public Map<String, Object> getGroupAtAllRemain(long groupId) {
        return callApi("get_group_at_all_remain", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 设置群待办 */
    public void setGroupTodo(long groupId, long messageId) {
        callApi("set_group_todo", Map.of(
                "group_id", String.valueOf(groupId), "message_id", String.valueOf(messageId)));
    }

    /** 获取群忽略的加群通知 */
    public Map<String, Object> getGroupIgnoredNotifies(long groupId) {
        return callApi("get_group_ignored_notifies", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 获取群忽略的添加请求 */
    public Map<String, Object> getGroupIgnoreAddRequest(long groupId) {
        return callApi("get_group_ignore_add_request", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 设置群加群选项 */
    public void setGroupAddOption(long groupId, int addOption) {
        callApi("set_group_add_option", Map.of(
                "group_id", String.valueOf(groupId), "add_option", addOption));
    }

    /** 设置群机器人加群选项 */
    public void setGroupRobotAddOption(long groupId, int addOption) {
        callApi("set_group_robot_add_option", Map.of(
                "group_id", String.valueOf(groupId), "add_option", addOption));
    }

    /** 设置群搜索 */
    public void setGroupSearch(long groupId, boolean enable) {
        callApi("set_group_search", Map.of(
                "group_id", String.valueOf(groupId), "enable", enable));
    }

    // ==================== 群系统消息 & 精华消息 ====================

    /** 获取群系统消息 */
    public Map<String, Object> getGroupSystemMsg() {
        return callApi("get_group_system_msg", null);
    }

    /** 获取群公告 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGroupNotice(long groupId) {
        var data = callApiRaw("_get_group_notice", Map.of("group_id", String.valueOf(groupId)));
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 发送群公告 */
    public void sendGroupNotice(long groupId, String content, String image) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("content", content);
        if (image != null) params.put("image", image);
        callApi("_send_group_notice", params);
    }

    /** 删除群公告 */
    public void delGroupNotice(long groupId, String noticeId) {
        callApi("_del_group_notice", Map.of(
                "group_id", String.valueOf(groupId), "notice_id", noticeId));
    }

    /** 获取精华消息列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getEssenceMsgList(long groupId) {
        var data = callApiRaw("get_essence_msg_list", Map.of("group_id", String.valueOf(groupId)));
        return data instanceof List ? (List<Map<String, Object>>) data : List.of();
    }

    /** 设置精华消息 */
    public void setEssenceMsg(long messageId) {
        callApi("set_essence_msg", Map.of("message_id", messageId));
    }

    /** 删除精华消息 */
    public void deleteEssenceMsg(long messageId) {
        callApi("delete_essence_msg", Map.of("message_id", messageId));
    }

    // ==================== 群文件管理 ====================

    /** 上传私聊文件 */
    public void uploadPrivateFile(long userId, String file, String name) {
        callApi("upload_private_file", Map.of(
                "user_id", String.valueOf(userId), "file", file, "name", name));
    }

    /** 获取群文件系统信息 */
    public Map<String, Object> getGroupFileSystemInfo(long groupId) {
        return callApi("get_group_file_system_info", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 获取群根目录文件列表 */
    public Map<String, Object> getGroupRootFiles(long groupId) {
        return callApi("get_group_root_files", Map.of("group_id", String.valueOf(groupId)));
    }

    /** 获取群子目录文件列表 */
    public Map<String, Object> getGroupFilesByFolder(long groupId, String folderId) {
        return callApi("get_group_files_by_folder", Map.of(
                "group_id", String.valueOf(groupId), "folder_id", folderId));
    }

    /** 获取群文件下载链接 */
    public Map<String, Object> getGroupFileUrl(long groupId, String fileId, int busid) {
        return callApi("get_group_file_url", Map.of(
                "group_id", String.valueOf(groupId), "file_id", fileId, "busid", busid));
    }

    /** 创建群文件文件夹 */
    public void createGroupFileFolder(long groupId, String name, String parentId) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", String.valueOf(groupId));
        params.put("name", name);
        if (parentId != null) params.put("parent_id", parentId);
        callApi("create_group_file_folder", params);
    }

    /** 删除群文件 */
    public void deleteGroupFile(long groupId, String fileId, int busid) {
        callApi("delete_group_file", Map.of(
                "group_id", String.valueOf(groupId), "file_id", fileId, "busid", busid));
    }

    /** 删除群文件夹 */
    public void deleteGroupFolder(long groupId, String folderId) {
        callApi("delete_group_folder", Map.of(
                "group_id", String.valueOf(groupId), "folder_id", folderId));
    }

    /** 重命名群文件 */
    public void renameGroupFile(long groupId, String fileId, int busid, String newName) {
        callApi("rename_group_file", Map.of(
                "group_id", String.valueOf(groupId), "file_id", fileId,
                "busid", busid, "new_name", newName));
    }

    /** 移动群文件 */
    public void moveGroupFile(long groupId, String fileId, int busid, String parentId) {
        callApi("move_group_file", Map.of(
                "group_id", String.valueOf(groupId), "file_id", fileId,
                "busid", busid, "parent_id", parentId));
    }

    /** 转存群文件 */
    public void transGroupFile(long groupId, String fileId, int busid) {
        callApi("trans_group_file", Map.of(
                "group_id", String.valueOf(groupId), "file_id", fileId, "busid", busid));
    }

    /** 获取私聊文件下载链接 */
    public Map<String, Object> getPrivateFileUrl(long userId, String fileId) {
        return callApi("get_private_file_url", Map.of(
                "user_id", String.valueOf(userId), "file_id", fileId));
    }

    /** 下载文件 */
    public Map<String, Object> downloadFile(String url, String base64, int threadCount, Map<String, String> headers) {
        var params = new LinkedHashMap<String, Object>();
        if (url != null) params.put("url", url);
        if (base64 != null) params.put("base64", base64);
        params.put("thread_count", threadCount);
        if (headers != null) params.put("headers", headers);
        return callApi("download_file", params);
    }

    /** 获取文件信息 */
    public Map<String, Object> getFile(String fileId) {
        return callApi("get_file", Map.of("file_id", fileId));
    }

    // ==================== 群相册 ====================

    /** 获取群相册列表 */
    public Map<String, Object> getQunAlbumList(long groupId, String attachInfo) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        if (attachInfo != null) params.put("attach_info", attachInfo);
        return callApi("get_qun_album_list", params);
    }

    /** 获取群相册媒体列表 */
    public Map<String, Object> getGroupAlbumMediaList(long groupId, String albumId, String attachInfo) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        params.put("album_id", albumId);
        if (attachInfo != null) params.put("attach_info", attachInfo);
        return callApi("get_group_album_media_list", params);
    }

    /** 上传图片到群相册 */
    public Map<String, Object> uploadImageToQunAlbum(long groupId, String albumId, String albumName, String file) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        params.put("album_id", albumId);
        params.put("album_name", albumName);
        params.put("file", file);
        return callApi("upload_image_to_qun_album", params);
    }

    /** 删除群相册媒体 */
    public Map<String, Object> delGroupAlbumMedia(long groupId, String albumId, String lloc) {
        return callApi("del_group_album_media", Map.of(
                "group_id", groupId, "album_id", albumId, "lloc", lloc));
    }

    /** 点赞群相册媒体 */
    public Map<String, Object> setGroupAlbumMediaLike(long groupId, String albumId, String lloc, String id, boolean set) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        params.put("album_id", albumId);
        params.put("lloc", lloc);
        params.put("id", id);
        params.put("set", set);
        return callApi("set_group_album_media_like", params);
    }

    /** 发表群相册评论 */
    public Map<String, Object> doGroupAlbumComment(long groupId, String albumId, String lloc, String content) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        params.put("album_id", albumId);
        params.put("lloc", lloc);
        params.put("content", content);
        return callApi("do_group_album_comment", params);
    }

    // ==================== 个人资料 / 状态 ====================

    /** 设置QQ头像 */
    public Map<String, Object> setQqAvatar(String file) {
        return callApi("set_qq_avatar", Map.of("file", file));
    }

    /** 设置QQ资料（昵称、个性签名、性别） */
    public Map<String, Object> setQqProfile(String nickname, String personalNote, Integer sex) {
        var params = new LinkedHashMap<String, Object>();
        params.put("nickname", nickname);
        if (personalNote != null) params.put("personal_note", personalNote);
        if (sex != null) params.put("sex", sex);
        return callApi("set_qq_profile", params);
    }

    /**
     * 设置在线状态
     * @param status       在线状态 (10=在线, 30=离开, 40=隐身, 50=忙碌, 60=Q我吧, 70=请勿打扰)
     * @param extStatus    扩展状态
     * @param batteryStatus 电量状态
     */
    public Map<String, Object> setOnlineStatus(int status, int extStatus, int batteryStatus) {
        return callApi("set_online_status", Map.of(
                "status", status, "ext_status", extStatus, "battery_status", batteryStatus));
    }

    /** 设置自定义在线状态 */
    public Map<String, Object> setDiyOnlineStatus(int faceId, int faceType, String wording) {
        return callApi("set_diy_online_status", Map.of(
                "face_id", faceId, "face_type", faceType, "wording", wording));
    }

    /** 获取在线客户端列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getOnlineClients(boolean noCache) {
        var raw = callApiRaw("get_online_clients", Map.of("no_cache", noCache));
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    /** 设置输入状态 */
    public Map<String, Object> setInputStatus(long userId, int eventType) {
        return callApi("set_input_status", Map.of("user_id", userId, "event_type", eventType));
    }

    /** 英文单词翻译为中文 */
    public Map<String, Object> translateEn2Zh(List<String> words) {
        return callApi("translate_en2zh", Map.of("words", words));
    }

    // ==================== AI 语音 ====================

    /** 获取AI角色列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAiCharacters(long groupId, int chatType) {
        var raw = callApiRaw("get_ai_characters", Map.of("group_id", groupId, "chat_type", chatType));
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    /** 获取AI语音URL */
    public Map<String, Object> getAiRecord(String character, long groupId, String text) {
        return callApi("get_ai_record", Map.of(
                "character", character, "group_id", groupId, "text", text));
    }

    /** 发送群AI语音 */
    public Map<String, Object> sendGroupAiRecord(String character, long groupId, String text) {
        return callApi("send_group_ai_record", Map.of(
                "character", character, "group_id", groupId, "text", text));
    }

    // ==================== Ark 分享 ====================

    /** 获取群分享的 Ark 内容 */
    public Map<String, Object> arkShareGroup(long groupId) {
        return callApi("ArkShareGroup", Map.of("group_id", groupId));
    }

    /** 获取用户推荐的 Ark 内容 */
    public Map<String, Object> arkSharePeer(Long userId, Long groupId, String phoneNumber) {
        var params = new LinkedHashMap<String, Object>();
        if (userId != null) params.put("user_id", userId);
        if (groupId != null) params.put("group_id", groupId);
        params.put("phone_number", phoneNumber != null ? phoneNumber : "");
        return callApi("ArkSharePeer", params);
    }

    /** 发送群 Ark 分享 */
    public Map<String, Object> sendGroupArkShare(long groupId) {
        return callApi("send_group_ark_share", Map.of("group_id", groupId));
    }

    /** 发送用户 Ark 分享 */
    public Map<String, Object> sendArkShare(Long userId, Long groupId, String phoneNumber) {
        var params = new LinkedHashMap<String, Object>();
        if (userId != null) params.put("user_id", userId);
        if (groupId != null) params.put("group_id", groupId);
        params.put("phone_number", phoneNumber != null ? phoneNumber : "");
        return callApi("send_ark_share", params);
    }

    /** 获取小程序 Ark（简单模板：bili / weibo） */
    public Map<String, Object> getMiniAppArk(String type, String title, String desc,
                                              String picUrl, String jumpUrl, String webUrl, String rawArkData) {
        var params = new LinkedHashMap<String, Object>();
        params.put("type", type);
        params.put("title", title);
        params.put("desc", desc);
        params.put("picUrl", picUrl);
        params.put("jumpUrl", jumpUrl);
        if (webUrl != null) params.put("webUrl", webUrl);
        if (rawArkData != null) params.put("rawArkData", rawArkData);
        return callApi("get_mini_app_ark", params);
    }

    // ==================== RKey ====================

    /** 获取扩展 RKey（返回列表） */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRkey() {
        var raw = callApiRaw("get_rkey", Map.of());
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    /** 获取 RKey 服务器信息 */
    public Map<String, Object> getRkeyServer() {
        return callApi("get_rkey_server", Map.of());
    }

    /** 获取 RKey（NapCat） */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> ncGetRkey() {
        var raw = callApiRaw("nc_get_rkey", Map.of());
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    // ==================== 系统杂项 ====================

    /** 获取ClientKey */
    public Map<String, Object> getClientkey() {
        return callApi("get_clientkey", Map.of());
    }

    /** 检查URL安全性 (1=安全, 2=未知, 3=危险) */
    public Map<String, Object> checkUrlSafely(String url) {
        return callApi("check_url_safely", Map.of("url", url));
    }

    /** 获取机器人 UIN 范围 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRobotUinRange() {
        var raw = callApiRaw("get_robot_uin_range", Map.of());
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    /** 获取 Packet 服务状态 */
    public Map<String, Object> ncGetPacketStatus() {
        return callApi("nc_get_packet_status", Map.of());
    }

    /** 退出登录 */
    public Map<String, Object> botExit() {
        return callApi("bot_exit", Map.of());
    }

    /** 发送戳一戳 */
    public Map<String, Object> sendPoke(long userId, Long groupId) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", userId);
        if (groupId != null) params.put("group_id", groupId);
        return callApi("send_poke", params);
    }

    /** 发送原始数据包 */
    public Map<String, Object> sendPacket(String cmd, String data, boolean rsp) {
        return callApi("send_packet", Map.of("cmd", cmd, "data", data, "rsp", rsp));
    }

    /** 点击内联键盘按钮 */
    public Map<String, Object> clickInlineKeyboardButton(long groupId, String botAppid,
                                                         String buttonId, String callbackData, String msgSeq) {
        var params = new LinkedHashMap<String, Object>();
        params.put("group_id", groupId);
        params.put("bot_appid", botAppid);
        params.put("button_id", buttonId);
        params.put("callback_data", callbackData);
        params.put("msg_seq", msgSeq);
        return callApi("click_inline_keyboard_button", params);
    }

    /** 获取自定义表情 URL 列表 */
    @SuppressWarnings("unchecked")
    public List<String> fetchCustomFace(int count) {
        var raw = callApiRaw("fetch_custom_face", Map.of("count", count));
        if (raw instanceof List<?> list) return (List<String>) (List<?>) list;
        return List.of();
    }

    /** 获取机型显示列表 */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getModelShow(String model) {
        var params = new LinkedHashMap<String, Object>();
        if (model != null) params.put("model", model);
        var raw = callApiRaw("_get_model_show", params);
        if (raw instanceof List<?> list) return (List<Map<String, Object>>) (List<?>) list;
        return List.of();
    }

    /** 设置机型 */
    public Map<String, Object> setModelShow(String model, String modelShow) {
        return callApi("_set_model_show", Map.of("model", model, "model_show", modelShow));
    }

    /**
     * 处理快速操作
     * @param context   事件上下文（原始事件对象）
     * @param operation 快速操作内容
     */
    public Map<String, Object> handleQuickOperation(Map<String, Object> context, Map<String, Object> operation) {
        return callApi(".handle_quick_operation", Map.of("context", context, "operation", operation));
    }

    // ==================== 收藏 ====================

    /** 创建收藏 */
    public Map<String, Object> createCollection(String rawData, String brief) {
        return callApi("create_collection", Map.of("rawData", rawData, "brief", brief));
    }

    /** 获取收藏列表 */
    public Map<String, Object> getCollectionList(String category, int count) {
        return callApi("get_collection_list", Map.of("category", category, "count", String.valueOf(count)));
    }

    // ==================== 闪传 ====================

    /** 创建闪传任务 */
    public Map<String, Object> createFlashTask(Object files, String name, String thumbPath) {
        var params = new LinkedHashMap<String, Object>();
        params.put("files", files);
        if (name != null) params.put("name", name);
        if (thumbPath != null) params.put("thumb_path", thumbPath);
        return callApi("create_flash_task", params);
    }

    /** 获取闪传文件列表 */
    public Map<String, Object> getFlashFileList(String filesetId) {
        return callApi("get_flash_file_list", Map.of("fileset_id", filesetId));
    }

    /** 获取闪传文件链接 */
    public Map<String, Object> getFlashFileUrl(String filesetId, String fileName, Integer fileIndex) {
        var params = new LinkedHashMap<String, Object>();
        params.put("fileset_id", filesetId);
        if (fileName != null) params.put("file_name", fileName);
        if (fileIndex != null) params.put("file_index", fileIndex);
        return callApi("get_flash_file_url", params);
    }

    /** 发送闪传消息 */
    public Map<String, Object> sendFlashMsg(String filesetId, Long userId, Long groupId) {
        var params = new LinkedHashMap<String, Object>();
        params.put("fileset_id", filesetId);
        if (userId != null) params.put("user_id", userId);
        if (groupId != null) params.put("group_id", groupId);
        return callApi("send_flash_msg", params);
    }

    /** 获取文件分享链接 */
    public Map<String, Object> getShareLink(String filesetId) {
        return callApi("get_share_link", Map.of("fileset_id", filesetId));
    }

    /** 获取文件集信息 */
    public Map<String, Object> getFilesetInfo(String filesetId) {
        return callApi("get_fileset_info", Map.of("fileset_id", filesetId));
    }

    /** 通过分享码获取文件集 ID */
    public Map<String, Object> getFilesetId(String shareCode) {
        return callApi("get_fileset_id", Map.of("share_code", shareCode));
    }

    /** 下载文件集 */
    public Map<String, Object> downloadFileset(String filesetId) {
        return callApi("download_fileset", Map.of("fileset_id", filesetId));
    }

    // ==================== 在线文件 ====================

    /** 获取在线文件消息 */
    public Map<String, Object> getOnlineFileMsg(long userId) {
        return callApi("get_online_file_msg", Map.of("user_id", userId));
    }

    /** 发送在线文件 */
    public Map<String, Object> sendOnlineFile(long userId, String filePath, String fileName) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", userId);
        params.put("file_path", filePath);
        if (fileName != null) params.put("file_name", fileName);
        return callApi("send_online_file", params);
    }

    /** 发送在线文件夹 */
    public Map<String, Object> sendOnlineFolder(long userId, String folderPath, String folderName) {
        var params = new LinkedHashMap<String, Object>();
        params.put("user_id", userId);
        params.put("folder_path", folderPath);
        if (folderName != null) params.put("folder_name", folderName);
        return callApi("send_online_folder", params);
    }

    /** 接收在线文件 */
    public Map<String, Object> receiveOnlineFile(long userId, String msgId, String elementId) {
        return callApi("receive_online_file", Map.of(
                "user_id", userId, "msg_id", msgId, "element_id", elementId));
    }

    /** 拒绝在线文件 */
    public Map<String, Object> refuseOnlineFile(long userId, String msgId, String elementId) {
        return callApi("refuse_online_file", Map.of(
                "user_id", userId, "msg_id", msgId, "element_id", elementId));
    }

    /** 取消在线文件 */
    public Map<String, Object> cancelOnlineFile(long userId, String msgId) {
        return callApi("cancel_online_file", Map.of("user_id", userId, "msg_id", msgId));
    }

    // ==================== 流式传输 ====================

    /** 下载文件流 */
    public Map<String, Object> downloadFileStream(String file, String fileId, Integer chunkSize) {
        var params = new LinkedHashMap<String, Object>();
        if (file != null) params.put("file", file);
        if (fileId != null) params.put("file_id", fileId);
        if (chunkSize != null) params.put("chunk_size", chunkSize);
        return callApi("download_file_stream", params);
    }

    /** 下载语音文件流 */
    public Map<String, Object> downloadFileRecordStream(String file, String fileId, Integer chunkSize, String outFormat) {
        var params = new LinkedHashMap<String, Object>();
        if (file != null) params.put("file", file);
        if (fileId != null) params.put("file_id", fileId);
        if (chunkSize != null) params.put("chunk_size", chunkSize);
        if (outFormat != null) params.put("out_format", outFormat);
        return callApi("download_file_record_stream", params);
    }

    /** 下载图片文件流 */
    public Map<String, Object> downloadFileImageStream(String file, String fileId, Integer chunkSize) {
        var params = new LinkedHashMap<String, Object>();
        if (file != null) params.put("file", file);
        if (fileId != null) params.put("file_id", fileId);
        if (chunkSize != null) params.put("chunk_size", chunkSize);
        return callApi("download_file_image_stream", params);
    }

    /** 上传文件流 */
    public Map<String, Object> uploadFileStream(String streamId, String chunkData, Integer chunkIndex,
                                                Integer totalChunks, Long fileSize, String expectedSha256,
                                                Boolean isComplete, String filename, Boolean reset,
                                                Boolean verifyOnly, Long fileRetention) {
        var params = new LinkedHashMap<String, Object>();
        params.put("stream_id", streamId);
        if (chunkData != null) params.put("chunk_data", chunkData);
        if (chunkIndex != null) params.put("chunk_index", chunkIndex);
        if (totalChunks != null) params.put("total_chunks", totalChunks);
        if (fileSize != null) params.put("file_size", fileSize);
        if (expectedSha256 != null) params.put("expected_sha256", expectedSha256);
        if (isComplete != null) params.put("is_complete", isComplete);
        if (filename != null) params.put("filename", filename);
        if (reset != null) params.put("reset", reset);
        if (verifyOnly != null) params.put("verify_only", verifyOnly);
        params.put("file_retention", fileRetention != null ? fileRetention : 300000L);
        return callApi("upload_file_stream", params);
    }

    /** 测试下载流 */
    public Map<String, Object> testDownloadStream(boolean error) {
        return callApi("test_download_stream", Map.of("error", error));
    }

    /** 清理流式传输临时文件 */
    public Map<String, Object> cleanStreamTempFile() {
        return callApi("clean_stream_temp_file", Map.of());
    }

    // ==================== 内部工具方法 ====================

    private List<Map<String, Object>> segmentsToList(List<MessageSegment> segments) {
        var list = new ArrayList<Map<String, Object>>();
        for (var seg : segments) {
            var map = new LinkedHashMap<String, Object>();
            map.put("type", seg.getType());
            map.put("data", seg.getData());
            list.add(map);
        }
        return list;
    }

}
