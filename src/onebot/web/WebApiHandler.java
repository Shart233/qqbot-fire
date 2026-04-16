package onebot.web;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import onebot.client.BotInstance;
import onebot.console.BotConsole;
import onebot.napcat.NapCatConfigDiscovery;
import onebot.napcat.NapCatLauncher;
import onebot.util.ConvertUtil;
import com.google.gson.reflect.TypeToken;
import onebot.util.GsonFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.*;

/**
 * Web 控制台 REST API 处理器
 *
 * 处理所有 /api/* 请求，提供 Bot 管理、连接、消息、定时任务、NapCat 管理等 API。
 * JSON 响应格式: {"ok": true, "data": ...} 或 {"ok": false, "error": "..."}
 */
public class WebApiHandler implements HttpHandler {

    private static final Logger logger = LogManager.getLogger(WebApiHandler.class);

    private final BotConsole console;

    public WebApiHandler(BotConsole console) {
        this.console = console;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod().toUpperCase();

        try {
            route(exchange, method, path);
        } catch (Exception e) {
            logger.error("API 处理异常: {} {}", method, path, e);
            sendError(exchange, 500, e.getMessage() != null ? e.getMessage() : "Internal Server Error");
        }
    }

    // ==================== 路由 ====================

    private void route(HttpExchange ex, String method, String path) throws IOException {
        // 去掉 /api 前缀
        String api = path.startsWith("/api") ? path.substring(4) : path;
        if (api.isEmpty()) api = "/";

        // ---- Console ----
        if (api.startsWith("/console")) {
            routeConsole(ex, method, api);
            return;
        }

        // ---- Logs ----
        if (api.startsWith("/logs")) {
            routeLogs(ex, method, api.substring(5));
            return;
        }

        // ---- NapCat ----
        if (api.startsWith("/napcat")) {
            routeNapCat(ex, method, api);
            return;
        }

        // ---- 全局操作 ----
        if ("/connect-all".equals(api) && "POST".equals(method)) {
            handleConnectAll(ex); return;
        }
        if ("/disconnect-all".equals(api) && "POST".equals(method)) {
            handleDisconnectAll(ex); return;
        }
        if ("/config/clear".equals(api) && "POST".equals(method)) {
            handleClearAllConfig(ex); return;
        }

        // ---- /bots ----
        if ("/bots".equals(api)) {
            if ("GET".equals(method)) { handleListBots(ex); return; }
            if ("POST".equals(method)) { handleAddBot(ex); return; }
        }

        // ---- /bots/{name}/... ----
        if (api.startsWith("/bots/")) {
            routeBot(ex, method, api.substring(6));
            return;
        }

        sendError(ex, 404, "未知 API: " + path);
    }

    private void routeBot(HttpExchange ex, String method, String rest) throws IOException {
        // rest = "{name}" or "{name}/action" or "{name}/action/..."
        int slash = rest.indexOf('/');
        String botName;
        String action;

        if (slash < 0) {
            botName = urlDecode(rest);
            action = "";
        } else {
            botName = urlDecode(rest.substring(0, slash));
            action = rest.substring(slash);
        }

        // DELETE /api/bots/{name}
        if (action.isEmpty() && "DELETE".equals(method)) {
            handleDeleteBot(ex, botName); return;
        }

        switch (action) {
            case "/rename" -> { if ("PUT".equals(method)) { handleRenameBot(ex, botName); return; } }
            case "/active" -> { if ("PUT".equals(method)) { handleSetActive(ex, botName); return; } }
            case "/config" -> {
                if ("GET".equals(method)) { handleGetConfig(ex, botName); return; }
                if ("PUT".equals(method)) { handleUpdateConfig(ex, botName); return; }
            }
            case "/config/clear" -> { if ("POST".equals(method)) { handleClearBotConfig(ex, botName); return; } }
            case "/connect" -> { if ("POST".equals(method)) { handleConnect(ex, botName); return; } }
            case "/disconnect" -> { if ("POST".equals(method)) { handleDisconnect(ex, botName); return; } }
            case "/reconnect" -> { if ("POST".equals(method)) { handleReconnect(ex, botName); return; } }
            case "/status" -> { if ("GET".equals(method)) { handleStatus(ex, botName); return; } }
            case "/friends" -> { if ("GET".equals(method)) { handleFriends(ex, botName); return; } }
            case "/groups" -> { if ("GET".equals(method)) { handleGroups(ex, botName); return; } }
            case "/send" -> { if ("POST".equals(method)) { handleSend(ex, botName); return; } }
            case "/schedules" -> {
                if ("GET".equals(method)) { handleListSchedules(ex, botName); return; }
                if ("POST".equals(method)) { handleAddSchedule(ex, botName); return; }
            }
            default -> {}
        }

        // /groups/{groupId}/members
        if (action.startsWith("/groups/") && action.endsWith("/members") && "GET".equals(method)) {
            String groupIdStr = action.substring(8, action.length() - 8);
            handleGroupMembers(ex, botName, groupIdStr);
            return;
        }

        // /schedules/{taskName}...
        if (action.startsWith("/schedules/")) {
            routeSchedule(ex, method, botName, action.substring(11));
            return;
        }

        sendError(ex, 404, "未知 Bot API: /api/bots/" + botName + action);
    }

    private void routeSchedule(HttpExchange ex, String method, String botName, String rest) throws IOException {
        int slash = rest.indexOf('/');
        String taskName;
        String subAction;

        if (slash < 0) {
            taskName = urlDecode(rest);
            subAction = "";
        } else {
            taskName = urlDecode(rest.substring(0, slash));
            subAction = rest.substring(slash);
        }

        if (subAction.isEmpty() && "DELETE".equals(method)) {
            handleDeleteSchedule(ex, botName, taskName); return;
        }
        if ("/toggle".equals(subAction) && "PUT".equals(method)) {
            handleToggleSchedule(ex, botName, taskName); return;
        }
        if ("/test".equals(subAction) && "POST".equals(method)) {
            handleTestSchedule(ex, botName, taskName); return;
        }

        sendError(ex, 404, "未知定时任务 API");
    }

    private void routeNapCat(HttpExchange ex, String method, String api) throws IOException {
        String sub = api.substring(7); // remove "/napcat"
        if (sub.isEmpty()) sub = "/";

        if ("/config".equals(sub)) {
            if ("GET".equals(method)) { handleGetNapCatConfig(ex); return; }
            if ("PUT".equals(method)) { handleSetNapCatConfig(ex); return; }
        }
        if ("/start".equals(sub) && "POST".equals(method)) { handleNapCatStart(ex); return; }
        if ("/stop".equals(sub) && "POST".equals(method)) { handleNapCatStop(ex); return; }
        if ("/instances".equals(sub) && "GET".equals(method)) { handleNapCatInstances(ex); return; }
        if ("/saved".equals(sub) && "GET".equals(method)) { handleNapCatSaved(ex); return; }
        if ("/saved".equals(sub) && "PUT".equals(method)) { handleNapCatUpdateSaved(ex); return; }
        if ("/forget".equals(sub) && "POST".equals(method)) { handleNapCatForget(ex); return; }
        if ("/discover".equals(sub) && "POST".equals(method)) { handleNapCatDiscover(ex); return; }

        // /instances/{name}/log
        if (sub.startsWith("/instances/") && sub.endsWith("/log") && "GET".equals(method)) {
            String name = urlDecode(sub.substring(11, sub.length() - 4));
            handleNapCatLog(ex, name);
            return;
        }

        sendError(ex, 404, "未知 NapCat API");
    }

    // ==================== 控制台命令 ====================

    private void routeConsole(HttpExchange ex, String method, String api) throws IOException {
        if ("/console/exec".equals(api) && "POST".equals(method)) {
            handleConsoleExec(ex); return;
        }
        sendError(ex, 404, "未知控制台 API");
    }

    private void handleConsoleExec(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String command = (String) body.get("command");
        if (command == null || command.isBlank()) {
            sendError(ex, 400, "缺少 command 参数"); return;
        }

        // 捕获 System.out 输出
        var baos = new java.io.ByteArrayOutputStream();
        var capture = new java.io.PrintStream(baos, true, java.nio.charset.StandardCharsets.UTF_8);
        var oldOut = System.out;
        System.setOut(capture);
        try {
            console.executeCommand(command);
        } catch (Exception e) {
            System.out.println("错误: " + e.getMessage());
        } finally {
            System.setOut(oldOut);
        }

        String output = baos.toString(java.nio.charset.StandardCharsets.UTF_8);
        sendOk(ex, Map.of("output", output));
    }

    // ==================== 服务端日志 ====================

    private void routeLogs(HttpExchange ex, String method, String api) throws IOException {
        if ("GET".equals(method)) {
            // /logs/list — 列出可用日志文件
            if ("/list".equals(api)) {
                handleLogList(ex); return;
            }
            // /logs/read?file=xxx&lines=nnn&offset=nnn
            if ("/read".equals(api)) {
                handleLogRead(ex); return;
            }
        }
        sendError(ex, 404, "未知日志 API");
    }

    private void handleLogList(HttpExchange ex) throws IOException {
        var logDir = java.nio.file.Path.of("logs");
        var files = new ArrayList<Map<String, Object>>();
        if (java.nio.file.Files.isDirectory(logDir)) {
            try (var stream = java.nio.file.Files.list(logDir)) {
                stream.filter(p -> p.toString().endsWith(".log"))
                      .sorted()
                      .forEach(p -> {
                          var m = new LinkedHashMap<String, Object>();
                          m.put("name", p.getFileName().toString());
                          try { m.put("size", java.nio.file.Files.size(p)); } catch (Exception e) { m.put("size", 0); }
                          try { m.put("modified", java.nio.file.Files.getLastModifiedTime(p).toMillis()); } catch (Exception e) { m.put("modified", 0); }
                          files.add(m);
                      });
            }
        }
        sendOk(ex, files);
    }

    private void handleLogRead(HttpExchange ex) throws IOException {
        String query = ex.getRequestURI().getQuery();
        var params = parseQuery(query);
        String fileName = params.getOrDefault("file", "qqbot-fire.log");
        int lines = 200;
        try { lines = Integer.parseInt(params.getOrDefault("lines", "200")); } catch (Exception ignored) {}
        if (lines > 2000) lines = 2000;
        if (lines < 1) lines = 200;

        // 安全检查: 只允许读取 logs/ 下的 .log 文件
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\") || !fileName.endsWith(".log")) {
            sendError(ex, 400, "非法文件名"); return;
        }

        var logFile = java.nio.file.Path.of("logs", fileName);
        if (!java.nio.file.Files.exists(logFile)) {
            sendOk(ex, Map.of("file", fileName, "lines", List.of(), "total", 0));
            return;
        }

        // 读取最后 N 行 (tail)
        var allLines = java.nio.file.Files.readAllLines(logFile, java.nio.charset.StandardCharsets.UTF_8);
        int total = allLines.size();
        int from = Math.max(0, total - lines);
        var tail = allLines.subList(from, total);

        var data = new LinkedHashMap<String, Object>();
        data.put("file", fileName);
        data.put("lines", tail);
        data.put("total", total);
        data.put("from", from);
        sendOk(ex, data);
    }

    private static Map<String, String> parseQuery(String query) {
        var params = new LinkedHashMap<String, String>();
        if (query == null || query.isBlank()) return params;
        for (String pair : query.split("&")) {
            int eq = pair.indexOf('=');
            if (eq > 0) {
                params.put(urlDecode(pair.substring(0, eq)), urlDecode(pair.substring(eq + 1)));
            }
        }
        return params;
    }

    // ==================== Bot 管理 ====================

    private void handleListBots(HttpExchange ex) throws IOException {
        var bots = console.getBots();
        var list = new ArrayList<Map<String, Object>>();
        for (var inst : bots.values()) {
            list.add(botToMap(inst));
        }
        var data = new LinkedHashMap<String, Object>();
        data.put("bots", list);
        data.put("activeBot", console.getActiveBotName());
        sendOk(ex, data);
    }

    private void handleAddBot(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        if (name == null || name.isBlank()) {
            sendError(ex, 400, "缺少 name 参数"); return;
        }
        if (console.getBots().containsKey(name)) {
            sendError(ex, 409, "Bot '" + name + "' 已存在"); return;
        }
        var inst = new BotInstance(name);
        console.getBots().put(name, inst);
        if (console.getActiveBotName() == null) console.setActiveBotName(name);
        console.saveConfig();
        sendOk(ex, botToMap(inst));
    }

    private void handleDeleteBot(HttpExchange ex, String name) throws IOException {
        var inst = console.getBots().get(name);
        if (inst == null) { sendError(ex, 404, "Bot '" + name + "' 不存在"); return; }
        if (inst.isConnected()) {
            console.disconnectInstance(inst);
        }
        console.getBots().remove(name);
        if (name.equals(console.getActiveBotName())) {
            console.setActiveBotName(console.getBots().isEmpty() ? null : console.getBots().keySet().iterator().next());
        }
        console.saveConfig();
        sendOk(ex, Map.of("deleted", name));
    }

    private void handleRenameBot(HttpExchange ex, String name) throws IOException {
        var body = readBodyAsMap(ex);
        String newName = (String) body.get("newName");
        if (newName == null || newName.isBlank()) { sendError(ex, 400, "缺少 newName 参数"); return; }
        var inst = console.getBots().get(name);
        if (inst == null) { sendError(ex, 404, "Bot '" + name + "' 不存在"); return; }
        if (console.getBots().containsKey(newName)) { sendError(ex, 409, "Bot '" + newName + "' 已存在"); return; }
        console.getBots().remove(name);
        inst.setName(newName);
        console.getBots().put(newName, inst);
        if (name.equals(console.getActiveBotName())) console.setActiveBotName(newName);
        console.saveConfig();
        sendOk(ex, botToMap(inst));
    }

    private void handleSetActive(HttpExchange ex, String name) throws IOException {
        if (!console.getBots().containsKey(name)) { sendError(ex, 404, "Bot '" + name + "' 不存在"); return; }
        console.setActiveBotName(name);
        console.saveConfig();
        sendOk(ex, Map.of("activeBot", name));
    }

    // ==================== 配置 ====================

    private void handleGetConfig(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        sendOk(ex, configToMap(inst));
    }

    private void handleUpdateConfig(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        var body = readBodyAsMap(ex);
        if (body.containsKey("mode")) inst.setMode((String) body.get("mode"));
        if (body.containsKey("wsUrl")) inst.setWsUrl((String) body.get("wsUrl"));
        if (body.containsKey("httpUrl")) inst.setHttpUrl((String) body.get("httpUrl"));
        if (body.containsKey("wsToken")) inst.setWsToken((String) body.get("wsToken"));
        if (body.containsKey("httpToken")) inst.setHttpToken((String) body.get("httpToken"));
        console.saveConfig();
        sendOk(ex, configToMap(inst));
    }

    private void handleClearAllConfig(HttpExchange ex) throws IOException {
        for (var inst : console.getBots().values()) {
            if (inst.isConnected()) {
                try { console.disconnectInstance(inst); } catch (Exception ignored) {}
            }
        }
        console.getBots().clear();
        console.getBots().put("default", new BotInstance("default"));
        console.setActiveBotName("default");
        console.saveConfig();
        sendOk(ex, Map.of("message", "已清除所有配置"));
    }

    private void handleClearBotConfig(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        if (inst.isConnected()) { sendError(ex, 400, "请先断开连接"); return; }
        inst.setMode("ws");
        inst.setWsUrl("");
        inst.setHttpUrl("");
        inst.setWsToken("");
        inst.setHttpToken("");
        console.saveConfig();
        sendOk(ex, configToMap(inst));
    }

    // ==================== 连接管理 ====================

    private void handleConnect(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        if (inst.isConnected()) { sendError(ex, 400, "已连接"); return; }
        try {
            console.connectInstance(inst);
            sendOk(ex, botToMap(inst));
        } catch (Exception e) {
            sendError(ex, 500, "连接失败: " + e.getMessage());
        }
    }

    private void handleDisconnect(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        console.disconnectInstance(inst);
        sendOk(ex, botToMap(inst));
    }

    private void handleReconnect(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        console.disconnectInstance(inst);
        try {
            console.connectInstance(inst);
            sendOk(ex, botToMap(inst));
        } catch (Exception e) {
            sendError(ex, 500, "重连失败: " + e.getMessage());
        }
    }

    private void handleConnectAll(HttpExchange ex) throws IOException {
        int count = 0;
        for (var inst : console.getBots().values()) {
            if (!inst.isConnected()) {
                try { console.connectInstance(inst); count++; } catch (Exception ignored) {}
            }
        }
        sendOk(ex, Map.of("connected", count));
    }

    private void handleDisconnectAll(HttpExchange ex) throws IOException {
        int count = 0;
        for (var inst : console.getBots().values()) {
            if (inst.isConnected()) {
                console.disconnectInstance(inst);
                count++;
            }
        }
        sendOk(ex, Map.of("disconnected", count));
    }

    // ==================== 状态 & 信息 ====================

    private void handleStatus(HttpExchange ex, String botName) throws IOException {
        var inst = requireConnectedBot(ex, botName);
        if (inst == null) return;
        try {
            var login = inst.getClient().getLoginInfo();
            var ver = inst.getClient().getVersionInfo();
            var data = new LinkedHashMap<String, Object>();
            data.put("name", inst.getName());
            data.put("userId", login.getUserId());
            data.put("nickname", login.getNickname());
            data.put("appName", ver.getAppName());
            data.put("appVersion", ver.getAppVersion());
            data.put("protocolVersion", ver.getProtocolVersion());
            data.put("connected", true);
            sendOk(ex, data);
        } catch (Exception e) {
            sendError(ex, 500, "获取状态失败: " + e.getMessage());
        }
    }

    private void handleFriends(HttpExchange ex, String botName) throws IOException {
        var inst = requireConnectedBot(ex, botName);
        if (inst == null) return;
        try {
            var friends = inst.getClient().getFriendList();
            var list = new ArrayList<Map<String, Object>>();
            for (var f : friends) {
                var m = new LinkedHashMap<String, Object>();
                m.put("userId", f.getUserId());
                m.put("nickname", f.getNickname());
                m.put("remark", f.getRemark());
                list.add(m);
            }
            sendOk(ex, list);
        } catch (Exception e) {
            sendError(ex, 500, "获取好友列表失败: " + e.getMessage());
        }
    }

    private void handleGroups(HttpExchange ex, String botName) throws IOException {
        var inst = requireConnectedBot(ex, botName);
        if (inst == null) return;
        try {
            var groups = inst.getClient().getGroupList();
            var list = new ArrayList<Map<String, Object>>();
            for (var g : groups) {
                var m = new LinkedHashMap<String, Object>();
                m.put("groupId", g.getGroupId());
                m.put("groupName", g.getGroupName());
                m.put("memberCount", g.getMemberCount());
                m.put("maxMemberCount", g.getMaxMemberCount());
                list.add(m);
            }
            sendOk(ex, list);
        } catch (Exception e) {
            sendError(ex, 500, "获取群列表失败: " + e.getMessage());
        }
    }

    private void handleGroupMembers(HttpExchange ex, String botName, String groupIdStr) throws IOException {
        var inst = requireConnectedBot(ex, botName);
        if (inst == null) return;
        try {
            long groupId = Long.parseLong(groupIdStr);
            var members = inst.getClient().getGroupMemberList(groupId);
            var list = new ArrayList<Map<String, Object>>();
            for (var mem : members) {
                var m = new LinkedHashMap<String, Object>();
                m.put("userId", mem.getUserId());
                m.put("nickname", mem.getNickname());
                m.put("card", mem.getCard());
                m.put("role", mem.getRole());
                m.put("joinTime", mem.getJoinTime());
                m.put("lastSentTime", mem.getLastSentTime());
                m.put("level", mem.getLevel());
                list.add(m);
            }
            sendOk(ex, list);
        } catch (NumberFormatException e) {
            sendError(ex, 400, "群号格式错误");
        } catch (Exception e) {
            sendError(ex, 500, "获取群成员失败: " + e.getMessage());
        }
    }

    // ==================== 消息 ====================

    private void handleSend(HttpExchange ex, String botName) throws IOException {
        var inst = requireConnectedBot(ex, botName);
        if (inst == null) return;
        var body = readBodyAsMap(ex);
        String type = (String) body.get("type");
        long target = ConvertUtil.toLong(body.get("target"));
        String message = (String) body.get("message");

        if (type == null || target == 0 || message == null) {
            sendError(ex, 400, "缺少 type, target 或 message 参数"); return;
        }

        try {
            long msgId;
            if ("group".equals(type)) {
                msgId = inst.getClient().sendGroupMsg(target, message);
            } else if ("private".equals(type)) {
                msgId = inst.getClient().sendPrivateMsg(target, message);
            } else {
                sendError(ex, 400, "type 必须是 group 或 private"); return;
            }
            sendOk(ex, Map.of("messageId", msgId));
        } catch (Exception e) {
            sendError(ex, 500, "发送失败: " + e.getMessage());
        }
    }

    // ==================== 定时任务 ====================

    private void handleListSchedules(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        var tasks = inst.getScheduler().getTasks();
        var list = new ArrayList<Map<String, Object>>();
        for (var t : tasks) {
            list.add(taskToMap(t));
        }
        sendOk(ex, list);
    }

    @SuppressWarnings("unchecked")
    private void handleAddSchedule(HttpExchange ex, String botName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        String time = (String) body.get("time");
        String message = (String) body.get("message");
        var rawTargets = body.get("targets");

        if (name == null || time == null || message == null || rawTargets == null) {
            sendError(ex, 400, "缺少 name, time, targets 或 message"); return;
        }

        String targetType = body.get("targetType") instanceof String tt ? tt : "private";

        var targets = new ArrayList<Long>();
        if (rawTargets instanceof List<?> targetList) {
            for (var t : targetList) {
                targets.add(ConvertUtil.toLong(t));
            }
        }

        try {
            inst.getScheduler().addTask(name, time, targets, targetType, message);
            sendOk(ex, Map.of("message", "任务已添加"));
        } catch (Exception e) {
            sendError(ex, 400, e.getMessage());
        }
    }

    private void handleDeleteSchedule(HttpExchange ex, String botName, String taskName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        if (inst.getScheduler().removeTask(taskName)) {
            sendOk(ex, Map.of("deleted", taskName));
        } else {
            sendError(ex, 404, "任务 '" + taskName + "' 不存在");
        }
    }

    private void handleToggleSchedule(HttpExchange ex, String botName, String taskName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        var body = readBodyAsMap(ex);
        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));
        if (inst.getScheduler().toggleTask(taskName, enabled)) {
            sendOk(ex, Map.of("task", taskName, "enabled", enabled));
        } else {
            sendError(ex, 404, "任务 '" + taskName + "' 不存在");
        }
    }

    private void handleTestSchedule(HttpExchange ex, String botName, String taskName) throws IOException {
        var inst = requireBot(ex, botName);
        if (inst == null) return;
        try {
            inst.getScheduler().triggerNow(taskName);
            sendOk(ex, Map.of("message", "任务已触发"));
        } catch (Exception e) {
            sendError(ex, 400, e.getMessage());
        }
    }

    // ==================== NapCat 管理 ====================

    private void handleGetNapCatConfig(HttpExchange ex) throws IOException {
        var launcher = console.getNapCatLauncher();
        var data = new LinkedHashMap<String, Object>();
        data.put("napCatDir", launcher.getNapCatDir() != null ? launcher.getNapCatDir() : "");
        data.put("workRoot", launcher.getWorkRoot() != null ? launcher.getWorkRoot() : "");
        sendOk(ex, data);
    }

    private void handleSetNapCatConfig(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        var launcher = console.getNapCatLauncher();
        if (body.containsKey("napCatDir")) launcher.setNapCatDir((String) body.get("napCatDir"));
        if (body.containsKey("workRoot")) launcher.setWorkRoot((String) body.get("workRoot"));
        console.saveConfig();
        sendOk(ex, Map.of("message", "NapCat 配置已更新"));
    }

    private void handleNapCatStart(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        String qq = (String) body.get("qq");
        int webuiPort = ConvertUtil.intOf(body.get("webuiPort"), 6099);

        // 如果只提供 name，从记忆实例补全参数
        var launcher = console.getNapCatLauncher();
        if (name != null && (qq == null || qq.isEmpty())) {
            var saved = launcher.getSavedInstance(name);
            if (saved != null) {
                qq = saved.qqUin;
                webuiPort = saved.webuiPort;
            }
        }

        if (name == null || qq == null || qq.isEmpty()) {
            sendError(ex, 400, "缺少 name 或 qq 参数 (记忆中也没有此实例)"); return;
        }

        // 自动发现端口和 token
        int wsPort = 0, httpPort = 0;
        String wsToken = "", httpToken = "";
        try {
            Path sharedConfigDir = Path.of(launcher.getNapCatDir(), "config");
            var matched = NapCatConfigDiscovery.discoverByQQ(sharedConfigDir, qq);

            String wr = launcher.getWorkRoot();
            if (wr == null || wr.isEmpty()) wr = launcher.getNapCatDir() + "/instances";
            Path instanceConfigDir = Path.of(wr, name, "config");
            var instanceCfg = NapCatConfigDiscovery.discoverByQQ(instanceConfigDir, qq);

            if (matched != null && instanceCfg != null) {
                NapCatConfigDiscovery.mergeConfig(matched, instanceCfg);
            } else if (matched == null) {
                matched = instanceCfg;
            }

            if (matched != null) {
                if (matched.wsPort > 0) { wsPort = matched.wsPort; wsToken = matched.wsToken; }
                if (matched.httpPort > 0) { httpPort = matched.httpPort; httpToken = matched.httpToken; }
            }
        } catch (Exception e) {
            logger.warn("读取 NapCat 配置失败", e);
        }

        try {
            launcher.start(name, qq, wsPort, httpPort, webuiPort);

            // 自动创建 BotInstance
            String botName = "qq" + qq;
            var inst = console.getBots().get(botName);
            if (inst == null) {
                inst = new BotInstance(botName);
                console.getBots().put(botName, inst);
            }
            if (wsPort > 0) {
                inst.setMode("ws");
                inst.setWsUrl("ws://127.0.0.1:" + wsPort);
                inst.setWsToken(wsToken);
            }
            if (httpPort > 0) {
                inst.setHttpUrl("http://127.0.0.1:" + httpPort);
                inst.setHttpToken(httpToken);
                if (wsPort == 0) inst.setMode("http");
            }
            inst.setNapCatInstanceName(name);
            inst.setQqUin(qq);
            console.saveConfig();

            var data = new LinkedHashMap<String, Object>();
            data.put("name", name);
            data.put("qq", qq);
            data.put("wsPort", wsPort);
            data.put("httpPort", httpPort);
            data.put("webuiPort", webuiPort);
            data.put("botName", botName);
            sendOk(ex, data);
        } catch (Exception e) {
            sendError(ex, 500, "启动失败: " + e.getMessage());
        }
    }

    private void handleNapCatStop(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        if (name == null) { sendError(ex, 400, "缺少 name 参数"); return; }

        var launcher = console.getNapCatLauncher();
        if ("all".equalsIgnoreCase(name)) {
            launcher.stopAll();
            sendOk(ex, Map.of("message", "已停止所有实例"));
        } else if (launcher.stop(name)) {
            sendOk(ex, Map.of("stopped", name));
        } else {
            sendError(ex, 404, "实例 '" + name + "' 不存在或已停止");
        }
    }

    private void handleNapCatInstances(HttpExchange ex) throws IOException {
        var launcher = console.getNapCatLauncher();
        var running = launcher.listInstances();
        var savedAll = launcher.getSavedInstances();
        var runningNames = new HashSet<String>();
        var list = new ArrayList<Map<String, Object>>();

        // 运行中的实例
        for (var inst : running) {
            runningNames.add(inst.name);
            var m = new LinkedHashMap<String, Object>();
            m.put("name", inst.name);
            m.put("qqUin", inst.qqUin);
            m.put("wsPort", inst.wsPort);
            m.put("httpPort", inst.httpPort);
            m.put("webuiPort", inst.webuiPort);
            m.put("workDir", inst.workDir);
            m.put("pid", inst.pid);
            m.put("alive", inst.process != null && inst.process.isAlive());
            m.put("saved", launcher.getSavedInstance(inst.name) != null);
            list.add(m);
        }
        // 未运行但有记忆的实例
        for (var si : savedAll) {
            if (!runningNames.contains(si.name)) {
                var m = new LinkedHashMap<String, Object>();
                m.put("name", si.name);
                m.put("qqUin", si.qqUin);
                m.put("wsPort", 0);
                m.put("httpPort", 0);
                m.put("webuiPort", si.webuiPort);
                m.put("workDir", "");
                m.put("pid", 0L);
                m.put("alive", false);
                m.put("saved", true);
                list.add(m);
            }
        }
        sendOk(ex, list);
    }

    private void handleNapCatSaved(HttpExchange ex) throws IOException {
        var saved = console.getNapCatLauncher().getSavedInstances();
        var list = new ArrayList<Map<String, Object>>();
        for (var si : saved) {
            var m = new LinkedHashMap<String, Object>();
            m.put("name", si.name);
            m.put("qqUin", si.qqUin);
            m.put("webuiPort", si.webuiPort);
            m.put("running", console.getNapCatLauncher().isRunning(si.name));
            list.add(m);
        }
        sendOk(ex, list);
    }

    private void handleNapCatUpdateSaved(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        if (name == null || name.isEmpty()) { sendError(ex, 400, "缺少 name 参数"); return; }

        var launcher = console.getNapCatLauncher();
        if (launcher.getSavedInstance(name) == null) {
            sendError(ex, 404, "记忆中没有实例 '" + name + "'"); return;
        }
        if (launcher.isRunning(name)) {
            sendError(ex, 400, "实例 '" + name + "' 正在运行，请先停止再编辑"); return;
        }

        String qqUin = body.containsKey("qqUin") ? String.valueOf(body.get("qqUin")) : launcher.getSavedInstance(name).qqUin;
        int webuiPort = body.containsKey("webuiPort") ? ((Number) body.get("webuiPort")).intValue() : launcher.getSavedInstance(name).webuiPort;

        launcher.saveInstance(name, qqUin, webuiPort);
        sendOk(ex, Map.of("updated", name));
    }

    private void handleNapCatForget(HttpExchange ex) throws IOException {
        var body = readBodyAsMap(ex);
        String name = (String) body.get("name");
        if (name == null) { sendError(ex, 400, "缺少 name 参数"); return; }

        var launcher = console.getNapCatLauncher();
        if ("all".equalsIgnoreCase(name)) {
            var all = new ArrayList<>(launcher.getSavedInstances());
            for (var si : all) launcher.forgetInstance(si.name);
            sendOk(ex, Map.of("forgotten", all.size()));
        } else if (launcher.forgetInstance(name)) {
            sendOk(ex, Map.of("forgotten", name));
        } else {
            sendError(ex, 404, "记忆中没有实例 '" + name + "'");
        }
    }

    private void handleNapCatLog(HttpExchange ex, String name) throws IOException {
        var instances = console.getNapCatLauncher().listInstances();
        for (var inst : instances) {
            if (inst.name.equals(name)) {
                if (inst.outputReader != null) {
                    var lines = inst.outputReader.getRecentLines(500);
                    sendOk(ex, Map.of("name", name, "lines", lines));
                } else {
                    sendOk(ex, Map.of("name", name, "lines", List.of()));
                }
                return;
            }
        }
        sendError(ex, 404, "实例 '" + name + "' 不存在");
    }

    private void handleNapCatDiscover(HttpExchange ex) throws IOException {
        var launcher = console.getNapCatLauncher();
        String dir = launcher.getNapCatDir();
        if (dir == null || dir.isEmpty()) {
            sendError(ex, 400, "请先设置 NapCat 目录"); return;
        }

        try {
            var configMap = new LinkedHashMap<String, NapCatConfigDiscovery.BotConfig>();

            for (var cfg : NapCatConfigDiscovery.discover(dir)) {
                configMap.put(cfg.qqUin, cfg);
            }

            String wr = launcher.getWorkRoot();
            if (wr != null && !wr.isEmpty()) {
                for (var wCfg : NapCatConfigDiscovery.discoverFromWorkRoot(wr)) {
                    var existing = configMap.get(wCfg.qqUin);
                    if (existing == null) {
                        configMap.put(wCfg.qqUin, wCfg);
                    } else {
                        NapCatConfigDiscovery.mergeConfig(existing, wCfg);
                    }
                }
            }

            int created = 0;
            var discovered = new ArrayList<String>();
            for (var cfg : configMap.values()) {
                String botName = "qq" + cfg.qqUin;
                discovered.add(botName);
                var inst = console.getBots().get(botName);
                if (inst == null) {
                    inst = new BotInstance(botName);
                    console.getBots().put(botName, inst);
                    created++;
                }
                inst.setMode(cfg.wsPort > 0 ? "ws" : "http");
                if (cfg.wsPort > 0) {
                    inst.setWsUrl(cfg.wsUrl());
                    inst.setWsToken(cfg.wsToken);
                }
                if (cfg.httpPort > 0) {
                    inst.setHttpUrl(cfg.httpUrl());
                    inst.setHttpToken(cfg.httpToken);
                }
            }
            console.saveConfig();
            sendOk(ex, Map.of("discovered", discovered, "created", created, "total", console.getBots().size()));
        } catch (Exception e) {
            sendError(ex, 500, "发现失败: " + e.getMessage());
        }
    }

    // ==================== 辅助方法 ====================

    private BotInstance requireBot(HttpExchange ex, String name) throws IOException {
        var inst = console.getBots().get(name);
        if (inst == null) {
            sendError(ex, 404, "Bot '" + name + "' 不存在");
            return null;
        }
        return inst;
    }

    private BotInstance requireConnectedBot(HttpExchange ex, String name) throws IOException {
        var inst = requireBot(ex, name);
        if (inst != null && !inst.isConnected()) {
            sendError(ex, 400, "Bot '" + name + "' 未连接");
            return null;
        }
        return inst;
    }

    private Map<String, Object> botToMap(BotInstance inst) {
        var m = new LinkedHashMap<String, Object>();
        m.put("name", inst.getName());
        m.put("mode", inst.getMode());
        m.put("wsUrl", inst.getWsUrl());
        m.put("httpUrl", inst.getHttpUrl());
        m.put("wsToken", maskToken(inst.getWsToken()));
        m.put("httpToken", maskToken(inst.getHttpToken()));
        m.put("connected", inst.isConnected());
        m.put("userId", inst.getUserId());
        m.put("nickname", inst.getNickname());
        return m;
    }

    private Map<String, Object> configToMap(BotInstance inst) {
        var m = new LinkedHashMap<String, Object>();
        m.put("name", inst.getName());
        m.put("mode", inst.getMode());
        m.put("wsUrl", inst.getWsUrl());
        m.put("httpUrl", inst.getHttpUrl());
        m.put("wsToken", inst.getWsToken());
        m.put("httpToken", inst.getHttpToken());
        return m;
    }

    private Map<String, Object> taskToMap(onebot.scheduler.ScheduleManager.ScheduleTask task) {
        var m = new LinkedHashMap<String, Object>();
        m.put("name", task.name);
        m.put("time", task.time);
        m.put("targets", task.targets);
        m.put("targetType", task.targetType);
        m.put("message", task.message);
        m.put("enabled", task.enabled);
        return m;
    }

    private static String maskToken(String token) {
        if (token == null || token.isEmpty()) return "";
        if (token.length() <= 4) return "****";
        return token.substring(0, 4) + "****";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> readBodyAsMap(HttpExchange ex) throws IOException {
        String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        if (body.isBlank()) return Map.of();
        java.lang.reflect.Type mapType = new TypeToken<Map<String, Object>>(){}.getType();
        Map<String, Object> parsed = GsonFactory.gson().fromJson(body, mapType);
        return parsed != null ? parsed : Map.of();
    }

    private void sendOk(HttpExchange ex, Object data) throws IOException {
        var response = new LinkedHashMap<String, Object>();
        response.put("ok", true);
        response.put("data", data);
        sendJson(ex, 200, response);
    }

    private void sendError(HttpExchange ex, int code, String message) throws IOException {
        var response = new LinkedHashMap<String, Object>();
        response.put("ok", false);
        response.put("error", message);
        sendJson(ex, code, response);
    }

    private void sendJson(HttpExchange ex, int code, Object obj) throws IOException {
        String json = GsonFactory.gson().toJson(obj);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        ex.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String urlDecode(String s) {
        try {
            return java.net.URLDecoder.decode(s, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return s;
        }
    }
}
