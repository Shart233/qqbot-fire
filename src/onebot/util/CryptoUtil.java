package onebot.util;

import javax.crypto.Cipher;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * RSA 加解密工具
 *
 * 用于保护 config.json 中的 accessToken 等敏感字段。
 * 密钥对保存在项目目录下的 .keys/ 目录中。
 *
 * 加密后的字符串格式: "RSA:" + Base64(密文)
 * 未加密的字符串直接返回原文
 */
public class CryptoUtil {

    private static final String KEY_DIR = ".keys";
    private static final String PUBLIC_KEY_FILE = "public.key";
    private static final String PRIVATE_KEY_FILE = "private.key";
    private static final String RSA_PREFIX = "RSA:";
    private static final int KEY_SIZE = 2048;

    private static PublicKey publicKey;
    private static PrivateKey privateKey;

    /**
     * 初始化密钥对（如果不存在则自动生成）
     */
    public static void init() {
        try {
            Path keyDir = Path.of(KEY_DIR);
            Path pubFile = keyDir.resolve(PUBLIC_KEY_FILE);
            Path priFile = keyDir.resolve(PRIVATE_KEY_FILE);

            if (Files.exists(pubFile) && Files.exists(priFile)) {
                // 加载已有密钥
                byte[] pubBytes = Base64.getDecoder().decode(Files.readString(pubFile).strip());
                byte[] priBytes = Base64.getDecoder().decode(Files.readString(priFile).strip());

                KeyFactory kf = KeyFactory.getInstance("RSA");
                publicKey = kf.generatePublic(new X509EncodedKeySpec(pubBytes));
                privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(priBytes));
            } else {
                // 生成新密钥对
                Files.createDirectories(keyDir);

                KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
                gen.initialize(KEY_SIZE);
                KeyPair pair = gen.generateKeyPair();

                publicKey = pair.getPublic();
                privateKey = pair.getPrivate();

                Files.writeString(pubFile, Base64.getEncoder().encodeToString(publicKey.getEncoded()));
                Files.writeString(priFile, Base64.getEncoder().encodeToString(privateKey.getEncoded()));
            }
        } catch (Exception e) {
            throw new RuntimeException("RSA 密钥初始化失败", e);
        }
    }

    /**
     * RSA 加密字符串
     * @return "RSA:" + Base64(密文)
     */
    public static String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) return plainText;
        ensureInit();
        try {
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, publicKey);
            byte[] encrypted = cipher.doFinal(plainText.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return RSA_PREFIX + Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("RSA 加密失败", e);
        }
    }

    /**
     * RSA 解密字符串
     * 如果不是 "RSA:" 开头则直接返回原文（兼容未加密的旧配置）
     */
    public static String decrypt(String cipherText) {
        if (cipherText == null || cipherText.isEmpty()) return cipherText;
        if (!cipherText.startsWith(RSA_PREFIX)) return cipherText; // 未加密，直接返回
        ensureInit();
        try {
            byte[] encrypted = Base64.getDecoder().decode(cipherText.substring(RSA_PREFIX.length()));
            Cipher cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE, privateKey);
            byte[] decrypted = cipher.doFinal(encrypted);
            return new String(decrypted, java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("RSA 解密失败 (密钥可能已更换，请重新 /set token)", e);
        }
    }

    /**
     * 判断字符串是否已加密
     */
    public static boolean isEncrypted(String text) {
        return text != null && text.startsWith(RSA_PREFIX);
    }

    private static void ensureInit() {
        if (publicKey == null || privateKey == null) {
            init();
        }
    }
}
