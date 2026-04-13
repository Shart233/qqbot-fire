package onebot.client;

import java.util.Map;

/**
 * API 调用提供者接口
 * WebSocket (OneBotConnection) 和 HTTP (OneBotHttpConnection) 都实现此接口
 */
public interface ApiProvider {

    /** 调用 API，返回 data 字段 (Map) */
    Map<String, Object> callApi(String action, Map<String, Object> params);

    /** 调用 API，返回原始 data (可能是 List、Map 或 null) */
    Object callApiRaw(String action, Map<String, Object> params);

    /** 是否已连接 */
    boolean isConnected();

    /** 关闭连接 */
    void close();
}
