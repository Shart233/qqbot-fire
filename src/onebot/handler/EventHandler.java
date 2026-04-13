package onebot.handler;

import onebot.event.OneBotEvent;

/**
 * 事件处理器接口
 * 实现此接口来处理不同类型的 OneBot 事件
 */
public interface EventHandler {

    /**
     * 处理事件
     * @param event 事件对象
     * @return true 表示事件已被处理（阻止后续 handler），false 继续传递
     */
    boolean handle(OneBotEvent event);
}
