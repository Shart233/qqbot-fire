package onebot.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

/**
 * JWT 签发与校验工具
 *
 * 使用 com.auth0:java-jwt，算法 HS256。
 * 密钥存放在 .keys/jwt.secret（32 字节随机，首次启动自动生成）。
 * payload 带 pwdVer（密码哈希前 8 位），改密后旧 token 验签失败，实现即时吊销。
 */
public class JwtUtil {

    private static final Logger logger = LogManager.getLogger(JwtUtil.class);

    private static final String KEY_DIR = ".keys";
    private static final String SECRET_FILE = "jwt.secret";
    private static final int SECRET_BYTES = 32;

    public static final long DEFAULT_TTL_MS = 7L * 24 * 3600 * 1000;

    private static volatile Algorithm algorithm;

    private JwtUtil() {}

    /** 加载或生成 HMAC 密钥 */
    public static synchronized void init() {
        if (algorithm != null) return;
        try {
            Path keyDir = Path.of(KEY_DIR);
            Path secretFile = keyDir.resolve(SECRET_FILE);
            byte[] secretBytes;
            if (Files.exists(secretFile)) {
                secretBytes = Base64.getDecoder().decode(Files.readString(secretFile).strip());
            } else {
                Files.createDirectories(keyDir);
                secretBytes = new byte[SECRET_BYTES];
                new SecureRandom().nextBytes(secretBytes);
                Files.writeString(secretFile, Base64.getEncoder().encodeToString(secretBytes));
                logger.info("已生成新的 JWT 密钥: {}", secretFile.toAbsolutePath());
            }
            algorithm = Algorithm.HMAC256(secretBytes);
        } catch (Exception e) {
            throw new RuntimeException("JWT 密钥初始化失败", e);
        }
    }

    private static Algorithm algo() {
        if (algorithm == null) init();
        return algorithm;
    }

    /** 签发 token */
    public static String sign(String subject, String pwdVer, long ttlMs) {
        long now = System.currentTimeMillis();
        return JWT.create()
                .withSubject(subject)
                .withClaim("pwdVer", pwdVer == null ? "" : pwdVer)
                .withIssuedAt(new Date(now))
                .withExpiresAt(new Date(now + ttlMs))
                .sign(algo());
    }

    /** 签发默认有效期 token */
    public static String sign(String subject, String pwdVer) {
        return sign(subject, pwdVer, DEFAULT_TTL_MS);
    }

    /**
     * 校验 token
     * @return 成功返回 subject；失败（签名错/过期/pwdVer 不匹配）返回 null
     */
    public static String verify(String token, String expectedPwdVer) {
        if (token == null || token.isEmpty()) return null;
        try {
            DecodedJWT jwt = JWT.require(algo())
                    .withClaim("pwdVer", expectedPwdVer == null ? "" : expectedPwdVer)
                    .build()
                    .verify(token);
            return jwt.getSubject();
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    /** 返回默认有效期毫秒数 */
    public static long defaultTtlMs() {
        return DEFAULT_TTL_MS;
    }
}
