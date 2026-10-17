import onebot.client.OneBotClient;
import onebot.client.OneBotConnection;
import onebot.message.MessageSegment;
import onebot.util.GsonFactory;
import java.util.*;
import java.lang.reflect.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;

/** 通过实际 Java 客户端捕获每个公开 API 的请求，不连接真实 QQ。 */
public class GenerateOneBotFixture {
    static class Capture extends OneBotConnection {
        String action;
        Map<String, Object> params;
        Capture() { super("ws://127.0.0.1:1", null); }
        @Override public Map<String, Object> callApi(String action, Map<String, Object> params) {
            this.action = action;
            this.params = params == null ? Map.of() : params;
            return Map.of("message_id", 99L, "yes", true, "messages", List.of(Map.of("message_id", 8L)));
        }
        @Override public Object callApiRaw(String action, Map<String, Object> params) {
            this.action = action;
            this.params = params == null ? Map.of() : params;
            return List.of(Map.of("user_id", 42L, "nickname", "测试", "remark", ""));
        }
    }
    static Object argument(Class<?> type, java.lang.reflect.Type generic) {
        if (type == long.class || type == Long.class) return 42L;
        if (type == int.class || type == Integer.class) return 3;
        if (type == boolean.class || type == Boolean.class) return true;
        if (type == String.class) return "测试";
        if (Map.class.isAssignableFrom(type)) return Map.of("example", "值");
        if (List.class.isAssignableFrom(type)) return generic.getTypeName().contains("MessageSegment") ? List.of(MessageSegment.text("消息")) : List.of("42");
        return Map.of("example", "值");
    }
    public static void main(String[] args) throws Exception {
        var capture = new Capture();
        var client = new OneBotClient(capture);
        var cases = new ArrayList<Map<String, Object>>();
        var methods = Arrays.stream(OneBotClient.class.getDeclaredMethods()).filter(m -> Modifier.isPublic(m.getModifiers()) && !m.getName().equals("getProvider")).sorted(Comparator.comparing(Method::toGenericString)).toList();
        for (var method : methods) {
            var types = method.getParameterTypes();
            var generic = method.getGenericParameterTypes();
            var values = new Object[types.length];
            for (int index = 0; index < types.length; index++) values[index] = argument(types[index], generic[index]);
            if (method.getName().equals("callApi") || method.getName().equals("callApiRaw")) values[0] = "get_status";
            capture.action = null;
            method.invoke(client, values);
            cases.add(Map.of("name", method.getName(), "signature", method.toGenericString(), "args", values, "action", capture.action, "params", capture.params));
        }
        Files.writeString(Path.of("tests/fixtures/onebot-java.json"), GsonFactory.gson().toJson(cases), StandardCharsets.UTF_8);
        System.out.println("Java API 请求夹具已生成: " + cases.size());
    }
}
