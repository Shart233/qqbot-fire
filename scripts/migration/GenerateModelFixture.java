import onebot.util.GsonFactory;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import java.lang.reflect.*;
import java.nio.file.*;
import java.util.*;

/** 实际执行旧版模型转换，记录缺省值、空值、嵌套模型和类型边界。 */
public class GenerateModelFixture {
    static Object dump(Object value) throws Exception {
        if (value == null || value instanceof String || value instanceof Number || value instanceof Boolean) return value;
        if (value instanceof List<?> list) {
            var result = new ArrayList<Object>();
            for (var item : list) result.add(dump(item));
            return result;
        }
        if (value instanceof Map<?, ?>) return value;
        var result = new LinkedHashMap<String, Object>();
        for (var field : value.getClass().getDeclaredFields()) {
            if (Modifier.isStatic(field.getModifiers())) continue;
            field.setAccessible(true);
            result.put(field.getName(), dump(field.get(value)));
        }
        return result;
    }
    public static void main(String[] args) throws Exception {
        var cases = new ArrayList<Map<String, Object>>();
        for (var name : List.of("FriendInfo", "GroupInfo", "GroupMember", "LoginInfo", "MessageData", "Sender", "StrangerInfo", "VersionInfo")) {
            var model = Class.forName("onebot.model." + name);
            var converted = new LinkedHashMap<String, Object>();
            for (var field : model.getDeclaredFields()) {
                if (Modifier.isStatic(field.getModifiers())) continue;
                var type = field.getType();
                converted.put(field.getName(), type == boolean.class ? "1" : type.isPrimitive() ? "42" : type == String.class ? 17 : List.class.isAssignableFrom(type) ? List.of(Map.of("type", "text", "data", Map.of("text", "中文"))) : Map.of("user_id", "7"));
            }
            var nulls = new LinkedHashMap<String, Object>();
            for (var field : model.getDeclaredFields()) nulls.put(field.getName(), null);
            var inputs = new ArrayList<Object>(Arrays.asList(Map.of(), null, converted, nulls));
            if (name.equals("GroupMember")) inputs.add(Map.of("is_robot", Map.of("bad", true), "age", "非法"));
            if (name.equals("GroupInfo")) {
                inputs.add(Map.of("group_all_shut", List.of(true), "member_count", 2.9));
                inputs.add(Map.of("group_name", true, "group_id", "8", "unused", "忽略"));
            }
            for (var input : inputs) {
                var item = new LinkedHashMap<String, Object>();
                item.put("model", name); item.put("input", input);
                try { item.put("expected", dump(GsonFactory.convert(input, model))); }
                catch (Exception error) { item.put("error", true); }
                cases.add(item);
            }
        }
        Files.writeString(Path.of(args[0]), new GsonBuilder().serializeNulls().setPrettyPrinting().create().toJson(cases));
    }
}
