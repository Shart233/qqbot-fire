package onebot.client;

import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

/**
 * NapCat OneBot 11 HTTP 连接
 *
 * 通过 NapCat Debug API 发送请求:
 *   POST http://host:port/api/Debug/call/debug-primary
 *   Authorization: Bearer "token"
 *   Body: {"action": "get_login_info", "params": {}}
 *
 * 注意: HTTP 模式不支持事件接收，只能主动调用 API。
 * 如需接收消息事件，请使用 WebSocket 模式 (OneBotConnection)。
 */
public class OneBotHttpConnection implements ApiProvider {

    private static final Logger logger = LogManager.getLogger(OneBotHttpConnection.class);

    private final String baseUrl;
    private final String accessToken;
    private final HttpClient httpClient;
    private final String apiPath;

    /**
     * @param baseUrl     NapCat 地址，如 http://127.0.0.1:6099
     * @param accessToken 访问令牌
     */
    public OneBotHttpConnection(String baseUrl, String accessToken) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.accessToken = accessToken;
        this.apiPath = "/api/Debug/call/debug-primary";
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        logger.info("HTTP 连接初始化完成, baseUrl={}", this.baseUrl);
    }

    public OneBotHttpConnection(String baseUrl) {
        this(baseUrl, null);
    }

    /**
     * 调用 OneBot API
     * @param action API 动作名
     * @param params 参数
     * @return 响应的 data 字段 (Map)
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> callApi(String action, Map<String, Object> params) {
        var body = new LinkedHashMap<String, Object>();
        body.put("action", action);
        body.put("params", params != null ? params : Map.of());

        String json = JsonUtil.toJson(body);
        String url = baseUrl + apiPath;

        logger.debug("HTTP 请求: POST {} action={}", url, action);

        try {
            var requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json));

            // NapCat Debug API 使用 Bearer "token" (带引号)
            if (accessToken != null && !accessToken.isEmpty()) {
                requestBuilder.header("Authorization", "Bearer \"" + accessToken + "\"");
            }

            HttpResponse<String> response = httpClient.send(
                    requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofString());

            logger.debug("HTTP 响应: status={} body={}", response.statusCode(), response.body());

            if (response.statusCode() != 200) {
                throw new OneBotException("HTTP " + response.statusCode() + ": " + response.body());
            }

            Map<String, Object> result = JsonUtil.parseObject(response.body());

            // 检查 OneBot 响应
            String status = (String) result.get("status");
            int retcode = toInt(result.get("retcode"));

            if ("ok".equals(status) || retcode == 0) {
                Object data = result.get("data");
                if (data instanceof Map) {
                    return (Map<String, Object>) data;
                }
                // data 可能是 List 或 null
                var wrapper = new LinkedHashMap<String, Object>();
                wrapper.put("data", data);
                return wrapper;
            } else {
                String message = (String) result.get("message");
                String wording = (String) result.get("wording");
                throw new OneBotException("API error [" + retcode + "]: " + message + " (" + wording + ")");
            }
        } catch (OneBotException e) {
            throw e;
        } catch (Exception e) {
            logger.error("HTTP API 调用失败: {}", action, e);
            throw new OneBotException("HTTP API 调用失败: " + action, e);
        }
    }

    /**
     * 调用 API 返回原始 data (可能是 List)
     */
    @SuppressWarnings("unchecked")
    public Object callApiRaw(String action, Map<String, Object> params) {
        var body = new LinkedHashMap<String, Object>();
        body.put("action", action);
        body.put("params", params != null ? params : Map.of());

        String json = JsonUtil.toJson(body);
        String url = baseUrl + apiPath;

        logger.debug("HTTP 请求: POST {} action={}", url, action);

        try {
            var requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json));

            if (accessToken != null && !accessToken.isEmpty()) {
                requestBuilder.header("Authorization", "Bearer \"" + accessToken + "\"");
            }

            HttpResponse<String> response = httpClient.send(
                    requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new OneBotException("HTTP " + response.statusCode() + ": " + response.body());
            }

            Map<String, Object> result = JsonUtil.parseObject(response.body());
            String status = (String) result.get("status");
            int retcode = toInt(result.get("retcode"));

            if ("ok".equals(status) || retcode == 0) {
                return result.get("data");
            } else {
                String message = (String) result.get("message");
                String wording = (String) result.get("wording");
                throw new OneBotException("API error [" + retcode + "]: " + message + " (" + wording + ")");
            }
        } catch (OneBotException e) {
            throw e;
        } catch (Exception e) {
            throw new OneBotException("HTTP API 调用失败: " + action, e);
        }
    }

    /** 总是返回 false (HTTP 无持久连接) */
    public boolean isConnected() {
        return true; // HTTP 无状态，只要配置了就算"连接"
    }

    /** HTTP 无需关闭 */
    public void close() {
        logger.info("HTTP 连接已关闭");
    }

    private static int toInt(Object obj) {
        if (obj instanceof Number n) return n.intValue();
        if (obj instanceof String s && !s.isEmpty()) {
            try { return Integer.parseInt(s); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }
}
