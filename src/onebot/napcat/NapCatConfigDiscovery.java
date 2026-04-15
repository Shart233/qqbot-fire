package onebot.napcat;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * NapCat 配置自动发现
 *
 * 扫描 NapCat.Shell/config/ 目录下的 onebot11_{QQ号}.json 文件，
 * 自动提取每个 QQ 账号的 WS/HTTP 服务器地址、端口和 Token。
 *
 * 配置文件结构:
 *   {
 *     "network": {
 *       "websocketServers": [{ "enable": true, "host": "...", "port": 3001, "token": "..." }],
 *       "httpServers": [{ "enable": true, "host": "...", "port": 3003, "token": "..." }]
 *     }
 *   }
 */
public class NapCatConfigDiscovery {

    private static final Logger logger = LogManager.getLogger(NapCatConfigDiscovery.class);
    private static final Pattern ONEBOT_CONFIG_PATTERN = Pattern.compile("onebot11_(\\d+)\\.json");

    /**
     * 扫描 NapCat 配置目录，发现所有 QQ Bot 的连接信息
     *
     * @param napCatDir NapCat.Shell 安装目录 (或 NAPCAT_WORKDIR)
     * @return 发现的 Bot 配置列表
     */
    public static List<BotConfig> discover(String napCatDir) throws IOException {
        return discoverFromDir(Path.of(napCatDir, "config"));
    }

    /**
     * 扫描多实例工作根目录，发现所有实例的 QQ Bot 连接信息。
     * 扫描路径: {workRoot}/{instanceName}/config/onebot11_{QQ号}.json
     *
     * @param workRoot 实例工作根目录
     * @return 发现的 Bot 配置列表 (按 QQ 号去重，优先工作目录下的配置)
     */
    public static List<BotConfig> discoverFromWorkRoot(String workRoot) throws IOException {
        var results = new ArrayList<BotConfig>();
        Path root = Path.of(workRoot);

        if (!Files.isDirectory(root)) {
            logger.warn("工作根目录不存在: {}", root);
            return results;
        }

        // 遍历每个实例子目录
        try (var dirs = Files.list(root)) {
            dirs.filter(Files::isDirectory).forEach(instanceDir -> {
                Path configDir = instanceDir.resolve("config");
                if (Files.isDirectory(configDir)) {
                    try {
                        results.addAll(discoverFromDir(configDir));
                    } catch (Exception e) {
                        logger.warn("扫描实例目录失败: {}", instanceDir, e);
                    }
                }
            });
        }

        return results;
    }

    /**
     * 根据 QQ 号从指定目录查找配置
     *
     * @param configDir config 目录路径
     * @param qqUin     QQ 号
     * @return 匹配的 Bot 配置，未找到返回 null
     */
    public static BotConfig discoverByQQ(Path configDir, String qqUin) throws IOException {
        Path configFile = configDir.resolve("onebot11_" + qqUin + ".json");
        if (Files.exists(configFile)) {
            return parseOneBotConfig(configFile);
        }
        return null;
    }

    /** 扫描单个 config 目录下的所有 onebot11_*.json */
    private static List<BotConfig> discoverFromDir(Path configDir) throws IOException {
        var results = new ArrayList<BotConfig>();

        if (!Files.isDirectory(configDir)) {
            logger.warn("NapCat 配置目录不存在: {}", configDir);
            return results;
        }

        try (var stream = Files.list(configDir)) {
            stream.filter(p -> ONEBOT_CONFIG_PATTERN.matcher(p.getFileName().toString()).matches())
                    .forEach(p -> {
                        try {
                            var bc = parseOneBotConfig(p);
                            if (bc != null) {
                                results.add(bc);
                            }
                        } catch (Exception e) {
                            logger.warn("解析配置文件失败: {}", p, e);
                        }
                    });
        }

        return results;
    }

    /**
     * 解析单个 onebot11_{QQ号}.json 文件
     */
    private static BotConfig parseOneBotConfig(Path path) throws IOException {
        // 从文件名提取 QQ 号
        var matcher = ONEBOT_CONFIG_PATTERN.matcher(path.getFileName().toString());
        if (!matcher.matches()) return null;
        String qqUin = matcher.group(1);

        String json = Files.readString(path);
        JsonObject root = JsonParser.parseString(json).getAsJsonObject();
        if (!root.has("network")) return null;

        JsonObject network = root.getAsJsonObject("network");
        if (network == null) return null;

        var bc = new BotConfig();
        bc.qqUin = qqUin;
        bc.configFile = path.toString();

        // 解析 websocketServers — 优先取 enable=true 的，否则取第一个
        if (network.has("websocketServers")) {
            JsonArray wsList = network.getAsJsonArray("websocketServers");
            JsonObject firstWs = null;
            for (JsonElement item : wsList) {
                JsonObject ws = item.getAsJsonObject();
                if (firstWs == null) firstWs = ws;
                if (ws.has("enable") && ws.get("enable").getAsBoolean()) {
                    firstWs = ws;
                    bc.wsEnabled = true;
                    break;
                }
            }
            if (firstWs != null) {
                bc.wsHost = getStr(firstWs, "host", "127.0.0.1");
                bc.wsPort = getInt(firstWs, "port", 0);
                bc.wsToken = getStr(firstWs, "token", "");
            }
        }

        // 解析 httpServers — 优先取 enable=true 的，否则取第一个
        if (network.has("httpServers")) {
            JsonArray httpList = network.getAsJsonArray("httpServers");
            JsonObject firstHttp = null;
            for (JsonElement item : httpList) {
                JsonObject http = item.getAsJsonObject();
                if (firstHttp == null) firstHttp = http;
                if (http.has("enable") && http.get("enable").getAsBoolean()) {
                    firstHttp = http;
                    bc.httpEnabled = true;
                    break;
                }
            }
            if (firstHttp != null) {
                bc.httpHost = getStr(firstHttp, "host", "127.0.0.1");
                bc.httpPort = getInt(firstHttp, "port", 0);
                bc.httpToken = getStr(firstHttp, "token", "");
            }
        }

        // 至少有一个服务器配置 (不要求 enable) 才有意义
        if (bc.wsPort == 0 && bc.httpPort == 0) {
            logger.debug("QQ {} 无 WS/HTTP 服务器配置，跳过", qqUin);
            return null;
        }

        return bc;
    }

    private static String getStr(JsonObject obj, String key, String def) {
        return obj.has(key) && !obj.get(key).isJsonNull() ? obj.get(key).getAsString() : def;
    }

    private static int getInt(JsonObject obj, String key, int def) {
        return obj.has(key) && !obj.get(key).isJsonNull() ? obj.get(key).getAsInt() : def;
    }


    /**
     * 合并两个 BotConfig: 将 source 中的非空字段合并到 target。
     * 用于共享目录(有token) + 工作目录(有端口但token可能为空) 场景。
     */
    public static void mergeConfig(BotConfig target, BotConfig source) {
        if (source.wsEnabled) target.wsEnabled = true;
        if (source.httpEnabled) target.httpEnabled = true;

        if (source.wsPort > 0) target.wsPort = source.wsPort;
        if (!source.wsHost.isEmpty() && !"127.0.0.1".equals(source.wsHost)) target.wsHost = source.wsHost;
        if (!source.wsToken.isEmpty()) target.wsToken = source.wsToken;

        if (source.httpPort > 0) target.httpPort = source.httpPort;
        if (!source.httpHost.isEmpty() && !"127.0.0.1".equals(source.httpHost)) target.httpHost = source.httpHost;
        if (!source.httpToken.isEmpty()) target.httpToken = source.httpToken;
    }

    // ==================== 数据类 ====================

    public static class BotConfig {
        public String qqUin;
        public String configFile;

        public boolean wsEnabled;
        public String wsHost = "127.0.0.1";
        public int wsPort;
        public String wsToken = "";

        public boolean httpEnabled;
        public String httpHost = "127.0.0.1";
        public int httpPort;
        public String httpToken = "";

        /** 推荐的连接模式 (ws 优先，其次看哪个有端口) */
        public String recommendedMode() {
            if (wsEnabled) return "ws";
            if (httpEnabled) return "http";
            return wsPort > 0 ? "ws" : "http";
        }

        /** WS URL */
        public String wsUrl() {
            return "ws://" + wsHost + ":" + wsPort;
        }

        /** HTTP URL */
        public String httpUrl() {
            return "http://" + httpHost + ":" + httpPort;
        }

        @Override
        public String toString() {
            var sb = new StringBuilder();
            sb.append("QQ=").append(qqUin);
            if (wsPort > 0) {
                sb.append(" WS=").append(wsUrl());
                if (wsEnabled) sb.append("(ON)"); else sb.append("(OFF)");
                if (!wsToken.isEmpty()) sb.append(" token=").append(wsToken.substring(0, Math.min(4, wsToken.length()))).append("...");
            }
            if (httpPort > 0) {
                sb.append(" HTTP=").append(httpUrl());
                if (httpEnabled) sb.append("(ON)"); else sb.append("(OFF)");
                if (!httpToken.isEmpty()) sb.append(" token=").append(httpToken.substring(0, Math.min(4, httpToken.length()))).append("...");
            }
            return sb.toString();
        }
    }
}
