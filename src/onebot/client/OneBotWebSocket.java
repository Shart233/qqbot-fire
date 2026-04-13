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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/**
 * OneBot 11 WebSocket 事件监听客户端
 *
 * 连接 NapCat 的 WebSocket 正向连接端口，接收事件推送。
 * 支持自动重连。
 *
 * 用法:
 *   var ws = new OneBotWebSocket("ws://127.0.0.1:3001", dispatcher);
 *   ws.connect();
 *   ws.awaitClose(); // 阻塞直到连接关闭
 */
public class OneBotWebSocket {

    private static final Logger logger = LogManager.getLogger(OneBotWebSocket.class);

    private final String wsUrl;
    private final String accessToken;
    private final EventDispatcher dispatcher;
    private final HttpClient httpClient;

    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicBoolean reconnecting = new AtomicBoolean(false);
    private final AtomicReference<WebSocket> wsRef = new AtomicReference<>();
    private final CountDownLatch closeLatch = new CountDownLatch(1);

    /** 重连间隔 (秒) */
    private int reconnectInterval = 5;
    /** 最大重连间隔 (秒) */
    private int maxReconnectInterval = 60;
    /** 是否启用自动重连 */
    private boolean autoReconnect = true;

    public OneBotWebSocket(String wsUrl, EventDispatcher dispatcher) {
        this(wsUrl, null, dispatcher);
    }

    public OneBotWebSocket(String wsUrl, String accessToken, EventDispatcher dispatcher) {
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

    /** 建立 WebSocket 连接 */
    public void connect() {
        if (running.getAndSet(true)) {
            logger.warn("WebSocket 已在运行中");
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

            var listener = new OneBotWsListener();
            WebSocket ws = httpClient.newWebSocketBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .buildAsync(URI.create(url), listener)
                    .join();

            wsRef.set(ws);
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

    /** 阻塞等待连接关闭 (带超时) */
    public boolean awaitClose(long timeout, TimeUnit unit) throws InterruptedException {
        return closeLatch.await(timeout, unit);
    }

    /** 是否已连接 */
    public boolean isConnected() {
        var ws = wsRef.get();
        return ws != null && !ws.isInputClosed() && !ws.isOutputClosed();
    }

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
                    // 指数退避
                    reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval);
                    doConnect();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
    }

    // ==================== WebSocket Listener ====================

    private class OneBotWsListener implements WebSocket.Listener {

        private final StringBuilder buffer = new StringBuilder();

        @Override
        public void onOpen(WebSocket webSocket) {
            logger.debug("WebSocket onOpen");
            reconnectInterval = 5; // 连接成功，重置重连间隔
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
            scheduleReconnect();
            return CompletableFuture.completedFuture(null);
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            logger.error("WebSocket 错误", error);
            wsRef.set(null);
            scheduleReconnect();
        }
    }

    private void processMessage(String json) {
        try {
            Map<String, Object> data = JsonUtil.parseObject(json);
            if (data.isEmpty()) return;

            var event = new OneBotEvent(data);

            // 心跳事件只在 debug 级别打印
            if (event.isMetaEvent()) {
                logger.debug("收到元事件: {}", event.getMetaEventType());
            } else {
                logger.info("收到事件: {}", event);
            }

            dispatcher.dispatch(event);
        } catch (Exception e) {
            logger.error("处理 WebSocket 消息失败: {}", json, e);
        }
    }
}
