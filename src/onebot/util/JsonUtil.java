package onebot.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.*;

/**
 * 轻量级 JSON 工具类 (无第三方依赖)
 * 支持：序列化 Map/List/POJO -> JSON 字符串
 *       反序列化 JSON 字符串 -> Map/List (然后手动映射到 POJO)
 */
public class JsonUtil {

    // ==================== 序列化 ====================

    public static String toJson(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof String s) return quote(s);
        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();
        if (obj instanceof Map<?, ?> map) return mapToJson(map);
        if (obj instanceof List<?> list) return listToJson(list);
        if (obj.getClass().isArray()) return arrayToJson(obj);
        // POJO -> 通过反射转 Map
        return mapToJson(pojoToMap(obj));
    }

    private static String mapToJson(Map<?, ?> map) {
        var sb = new StringBuilder("{");
        var first = true;
        for (var entry : map.entrySet()) {
            if (entry.getValue() == null) continue;
            if (!first) sb.append(",");
            first = false;
            sb.append(quote(String.valueOf(entry.getKey())))
              .append(":")
              .append(toJson(entry.getValue()));
        }
        sb.append("}");
        return sb.toString();
    }

    private static String listToJson(List<?> list) {
        var sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(list.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }

    private static String arrayToJson(Object arr) {
        var sb = new StringBuilder("[");
        int len = Array.getLength(arr);
        for (int i = 0; i < len; i++) {
            if (i > 0) sb.append(",");
            sb.append(toJson(Array.get(arr, i)));
        }
        sb.append("]");
        return sb.toString();
    }

    private static Map<String, Object> pojoToMap(Object obj) {
        var map = new LinkedHashMap<String, Object>();
        for (var field : obj.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                var val = field.get(obj);
                if (val != null) {
                    map.put(field.getName(), val);
                }
            } catch (IllegalAccessException ignored) {}
        }
        return map;
    }

    private static String quote(String s) {
        return "\"" + escape(s) + "\"";
    }

    private static String escape(String s) {
        if (s == null) return "";
        var sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                case '\b' -> sb.append("\\b");
                case '\f' -> sb.append("\\f");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.toString();
    }

    // ==================== 反序列化 ====================

    /**
     * 解析 JSON 字符串为 Map 或 List
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseObject(String json) {
        if (json == null || json.isBlank()) return Map.of();
        json = json.strip();
        var result = parseValue(json, new int[]{0});
        return result instanceof Map ? (Map<String, Object>) result : Map.of();
    }

    @SuppressWarnings("unchecked")
    public static List<Map<String, Object>> parseArray(String json) {
        if (json == null || json.isBlank()) return List.of();
        json = json.strip();
        var result = parseValue(json, new int[]{0});
        return result instanceof List ? (List<Map<String, Object>>) result : List.of();
    }

    private static Object parseValue(String json, int[] pos) {
        skipWhitespace(json, pos);
        if (pos[0] >= json.length()) return null;
        char c = json.charAt(pos[0]);
        return switch (c) {
            case '{' -> parseMap(json, pos);
            case '[' -> parseList(json, pos);
            case '"' -> parseString(json, pos);
            case 't', 'f' -> parseBoolean(json, pos);
            case 'n' -> parseNull(json, pos);
            default -> parseNumber(json, pos);
        };
    }

    private static Map<String, Object> parseMap(String json, int[] pos) {
        var map = new LinkedHashMap<String, Object>();
        pos[0]++; // skip '{'
        skipWhitespace(json, pos);
        if (pos[0] < json.length() && json.charAt(pos[0]) == '}') {
            pos[0]++;
            return map;
        }
        while (pos[0] < json.length()) {
            skipWhitespace(json, pos);
            String key = parseString(json, pos);
            skipWhitespace(json, pos);
            if (pos[0] < json.length() && json.charAt(pos[0]) == ':') pos[0]++;
            skipWhitespace(json, pos);
            Object value = parseValue(json, pos);
            map.put(key, value);
            skipWhitespace(json, pos);
            if (pos[0] < json.length() && json.charAt(pos[0]) == ',') {
                pos[0]++;
            } else {
                break;
            }
        }
        if (pos[0] < json.length() && json.charAt(pos[0]) == '}') pos[0]++;
        return map;
    }

    private static List<Object> parseList(String json, int[] pos) {
        var list = new ArrayList<Object>();
        pos[0]++; // skip '['
        skipWhitespace(json, pos);
        if (pos[0] < json.length() && json.charAt(pos[0]) == ']') {
            pos[0]++;
            return list;
        }
        while (pos[0] < json.length()) {
            skipWhitespace(json, pos);
            list.add(parseValue(json, pos));
            skipWhitespace(json, pos);
            if (pos[0] < json.length() && json.charAt(pos[0]) == ',') {
                pos[0]++;
            } else {
                break;
            }
        }
        if (pos[0] < json.length() && json.charAt(pos[0]) == ']') pos[0]++;
        return list;
    }

    private static String parseString(String json, int[] pos) {
        if (json.charAt(pos[0]) != '"') return "";
        pos[0]++; // skip opening quote
        var sb = new StringBuilder();
        while (pos[0] < json.length()) {
            char c = json.charAt(pos[0]);
            if (c == '\\' && pos[0] + 1 < json.length()) {
                pos[0]++;
                char next = json.charAt(pos[0]);
                switch (next) {
                    case '"' -> sb.append('"');
                    case '\\' -> sb.append('\\');
                    case '/' -> sb.append('/');
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case 'b' -> sb.append('\b');
                    case 'f' -> sb.append('\f');
                    case 'u' -> {
                        if (pos[0] + 4 < json.length()) {
                            String hex = json.substring(pos[0] + 1, pos[0] + 5);
                            sb.append((char) Integer.parseInt(hex, 16));
                            pos[0] += 4;
                        }
                    }
                    default -> sb.append(next);
                }
            } else if (c == '"') {
                pos[0]++;
                return sb.toString();
            } else {
                sb.append(c);
            }
            pos[0]++;
        }
        return sb.toString();
    }

    private static Number parseNumber(String json, int[] pos) {
        int start = pos[0];
        boolean isFloat = false;
        if (pos[0] < json.length() && json.charAt(pos[0]) == '-') pos[0]++;
        while (pos[0] < json.length()) {
            char c = json.charAt(pos[0]);
            if (c == '.' || c == 'e' || c == 'E') isFloat = true;
            if (Character.isDigit(c) || c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') {
                pos[0]++;
            } else {
                break;
            }
        }
        // 防止空字符串
        if (start == pos[0]) {
            pos[0]++;
            return 0;
        }
        String num = json.substring(start, pos[0]);
        if (isFloat) return Double.parseDouble(num);
        long val = Long.parseLong(num);
        if (val >= Integer.MIN_VALUE && val <= Integer.MAX_VALUE) return (int) val;
        return val;
    }

    private static Boolean parseBoolean(String json, int[] pos) {
        if (json.startsWith("true", pos[0])) {
            pos[0] += 4;
            return true;
        }
        pos[0] += 5;
        return false;
    }

    private static Object parseNull(String json, int[] pos) {
        pos[0] += 4;
        return null;
    }

    private static void skipWhitespace(String json, int[] pos) {
        while (pos[0] < json.length() && Character.isWhitespace(json.charAt(pos[0]))) {
            pos[0]++;
        }
    }

    // ==================== Map -> POJO 映射 ====================

    /**
     * 将 Map 映射到 POJO（按字段名匹配）
     */
    public static <T> T mapToBean(Map<String, Object> map, Class<T> clazz) {
        try {
            T obj = clazz.getDeclaredConstructor().newInstance();
            for (var field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                Object val = map.get(field.getName());
                if (val == null) continue;
                field.set(obj, convertValue(val, field.getType()));
            }
            return obj;
        } catch (Exception e) {
            throw new RuntimeException("Failed to map to " + clazz.getSimpleName(), e);
        }
    }

    public static <T> List<T> mapToList(List<Map<String, Object>> list, Class<T> clazz) {
        var result = new ArrayList<T>();
        for (var map : list) {
            result.add(mapToBean(map, clazz));
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    private static Object convertValue(Object val, Class<?> targetType) {
        if (val == null) return null;
        if (targetType.isAssignableFrom(val.getClass())) return val;

        // Number conversions
        if (val instanceof Number num) {
            if (targetType == int.class || targetType == Integer.class) return num.intValue();
            if (targetType == long.class || targetType == Long.class) return num.longValue();
            if (targetType == double.class || targetType == Double.class) return num.doubleValue();
            if (targetType == float.class || targetType == Float.class) return num.floatValue();
            if (targetType == boolean.class || targetType == Boolean.class) return num.intValue() != 0;
        }

        // String -> number
        if (val instanceof String s && !s.isEmpty()) {
            try {
                if (targetType == int.class || targetType == Integer.class) return Integer.parseInt(s);
                if (targetType == long.class || targetType == Long.class) return Long.parseLong(s);
                if (targetType == double.class || targetType == Double.class) return Double.parseDouble(s);
                if (targetType == boolean.class || targetType == Boolean.class) return Boolean.parseBoolean(s);
            } catch (NumberFormatException ignored) {}
        }

        if (targetType == String.class) return String.valueOf(val);
        if (targetType == boolean.class || targetType == Boolean.class) {
            if (val instanceof Boolean b) return b;
            return false;
        }

        return val;
    }
}
