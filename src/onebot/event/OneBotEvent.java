package onebot.event;

import onebot.util.ConvertUtil;

import java.util.List;
import java.util.Map;

/**
 * OneBot 11 通用事件
 * 所有事件的基类，包含通用字段和原始数据
 */
public class OneBotEvent {
    private final Map<String, Object> raw;

    public OneBotEvent(Map<String, Object> raw) {
        this.raw = raw;
    }

    /** 原始 JSON 数据 */
    public Map<String, Object> getRaw() { return raw; }

    // ========== 通用字段 ==========

    public long getTime() { return toLong(raw.get("time")); }
    public long getSelfId() { return toLong(raw.get("self_id")); }
    public String getPostType() { return str(raw.get("post_type")); }

    // ========== 消息事件字段 ==========

    public String getMessageType() { return str(raw.get("message_type")); }
    public String getSubType() { return str(raw.get("sub_type")); }
    public long getMessageId() { return toLong(raw.get("message_id")); }
    public long getUserId() { return toLong(raw.get("user_id")); }
    public long getGroupId() { return toLong(raw.get("group_id")); }
    public String getRawMessage() { return str(raw.get("raw_message")); }
    public int getFont() { return toInt(raw.get("font")); }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getMessage() {
        Object msg = raw.get("message");
        if (msg instanceof List) return (List<Map<String, Object>>) msg;
        return List.of();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getSender() {
        Object sender = raw.get("sender");
        if (sender instanceof Map) return (Map<String, Object>) sender;
        return Map.of();
    }

    public String getSenderNickname() { return str(getSender().get("nickname")); }
    public String getSenderCard() { return str(getSender().get("card")); }
    public String getSenderRole() { return str(getSender().get("role")); }

    /** 获取显示名 (群名片 > 昵称) */
    public String getDisplayName() {
        String card = getSenderCard();
        return (card != null && !card.isEmpty()) ? card : getSenderNickname();
    }

    // ========== 通知事件字段 ==========

    public String getNoticeType() { return str(raw.get("notice_type")); }
    public long getOperatorId() { return toLong(raw.get("operator_id")); }
    public long getTargetId() { return toLong(raw.get("target_id")); }
    public String getDuration() { return str(raw.get("duration")); }

    // ========== 请求事件字段 ==========

    public String getRequestType() { return str(raw.get("request_type")); }
    public String getComment() { return str(raw.get("comment")); }
    public String getFlag() { return str(raw.get("flag")); }

    // ========== 元事件字段 ==========

    public String getMetaEventType() { return str(raw.get("meta_event_type")); }

    // ========== 便捷判断 ==========

    public boolean isMessage() { return EventType.MESSAGE.equals(getPostType()); }
    public boolean isNotice() { return EventType.NOTICE.equals(getPostType()); }
    public boolean isRequest() { return EventType.REQUEST.equals(getPostType()); }
    public boolean isMetaEvent() { return EventType.META_EVENT.equals(getPostType()); }

    public boolean isPrivateMessage() { return isMessage() && EventType.PRIVATE.equals(getMessageType()); }
    public boolean isGroupMessage() { return isMessage() && EventType.GROUP.equals(getMessageType()); }

    public boolean isFromAdmin() {
        String role = getSenderRole();
        return "admin".equals(role) || "owner".equals(role);
    }

    public boolean isFromOwner() {
        return "owner".equals(getSenderRole());
    }

    // ========== 文本提取 ==========

    /** 提取纯文本内容 (合并所有 text 类型消息段) */
    public String getPlainText() {
        var sb = new StringBuilder();
        for (var seg : getMessage()) {
            if ("text".equals(seg.get("type"))) {
                Object data = seg.get("data");
                if (data instanceof Map) {
                    Object text = ((Map<?, ?>) data).get("text");
                    if (text != null) sb.append(text);
                }
            }
        }
        return sb.toString();
    }

    /** 检查消息是否包含 @某人 */
    public boolean hasAt(long userId) {
        for (var seg : getMessage()) {
            if ("at".equals(seg.get("type"))) {
                Object data = seg.get("data");
                if (data instanceof Map) {
                    Object qq = ((Map<?, ?>) data).get("qq");
                    if (String.valueOf(userId).equals(String.valueOf(qq))) return true;
                }
            }
        }
        return false;
    }

    // ========== 工具方法 (委托 ConvertUtil) ==========

    private static String str(Object obj) { return ConvertUtil.str(obj); }
    private static long toLong(Object obj) { return ConvertUtil.toLong(obj); }
    private static int toInt(Object obj) { return ConvertUtil.toInt(obj); }

    @Override
    public String toString() {
        if (isGroupMessage()) {
            return "GroupMsg{group=" + getGroupId() + ", user=" + getUserId() +
                   ", name=" + getDisplayName() + ", msg=" + getRawMessage() + "}";
        } else if (isPrivateMessage()) {
            return "PrivateMsg{user=" + getUserId() + ", name=" + getDisplayName() +
                   ", msg=" + getRawMessage() + "}";
        } else if (isNotice()) {
            return "Notice{type=" + getNoticeType() + ", group=" + getGroupId() +
                   ", user=" + getUserId() + "}";
        } else if (isRequest()) {
            return "Request{type=" + getRequestType() + ", user=" + getUserId() + "}";
        } else if (isMetaEvent()) {
            return "Meta{type=" + getMetaEventType() + "}";
        }
        return "Event{post_type=" + getPostType() + "}";
    }
}
