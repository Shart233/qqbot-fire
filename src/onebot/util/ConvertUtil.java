package onebot.util;

/**
 * 通用类型转换工具类
 *
 * 集中管理 Object → 基本类型 的安全转换，
 * 避免各处重复编写 null 检查和异常捕获逻辑。
 */
public final class ConvertUtil {

    private ConvertUtil() {}

    /** Object → int，无法转换时返回 0 */
    public static int toInt(Object obj) {
        if (obj instanceof Number n) return n.intValue();
        if (obj instanceof String s && !s.isEmpty()) {
            try { return Integer.parseInt(s); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }

    /** Object → int，无法转换时返回指定默认值 */
    public static int intOf(Object obj, int def) {
        if (obj instanceof Number n) return n.intValue();
        if (obj instanceof String s && !s.isEmpty()) {
            try { return Integer.parseInt(s); } catch (NumberFormatException e) { return def; }
        }
        return def;
    }

    /** Object → long，无法转换时返回 0 */
    public static long toLong(Object obj) {
        if (obj instanceof Number n) return n.longValue();
        if (obj instanceof String s && !s.isEmpty()) {
            try { return Long.parseLong(s); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }

    /** Object → String，null 返回空字符串 */
    public static String str(Object obj) {
        return obj != null ? String.valueOf(obj) : "";
    }

    /** Object → String，非 String 或空字符串时返回指定默认值 */
    public static String stringOf(Object obj, String def) {
        if (obj instanceof String s && !s.isEmpty()) return s;
        return def;
    }
}
