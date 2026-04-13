package onebot.message;

import java.util.ArrayList;
import java.util.List;

/**
 * 消息构建器 — 链式API构造消息段数组
 *
 * 用法示例:
 *   var msg = MessageBuilder.create()
 *       .text("Hello ")
 *       .at(123456)
 *       .text(" 你好")
 *       .image("https://example.com/image.png")
 *       .build();
 */
public class MessageBuilder {
    private final List<MessageSegment> segments = new ArrayList<>();

    private MessageBuilder() {}

    public static MessageBuilder create() {
        return new MessageBuilder();
    }

    public MessageBuilder add(MessageSegment segment) {
        segments.add(segment);
        return this;
    }

    public MessageBuilder text(String text) {
        return add(MessageSegment.text(text));
    }

    public MessageBuilder at(long userId) {
        return add(MessageSegment.at(userId));
    }

    public MessageBuilder atAll() {
        return add(MessageSegment.atAll());
    }

    public MessageBuilder face(int faceId) {
        return add(MessageSegment.face(faceId));
    }

    public MessageBuilder image(String file) {
        return add(MessageSegment.image(file));
    }

    public MessageBuilder record(String file) {
        return add(MessageSegment.record(file));
    }

    public MessageBuilder video(String file) {
        return add(MessageSegment.video(file));
    }

    public MessageBuilder reply(long messageId) {
        return add(MessageSegment.reply(messageId));
    }

    public MessageBuilder json(String data) {
        return add(MessageSegment.json(data));
    }

    public MessageBuilder markdown(String content) {
        return add(MessageSegment.markdown(content));
    }

    public MessageBuilder poke(int type, int id) {
        return add(MessageSegment.poke(type, id));
    }

    public MessageBuilder dice() {
        return add(MessageSegment.dice());
    }

    public MessageBuilder rps() {
        return add(MessageSegment.rps());
    }

    public MessageBuilder location(double lat, double lon, String title, String content) {
        return add(MessageSegment.location(lat, lon, title, content));
    }

    public MessageBuilder music(String type, String id) {
        return add(MessageSegment.music(type, id));
    }

    public MessageBuilder file(String file, String name) {
        return add(MessageSegment.file(file, name));
    }

    public MessageBuilder node(long userId, String nickname, Object content) {
        return add(MessageSegment.node(userId, nickname, content));
    }

    /** 构建消息段列表 */
    public List<MessageSegment> build() {
        return List.copyOf(segments);
    }

    /** 构建为 JSON 数组字符串 */
    public String toJson() {
        var sb = new StringBuilder("[");
        for (int i = 0; i < segments.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(segments.get(i).toJson());
        }
        sb.append("]");
        return sb.toString();
    }

    @Override
    public String toString() {
        return toJson();
    }
}
