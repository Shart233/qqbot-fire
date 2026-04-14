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
 * 支持两种 HTTP API 模式:
 *
 *   1. 标准 OneBot 11 HTTP (默认)
 *      POST http://host:port/{action}
 *      Authorization: Bearer {token}
 *      Body: {params}
 *
 *   2. NapCat Debug API
 *      POST http://host:port/api/Debug/call/debug-primary
 *      Authorization: Bearer "{token}"
 *      Body: {"action": "...", "params": {...}}
 *
 * 通过 setDebugMode(true) 切换到 Debug API 模式。
 * 首次连接会自动探测: 优先尝试标准模式，失败时回退到 Debug 模式。
 *
 * 注意: HTTP 模式不支持事件接收，只能主动调用 API。
 * 如需接收消息事件，请使用 WebSocket 模式 (OneBotConnection)。
 */
public class OneBotHttpConnection implements ApiProvider {

    private static final Logger logger = LogManager.getLogger(OneBotHttpConnection.class);

    private final String baseUrl;
    private final String accessToken;
    private final HttpClient httpClient;

    /** true = NapCat Debug API, false = 标准 OneBot 11 HTTP */
    private boolean debugMode = false;
    /** 是否已完成自动探测 */
    private boolean modeDetected = false;

    /**
     * @param baseUrl     NapCat 地址，如 http://127.0.0.1:3000 (标准) 或 http://127.0.0.1:6099 (Debug)
     * @param accessToken 访问令牌
     */
    public OneBotHttpConnection(String baseUrl, String accessToken) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.accessToken = accessToken;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        logger.info("HTTP 连接初始化完成, baseUrl={}", this.baseUrl);
    }

    public OneBotHttpConnection(String baseUrl) {
        this(baseUrl, null);
    }

    /** 手动设置 Debug API 模式 */
    public void setDebugMode(boolean debugMode) {
        this.debugMode = debugMode;
        this.modeDetected = true;
    }

    /** 是否使用 Debug API 模式 */
    public boolean isDebugMode() {
        return debugMode;
    }

    // ==================== API 调用 ====================

    /**
     * 调用 OneBot API
     * @param action API 动作名
     * @param params 参数
     * @return 响应的 data 字段 (Map)
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> callApi(String action, Map<String, Object> params) {
        autoDetectMode(action, params);

        Object rawData = doRequest(action, params);
        if (rawData instanceof Map) {
            return (Map<String, Object>) rawData;
        }
        // data 可能是 List 或 null，包装一层
        var wrapper = new LinkedHashMap<String, Object>();
        wrapper.put("data", rawData);
        return wrapper;
    }

    /**
     * 调用 API 返回原始 data (可能是 List、Map 或 null)
     */
    public Object callApiRaw(String action, Map<String, Object> params) {
        autoDetectMode(action, params);
        return doRequest(action, params);
    }

    // ==================== 核心请求 ====================

    /**
     * 发送 HTTP 请求并解析 OneBot 响应
     */
    private Object doRequest(String action, Map<String, Object> params) {
        String url;
        String json;
        String authHeader;

        if (debugMode) {
            // Debug API: POST /api/Debug/call/debug-primary, Bearer "token"
            url = baseUrl + "/api/Debug/call/debug-primary";
            var body = new LinkedHashMap<String, Object>();
            body.put("action", action);
            body.put("params", params != null ? params : Map.of());
            json = JsonUtil.toJson(body);
            authHeader = buildAuthHeader(true);
        } else {
            // 标准 OneBot 11: POST /{action}, Bearer token
            url = baseUrl + "/" + action;
            json = JsonUtil.toJson(params != null ? params : Map.of());
            authHeader = buildAuthHeader(false);
        }

        logger.debug("HTTP 请求: POST {} {}{}", url, debugMode ? "[Debug] " : "", "action=" + action);

        try {
            var requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(json));

            if (authHeader != null) {
                requestBuilder.header("Authorization", authHeader);
            }

            HttpResponse<String> response = httpClient.send(
                    requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofString());

            logger.debug("HTTP 响应: status={} body={}", response.statusCode(), response.body());

            if (response.statusCode() != 200) {
                throw new OneBotException("HTTP " + response.statusCode() + ": " + response.body());
            }

            return parseResponse(response.body(), action);
        } catch (OneBotException e) {
            throw e;
        } catch (Exception e) {
            logger.error("HTTP API 调用失败: {}", action, e);
            throw new OneBotException("HTTP API 调用失败: " + action, e);
        }
    }

    /**
     * 解析 OneBot 标准响应格式
     */
    private Object parseResponse(String responseBody, String action) {
        Map<String, Object> result = JsonUtil.parseObject(responseBody);

        String status = (String) result.get("status");
        int retcode = toInt(result.get("retcode"));

        if ("ok".equals(status) || retcode == 0) {
            return result.get("data");
        } else {
            String message = (String) result.get("message");
            String wording = (String) result.get("wording");
            throw new OneBotException("API error [" + retcode + "]: " + message + " (" + wording + ")");
        }
    }

    /**
     * 构造 Authorization 头
     * @param withQuotes Debug API 需要 Bearer "token"，标准模式使用 Bearer token
     */
    private String buildAuthHeader(boolean withQuotes) {
        if (accessToken == null || accessToken.isEmpty()) return null;
        return withQuotes
                ? "Bearer \"" + accessToken + "\""
                : "Bearer " + accessToken;
    }

    // ==================== 模式自动探测 ====================

    /**
     * 首次调用时自动探测 API 模式
     * 先尝试标准 OneBot 11 HTTP，失败后回退到 Debug API
     */
    private synchronized void autoDetectMode(String action, Map<String, Object> params) {
        if (modeDetected) return;
        modeDetected = true;

        logger.info("首次连接，自动探测 HTTP API 模式...");

        // 先尝试标准模式
        try {
            debugMode = false;
            doRequest("get_login_info", null);
            logger.info("检测到标准 OneBot 11 HTTP 接口 (POST /{action})");
            System.out.println("HTTP 模式: 标准 OneBot 11 (POST /" + "{action})");
            return;
        } catch (Exception e) {
            logger.debug("标准模式探测失败: {}", e.getMessage());
        }

        // 回退到 Debug API
        try {
            debugMode = true;
            doRequest("get_login_info", null);
            logger.info("检测到 NapCat Debug API (/api/Debug/call/debug-primary)");
            System.out.println("HTTP 模式: NapCat Debug API");
            return;
        } catch (Exception e) {
            logger.debug("Debug 模式探测失败: {}", e.getMessage());
        }

        // 都失败了，默认使用标准模式，让后续调用报出具体错误
        debugMode = false;
        logger.warn("两种 HTTP 模式均探测失败，默认使用标准 OneBot 11 模式");
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
