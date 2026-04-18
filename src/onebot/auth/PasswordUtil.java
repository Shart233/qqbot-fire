package onebot.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码哈希工具
 *
 * 基于 Spring Security Crypto 的 BCryptPasswordEncoder（strength=10）。
 * 仅使用其单模块依赖，不引入 Spring 容器。
 */
public class PasswordUtil {

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder(10);

    private PasswordUtil() {}

    /** 生成 bcrypt 哈希（含盐，线程安全） */
    public static String hash(String plain) {
        return ENCODER.encode(plain);
    }

    /** 校验明文是否匹配给定的 bcrypt 哈希 */
    public static boolean verify(String plain, String stored) {
        if (plain == null || stored == null || stored.isEmpty()) return false;
        try {
            return ENCODER.matches(plain, stored);
        } catch (Exception e) {
            return false;
        }
    }

    /** 取哈希前 8 位作为密码版本号（改密后会变化，用于吊销旧 JWT） */
    public static String passwordVersion(String hash) {
        if (hash == null || hash.length() < 8) return "";
        return hash.substring(0, 8);
    }
}
