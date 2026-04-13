package onebot.handler;

import onebot.event.OneBotEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 事件分发器
 * 将 OneBotEvent 分发到注册的 EventHandler 链
 */
public class EventDispatcher {

    private static final Logger logger = LogManager.getLogger(EventDispatcher.class);

    private final List<EventHandler> handlers = new CopyOnWriteArrayList<>();

    /** 注册事件处理器 (按注册顺序执行) */
    public void addHandler(EventHandler handler) {
        handlers.add(handler);
        logger.debug("注册事件处理器: {}", handler.getClass().getSimpleName());
    }

    /** 移除事件处理器 */
    public void removeHandler(EventHandler handler) {
        handlers.remove(handler);
    }

    /** 分发事件到所有 handler */
    public void dispatch(OneBotEvent event) {
        for (var handler : handlers) {
            try {
                boolean handled = handler.handle(event);
                if (handled) {
                    logger.debug("事件已被 {} 处理: {}", handler.getClass().getSimpleName(), event);
                    return;
                }
            } catch (Exception e) {
                logger.error("处理器 {} 抛出异常", handler.getClass().getSimpleName(), e);
            }
        }
    }
}
