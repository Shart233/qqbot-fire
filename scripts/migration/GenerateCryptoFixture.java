import java.security.KeyPairGenerator;
import java.util.Base64;
import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;

/** 使用一次性密钥生成脱敏兼容夹具，不读取生产文件。 */
public class GenerateCryptoFixture {
    public static void main(String[] args) throws Exception {
        var generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        var pair = generator.generateKeyPair();
        var cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, pair.getPublic());
        var encoder = Base64.getEncoder();
        var encrypted = cipher.doFinal("兼容测试-token".getBytes(StandardCharsets.UTF_8));
        System.out.println("{\"provider\":\"" + cipher.getProvider().getName() + "\",\"publicKey\":\""
            + encoder.encodeToString(pair.getPublic().getEncoded()) + "\",\"privateKey\":\""
            + encoder.encodeToString(pair.getPrivate().getEncoded()) + "\",\"cipherText\":\"RSA:"
            + encoder.encodeToString(encrypted) + "\"}");
    }
}
