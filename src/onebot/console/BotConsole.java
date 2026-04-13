package onebot.console;

import onebot.client.ApiProvider;
import onebot.client.OneBotClient;
import onebot.client.OneBotConnection;
import onebot.client.OneBotHttpConnection;
import onebot.handler.CommandHandler;
import onebot.handler.EventDispatcher;
import onebot.handler.LogHandler;
import onebot.scheduler.ScheduleManager;
import onebot.util.CryptoUtil;
import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * QQBot-Fire 交互式控制台
 *
 * 支持两种连接模式:
 *   ws   - WebSocket 模式 (同时支持 API 调用和事件接收)
 *   http - HTTP 模式 (仅 API 调用，不接收事件)
 *
 * 配置命令:
 *   /set mode <ws|http>   - 切换连接模式
 *   /set ws <url>         - 设置 WebSocket 地址
 *   /set http <url>       - 设置 HTTP API 地址
 *   /set token <token>    - 设置 access_token
 *   /set prefix <prefix>  - 设置命令前缀
 *   /show                 - 显示当前配置
 *   /connect              - 连接并启动 Bot
 */
public class BotConsole {

    private static final Logger logger = LogManager.getLogger(BotConsole.class);
    private static final String CONFIG_FILE = "config.json";

    // 可配置参数 (持久化到 config.json)
    private String mode = "ws";
    private String wsUrl = "ws://127.0.0.1:3001";
    private String httpUrl = "http://127.0.0.1:6099";
    private String accessToken = "";
    private final String commandPrefix = "/";

    // 运行时对象
    private final ScheduleManager scheduler = new ScheduleManager();
    private OneBotConnection wsConnection;
    private ApiProvider provider;
    private OneBotClient bot;
    private EventDispatcher dispatcher;
    private boolean connected = false;

    public void start() {
        printBanner();
        loadConfig();
        System.out.println("输入 /help 查看命令列表，输入 /connect 连接 Bot\n");
        showConfig();
        System.out.println();

        try (var scanner = new Scanner(System.in)) {
            while (true) {
                System.out.print("> ");
                String line;
                try {
                    if (!scanner.hasNextLine()) break;
                    line = scanner.nextLine().trim();
                } catch (Exception e) {
                    break;
                }

                if (line.isEmpty()) continue;

                if (!line.startsWith("/")) {
                    System.out.println("命令需以 / 开头，输入 /help 查看帮助");
                    continue;
                }

                String[] parts = line.substring(1).split("\\s+", 3);
                String cmd = parts[0].toLowerCase();

                try {
                    switch (cmd) {
                        case "help", "h" -> printHelp();
                        case "set" -> handleSet(parts);
                        case "show" -> showConfig();
                        case "connect", "c" -> handleConnect();
                        case "disconnect", "dc" -> handleDisconnect();
                        case "reconnect", "rc" -> handleReconnect();
                        case "status", "s" -> handleStatus();
                        case "send" -> handleSend(parts);
                        case "friends" -> handleFriends();
                        case "groups" -> handleGroups();
                        case "members" -> handleMembers(parts);
                        case "schedule", "sch" -> handleSchedule(parts);
                        case "logout" -> handleLogout();
                        case "quit", "exit", "q" -> {
                            handleQuit();
                            return;
                        }
                        default -> System.out.println("未知命令: /" + cmd + "，输入 /help 查看帮助");
                    }
                } catch (Exception e) {
                    logger.error("命令执行失败", e);
                }
            }
        }
    }

    // ==================== 配置命令 ====================

    private void handleSet(String[] parts) {
        if (parts.length < 3) {
            System.out.println("用法: /set <mode|ws|http|token> <值>");
            return;
        }
        String key = parts[1].toLowerCase();
        String value = parts[2];
        switch (key) {
            case "mode" -> {
                if ("ws".equals(value) || "http".equals(value)) {
                    mode = value;
                    saveConfig();
                    System.out.println("连接模式已设置: " + mode.toUpperCase());
                } else {
                    System.out.println("模式只能是 ws 或 http");
                }
            }
            case "ws" -> {
                wsUrl = value;
                saveConfig();
                System.out.println("WebSocket 地址已设置: " + wsUrl);
            }
            case "http" -> {
                httpUrl = value;
                saveConfig();
                System.out.println("HTTP API 地址已设置: " + httpUrl);
            }
            case "token" -> {
                if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                }
                accessToken = value;
                saveConfig();
                System.out.println("Access Token 已设置" + (value.length() > 4 ? " (" + value.substring(0, 4) + "...)" : ""));
            }
            default -> System.out.println("未知配置项: " + key + "，可用: mode, ws, http, token");
        }
    }

    private void showConfig() {
        System.out.println("┌─ 当前配置 ─────────────────────────────┐");
        System.out.println("│ 模式     : " + pad(mode.toUpperCase() + ("ws".equals(mode) ? " (WebSocket)" : " (HTTP)"), 30) + "│");
        if ("ws".equals(mode)) {
            System.out.println("│ WS 地址  : " + pad(wsUrl, 30) + "│");
        } else {
            System.out.println("│ HTTP 地址: " + pad(httpUrl, 30) + "│");
        }
        String tokenDisplay = accessToken.isEmpty() ? "(无)" :
                accessToken.substring(0, Math.min(4, accessToken.length())) + "****";
        System.out.println("│ Token    : " + pad(tokenDisplay, 30) + "│");
        System.out.println("│ 状态     : " + pad(connected ? "已连接" : "未连接", 30) + "│");
        System.out.println("└───────────────────────────────────────┘");
    }

    // ==================== 连接管理 ====================

    private void handleConnect() {
        if (connected) {
            System.out.println("已处于连接状态，使用 /reconnect 重连或 /disconnect 断开");
            return;
        }

        if ("ws".equals(mode)) {
            connectWebSocket();
        } else {
            connectHttp();
        }
    }

    private void connectWebSocket() {
        System.out.println("正在通过 WebSocket 连接...");

        dispatcher = new EventDispatcher();
        dispatcher.addHandler(new LogHandler());

        wsConnection = accessToken.isEmpty()
                ? new OneBotConnection(wsUrl, dispatcher)
                : new OneBotConnection(wsUrl, accessToken, dispatcher);

        wsConnection.setAutoReconnect(true);
        wsConnection.setReconnectInterval(5);
        wsConnection.connect();

        provider = wsConnection;
        bot = new OneBotClient(wsConnection);

        dispatcher.addHandler(new CommandHandler(bot, commandPrefix));

        tryPrintLoginInfo();
        scheduler.setBot(bot);
        scheduler.start();
        connected = true;
        System.out.println("Bot 已启动 (WebSocket 模式)，QQ 发送 '/help' 查看命令");
    }

    private void connectHttp() {
        System.out.println("正在通过 HTTP 连接...");

        var httpConn = accessToken.isEmpty()
                ? new OneBotHttpConnection(httpUrl)
                : new OneBotHttpConnection(httpUrl, accessToken);

        provider = httpConn;
        bot = new OneBotClient(httpConn);

        tryPrintLoginInfo();
        scheduler.setBot(bot);
        scheduler.start();
        connected = true;
        System.out.println("Bot 已启动 (HTTP 模式)，注意: HTTP 模式不接收事件推送");
    }

    private void tryPrintLoginInfo() {
        try {
            var loginInfo = bot.getLoginInfo();
            System.out.println("登录成功 — QQ: " + loginInfo.getUserId() + ", 昵称: " + loginInfo.getNickname());
        } catch (Exception e) {
            System.out.println("警告: 无法获取登录信息 (" + e.getMessage() + ")");
        }
    }

    private void handleDisconnect() {
        if (!connected) {
            System.out.println("当前未连接");
            return;
        }
        if (provider != null) {
            provider.close();
        }
        wsConnection = null;
        provider = null;
        bot = null;
        connected = false;
        System.out.println("已断开连接");
    }

    private void handleReconnect() {
        handleDisconnect();
        handleConnect();
    }

    // ==================== 运行时命令 ====================

    private void handleStatus() {
        if (!checkConnected()) return;
        try {
            var loginInfo = bot.getLoginInfo();
            var ver = bot.getVersionInfo();
            System.out.println("┌─ Bot 状态 ─────────────────────────────┐");
            System.out.println("│ 模式     : " + pad(mode.toUpperCase(), 30) + "│");
            System.out.println("│ QQ号     : " + pad(String.valueOf(loginInfo.getUserId()), 30) + "│");
            System.out.println("│ 昵称     : " + pad(loginInfo.getNickname(), 30) + "│");
            System.out.println("│ 应用     : " + pad(ver.getAppName() + " v" + ver.getAppVersion(), 30) + "│");
            System.out.println("│ 连接状态 : " + pad(provider.isConnected() ? "已连接" : "已断开", 30) + "│");
            System.out.println("└───────────────────────────────────────┘");
        } catch (Exception e) {
            System.out.println("获取状态失败: " + e.getMessage());
        }
    }

    private void handleSend(String[] parts) {
        if (!checkConnected()) return;
        if (parts.length < 3) {
            System.out.println("用法: /send group <群号> <消息>");
            System.out.println("      /send private <QQ号> <消息>");
            return;
        }
        String sub = parts[1].toLowerCase();
        String rest = parts.length > 2 ? parts[2] : "";
        String[] subParts = rest.split("\\s+", 2);
        if (subParts.length < 2) {
            System.out.println("用法: /send " + sub + " <ID> <消息内容>");
            return;
        }
        long id;
        try {
            id = Long.parseLong(subParts[0]);
        } catch (NumberFormatException e) {
            System.out.println("ID 必须是数字");
            return;
        }
        String msg = subParts[1];

        try {
            long msgId;
            switch (sub) {
                case "group", "g" -> {
                    msgId = bot.sendGroupMsg(id, msg);
                    System.out.println("群消息发送成功, message_id=" + msgId);
                }
                case "private", "p" -> {
                    msgId = bot.sendPrivateMsg(id, msg);
                    System.out.println("私聊消息发送成功, message_id=" + msgId);
                }
                default -> System.out.println("类型必须是 group 或 private");
            }
        } catch (Exception e) {
            System.out.println("发送失败: " + e.getMessage());
        }
    }

    private void handleFriends() {
        if (!checkConnected()) return;
        try {
            var friends = bot.getFriendList();
            System.out.println("好友列表 (共 " + friends.size() + " 个):");
            for (var f : friends) {
                String remark = (f.getRemark() != null && !f.getRemark().isEmpty()) ? " (" + f.getRemark() + ")" : "";
                System.out.println("  " + f.getUserId() + " - " + f.getNickname() + remark);
            }
        } catch (Exception e) {
            System.out.println("获取好友列表失败: " + e.getMessage());
        }
    }

    private void handleGroups() {
        if (!checkConnected()) return;
        try {
            var groups = bot.getGroupList();
            System.out.println("群列表 (共 " + groups.size() + " 个):");
            for (var g : groups) {
                System.out.println("  " + g.getGroupId() + " - " + g.getGroupName()
                        + " (" + g.getMemberCount() + "/" + g.getMaxMemberCount() + ")");
            }
        } catch (Exception e) {
            System.out.println("获取群列表失败: " + e.getMessage());
        }
    }

    private void handleMembers(String[] parts) {
        if (!checkConnected()) return;
        if (parts.length < 2) {
            System.out.println("用法: /members <群号>");
            return;
        }
        long groupId;
        try {
            groupId = Long.parseLong(parts[1]);
        } catch (NumberFormatException e) {
            System.out.println("群号必须是数字");
            return;
        }
        try {
            var members = bot.getGroupMemberList(groupId);
            System.out.println("群 " + groupId + " 成员列表 (共 " + members.size() + " 人):");
            for (var m : members) {
                String card = (m.getCard() != null && !m.getCard().isEmpty()) ? m.getCard() : m.getNickname();
                System.out.println("  " + m.getUserId() + " - " + card + " [" + m.getRole() + "]");
            }
        } catch (Exception e) {
            System.out.println("获取群成员列表失败: " + e.getMessage());
        }
    }

    // ==================== 定时任务命令 ====================

    private void handleSchedule(String[] parts) {
        if (parts.length < 2) {
            printScheduleHelp();
            return;
        }
        String sub = parts[1].toLowerCase();
        switch (sub) {
            case "list", "ls" -> {
                var tasks = scheduler.getTasks();
                if (tasks.isEmpty()) {
                    System.out.println("暂无定时任务，使用 /schedule add 添加");
                } else {
                    System.out.println("定时任务列表 (共 " + tasks.size() + " 个):");
                    for (var t : tasks) {
                        System.out.println("  " + t);
                    }
                }
            }
            case "add" -> {
                // /schedule add <名称> <时间> <QQ1,QQ2,...> <消息内容>
                if (parts.length < 3) {
                    System.out.println("用法: /schedule add <名称> <HH:mm> <QQ1,QQ2,...> <消息内容>");
                    System.out.println("示例: /schedule add morning 05:00 123456,789012 早上好！新的一天开始了");
                    return;
                }
                String rest = parts[2];
                String[] args = rest.split("\\s+", 4);
                if (args.length < 4) {
                    System.out.println("参数不足，用法: /schedule add <名称> <HH:mm> <QQ1,QQ2,...> <消息>");
                    return;
                }
                String name = args[0];
                String time = args[1];
                String[] qqStrs = args[2].split(",");
                String message = args[3];

                var targets = new java.util.ArrayList<Long>();
                for (String qq : qqStrs) {
                    try { targets.add(Long.parseLong(qq.trim())); }
                    catch (NumberFormatException e) { System.out.println("无效 QQ 号: " + qq); return; }
                }

                try {
                    scheduler.addTask(name, time, targets, message);
                    System.out.println("定时任务已添加: " + name + " -> 每天 " + time + " 发送到 " + targets.size() + " 人");
                } catch (Exception e) {
                    System.out.println("添加失败: " + e.getMessage());
                }
            }
            case "remove", "rm" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /schedule remove <任务名>");
                    return;
                }
                String name = parts[2].trim();
                if (scheduler.removeTask(name)) {
                    System.out.println("已删除任务: " + name);
                } else {
                    System.out.println("任务不存在: " + name);
                }
            }
            case "on" -> {
                if (parts.length < 3 || parts[2].isBlank()) { System.out.println("用法: /schedule on <任务名>"); return; }
                if (scheduler.toggleTask(parts[2].trim(), true)) System.out.println("已启用: " + parts[2].trim());
                else System.out.println("任务不存在");
            }
            case "off" -> {
                if (parts.length < 3 || parts[2].isBlank()) { System.out.println("用法: /schedule off <任务名>"); return; }
                if (scheduler.toggleTask(parts[2].trim(), false)) System.out.println("已禁用: " + parts[2].trim());
                else System.out.println("任务不存在");
            }
            case "test" -> {
                if (!checkConnected()) return;
                if (parts.length < 3 || parts[2].isBlank()) { System.out.println("用法: /schedule test <任务名>"); return; }
                String name = parts[2].trim();
                if (scheduler.getTask(name) != null) {
                    System.out.println("立即执行任务: " + name);
                    scheduler.triggerNow(name);
                } else {
                    System.out.println("任务不存在: " + name);
                }
            }
            default -> printScheduleHelp();
        }
    }

    private void printScheduleHelp() {
        System.out.println("用法: /schedule <子命令>");
        System.out.println("  list                          查看所有定时任务");
        System.out.println("  add <名称> <HH:mm> <QQ,...> <消息>  添加任务");
        System.out.println("  remove <名称>                 删除任务");
        System.out.println("  on <名称>                     启用任务");
        System.out.println("  off <名称>                    禁用任务");
        System.out.println("  test <名称>                   立即测试执行");
        System.out.println();
        System.out.println("示例:");
        System.out.println("  /schedule add morning 05:00 123456,789012 早上好！");
    }

    private void handleLogout() {
        if (!checkConnected()) return;
        try {
            System.out.println("正在退出 QQ 登录...");
            bot.callApi("bot_exit", null);
            System.out.println("已发送退出登录请求，NapCat 将断开当前 QQ 账号");
        } catch (Exception e) {
            System.out.println("退出登录失败: " + e.getMessage());
        }
    }

    private void handleQuit() {
        System.out.println("正在退出...");
        scheduler.stop();
        if (connected && provider != null) {
            provider.close();
        }
        System.out.println("再见!");
    }

    // ==================== 配置持久化 ====================

    private void loadConfig() {
        try {
            CryptoUtil.init();
            Path path = Path.of(CONFIG_FILE);
            if (Files.exists(path)) {
                String json = Files.readString(path);
                Map<String, Object> cfg = JsonUtil.parseObject(json);
                if (cfg.get("mode") instanceof String v) mode = v;
                if (cfg.get("wsUrl") instanceof String v) wsUrl = v;
                if (cfg.get("httpUrl") instanceof String v) httpUrl = v;
                if (cfg.get("accessToken") instanceof String v) accessToken = CryptoUtil.decrypt(v);
                logger.debug("已加载配置文件: {}", path.toAbsolutePath());
            }
        } catch (Exception e) {
            logger.warn("加载配置文件失败，使用默认配置: {}", e.getMessage());
        }
    }

    private void saveConfig() {
        try {
            var cfg = new LinkedHashMap<String, Object>();
            cfg.put("mode", mode);
            cfg.put("wsUrl", wsUrl);
            cfg.put("httpUrl", httpUrl);
            cfg.put("accessToken", CryptoUtil.encrypt(accessToken));
            Files.writeString(Path.of(CONFIG_FILE), JsonUtil.toJson(cfg));
            logger.debug("配置已保存");
        } catch (IOException e) {
            logger.warn("保存配置文件失败", e);
        }
    }

    // ==================== 辅助方法 ====================

    private boolean checkConnected() {
        if (!connected || bot == null) {
            System.out.println("尚未连接，请先执行 /connect");
            return false;
        }
        return true;
    }

    private static String pad(String s, int width) {
        if (s == null) s = "";
        int displayWidth = 0;
        for (char c : s.toCharArray()) {
            displayWidth += (c > 127) ? 2 : 1;
        }
        int padding = Math.max(0, width - displayWidth);
        return s + " ".repeat(padding);
    }

    private void printBanner() {
        System.out.println();
        System.out.println("  ╔═══════════════════════════════════════╗");
        System.out.println("  ║         QQBot-Fire  v1.0.0            ║");
        System.out.println("  ║   NapCat OneBot 11 Java Bot Client    ║");
        System.out.println("  ╚═══════════════════════════════════════╝");
        System.out.println();
    }

    private void printHelp() {
        System.out.println();
        System.out.println("  ┌─ 配置命令 ────────────────────────────┐");
        System.out.println("  │ /set mode <ws|http> 切换连接模式      │");
        System.out.println("  │ /set ws <url>      设置 WebSocket 地址│");
        System.out.println("  │ /set http <url>    设置 HTTP API 地址 │");
        System.out.println("  │ /set token <token> 设置 Access Token  │");
        System.out.println("  │ /show              显示当前配置       │");
        System.out.println("  ├─ 连接管理 ────────────────────────────┤");
        System.out.println("  │ /connect           连接并启动 Bot     │");
        System.out.println("  │ /disconnect        断开连接           │");
        System.out.println("  │ /reconnect         重新连接           │");
        System.out.println("  ├─ 运行时命令 ──────────────────────────┤");
        System.out.println("  │ /status            查看 Bot 状态      │");
        System.out.println("  │ /send group <群号> <消息>  发送群消息  │");
        System.out.println("  │ /send private <QQ> <消息>  发送私聊   │");
        System.out.println("  │ /friends           获取好友列表       │");
        System.out.println("  │ /groups            获取群列表         │");
        System.out.println("  │ /members <群号>    获取群成员列表     │");
        System.out.println("  ├─ 定时任务 ────────────────────────────┤");
        System.out.println("  │ /schedule list     查看定时任务       │");
        System.out.println("  │ /schedule add ...  添加定时任务       │");
        System.out.println("  │ /schedule remove   删除定时任务       │");
        System.out.println("  │ /schedule test     立即测试执行       │");
        System.out.println("  │ /logout            退出 QQ 登录       │");
        System.out.println("  ├─ 其他 ────────────────────────────────┤");
        System.out.println("  │ /quit              退出程序           │");
        System.out.println("  │ /help              显示此帮助         │");
        System.out.println("  └───────────────────────────────────────┘");
        System.out.println();
    }
}
