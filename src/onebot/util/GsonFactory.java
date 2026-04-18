package onebot.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Gson 工厂，提供项目统一的 Gson 实例。
 *
 * 命名策略: IDENTITY — 字段名即 JSON 键名。
 * model 类字段已是 snake_case (group_id, user_id)，与 OneBot 11 JSON 一致；
 * 配置类字段是 camelCase (wsUrl, httpUrl)，与 config.json 一致。
 *
 * 注册宽松 Boolean 适配器：NapCat 等实现会把部分布尔字段以数字 0/1 返回
 * (例如 group_all_shut、is_robot)，默认 Gson 会抛 IllegalStateException。
 * 这里统一兼容 boolean / number / string 三种输入形式。
 */
public class GsonFactory {

    /** 宽松 Boolean 适配器：兼容 true/false、数字 0/1、字符串 "true"/"false"/"0"/"1"。 */
    private static final TypeAdapter<Boolean> LENIENT_BOOLEAN = new TypeAdapter<>() {
        @Override
        public void write(JsonWriter out, Boolean value) throws IOException {
            if (value == null) {
                out.nullValue();
            } else {
                out.value(value);
            }
        }

        @Override
        public Boolean read(JsonReader in) throws IOException {
            JsonToken token = in.peek();
            switch (token) {
                case BOOLEAN:
                    return in.nextBoolean();
                case NUMBER:
                    return in.nextLong() != 0L;
                case STRING: {
                    String s = in.nextString();
                    if (s == null) return false;
                    String t = s.trim();
                    if ("1".equals(t) || "true".equalsIgnoreCase(t)) return true;
                    if ("0".equals(t) || "false".equalsIgnoreCase(t) || t.isEmpty()) return false;
                    return Boolean.parseBoolean(t);
                }
                case NULL:
                    in.nextNull();
                    return false;
                default:
                    in.skipValue();
                    return false;
            }
        }
    };

    private static final Gson GSON = new GsonBuilder()
            .disableHtmlEscaping()
            .registerTypeAdapter(Boolean.class, LENIENT_BOOLEAN)
            .registerTypeAdapter(boolean.class, LENIENT_BOOLEAN)
            .create();

    private static final Gson PRETTY = new GsonBuilder()
            .disableHtmlEscaping()
            .registerTypeAdapter(Boolean.class, LENIENT_BOOLEAN)
            .registerTypeAdapter(boolean.class, LENIENT_BOOLEAN)
            .setPrettyPrinting()
            .create();

    /** 标准 Gson 实例 (紧凑输出) */
    public static Gson gson() { return GSON; }

    /** Pretty-print Gson 实例 (配置文件输出用) */
    public static Gson pretty() { return PRETTY; }

    /** 将 Map/Object 转为指定 POJO 类型 (替代 JsonUtil.mapToBean) */
    public static <T> T convert(Object obj, Class<T> type) {
        return GSON.fromJson(GSON.toJsonTree(obj), type);
    }

    /** 将 List<Map> 转为 List<POJO> (替代 JsonUtil.mapToList) */
    public static <T> List<T> convertList(List<?> list, Class<T> elementType) {
        return list.stream()
                .map(item -> convert(item, elementType))
                .collect(Collectors.toList());
    }
}
