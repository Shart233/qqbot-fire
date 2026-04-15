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
