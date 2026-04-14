package onebot.message;

import onebot.util.JsonUtil;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * OneBot 11 消息段
 * 每个消息段由 type 和 data 组成，如:
 * {"type": "text", "data": {"text": "hello"}}
 */
public class MessageSegment {
    private final String type;
    private final Map<String, Object> data;

    private MessageSegment(String type, Map<String, Object> data) {
        this.type = type;
        this.data = data;
    }

    public String getType() { return type; }
    public Map<String, Object> getData() { return data; }

    // ========== 工厂方法 ==========

    /** 纯文本 */
    public static MessageSegment text(String text) {
        return of("text", Map.of("text", text));
    }

    /** @某人 */
    public static MessageSegment at(long userId) {
        return of("at", Map.of("qq", String.valueOf(userId)));
    }

    /** @全体成员 */
    public static MessageSegment atAll() {
        return of("at", Map.of("qq", "all"));
    }

    /** QQ表情 */
    public static MessageSegment face(int faceId) {
        return of("face", Map.of("id", String.valueOf(faceId)));
    }

    /** 图片 (支持URL/文件路径/Base64) */
    public static MessageSegment image(String file) {
        return of("image", Map.of("file", file));
    }

    /** 图片 (带详细参数) */
    public static MessageSegment image(String file, String type, String url) {
        var data = new LinkedHashMap<String, Object>();
        data.put("file", file);
        if (type != null) data.put("type", type);
        if (url != null) data.put("url", url);
        return of("image", data);
    }

    /** 语音 */
    public static MessageSegment record(String file) {
        return of("record", Map.of("file", file));
    }

    /** 视频 */
    public static MessageSegment video(String file) {
        return of("video", Map.of("file", file));
    }

    /** 回复 */
    public static MessageSegment reply(long messageId) {
        return of("reply", Map.of("id", String.valueOf(messageId)));
    }

    /** JSON消息 */
    public static MessageSegment json(String jsonData) {
        return of("json", Map.of("data", jsonData));
    }

    /** XML消息 */
    public static MessageSegment xml(String xmlData) {
        return of("xml", Map.of("data", xmlData));
    }

    /** Markdown消息 */
    public static MessageSegment markdown(String content) {
        return of("markdown", Map.of("content", content));
    }

    /** 戳一戳 */
    public static MessageSegment poke(int pokeType, int pokeId) {
        return of("poke", Map.of("type", String.valueOf(pokeType), "id", String.valueOf(pokeId)));
    }

    /** 骰子 */
    public static MessageSegment dice() {
        return of("dice", Map.of());
    }

    /** 猜拳 */
    public static MessageSegment rps() {
        return of("rps", Map.of());
    }

    /** 位置 */
    public static MessageSegment location(double lat, double lon, String title, String content) {
        var data = new LinkedHashMap<String, Object>();
        data.put("lat", String.valueOf(lat));
        data.put("lon", String.valueOf(lon));
        if (title != null) data.put("title", title);
        if (content != null) data.put("content", content);
        return of("location", data);
    }

    /** 音乐分享 (QQ音乐/网易云/虾米) */
    public static MessageSegment music(String musicType, String id) {
        return of("music", Map.of("type", musicType, "id", id));
    }

    /** 自定义音乐分享 */
    public static MessageSegment customMusic(String url, String audio, String title, String content, String image) {
        var data = new LinkedHashMap<String, Object>();
        data.put("type", "custom");
        data.put("url", url);
        data.put("audio", audio);
        data.put("title", title);
        if (content != null) data.put("content", content);
        if (image != null) data.put("image", image);
        return of("music", data);
    }

    /** 文件 */
    public static MessageSegment file(String file, String name) {
        var data = new LinkedHashMap<String, Object>();
        data.put("file", file);
        if (name != null) data.put("name", name);
        return of("file", data);
    }

    /** 合并转发节点 */
    public static MessageSegment node(long userId, String nickname, Object content) {
        var data = new LinkedHashMap<String, Object>();
        data.put("user_id", String.valueOf(userId));
        data.put("nickname", nickname);
        data.put("content", content);
        return of("node", data);
    }

    /** 引用已有消息的合并转发节点 */
    public static MessageSegment node(long messageId) {
        return of("node", Map.of("id", String.valueOf(messageId)));
    }

    /** 联系人分享 */
    public static MessageSegment contact(String contactType, long id) {
        return of("contact", Map.of("type", contactType, "id", String.valueOf(id)));
    }

    /** 通用构造 */
    public static MessageSegment of(String type, Map<String, Object> data) {
        return new MessageSegment(type, data);
    }

    /** 转为 JSON 字符串 */
    public String toJson() {
        var map = new LinkedHashMap<String, Object>();
        map.put("type", type);
        map.put("data", data);
        return JsonUtil.toJson(map);
    }

    @Override
    public String toString() {
        return toJson();
    }
}
