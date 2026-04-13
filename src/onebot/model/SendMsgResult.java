package onebot.model;

/**
 * 发送消息的返回数据
 */
public class SendMsgResult {
    private long message_id;

    public long getMessageId() { return message_id; }
    public void setMessageId(long messageId) { this.message_id = messageId; }

    @Override
    public String toString() {
        return "SendMsgResult{message_id=" + message_id + "}";
    }
}
