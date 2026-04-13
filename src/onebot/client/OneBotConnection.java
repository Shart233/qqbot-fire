package onebot.client;

import onebot.event.OneBotEvent;
import onebot.handler.EventDispatcher;
import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * NapCat OneBot 11 统一 WebSocket 连接
 *
 * 通过单一 WebSocket 连接同时实现:
 * - API 调用: 发送 {action, params, echo} 并通过 echo 匹配响应
 * - 事件接收: 没有 echo 的消息作为事件分发到 EventDispatcher
 *
 * 这是参照 NapLink 官方 SDK 的架构实现的。
 *
 * 用法:
 *   var conn = new OneBotConnection("ws://127.0.0.1:3001", "token", dispatcher);
 *   conn.connect();
 *   var result = conn.callApi("get_login_info", Map.of());
 */
public class OneBotConnection implements ApiProvider {

    private static final Logger logger = LogManager.getLogger(OneBotConnection.class);

    private final String wsUrl;
    private final String accessToken;
    private final EventDispatcher dispatcher;
    private final HttpClient httpClient;

    // 请求-响应匹配: echo -> CompletableFuture
    private final ConcurrentHashMap<String, CompletableFuture<Map<String, Object>>> pendingRequests = new ConcurrentHashMap<>();
    private final AtomicLong requestIdCounter = new AtomicLong(0);

    // 连接状态
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicBoolean reconnecting = new AtomicBoolean(false);
    private final AtomicReference<WebSocket> wsRef = new AtomicReference<>();
    private final CountDownLatch closeLatch = new CountDownLatch(1);
    private final CountDownLatch connectedLatch = new CountDownLatch(1);

    /** 重连间隔 (秒) */
    private int reconnectInterval = 5;
    /** 最大重连间隔 (秒) */
    private int maxReconnectInterval = 60;
    /** 是否启用自动重连 */
    private boolean autoReconnect = true;
    /** API 调用超时 (秒) */
    private int apiTimeout = 30;

    public OneBotConnection(String wsUrl, EventDispatcher dispatcher) {
        this(wsUrl, null, dispatcher);
    }

    public OneBotConnection(String wsUrl, String accessToken, EventDispatcher dispatcher) {
        this.wsUrl = wsUrl;
        this.accessToken = accessToken;
        this.dispatcher = dispatcher;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public void setAutoReconnect(boolean autoReconnect) {
        this.autoReconnect = autoReconnect;
    }

    public void setReconnectInterval(int seconds) {
        this.reconnectInterval = seconds;
    }

    public void setApiTimeout(int seconds) {
        this.apiTimeout = seconds;
    }

    // ==================== 连接管理 ====================

    /** 建立 WebSocket 连接 */
    public void connect() {
        if (running.getAndSet(true)) {
            logger.warn("连接已在运行中");
            return;
        }
        doConnect();
    }

    private void doConnect() {
        try {
            String url = wsUrl;
            if (accessToken != null && !accessToken.isEmpty()) {
                String encodedToken = URLEncoder.encode(accessToken, StandardCharsets.UTF_8);
                url += (url.contains("?") ? "&" : "?") + "access_token=" + encodedToken;
            }

            logger.info("正在连接 WebSocket: {}", wsUrl);

            var listener = new WsListener();
            WebSocket ws = httpClient.newWebSocketBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .buildAsync(URI.create(url), listener)
                    .join();

            wsRef.set(ws);
            connectedLatch.countDown();
            logger.info("WebSocket 连接成功: {}", wsUrl);

        } catch (Exception e) {
            logger.error("WebSocket 连接失败: {}", wsUrl, e);
            scheduleReconnect();
        }
    }

    /** 关闭连接 */
    public void close() {
        running.set(false);
        autoReconnect = false;

        // 拒绝所有待处理请求
        pendingRequests.forEach((echo, future) ->
                future.completeExceptionally(new OneBotException("连接已关闭")));
        pendingRequests.clear();

        var ws = wsRef.getAndSet(null);
        if (ws != null) {
            ws.sendClose(WebSocket.NORMAL_CLOSURE, "客户端主动关闭");
        }
        closeLatch.countDown();
        logger.info("WebSocket 已关闭");
    }

    /** 阻塞等待连接关闭 */
    public void awaitClose() throws InterruptedException {
        closeLatch.await();
    }

    /** 是否已连接 */
    public boolean isConnected() {
        var ws = wsRef.get();
        return ws != null && !ws.isInputClosed() && !ws.isOutputClosed();
    }

    // ==================== API 调用 (通过 WebSocket) ====================

    /**
     * 调用 OneBot API
     * 通过 WebSocket 发送 {action, params, echo} 并等待匹配的响应
     *
     * @param action API 动作名 (如 "get_login_info")
     * @param params 参数 Map
     * @return 响应的 data 字段
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> callApi(String action, Map<String, Object> params) {
        var ws = wsRef.get();
        if (ws == null || ws.isOutputClosed()) {
            throw new OneBotException("WebSocket 未连接，请先 /connect");
        }

        String echo = "req_" + requestIdCounter.incrementAndGet() + "_" + System.currentTimeMillis();

        // 构建请求
        var request = new java.util.LinkedHashMap<String, Object>();
        request.put("action", action);
        request.put("params", params != null ? params : Map.of());
        request.put("echo", echo);

        String payload = JsonUtil.toJson(request);
        logger.debug("发送 API 请求: {} echo={}", action, echo);

        // 注册 Future
        var future = new CompletableFuture<Map<String, Object>>();
        pendingRequests.put(echo, future);

        try {
            // 发送
            ws.sendText(payload, true).join();

            // 等待响应
            Map<String, Object> response = future.get(apiTimeout, TimeUnit.SECONDS);

            // 检查状态
            String status = (String) response.get("status");
            int retcode = toInt(response.get("retcode"));

            if ("ok".equals(status) || retcode == 0) {
                Object data = response.get("data");
                if (data instanceof Map) {
                    logger.debug("API 成功: {}", action);
                    return (Map<String, Object>) data;
                }
                // data 可能是 List 或 null，包装一下
                var wrapper = new java.util.LinkedHashMap<String, Object>();
                wrapper.put("data", data);
                return wrapper;
            } else {
                String message = (String) response.get("message");
                String wording = (String) response.get("wording");
                logger.warn("API 失败: {} retcode={} message={}", action, retcode, message);
                throw new OneBotException("API error [" + retcode + "]: " + message + " (" + wording + ")");
            }
        } catch (TimeoutException e) {
            pendingRequests.remove(echo);
            throw new OneBotException("API 调用超时: " + action + " (" + apiTimeout + "秒)");
        } catch (OneBotException e) {
            throw e;
        } catch (Exception e) {
            pendingRequests.remove(echo);
            throw new OneBotException("API 调用失败: " + action, e);
        } finally {
            pendingRequests.remove(echo);
        }
    }

    /**
     * 调用 API 并返回原始响应 (包含 data 为 List 的场景)
     */
    @SuppressWarnings("unchecked")
    public Object callApiRaw(String action, Map<String, Object> params) {
        var ws = wsRef.get();
        if (ws == null || ws.isOutputClosed()) {
            throw new OneBotException("WebSocket 未连接，请先 /connect");
        }

        String echo = "req_" + requestIdCounter.incrementAndGet() + "_" + System.currentTimeMillis();

        var request = new java.util.LinkedHashMap<String, Object>();
        request.put("action", action);
        request.put("params", params != null ? params : Map.of());
        request.put("echo", echo);

        String payload = JsonUtil.toJson(request);
        logger.debug("发送 API 请求: {} echo={}", action, echo);

        var future = new CompletableFuture<Map<String, Object>>();
        pendingRequests.put(echo, future);

        try {
            ws.sendText(payload, true).join();
            Map<String, Object> response = future.get(apiTimeout, TimeUnit.SECONDS);

            String status = (String) response.get("status");
            int retcode = toInt(response.get("retcode"));

            if ("ok".equals(status) || retcode == 0) {
                logger.debug("API 成功: {}", action);
                return response.get("data"); // 可能是 Map、List 或 null
            } else {
                String message = (String) response.get("message");
                String wording = (String) response.get("wording");
                throw new OneBotException("API error [" + retcode + "]: " + message + " (" + wording + ")");
            }
        } catch (TimeoutException e) {
            throw new OneBotException("API 调用超时: " + action);
        } catch (OneBotException e) {
            throw e;
        } catch (Exception e) {
            throw new OneBotException("API 调用失败: " + action, e);
        } finally {
            pendingRequests.remove(echo);
        }
    }

    // ==================== 重连 ====================

    private void scheduleReconnect() {
        if (!autoReconnect || !running.get()) {
            closeLatch.countDown();
            return;
        }
        if (reconnecting.getAndSet(true)) return;

        int interval = Math.min(reconnectInterval, maxReconnectInterval);
        logger.info("将在 {} 秒后尝试重连...", interval);

        Thread.ofVirtual().start(() -> {
            try {
                Thread.sleep(Duration.ofSeconds(interval));
                reconnecting.set(false);
                if (running.get()) {
                    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
                    doConnect();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    // ==================== WebSocket Listener ====================

    private class WsListener implements WebSocket.Listener {

        private final StringBuilder buffer = new StringBuilder();

        @Override
        public void onOpen(WebSocket webSocket) {
            logger.debug("WebSocket onOpen");
            reconnectInterval = 5;
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            buffer.append(data);
            if (last) {
                String json = buffer.toString();
                buffer.setLength(0);
                processMessage(json);
            }
            webSocket.request(1);
            return CompletableFuture.completedFuture(null);
        }

        @Override
        public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
            logger.info("WebSocket 连接关闭: code={}, reason={}", statusCode, reason);
            wsRef.set(null);
            // 拒绝所有待处理请求
            pendingRequests.forEach((echo, future) ->
                    future.completeExceptionally(new OneBotException("连接已断开")));
            pendingRequests.clear();
            scheduleReconnect();
            return CompletableFuture.completedFuture(null);
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            logger.error("WebSocket 错误", error);
            wsRef.set(null);
            pendingRequests.forEach((echo, future) ->
                    future.completeExceptionally(new OneBotException("WebSocket 错误", (Exception) error)));
            pendingRequests.clear();
            scheduleReconnect();
        }
    }

    @SuppressWarnings("unchecked")
    private void processMessage(String json) {
        try {
            Map<String, Object> data = JsonUtil.parseObject(json);
            if (data.isEmpty()) return;

            // 有 echo -> API 响应
            Object echo = data.get("echo");
            if (echo != null) {
                String echoStr = String.valueOf(echo);
                var future = pendingRequests.get(echoStr);
                if (future != null) {
                    future.complete(data);
                } else {
                    logger.debug("收到未匹配的响应: echo={}", echoStr);
                }
                return;
            }

            // 无 echo -> 事件
            var event = new OneBotEvent(data);

            if (event.isMetaEvent()) {
                logger.debug("收到元事件: {}", event.getMetaEventType());
            } else {
                logger.info("收到事件: {}", event);
            }

            dispatcher.dispatch(event);
        } catch (Exception e) {
            logger.error("处理消息失败: {}", json, e);
        }
    }

    private static int toInt(Object obj) {
        if (obj instanceof Number n) return n.intValue();
        if (obj instanceof String s && !s.isEmpty()) {
            try { return Integer.parseInt(s); } catch (NumberFormatException e) { return 0; }
        }
        return 0;
    }
}
