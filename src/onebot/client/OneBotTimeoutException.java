package onebot.client;

/**
 * OneBot API 调用超时异常。
 *
 * 与普通 {@link OneBotException} 的语义区别很重要：超时意味着「结果未知」而非「失败」。
 * 请求已经写进 WebSocket 交给 NapCat，只是响应没在超时窗口内回来；NapCat
 * 冷启动后 QQ 消息通道未就绪时会把请求排队，稍后仍会真正投递出去。
 * 调用方据此区分处理——超时的目标绝不能盲目重投，否则 NapCat 恢复时
 * 积压的请求会一次性全部发出，接收方收到成堆重复消息。
 */
public class OneBotTimeoutException extends OneBotException {

    public OneBotTimeoutException(String message) {
        super(message);
    }
}
