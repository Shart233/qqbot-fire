package onebot.console;

import onebot.client.*;
import onebot.handler.CommandHandler;
import onebot.handler.EventDispatcher;
import onebot.handler.LogHandler;
import onebot.napcat.NapCatConfigDiscovery;
import onebot.napcat.NapCatLauncher;
import onebot.util.CryptoUtil;
import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

/**
 * QQBot-Fire 交互式控制台 (多实例版)
 *
 * 支持同时管理多个 NapCat Bot 实例 (双开/多开):
 *   /bot add <名称>           - 添加 Bot 实例
 *   /bot remove <名称>        - 删除 Bot 实例
 *   /bot list                 - 列出所有 Bot 实例
 *   /bot use <名称>           - 切换当前操作的 Bot
 *   /bot rename <旧名> <新名> - 重命名 Bot
 *
 * 每个 Bot 拥有独立的连接配置、连接和定时任务。
 * 所有 /set /connect /send 等命令都作用于当前选中的 Bot。
 *
 * 配置自动保存到 config.json，格式:
 *   { "bots": { "name": { mode, wsUrl, httpUrl, accessToken }, ... }, "activeBot": "name" }
 * 兼容旧版单 Bot 配置: { mode, wsUrl, httpUrl, accessToken }
 */
public class BotConsole {

    private static final Logger logger = LogManager.getLogger(BotConsole.class);
    private static final String CONFIG_FILE = "config.json";
    private static final String DEFAULT_BOT_NAME = "default";

    // 多实例管理
    private final Map<String, BotInstance> bots = new LinkedHashMap<>();
    private String activeBotName = null;
    private final String commandPrefix = "/";

    // NapCat 进程管理
    private final NapCatLauncher napCatLauncher = new NapCatLauncher();

    // 日志流 attach/detach 状态
    private volatile boolean attached = false;
    private volatile String attachedInstance = null;

    public void start() {
        printBanner();
        loadConfig();
        System.out.println("输入 /help 查看命令列表，输入 /connect 连接 Bot\n");
        showConfig();
        System.out.println();

        try (var scanner = new Scanner(System.in)) {
            while (true) {
                System.out.print(buildPrompt());
                String line;
                try {
                    if (!scanner.hasNextLine()) break;
                    line = scanner.nextLine().trim();
                } catch (Exception e) {
                    break;
                }

                // attach 模式: 日志实时流占据控制台
                if (attached) {
                    // 检查进程是否已退出 (readerDone)
                    checkAttachState();
                    if (line.isEmpty() || "/detach".equalsIgnoreCase(line)) {
                        doDetach();
                    } else {
                        System.out.println("(输入 /detach 或按回车退出日志流)");
                    }
                    continue;
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
                        case "bot", "b" -> handleBot(parts);
                        case "set" -> handleSet(parts);
                        case "show" -> showConfig();
                        case "config" -> handleConfig(parts);
                        case "connect", "c" -> handleConnect();
                        case "disconnect", "dc" -> handleDisconnect();
                        case "reconnect", "rc" -> handleReconnect();
                        case "connectall", "ca" -> handleConnectAll();
                        case "disconnectall", "dca" -> handleDisconnectAll();
                        case "status", "s" -> handleStatus();
                        case "send" -> handleSend(parts);
                        case "friends" -> handleFriends();
                        case "groups" -> handleGroups();
                        case "members" -> handleMembers(parts);
                        case "schedule", "sch" -> handleSchedule(parts);
                        case "napcat", "nc" -> handleNapCat(parts);
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

    /** 构建带 Bot 名称的命令提示符 */
    private String buildPrompt() {
        if (attached) return ""; // attach 模式不显示提示符
        var bot = activeBot();
        if (bot == null) return "> ";
        if (bot.isConnected() && bot.getUserId() > 0) {
            return "[" + bot.getName() + ":" + bot.getUserId() + "] > ";
        }
        return "[" + bot.getName() + "] > ";
    }

    // ==================== Bot 实例管理 ====================

    private void handleBot(String[] parts) {
        if (parts.length < 2) {
            printBotHelp();
            return;
        }
        String sub = parts[1].toLowerCase();
        switch (sub) {
            case "add", "new" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /bot add <名称>");
                    return;
                }
                String name = parts[2].trim();
                if (bots.containsKey(name)) {
                    System.out.println("Bot '" + name + "' 已存在");
                    return;
                }
                bots.put(name, new BotInstance(name));
                activeBotName = name;
                saveConfig();
                System.out.println("已添加 Bot: " + name + " (已自动切换)");
            }
            case "remove", "rm", "del" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /bot remove <名称>");
                    return;
                }
                String name = parts[2].trim();
                var inst = bots.get(name);
                if (inst == null) {
                    System.out.println("Bot '" + name + "' 不存在");
                    return;
                }
                // 先断开连接
                if (inst.isConnected() && inst.getProvider() != null) {
                    inst.getScheduler().stop();
                    inst.getProvider().close();
                }
                bots.remove(name);
                if (name.equals(activeBotName)) {
                    activeBotName = bots.isEmpty() ? null : bots.keySet().iterator().next();
                }
                saveConfig();
                System.out.println("已删除 Bot: " + name
                        + (activeBotName != null ? " (当前: " + activeBotName + ")" : ""));
            }
            case "list", "ls" -> {
                if (bots.isEmpty()) {
                    System.out.println("暂无 Bot 实例，使用 /bot add <名称> 添加");
                    return;
                }
                System.out.println("Bot 实例列表 (共 " + bots.size() + " 个):");
                for (var inst : bots.values()) {
                    String marker = inst.getName().equals(activeBotName) ? " <-- 当前" : "";
                    System.out.println("  " + inst + marker);
                }
            }
            case "use", "switch", "sw" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /bot use <名称>");
                    return;
                }
                String name = parts[2].trim();
                if (!bots.containsKey(name)) {
                    System.out.println("Bot '" + name + "' 不存在，已有: " + String.join(", ", bots.keySet()));
                    return;
                }
                activeBotName = name;
                saveConfig();
                var inst = bots.get(name);
                System.out.println("已切换到: " + inst.label());
            }
            case "rename" -> {
                if (parts.length < 3) {
                    System.out.println("用法: /bot rename <旧名> <新名>");
                    return;
                }
                String[] args = parts[2].trim().split("\\s+", 2);
                if (args.length < 2) {
                    System.out.println("用法: /bot rename <旧名> <新名>");
                    return;
                }
                String oldName = args[0], newName = args[1];
                var inst = bots.get(oldName);
                if (inst == null) {
                    System.out.println("Bot '" + oldName + "' 不存在");
                    return;
                }
                if (bots.containsKey(newName)) {
                    System.out.println("Bot '" + newName + "' 已存在");
                    return;
                }
                bots.remove(oldName);
                inst.setName(newName);
                bots.put(newName, inst);
                if (oldName.equals(activeBotName)) activeBotName = newName;
                saveConfig();
                System.out.println("已重命名: " + oldName + " -> " + newName);
            }
            default -> printBotHelp();
        }
    }

    private void printBotHelp() {
        System.out.println("用法: /bot <子命令>");
        System.out.println("  add <名称>              添加新 Bot 实例");
        System.out.println("  remove <名称>           删除 Bot 实例");
        System.out.println("  list                    列出所有 Bot");
        System.out.println("  use <名称>              切换当前操作的 Bot");
        System.out.println("  rename <旧名> <新名>    重命名 Bot");
    }

    /** 获取当前活跃 Bot，不存在时提示 */
    private BotInstance activeBot() {
        if (activeBotName == null || !bots.containsKey(activeBotName)) return null;
        return bots.get(activeBotName);
    }

    /** 获取当前 Bot，不存在时打印提示并返回 null */
    private BotInstance requireActiveBot() {
        var bot = activeBot();
        if (bot == null) {
            if (bots.isEmpty()) {
                System.out.println("暂无 Bot 实例，使用 /bot add <名称> 添加");
            } else {
                System.out.println("请先选择 Bot: /bot use <名称>");
            }
        }
        return bot;
    }

    /** 获取已连接的当前 Bot */
    private BotInstance requireConnectedBot() {
        var bot = requireActiveBot();
        if (bot != null && !bot.isConnected()) {
            System.out.println("Bot '" + bot.getName() + "' 尚未连接，请先执行 /connect");
            return null;
        }
        return bot;
    }

    // ==================== 配置命令 ====================

    private void handleSet(String[] parts) {
        var inst = requireActiveBot();
        if (inst == null) return;

        if (parts.length < 3) {
            System.out.println("用法: /set <mode|ws|http|wstoken|httptoken> <值>");
            return;
        }
        String key = parts[1].toLowerCase();
        String value = parts[2];
        switch (key) {
            case "mode" -> {
                if ("ws".equals(value) || "http".equals(value)) {
                    inst.setMode(value);
                    saveConfig();
                    System.out.println("[" + inst.getName() + "] 连接模式已设置: " + value.toUpperCase());
                } else {
                    System.out.println("模式只能是 ws 或 http");
                }
            }
            case "ws" -> {
                inst.setWsUrl(value);
                saveConfig();
                System.out.println("[" + inst.getName() + "] WebSocket 地址已设置: " + value);
            }
            case "http" -> {
                inst.setHttpUrl(value);
                saveConfig();
                System.out.println("[" + inst.getName() + "] HTTP API 地址已设置: " + value);
            }
            case "wstoken" -> {
                if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                }
                inst.setWsToken(value);
                saveConfig();
                System.out.println("[" + inst.getName() + "] WS Token 已设置"
                        + (value.length() > 4 ? " (" + value.substring(0, 4) + "...)" : ""));
            }
            case "httptoken" -> {
                if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                }
                inst.setHttpToken(value);
                saveConfig();
                System.out.println("[" + inst.getName() + "] HTTP Token 已设置"
                        + (value.length() > 4 ? " (" + value.substring(0, 4) + "...)" : ""));
            }
            default -> System.out.println("未知配置项: " + key + "，可用: mode, ws, http, wstoken, httptoken");
        }
    }

    private void showConfig() {
        if (bots.isEmpty()) {
            System.out.println("暂无 Bot 实例，使用 /bot add <名称> 添加");
            return;
        }
        for (var inst : bots.values()) {
            String marker = inst.getName().equals(activeBotName) ? " (*当前*)" : "";
            String mode = inst.getMode();
            System.out.println("┌─ Bot: " + inst.getName() + marker + " ─────────────────────────┐");
            System.out.println("│ 模式     : " + pad(mode.toUpperCase() + ("ws".equals(mode) ? " (WebSocket)" : " (HTTP)"), 30) + "│");
            if ("ws".equals(mode)) {
                System.out.println("│ WS 地址  : " + pad(inst.getWsUrl(), 30) + "│");
            } else {
                System.out.println("│ HTTP 地址: " + pad(inst.getHttpUrl(), 30) + "│");
            }
            String wsTokenDisplay = inst.getWsToken().isEmpty() ? "(无)" :
                    inst.getWsToken().substring(0, Math.min(4, inst.getWsToken().length())) + "****";
            String httpTokenDisplay = inst.getHttpToken().isEmpty() ? "(无)" :
                    inst.getHttpToken().substring(0, Math.min(4, inst.getHttpToken().length())) + "****";
            System.out.println("│ WS Token : " + pad(wsTokenDisplay, 30) + "│");
            System.out.println("│ HTTP Token:" + pad(httpTokenDisplay, 30) + "│");
            String statusStr = inst.isConnected()
                    ? (inst.getUserId() > 0 ? "已连接 (QQ:" + inst.getUserId() + " " + inst.getNickname() + ")" : "已连接")
                    : "未连接";
            System.out.println("│ 状态     : " + pad(statusStr, 30) + "│");
            System.out.println("└───────────────────────────────────────────┘");
        }
    }

    // ==================== 配置管理 ====================

    private void handleConfig(String[] parts) {
        if (parts.length < 2) {
            System.out.println("用法: /config clear [Bot名称]");
            System.out.println("  /config clear         清除所有 Bot 配置并重置");
            System.out.println("  /config clear <名称>  仅清除指定 Bot 的配置 (连接信息归零)");
            return;
        }
        String sub = parts[1].toLowerCase();
        if (!"clear".equals(sub)) {
            System.out.println("未知子命令: " + sub + "，可用: clear");
            return;
        }

        if (parts.length >= 3 && !parts[2].isBlank()) {
            // 清除指定 Bot 的配置
            String name = parts[2].trim();
            var inst = bots.get(name);
            if (inst == null) {
                System.out.println("Bot '" + name + "' 不存在");
                return;
            }
            if (inst.isConnected()) {
                System.out.println("请先断开 Bot '" + name + "' 的连接: /bot use " + name + " 然后 /disconnect");
                return;
            }
            inst.setMode("ws");
            inst.setWsUrl("");
            inst.setHttpUrl("");
            inst.setWsToken("");
            inst.setHttpToken("");
            saveConfig();
            System.out.println("已清除 Bot '" + name + "' 的配置 (连接地址和 Token 已归零)");
        } else {
            // 清除所有配置: 断开所有连接 -> 删除所有 Bot -> 重建 default
            for (var inst : bots.values()) {
                if (inst.isConnected()) {
                    System.out.println("正在断开 " + inst.getName() + "...");
                    try { inst.disconnect(); } catch (Exception ignored) {}
                }
            }
            bots.clear();
            bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
            activeBotName = DEFAULT_BOT_NAME;
            saveConfig();
            System.out.println("已清除所有 Bot 配置，恢复为默认状态");
        }
    }

    // ==================== 连接管理 ====================

    private void handleConnect() {
        var inst = requireActiveBot();
        if (inst == null) return;
        if (inst.isConnected()) {
            System.out.println("Bot '" + inst.getName() + "' 已连接，使用 /reconnect 重连或 /disconnect 断开");
            return;
        }
        connectInstance(inst);
    }

    private void connectInstance(BotInstance inst) {
        if ("ws".equals(inst.getMode())) {
            connectWebSocket(inst);
        } else {
            connectHttp(inst);
        }
    }

    private void connectWebSocket(BotInstance inst) {
        System.out.println("[" + inst.getName() + "] 正在通过 WebSocket 连接...");

        var dispatcher = new EventDispatcher();
        dispatcher.addHandler(new LogHandler());

        var wsConn = inst.getWsToken().isEmpty()
                ? new OneBotConnection(inst.getWsUrl(), dispatcher)
                : new OneBotConnection(inst.getWsUrl(), inst.getWsToken(), dispatcher);

        wsConn.setAutoReconnect(true);
        wsConn.setReconnectInterval(5);
        wsConn.connect();

        inst.setWsConnection(wsConn);
        inst.setProvider(wsConn);
        inst.setDispatcher(dispatcher);

        var client = new OneBotClient(wsConn);
        inst.setClient(client);

        dispatcher.addHandler(new CommandHandler(client, commandPrefix));

        tryPrintLoginInfo(inst);
        inst.getScheduler().setBot(client);
        inst.getScheduler().start();
        inst.setConnected(true);

        System.out.println("[" + inst.getName() + "] Bot 已启动 (WebSocket 模式)");
    }

    private void connectHttp(BotInstance inst) {
        System.out.println("[" + inst.getName() + "] 正在通过 HTTP 连接...");

        var httpConn = inst.getHttpToken().isEmpty()
                ? new OneBotHttpConnection(inst.getHttpUrl())
                : new OneBotHttpConnection(inst.getHttpUrl(), inst.getHttpToken());

        inst.setProvider(httpConn);
        var client = new OneBotClient(httpConn);
        inst.setClient(client);

        tryPrintLoginInfo(inst);
        inst.getScheduler().setBot(client);
        inst.getScheduler().start();
        inst.setConnected(true);

        System.out.println("[" + inst.getName() + "] Bot 已启动 (HTTP 模式，不接收事件推送)");
    }

    private void tryPrintLoginInfo(BotInstance inst) {
        try {
            var loginInfo = inst.getClient().getLoginInfo();
            inst.setUserId(loginInfo.getUserId());
            inst.setNickname(loginInfo.getNickname());
            System.out.println("[" + inst.getName() + "] 登录成功 — QQ: "
                    + loginInfo.getUserId() + ", 昵称: " + loginInfo.getNickname());
        } catch (Exception e) {
            System.out.println("[" + inst.getName() + "] 警告: 无法获取登录信息 (" + e.getMessage() + ")");
        }
    }

    private void handleDisconnect() {
        var inst = requireActiveBot();
        if (inst == null) return;
        disconnectInstance(inst);
    }

    private void disconnectInstance(BotInstance inst) {
        if (!inst.isConnected()) {
            System.out.println("[" + inst.getName() + "] 当前未连接");
            return;
        }
        inst.getScheduler().stop();
        if (inst.getProvider() != null) {
            inst.getProvider().close();
        }
        inst.setWsConnection(null);
        inst.setProvider(null);
        inst.setClient(null);
        inst.setDispatcher(null);
        inst.setConnected(false);
        inst.setUserId(0);
        inst.setNickname("");
        System.out.println("[" + inst.getName() + "] 已断开连接");
    }

    private void handleReconnect() {
        var inst = requireActiveBot();
        if (inst == null) return;
        disconnectInstance(inst);
        connectInstance(inst);
    }

    /** 连接所有未连接的 Bot */
    private void handleConnectAll() {
        if (bots.isEmpty()) {
            System.out.println("暂无 Bot 实例");
            return;
        }
        int count = 0;
        for (var inst : bots.values()) {
            if (!inst.isConnected()) {
                connectInstance(inst);
                count++;
            }
        }
        if (count == 0) {
            System.out.println("所有 Bot 均已连接");
        } else {
            System.out.println("已连接 " + count + " 个 Bot");
        }
    }

    /** 断开所有已连接的 Bot */
    private void handleDisconnectAll() {
        int count = 0;
        for (var inst : bots.values()) {
            if (inst.isConnected()) {
                disconnectInstance(inst);
                count++;
            }
        }
        System.out.println("已断开 " + count + " 个 Bot");
    }

    // ==================== 运行时命令 ====================

    private void handleStatus() {
        var inst = requireConnectedBot();
        if (inst == null) return;
        try {
            var loginInfo = inst.getClient().getLoginInfo();
            var ver = inst.getClient().getVersionInfo();
            System.out.println("┌─ Bot 状态: " + inst.getName() + " ──────────────────────┐");
            System.out.println("│ 模式     : " + pad(inst.getMode().toUpperCase(), 30) + "│");
            System.out.println("│ QQ号     : " + pad(String.valueOf(loginInfo.getUserId()), 30) + "│");
            System.out.println("│ 昵称     : " + pad(loginInfo.getNickname(), 30) + "│");
            System.out.println("│ 应用     : " + pad(ver.getAppName() + " v" + ver.getAppVersion(), 30) + "│");
            System.out.println("│ 连接状态 : " + pad(inst.getProvider().isConnected() ? "已连接" : "已断开", 30) + "│");
            System.out.println("└───────────────────────────────────────────┘");
        } catch (Exception e) {
            System.out.println("获取状态失败: " + e.getMessage());
        }
    }

    private void handleSend(String[] parts) {
        var inst = requireConnectedBot();
        if (inst == null) return;
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
                    msgId = inst.getClient().sendGroupMsg(id, msg);
                    System.out.println("[" + inst.getName() + "] 群消息发送成功, message_id=" + msgId);
                }
                case "private", "p" -> {
                    msgId = inst.getClient().sendPrivateMsg(id, msg);
                    System.out.println("[" + inst.getName() + "] 私聊消息发送成功, message_id=" + msgId);
                }
                default -> System.out.println("类型必须是 group 或 private");
            }
        } catch (Exception e) {
            System.out.println("发送失败: " + e.getMessage());
        }
    }

    private void handleFriends() {
        var inst = requireConnectedBot();
        if (inst == null) return;
        try {
            var friends = inst.getClient().getFriendList();
            System.out.println("[" + inst.getName() + "] 好友列表 (共 " + friends.size() + " 个):");
            for (var f : friends) {
                String remark = (f.getRemark() != null && !f.getRemark().isEmpty()) ? " (" + f.getRemark() + ")" : "";
                System.out.println("  " + f.getUserId() + " - " + f.getNickname() + remark);
            }
        } catch (Exception e) {
            System.out.println("获取好友列表失败: " + e.getMessage());
        }
    }

    private void handleGroups() {
        var inst = requireConnectedBot();
        if (inst == null) return;
        try {
            var groups = inst.getClient().getGroupList();
            System.out.println("[" + inst.getName() + "] 群列表 (共 " + groups.size() + " 个):");
            for (var g : groups) {
                System.out.println("  " + g.getGroupId() + " - " + g.getGroupName()
                        + " (" + g.getMemberCount() + "/" + g.getMaxMemberCount() + ")");
            }
        } catch (Exception e) {
            System.out.println("获取群列表失败: " + e.getMessage());
        }
    }

    private void handleMembers(String[] parts) {
        var inst = requireConnectedBot();
        if (inst == null) return;
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
            var members = inst.getClient().getGroupMemberList(groupId);
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
        var inst = requireActiveBot();
        if (inst == null) return;
        var scheduler = inst.getScheduler();

        if (parts.length < 2) {
            printScheduleHelp();
            return;
        }
        String sub = parts[1].toLowerCase();
        switch (sub) {
            case "list", "ls" -> {
                var tasks = scheduler.getTasks();
                if (tasks.isEmpty()) {
                    System.out.println("[" + inst.getName() + "] 暂无定时任务，使用 /schedule add 添加");
                } else {
                    System.out.println("[" + inst.getName() + "] 定时任务列表 (共 " + tasks.size() + " 个):");
                    for (var t : tasks) {
                        System.out.println("  " + t);
                    }
                }
            }
            case "add" -> {
                if (parts.length < 3) {
                    System.out.println("用法: /schedule add <名称> <HH:mm> <QQ1,QQ2,...> <消息内容>");
                    System.out.println("示例: /schedule add morning 05:00 123456,789012 早上好！");
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
                    System.out.println("[" + inst.getName() + "] 定时任务已添加: " + name
                            + " -> 每天 " + time + " 发送到 " + targets.size() + " 人");
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
                if (inst.getClient() == null) {
                    System.out.println("Bot 未连接，请先 /connect");
                    return;
                }
                if (parts.length < 3 || parts[2].isBlank()) { System.out.println("用法: /schedule test <任务名>"); return; }
                String name = parts[2].trim();
                if (scheduler.getTask(name) != null) {
                    System.out.println("[" + inst.getName() + "] 立即执行任务: " + name);
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
        System.out.println("定时任务归属当前选中的 Bot，切换 Bot 后操作对应的任务列表");
    }

    // ==================== NapCat 进程管理 ====================

    private void handleNapCat(String[] parts) {
        if (parts.length < 2) {
            printNapCatHelp();
            return;
        }
        String sub = parts[1].toLowerCase();
        switch (sub) {
            case "dir" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    String cur = napCatLauncher.getNapCatDir();
                    System.out.println("NapCat 目录: " + (cur != null ? cur : "(未设置)"));
                    return;
                }
                napCatLauncher.setNapCatDir(parts[2].trim());
                saveConfig();
                System.out.println("NapCat 目录已设置: " + parts[2].trim());
            }
            case "workroot" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    String cur = napCatLauncher.getWorkRoot();
                    System.out.println("工作根目录: " + (cur != null ? cur : "(默认: NapCat目录/instances)"));
                    return;
                }
                napCatLauncher.setWorkRoot(parts[2].trim());
                saveConfig();
                System.out.println("工作根目录已设置: " + parts[2].trim());
            }
            case "start" -> {
                if (parts.length < 3) {
                    System.out.println("用法: /napcat start <名称> <QQ号> [WebUI端口]");
                    System.out.println("  端口和 Token 自动从 NapCat 配置读取");
                    System.out.println("示例: /napcat start bot1 2838453502");
                    System.out.println("      /napcat start bot1 2838453502 6101");
                    return;
                }
                String[] args = parts[2].trim().split("\\s+");
                if (args.length < 2) {
                    System.out.println("参数不足，用法: /napcat start <名称> <QQ号> [WebUI端口]");
                    return;
                }
                String name = args[0], qqUin = args[1];
                int webuiPort = 6099; // 默认 WebUI 端口
                if (args.length >= 3) {
                    try {
                        webuiPort = Integer.parseInt(args[2]);
                    } catch (NumberFormatException e) {
                        System.out.println("WebUI 端口必须是数字");
                        return;
                    }
                }

                // 从 NapCat 配置自动读取 WS/HTTP 端口
                // 优先从实例工作目录读取 (精确匹配 QQ 号)，避免多开时读到其他 QQ 的配置
                int wsPort = 0, httpPort = 0;
                String wsToken = "", httpToken = "";
                try {
                    NapCatConfigDiscovery.BotConfig matched = null;

                    // 1) 优先: 从实例工作目录 {workRoot}/{name}/config/onebot11_{QQ}.json 精确读取
                    String wr = napCatLauncher.getWorkRoot();
                    if (wr == null || wr.isEmpty()) {
                        wr = napCatLauncher.getNapCatDir() + "/instances";
                    }
                    java.nio.file.Path instanceConfigDir = java.nio.file.Path.of(wr, name, "config");
                    matched = NapCatConfigDiscovery.discoverByQQ(instanceConfigDir, qqUin);

                    // 2) 回退: 从 NapCat 共享配置目录按 QQ 号精确读取
                    if (matched == null) {
                        java.nio.file.Path sharedConfigDir = java.nio.file.Path.of(napCatLauncher.getNapCatDir(), "config");
                        matched = NapCatConfigDiscovery.discoverByQQ(sharedConfigDir, qqUin);
                    }

                    if (matched != null) {
                        if (matched.wsEnabled) {
                            wsPort = matched.wsPort;
                            wsToken = matched.wsToken;
                        }
                        if (matched.httpEnabled) {
                            httpPort = matched.httpPort;
                            httpToken = matched.httpToken;
                        }
                        System.out.println("已从配置读取: " + matched);
                    }
                } catch (Exception e) {
                    System.out.println("读取 NapCat 配置失败: " + e.getMessage());
                }

                try {
                    napCatLauncher.start(name, qqUin, wsPort, httpPort, webuiPort);
                    System.out.println("NapCat 实例已启动: " + name + " QQ=" + qqUin);
                    if (wsPort > 0)
                        System.out.println("  WS=ws://127.0.0.1:" + wsPort);
                    if (httpPort > 0)
                        System.out.println("  HTTP=http://127.0.0.1:" + httpPort);
                    System.out.println("  WebUI=http://127.0.0.1:" + webuiPort);

                    // 自动创建/更新对应的 BotInstance
                    String botName = "qq" + qqUin;
                    var inst = bots.get(botName);
                    if (inst == null) {
                        inst = new BotInstance(botName);
                        bots.put(botName, inst);
                        if (activeBotName == null) activeBotName = botName;
                    }
                    if (wsPort > 0) {
                        inst.setMode("ws");
                        inst.setWsUrl("ws://127.0.0.1:" + wsPort);
                        inst.setWsToken(wsToken);
                    } else if (httpPort > 0) {
                        inst.setMode("http");
                        inst.setHttpUrl("http://127.0.0.1:" + httpPort);
                        inst.setHttpToken(httpToken);
                    }
                    saveConfig();
                    System.out.println("  Bot '" + botName + "' 已自动配置，使用 /connect 连接");
                } catch (Exception e) {
                    System.out.println("启动失败: " + e.getMessage());
                }
            }
            case "stop" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /napcat stop <名称>");
                    return;
                }
                String name = parts[2].trim();
                // 如果正在 attach 被停止的实例，先 detach
                if (attached && name.equals(attachedInstance)) {
                    doDetach();
                }
                if ("all".equalsIgnoreCase(name)) {
                    if (attached) doDetach();
                    napCatLauncher.stopAll();
                    System.out.println("已停止所有 NapCat 实例");
                } else if (napCatLauncher.stop(name)) {
                    System.out.println("已停止 NapCat 实例: " + name);
                } else {
                    System.out.println("实例 '" + name + "' 不存在或已停止");
                }
            }
            case "list", "ls" -> {
                var instances = napCatLauncher.listInstances();
                if (instances.isEmpty()) {
                    System.out.println("暂无运行中的 NapCat 实例");
                } else {
                    System.out.println("NapCat 实例列表 (共 " + instances.size() + " 个):");
                    for (var inst : instances) {
                        System.out.println("  " + inst);
                    }
                }
                String dir = napCatLauncher.getNapCatDir();
                System.out.println("NapCat 目录: " + (dir != null ? dir : "(未设置)"));
            }
            case "log" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /napcat log <名称>");
                    return;
                }
                String name = parts[2].trim();
                var instances = napCatLauncher.listInstances();
                for (var inst : instances) {
                    if (inst.name.equals(name)) {
                        // 优先从内存环形缓冲区读取
                        if (inst.outputReader != null) {
                            var lines = inst.outputReader.getRecentLines(Integer.MAX_VALUE);
                            System.out.println("--- 共 " + lines.size() + " 行 (实时缓冲) ---");
                            for (var l : lines) {
                                System.out.println(l);
                            }
                            System.out.println("--- 使用 /napcat attach " + name + " 查看实时日志流 ---");
                        } else {
                            // 回退: 从文件读取
                            try {
                                var lines = java.nio.file.Files.readAllLines(java.nio.file.Path.of(inst.logFile));
                                System.out.println("--- 共 " + lines.size() + " 行 ---");
                                for (var l : lines) {
                                    System.out.println(l);
                                }
                            } catch (Exception e) {
                                System.out.println("读取日志失败: " + e.getMessage());
                            }
                        }
                        return;
                    }
                }
                System.out.println("实例 '" + name + "' 不存在");
            }
            case "attach", "a" -> {
                if (parts.length < 3 || parts[2].isBlank()) {
                    System.out.println("用法: /napcat attach <名称>");
                    return;
                }
                doAttach(parts[2].trim());
            }
            case "detach", "d" -> doDetach();
            case "discover" -> handleNapCatDiscover();
            default -> printNapCatHelp();
        }
    }

    // ==================== 日志流 attach/detach ====================

    private void doAttach(String name) {
        // 查找实例
        NapCatLauncher.NapCatProcess target = null;
        for (var inst : napCatLauncher.listInstances()) {
            if (inst.name.equals(name)) {
                target = inst;
                break;
            }
        }
        if (target == null || target.outputReader == null) {
            System.out.println("实例 '" + name + "' 不存在或未运行");
            return;
        }
        if (target.outputReader.isDone()) {
            System.out.println("实例 '" + name + "' 的进程已退出");
            return;
        }

        // 如果已 attach 另一个实例，先 detach
        if (attached) {
            doDetach();
        }

        // 回放最近30行历史
        var recent = target.outputReader.getRecentLines(Integer.MAX_VALUE);
        if (!recent.isEmpty()) {
            System.out.println("--- 共 " + recent.size() + " 行历史 ---");
            for (var line : recent) {
                System.out.println(line);
            }
        }

        // 设置实时监听器
        target.outputReader.setListener(line -> {
            if (line != null) {
                System.out.println(line);
            } else {
                // 进程退出，标记
                System.out.println("--- 进程 " + name + " 已退出 ---");
            }
        });

        attached = true;
        attachedInstance = name;
        System.out.println("--- 已连接到 " + name + " 的日志流 (输入 /detach 或按回车退出) ---");
    }

    private void doDetach() {
        if (!attached || attachedInstance == null) {
            System.out.println("当前未连接任何日志流");
            return;
        }

        // 清除监听器
        for (var inst : napCatLauncher.listInstances()) {
            if (inst.name.equals(attachedInstance) && inst.outputReader != null) {
                inst.outputReader.setListener(null);
                break;
            }
        }

        String name = attachedInstance;
        attached = false;
        attachedInstance = null;
        System.out.println("--- 已断开 " + name + " 的日志流 ---");
    }

    /** 检查 attach 状态: 如果进程已退出则自动 detach */
    private void checkAttachState() {
        if (!attached || attachedInstance == null) return;
        for (var inst : napCatLauncher.listInstances()) {
            if (inst.name.equals(attachedInstance)) {
                if (inst.outputReader != null && inst.outputReader.isDone()) {
                    doDetach();
                }
                return;
            }
        }
        // 实例已不在列表中
        attached = false;
        attachedInstance = null;
    }

    /**
     * 自动发现 NapCat 配置目录下的 onebot11_{QQ号}.json 文件，
     * 提取 WS/HTTP 连接信息，自动创建对应的 BotInstance。
     */
    private void handleNapCatDiscover() {
        String dir = napCatLauncher.getNapCatDir();
        if (dir == null || dir.isEmpty()) {
            System.out.println("请先设置 NapCat 目录: /napcat dir <路径>");
            return;
        }

        try {
            // 先从多实例工作目录扫描，再从共享配置目录补充 (按 QQ 号去重)
            var configs = new java.util.ArrayList<NapCatConfigDiscovery.BotConfig>();
            var seenQQ = new java.util.HashSet<String>();

            // 1) 扫描实例工作目录
            String wr = napCatLauncher.getWorkRoot();
            if (wr != null && !wr.isEmpty()) {
                for (var cfg : NapCatConfigDiscovery.discoverFromWorkRoot(wr)) {
                    configs.add(cfg);
                    seenQQ.add(cfg.qqUin);
                }
            }

            // 2) 补充: 共享配置目录 (跳过已在工作目录发现的 QQ)
            for (var cfg : NapCatConfigDiscovery.discover(dir)) {
                if (!seenQQ.contains(cfg.qqUin)) {
                    configs.add(cfg);
                }
            }

            if (configs.isEmpty()) {
                System.out.println("未发现任何已启用 WS/HTTP 服务的 QQ Bot 配置");
                System.out.println("请检查 " + dir + "/config/ 下是否有 onebot11_*.json 文件");
                return;
            }

            System.out.println("发现 " + configs.size() + " 个 QQ Bot 配置:");
            int created = 0;
            for (var cfg : configs) {
                System.out.println("  " + cfg);

                // 用 QQ 号作为 Bot 名称
                String botName = "qq" + cfg.qqUin;
                if (bots.containsKey(botName)) {
                    // 更新已有 Bot 的连接信息
                    var inst = bots.get(botName);
                    applyDiscoveredConfig(inst, cfg);
                    System.out.println("    -> 已更新 Bot: " + botName);
                } else {
                    // 创建新 Bot
                    var inst = new BotInstance(botName);
                    applyDiscoveredConfig(inst, cfg);
                    bots.put(botName, inst);
                    if (activeBotName == null) activeBotName = botName;
                    System.out.println("    -> 已创建 Bot: " + botName);
                    created++;
                }
            }

            saveConfig();
            System.out.println("完成! 新建 " + created + " 个，共 " + bots.size() + " 个 Bot");
            System.out.println("使用 /show 查看配置，/connect 或 /connectall 连接");
        } catch (Exception e) {
            System.out.println("自动发现失败: " + e.getMessage());
        }
    }

    /** 将发现的 NapCat 配置应用到 BotInstance */
    private void applyDiscoveredConfig(BotInstance inst, NapCatConfigDiscovery.BotConfig cfg) {
        inst.setMode(cfg.recommendedMode());
        if (cfg.wsEnabled) {
            inst.setWsUrl(cfg.wsUrl());
            inst.setWsToken(cfg.wsToken);
        }
        if (cfg.httpEnabled) {
            inst.setHttpUrl(cfg.httpUrl());
            inst.setHttpToken(cfg.httpToken);
        }
    }

    private void printNapCatHelp() {
        System.out.println("用法: /napcat <子命令>");
        System.out.println("  dir [路径]           查看/设置 NapCat.Shell 目录");
        System.out.println("  workroot [路径]      查看/设置实例工作根目录");
        System.out.println("  start <名称> <QQ号> <WS端口> <HTTP端口> <WebUI端口>");
        System.out.println("                       启动 NapCat 实例");
        System.out.println("  stop <名称|all>      停止 NapCat 实例");
        System.out.println("  list                 查看运行中的实例");
        System.out.println("  log <名称>           查看实例日志 (最后30行)");
        System.out.println("  attach <名称>        连接实时日志流 (屏幕切换)");
        System.out.println("  detach               断开日志流");
        System.out.println("  discover             自动发现 NapCat 配置并创建 Bot");
        System.out.println();
        System.out.println("示例:");
        System.out.println("  /napcat dir C:\\Users\\Lenovo\\Desktop\\NapCat.Shell");
        System.out.println("  /napcat start bot1 2838453502 3001 3003 6101");
        System.out.println("  /napcat start bot2 3149003262 3002 3004 6102");
        System.out.println("  /napcat list");
        System.out.println("  /napcat stop all");
    }

    private void handleLogout() {
        var inst = requireConnectedBot();
        if (inst == null) return;
        try {
            System.out.println("[" + inst.getName() + "] 正在退出 QQ 登录...");
            inst.getClient().callApi("bot_exit", null);
            System.out.println("[" + inst.getName() + "] 已发送退出登录请求");
        } catch (Exception e) {
            System.out.println("退出登录失败: " + e.getMessage());
        }
    }

    private void handleQuit() {
        System.out.println("正在退出...");
        // 如果正在 attach，先 detach
        if (attached) doDetach();
        // 停止所有 Bot 连接
        for (var inst : bots.values()) {
            if (inst.isConnected()) {
                inst.getScheduler().stop();
                if (inst.getProvider() != null) {
                    inst.getProvider().close();
                }
            }
        }
        // 停止所有 NapCat 实例
        if (!napCatLauncher.listInstances().isEmpty()) {
            System.out.println("正在停止 NapCat 实例...");
            napCatLauncher.stopAll();
        }
        System.out.println("再见!");
    }

    // ==================== 配置持久化 (多 Bot) ====================

    /**
     * 加载配置，支持两种格式:
     *   新格式: { "bots": { "name": {...}, ... }, "activeBot": "name" }
     *   旧格式: { "mode": "ws", "wsUrl": "...", ... }  (自动迁移为名为 "default" 的 Bot)
     */
    @SuppressWarnings("unchecked")
    private void loadConfig() {
        try {
            CryptoUtil.init();
            Path path = Path.of(CONFIG_FILE);
            if (!Files.exists(path)) {
                // 首次运行，创建一个默认 Bot
                bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
                activeBotName = DEFAULT_BOT_NAME;
                return;
            }

            String json = Files.readString(path);
            Map<String, Object> cfg = JsonUtil.parseObject(json);

            if (cfg.containsKey("bots") && cfg.get("bots") instanceof Map botsMap) {
                // 新格式: 多 Bot
                for (var entry : ((Map<String, Object>) botsMap).entrySet()) {
                    String name = entry.getKey();
                    if (entry.getValue() instanceof Map botCfg) {
                        var inst = new BotInstance(name);
                        if (botCfg.get("mode") instanceof String v) inst.setMode(v);
                        if (botCfg.get("wsUrl") instanceof String v) inst.setWsUrl(v);
                        if (botCfg.get("httpUrl") instanceof String v) inst.setHttpUrl(v);
                        if (botCfg.get("wsToken") instanceof String v) inst.setWsToken(CryptoUtil.decrypt(v));
                        if (botCfg.get("httpToken") instanceof String v) inst.setHttpToken(CryptoUtil.decrypt(v));
                        // 兼容旧版 accessToken: 同时设置 ws 和 http
                        if (botCfg.get("accessToken") instanceof String v) {
                            String decrypted = CryptoUtil.decrypt(v);
                            if (inst.getWsToken().isEmpty()) inst.setWsToken(decrypted);
                            if (inst.getHttpToken().isEmpty()) inst.setHttpToken(decrypted);
                        }
                        bots.put(name, inst);
                    }
                }
                if (cfg.get("activeBot") instanceof String ab && bots.containsKey(ab)) {
                    activeBotName = ab;
                } else if (!bots.isEmpty()) {
                    activeBotName = bots.keySet().iterator().next();
                }
                // NapCat 配置
                if (cfg.get("napCatDir") instanceof String v) napCatLauncher.setNapCatDir(v);
                if (cfg.get("napCatWorkRoot") instanceof String v) napCatLauncher.setWorkRoot(v);
            } else if (cfg.containsKey("mode")) {
                // 旧格式: 单 Bot -> 自动迁移
                var inst = new BotInstance(DEFAULT_BOT_NAME);
                if (cfg.get("mode") instanceof String v) inst.setMode(v);
                if (cfg.get("wsUrl") instanceof String v) inst.setWsUrl(v);
                if (cfg.get("httpUrl") instanceof String v) inst.setHttpUrl(v);
                // 旧版 accessToken: 同时设置 ws 和 http token
                if (cfg.get("accessToken") instanceof String v) {
                    String decrypted = CryptoUtil.decrypt(v);
                    inst.setWsToken(decrypted);
                    inst.setHttpToken(decrypted);
                }
                bots.put(DEFAULT_BOT_NAME, inst);
                activeBotName = DEFAULT_BOT_NAME;
                // 保存为新格式
                saveConfig();
                logger.info("已将旧版配置迁移为多 Bot 格式");
            } else {
                bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
                activeBotName = DEFAULT_BOT_NAME;
            }

            logger.debug("已加载 {} 个 Bot 配置", bots.size());
        } catch (Exception e) {
            logger.warn("加载配置文件失败，使用默认配置: {}", e.getMessage());
            bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
            activeBotName = DEFAULT_BOT_NAME;
        }
    }

    private void saveConfig() {
        try {
            var botsMap = new LinkedHashMap<String, Object>();
            for (var inst : bots.values()) {
                var botCfg = new LinkedHashMap<String, Object>();
                botCfg.put("mode", inst.getMode());
                botCfg.put("wsUrl", inst.getWsUrl());
                botCfg.put("httpUrl", inst.getHttpUrl());
                botCfg.put("wsToken", CryptoUtil.encrypt(inst.getWsToken()));
                botCfg.put("httpToken", CryptoUtil.encrypt(inst.getHttpToken()));
                botsMap.put(inst.getName(), botCfg);
            }

            var cfg = new LinkedHashMap<String, Object>();
            cfg.put("bots", botsMap);
            cfg.put("activeBot", activeBotName);

            // NapCat 配置
            if (napCatLauncher.getNapCatDir() != null) {
                cfg.put("napCatDir", napCatLauncher.getNapCatDir());
            }
            if (napCatLauncher.getWorkRoot() != null) {
                cfg.put("napCatWorkRoot", napCatLauncher.getWorkRoot());
            }

            Files.writeString(Path.of(CONFIG_FILE), JsonUtil.toJson(cfg));
            logger.debug("配置已保存 ({} 个 Bot)", bots.size());
        } catch (IOException e) {
            logger.warn("保存配置文件失败", e);
        }
    }

    // ==================== 辅助方法 ====================

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
        System.out.println("  ║         QQBot-Fire  v2.0.0            ║");
        System.out.println("  ║   NapCat OneBot 11 Java Bot Client    ║");
        System.out.println("  ║        多实例 (双开) 支持              ║");
        System.out.println("  ╚═══════════════════════════════════════╝");
        System.out.println();
    }

    private void printHelp() {
        System.out.println();
        System.out.println("  ┌─ Bot 管理 (多开) ─────────────────────┐");
        System.out.println("  │ /bot add <名称>    添加 Bot 实例      │");
        System.out.println("  │ /bot remove <名称> 删除 Bot 实例      │");
        System.out.println("  │ /bot list          列出所有 Bot       │");
        System.out.println("  │ /bot use <名称>    切换当前 Bot       │");
        System.out.println("  │ /bot rename <旧> <新>  重命名 Bot     │");
        System.out.println("  ├─ 配置命令 (作用于当前 Bot) ───────────┤");
        System.out.println("  │ /set mode <ws|http> 切换连接模式      │");
        System.out.println("  │ /set ws <url>      设置 WebSocket 地址│");
        System.out.println("  │ /set http <url>    设置 HTTP API 地址 │");
        System.out.println("  │ /set wstoken <t>   设置 WS Token      │");
        System.out.println("  │ /set httptoken <t> 设置 HTTP Token    │");
        System.out.println("  │ /show              显示所有 Bot 配置  │");
        System.out.println("  ├─ 连接管理 ────────────────────────────┤");
        System.out.println("  │ /connect           连接当前 Bot      │");
        System.out.println("  │ /disconnect        断开当前 Bot      │");
        System.out.println("  │ /reconnect         重新连接当前 Bot  │");
        System.out.println("  │ /connectall        连接所有 Bot      │");
        System.out.println("  │ /disconnectall     断开所有 Bot      │");
        System.out.println("  ├─ 运行时命令 (当前 Bot) ──────────────┤");
        System.out.println("  │ /status            查看 Bot 状态      │");
        System.out.println("  │ /send group <群号> <消息>  发送群消息  │");
        System.out.println("  │ /send private <QQ> <消息>  发送私聊   │");
        System.out.println("  │ /friends           获取好友列表       │");
        System.out.println("  │ /groups            获取群列表         │");
        System.out.println("  │ /members <群号>    获取群成员列表     │");
        System.out.println("  ├─ 定时任务 (当前 Bot) ────────────────┤");
        System.out.println("  │ /schedule list     查看定时任务       │");
        System.out.println("  │ /schedule add ...  添加定时任务       │");
        System.out.println("  │ /schedule remove   删除定时任务       │");
        System.out.println("  │ /schedule test     立即测试执行       │");
        System.out.println("  │ /logout            退出 QQ 登录       │");
        System.out.println("  ├─ NapCat 进程管理 ─────────────────────┤");
        System.out.println("  │ /napcat dir [路径]  NapCat.Shell 目录 │");
        System.out.println("  │ /napcat start ...  启动 NapCat 实例   │");
        System.out.println("  │ /napcat stop <名称> 停止 NapCat 实例  │");
        System.out.println("  │ /napcat list       查看运行中的实例   │");
        System.out.println("  │ /napcat log <名称> 查看实例日志       │");
        System.out.println("  │ /napcat attach <名称> 实时日志流      │");
        System.out.println("  │ /napcat detach   断开日志流           │");
        System.out.println("  ├─ 配置管理 ────────────────────────────┤");
        System.out.println("  │ /config clear       清除所有配置重置  │");
        System.out.println("  │ /config clear <名称> 清除指定Bot配置  │");
        System.out.println("  ├─ 其他 ────────────────────────────────┤");
        System.out.println("  │ /quit              退出程序           │");
        System.out.println("  │ /help              显示此帮助         │");
        System.out.println("  └───────────────────────────────────────┘");
        System.out.println();
    }
}
