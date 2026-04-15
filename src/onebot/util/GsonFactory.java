package onebot.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Gson 工厂，提供项目统一的 Gson 实例。
 *
 * 命名策略: IDENTITY — 字段名即 JSON 键名。
 * model 类字段已是 snake_case (group_id, user_id)，与 OneBot 11 JSON 一致；
 * 配置类字段是 camelCase (wsUrl, httpUrl)，与 config.json 一致。
 */
public class GsonFactory {

    private static final Gson GSON = new GsonBuilder()
            .disableHtmlEscaping()
            .create();

    private static final Gson PRETTY = new GsonBuilder()
            .disableHtmlEscaping()
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
