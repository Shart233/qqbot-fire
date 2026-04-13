package onebot.handler;

import onebot.event.OneBotEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 日志处理器
 * 记录所有消息事件，不拦截（始终返回 false）
 */
public class LogHandler implements EventHandler {

    private static final Logger logger = LogManager.getLogger(LogHandler.class);

    @Override
    public boolean handle(OneBotEvent event) {
        if (event.isGroupMessage()) {
            logger.info("[群消息] [{}] {} ({}): {}",
                    event.getGroupId(),
                    event.getDisplayName(),
                    event.getUserId(),
                    event.getRawMessage());
        } else if (event.isPrivateMessage()) {
            logger.info("[私聊] {} ({}): {}",
                    event.getDisplayName(),
                    event.getUserId(),
                    event.getRawMessage());
        } else if (event.isNotice()) {
            logger.info("[通知] type={}, group={}, user={}, operator={}",
                    event.getNoticeType(),
                    event.getGroupId(),
                    event.getUserId(),
                    event.getOperatorId());
        } else if (event.isRequest()) {
            logger.info("[请求] type={}, user={}, comment={}",
                    event.getRequestType(),
                    event.getUserId(),
                    event.getComment());
        }
        return false; // 永远不拦截，让后续 handler 继续处理
    }
}
