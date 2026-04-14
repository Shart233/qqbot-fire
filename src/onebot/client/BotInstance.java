package onebot.client;

import onebot.handler.EventDispatcher;
import onebot.scheduler.ScheduleManager;

/**
 * 单个 Bot 实例，封装一个 NapCat 连接的所有运行时状态。
 * 用于多开场景下管理多个并行 Bot。
 *
 * 每个 BotInstance 拥有独立的:
 *   - 连接配置 (mode, wsUrl, httpUrl, accessToken)
 *   - 连接对象 (ApiProvider / OneBotConnection)
 *   - 高层客户端 (OneBotClient)
 *   - 事件分发器 (WebSocket 模式)
 *   - 定时任务管理器
 */
public class BotInstance {

    // ---- 配置 (持久化) ----
    private String name;
    private String mode = "ws";
    private String wsUrl = "ws://127.0.0.1:3001";
    private String httpUrl = "http://127.0.0.1:6099";
    private String accessToken = "";

    // ---- 运行时 (不持久化) ----
    private OneBotConnection wsConnection;
    private ApiProvider provider;
    private OneBotClient client;
    private EventDispatcher dispatcher;
    private ScheduleManager scheduler;
    private boolean connected = false;

    // ---- 登录信息缓存 ----
    private long userId;
    private String nickname = "";

    public BotInstance(String name) {
        this.name = name;
        this.scheduler = new ScheduleManager(name);
    }

    // ==================== 配置 ====================

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getWsUrl() { return wsUrl; }
    public void setWsUrl(String wsUrl) { this.wsUrl = wsUrl; }

    public String getHttpUrl() { return httpUrl; }
    public void setHttpUrl(String httpUrl) { this.httpUrl = httpUrl; }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    // ==================== 运行时 ====================

    public OneBotConnection getWsConnection() { return wsConnection; }
    public void setWsConnection(OneBotConnection wsConnection) { this.wsConnection = wsConnection; }

    public ApiProvider getProvider() { return provider; }
    public void setProvider(ApiProvider provider) { this.provider = provider; }

    public OneBotClient getClient() { return client; }
    public void setClient(OneBotClient client) { this.client = client; }

    public EventDispatcher getDispatcher() { return dispatcher; }
    public void setDispatcher(EventDispatcher dispatcher) { this.dispatcher = dispatcher; }

    public ScheduleManager getScheduler() { return scheduler; }

    public boolean isConnected() { return connected; }
    public void setConnected(boolean connected) { this.connected = connected; }

    // ==================== 登录信息 ====================

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    // ==================== 显示 ====================

    /** 简短标识: name(QQ号) 或 name(未连接) */
    public String label() {
        if (connected && userId > 0) {
            return name + "(" + userId + ")";
        }
        return name + (connected ? "(已连接)" : "(未连接)");
    }

    @Override
    public String toString() {
        return String.format("[%s] %s %s %s",
                connected ? "ON" : "OFF",
                name,
                mode.toUpperCase(),
                connected && userId > 0 ? "QQ:" + userId + " " + nickname : "");
    }
}
