package onebot.client;

/**
 * OneBot API 调用异常
 */
public class OneBotException extends RuntimeException {

    public OneBotException(String message) {
        super(message);
    }

    public OneBotException(String message, Throwable cause) {
        super(message, cause);
    }
}
