package onebot.model;

import java.util.List;
import java.util.Map;

/**
 * 消息数据（get_msg 返回）
 */
public class MessageData {
    private long time;
    private long message_id;
    private long message_seq;
    private long real_id;
    private long user_id;
    private long group_id;
    private String message_type; // private, group
    private Sender sender;
    private List<Map<String, Object>> message;
    private String raw_message;
    private int font;
    private String sub_type;
    private String group_name;

    public long getTime() { return time; }
    public void setTime(long time) { this.time = time; }

    public long getMessageId() { return message_id; }
    public void setMessageId(long messageId) { this.message_id = messageId; }

    public long getMessageSeq() { return message_seq; }
    public void setMessageSeq(long messageSeq) { this.message_seq = messageSeq; }

    public long getRealId() { return real_id; }
    public void setRealId(long realId) { this.real_id = realId; }

    public long getUserId() { return user_id; }
    public void setUserId(long userId) { this.user_id = userId; }

    public long getGroupId() { return group_id; }
    public void setGroupId(long groupId) { this.group_id = groupId; }

    public String getMessageType() { return message_type; }
    public void setMessageType(String messageType) { this.message_type = messageType; }

    public Sender getSender() { return sender; }
    public void setSender(Sender sender) { this.sender = sender; }

    public List<Map<String, Object>> getMessage() { return message; }
    public void setMessage(List<Map<String, Object>> message) { this.message = message; }

    public String getRawMessage() { return raw_message; }
    public void setRawMessage(String rawMessage) { this.raw_message = rawMessage; }

    public int getFont() { return font; }
    public void setFont(int font) { this.font = font; }

    public String getSubType() { return sub_type; }
    public void setSubType(String subType) { this.sub_type = subType; }

    public String getGroupName() { return group_name; }
    public void setGroupName(String groupName) { this.group_name = groupName; }

    @Override
    public String toString() {
        return "MessageData{message_id=" + message_id + ", message_type='" + message_type +
               "', user_id=" + user_id + ", raw_message='" + raw_message + "'}";
    }
}
