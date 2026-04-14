package onebot.handler;

import onebot.client.OneBotClient;
import onebot.event.OneBotEvent;
import onebot.message.MessageBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 示例命令处理器
 *
 * 识别以指定前缀开头的消息，解析为命令并处理。
 * 支持群消息和私聊消息。
 *
 * 内置命令:
 *   #help   - 显示帮助
 *   #ping   - 测试连通性
 *   #status - 查看 Bot 状态
 *   #echo   - 回显消息
 */
public class CommandHandler implements EventHandler {

    private static final Logger logger = LogManager.getLogger(CommandHandler.class);

    private final OneBotClient bot;
    private final String prefix;
    private final long startTime = System.currentTimeMillis();
    private final java.util.concurrent.atomic.AtomicInteger processedCount = new java.util.concurrent.atomic.AtomicInteger(0);

    public CommandHandler(OneBotClient bot, String prefix) {
        this.bot = bot;
        this.prefix = prefix;
    }

    public CommandHandler(OneBotClient bot) {
        this(bot, "/");
    }

    @Override
    public boolean handle(OneBotEvent event) {
        if (!event.isMessage()) return false;

        String text = event.getPlainText().trim();
        if (!text.startsWith(prefix)) return false;

        // 解析命令和参数
        String content = text.substring(prefix.length()).trim();
        String[] parts = content.split("\\s+", 2);
        String command = parts[0].toLowerCase();
        String args = parts.length > 1 ? parts[1] : "";

        logger.info("收到命令: {} (参数: {}), 来自: {} ({})",
                command, args, event.getUserId(), event.getDisplayName());

        try {
            switch (command) {
                case "help" -> handleHelp(event);
                case "ping" -> handlePing(event);
                case "status" -> handleStatus(event);
                case "echo" -> handleEcho(event, args);
                default -> {
                    return false; // 未知命令，继续传递
                }
            }
            processedCount.incrementAndGet();
            return true;
        } catch (Exception e) {
            logger.error("处理命令 {} 失败", command, e);
            reply(event, "命令执行失败: " + e.getMessage());
            return true;
        }
    }

    private void handleHelp(OneBotEvent event) {
        String helpText = String.join("\n",
                "=== Bot 帮助 ===",
                prefix + "help   - 显示此帮助",
                prefix + "ping   - 测试连通性",
                prefix + "status - 查看运行状态",
                prefix + "echo <内容> - 回显消息"
        );
        reply(event, helpText);
    }

    private void handlePing(OneBotEvent event) {
        reply(event, "pong!");
    }

    private void handleStatus(OneBotEvent event) {
        long uptime = System.currentTimeMillis() - startTime;
        String uptimeStr = formatUptime(uptime);

        String statusText = String.join("\n",
                "=== Bot 状态 ===",
                "运行时长: " + uptimeStr,
                "已处理命令: " + processedCount.get()
        );
        reply(event, statusText);
    }

    private void handleEcho(OneBotEvent event, String args) {
        if (args.isEmpty()) {
            reply(event, "用法: " + prefix + "echo <要回显的内容>");
        } else {
            reply(event, args);
        }
    }

    // ==================== 工具方法 ====================

    private void reply(OneBotEvent event, String text) {
        try {
            if (event.isGroupMessage()) {
                bot.sendGroupMsg(event.getGroupId(), text);
            } else if (event.isPrivateMessage()) {
                bot.sendPrivateMsg(event.getUserId(), text);
            }
        } catch (Exception e) {
            logger.error("回复消息失败", e);
        }
    }

    private static String formatUptime(long ms) {
        long s = ms / 1000;
        long m = s / 60;
        long h = m / 60;
        long d = h / 24;
        if (d > 0) return d + "天" + (h % 24) + "小时";
        if (h > 0) return h + "小时" + (m % 60) + "分钟";
        if (m > 0) return m + "分钟" + (s % 60) + "秒";
        return s + "秒";
    }
}
