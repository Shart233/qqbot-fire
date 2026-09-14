package onebot.napcat;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import onebot.util.GsonFactory;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;

/** 通过本机 NapCat WebUI 获取登录状态，凭证仅保存在后端内存中。 */
public class NapCatLoginClient {
    private static final HttpClient HTTP = HttpClient.newBuilder()
            // NapCat 的本地 HTTP 服务不支持 JDK 默认的明文 HTTP/2 升级请求。
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(3)).build();
    private static final int MAX_IMAGE_BYTES = 1024 * 1024;
    private final NapCatLauncher.NapCatProcess instance;
    private String credential = "";
    private long credentialExpiresAt;

    public NapCatLoginClient(NapCatLauncher.NapCatProcess instance) {
        this.instance = instance;
    }

    /** 状态读取失败时仍可展示本次进程生成的原始二维码，但不猜测登录成功。 */
    public synchronized Map<String, Object> status() throws IOException {
        var result = new LinkedHashMap<String, Object>();
        result.put("name", instance.name);
        result.put("qqUin", instance.qqUin);
        result.put("state", "waiting");
        result.put("message", "正在等待 NapCat 生成二维码");
        result.put("qrImage", "");
        result.put("qrVersion", "");
        result.put("canRefresh", false);
        String loginError = "";
        try {
            var status = request("/QQLogin/CheckLoginStatus");
            result.put("canRefresh", true);
            if (status.has("isLogin") && status.get("isLogin").getAsBoolean()) {
                result.put("state", "logged_in");
                result.put("message", "QQ 已登录，可以返回 Bot 页面查看连接状态");
                return result;
            }
            loginError = status.has("loginError") && !status.get("loginError").isJsonNull()
                    ? status.get("loginError").getAsString() : "";
            if (!loginError.isBlank()) {
                result.put("state", "error");
                result.put("message", loginError);
                if (loginError.contains("二维码") && loginError.contains("过期")) return result;
            }
            if (status.has("isOffline") && status.get("isOffline").getAsBoolean()) {
                result.put("state", "error");
                result.put("message", "QQ 已离线，请在 NapCat 页面重启此实例后重新扫码");
                return result;
            }
        } catch (IOException e) {
            result.put("message", "登录状态暂不可用，正在重试；可先尝试扫描下方二维码");
        }

        // 只读取受管实例的固定文件，不接受客户端提供路径或远程图片地址。
        Path imagePath = Path.of(instance.workDir, "cache", "qrcode.png");
        if (!Files.isRegularFile(imagePath)) return result;
        long modified = Files.getLastModifiedTime(imagePath).toMillis();
        long started = instance.process.info().startInstant().map(t -> t.toEpochMilli()).orElse(Long.MAX_VALUE);
        if (modified < started || Files.size(imagePath) > MAX_IMAGE_BYTES) return result;
        byte[] bytes;
        try (var input = Files.newInputStream(imagePath)) {
            bytes = input.readNBytes(MAX_IMAGE_BYTES + 1);
        }
        byte[] signature = {(byte) 137, 80, 78, 71, 13, 10, 26, 10};
        if (bytes.length < 8 || bytes.length > MAX_IMAGE_BYTES
                || !java.util.Arrays.equals(signature, java.util.Arrays.copyOf(bytes, 8))) return result;
        result.put("qrImage", "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes));
        result.put("qrVersion", sha256(bytes));
        result.put("state", "qr_ready");
        if (Boolean.TRUE.equals(result.get("canRefresh"))) {
            result.put("message", (loginError.isBlank() ? "" : loginError + " ")
                    + "请使用手机 QQ 扫码，并在手机上确认登录");
        }
        return result;
    }

    /** 仅刷新登录二维码，不停止实例或影响其他 Bot。 */
    public synchronized void refresh() throws IOException {
        request("/QQLogin/RefreshQRcode");
    }

    private JsonObject request(String action) throws IOException {
        if (credential.isEmpty() || System.currentTimeMillis() >= credentialExpiresAt) login();
        var response = post(action, Map.of(), credential);
        if (response.has("message") && "Unauthorized".equals(response.get("message").getAsString())) {
            credential = "";
            login();
            response = post(action, Map.of(), credential);
        }
        return data(response);
    }

    private void login() throws IOException {
        try {
            // 初次启动时配置可能尚未生成，因此每次重新认证都读取配置。
            var config = JsonParser.parseString(Files.readString(
                    Path.of(instance.workDir, "config", "webui.json"))).getAsJsonObject();
            String token = config.get("token").getAsString();
            var auth = data(post("/auth/login", Map.of("hash",
                    sha256((token + ".napcat").getBytes(StandardCharsets.UTF_8))), ""));
            if (!auth.has("Credential")) throw new IOException("NapCat 认证需要额外验证");
            credential = auth.get("Credential").getAsString();
            credentialExpiresAt = System.currentTimeMillis() + Duration.ofMinutes(50).toMillis();
        } catch (RuntimeException e) {
            throw new IOException("NapCat 登录配置尚未就绪", e);
        }
    }

    private JsonObject post(String path, Map<String, Object> body, String auth) throws IOException {
        if (instance.webuiPort < 1 || instance.webuiPort > 65535) throw new IOException("WebUI 端口无效");
        var builder = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + instance.webuiPort + "/api" + path))
                .timeout(Duration.ofSeconds(4)).header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(GsonFactory.gson().toJson(body)));
        if (!auth.isEmpty()) builder.header("Authorization", "Bearer " + auth);
        try {
            var response = HTTP.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) throw new IOException("NapCat 登录接口暂不可用");
            return JsonParser.parseString(response.body()).getAsJsonObject();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("NapCat 登录请求被中断", e);
        } catch (RuntimeException e) {
            throw new IOException("NapCat 登录接口返回异常", e);
        }
    }

    private JsonObject data(JsonObject response) throws IOException {
        if (!response.has("code") || response.get("code").getAsInt() != 0) {
            throw new IOException("NapCat 暂时无法处理登录请求");
        }
        return response.has("data") && response.get("data").isJsonObject()
                ? response.getAsJsonObject("data") : new JsonObject();
    }

    private static String sha256(byte[] bytes) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new IllegalStateException("当前环境不支持 SHA-256", e);
        }
    }
}
