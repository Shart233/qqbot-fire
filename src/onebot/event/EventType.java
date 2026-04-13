package onebot.event;

/**
 * OneBot 11 事件类型常量
 */
public final class EventType {
    private EventType() {}

    // post_type
    public static final String MESSAGE = "message";
    public static final String NOTICE = "notice";
    public static final String REQUEST = "request";
    public static final String META_EVENT = "meta_event";

    // message_type
    public static final String PRIVATE = "private";
    public static final String GROUP = "group";

    // notice_type
    public static final String GROUP_UPLOAD = "group_upload";
    public static final String GROUP_ADMIN = "group_admin";
    public static final String GROUP_DECREASE = "group_decrease";
    public static final String GROUP_INCREASE = "group_increase";
    public static final String GROUP_BAN = "group_ban";
    public static final String GROUP_RECALL = "group_recall";
    public static final String FRIEND_RECALL = "friend_recall";
    public static final String FRIEND_ADD = "friend_add";
    public static final String NOTIFY = "notify";
    public static final String POKE = "poke";

    // request_type
    public static final String FRIEND_REQUEST = "friend";
    public static final String GROUP_REQUEST = "group";

    // meta_event_type
    public static final String LIFECYCLE = "lifecycle";
    public static final String HEARTBEAT = "heartbeat";
}
