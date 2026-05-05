package onebot.util;

import java.util.regex.Pattern;

/**
 * 标识符白名单校验工具。
 *
 * 用于 Bot 名称、NapCat 实例名等会被拼接到文件路径或 Map key 的字段，
 * 防止路径穿越（../）、控制字符、Unicode 同形字符等攻击载体。
 */
public final class NameUtil {

    /** 白名单：字母、数字、下划线、短横线，长度 1-64 */
    private static final Pattern VALID = Pattern.compile("^[a-zA-Z0-9_-]{1,64}$");

    private NameUtil() {}

    public static boolean isValidIdentifier(String name) {
        return name != null && VALID.matcher(name).matches();
    }

    /**
     * 校验失败抛 IllegalArgumentException，消息中含字段名（中文友好提示）。
     * 上层应 catch 并回 400。
     */
    public static void requireValidIdentifier(String name, String fieldName) {
        if (!isValidIdentifier(name)) {
            throw new IllegalArgumentException(
                    fieldName + " 仅允许字母数字下划线短横线，长度 1-64");
        }
    }
}
