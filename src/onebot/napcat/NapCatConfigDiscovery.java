package onebot.napcat;

import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    @SuppressWarnings("unchecked")
    private static BotConfig parseOneBotConfig(Path path) throws IOException {
        // 从文件名提取 QQ 号
        var matcher = ONEBOT_CONFIG_PATTERN.matcher(path.getFileName().toString());
        if (!matcher.matches()) return null;
        String qqUin = matcher.group(1);

        String json = Files.readString(path);
        Map<String, Object> root = JsonUtil.parseObject(json);
        if (root == null || !root.containsKey("network")) return null;

        var network = (Map<String, Object>) root.get("network");
        if (network == null) return null;

        var bc = new BotConfig();
        bc.qqUin = qqUin;
        bc.configFile = path.toString();

        // 解析 websocketServers — 取第一个 enable=true 的
        if (network.get("websocketServers") instanceof List wsList) {
            for (var item : wsList) {
                if (item instanceof Map wsMap) {
                    if (Boolean.TRUE.equals(wsMap.get("enable"))) {
                        bc.wsHost = stringOf(wsMap.get("host"), "127.0.0.1");
                        bc.wsPort = intOf(wsMap.get("port"), 0);
                        bc.wsToken = stringOf(wsMap.get("token"), "");
                        bc.wsEnabled = true;
                        break;
                    }
                }
            }
        }

        // 解析 httpServers — 取第一个 enable=true 的
        if (network.get("httpServers") instanceof List httpList) {
            for (var item : httpList) {
                if (item instanceof Map httpMap) {
                    if (Boolean.TRUE.equals(httpMap.get("enable"))) {
                        bc.httpHost = stringOf(httpMap.get("host"), "127.0.0.1");
                        bc.httpPort = intOf(httpMap.get("port"), 0);
                        bc.httpToken = stringOf(httpMap.get("token"), "");
                        bc.httpEnabled = true;
                        break;
                    }
                }
            }
        }

        // 至少有一个服务启用才有意义
        if (!bc.wsEnabled && !bc.httpEnabled) {
            logger.debug("QQ {} 无已启用的 WS/HTTP 服务，跳过", qqUin);
            return null;
        }

        return bc;
    }

    private static String stringOf(Object obj, String def) {
        if (obj instanceof String s && !s.isEmpty()) return s;
        return def;
    }

    private static int intOf(Object obj, int def) {
        if (obj instanceof Number n) return n.intValue();
        if (obj instanceof String s) {
            try { return Integer.parseInt(s); } catch (NumberFormatException e) { return def; }
        }
        return def;
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

        /** 推荐的连接模式 (ws 优先) */
        public String recommendedMode() {
            return wsEnabled ? "ws" : "http";
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
            if (wsEnabled) {
                sb.append(" WS=").append(wsUrl());
                if (!wsToken.isEmpty()) sb.append(" token=").append(wsToken.substring(0, Math.min(4, wsToken.length()))).append("...");
            }
            if (httpEnabled) {
                sb.append(" HTTP=").append(httpUrl());
                if (!httpToken.isEmpty()) sb.append(" token=").append(httpToken.substring(0, Math.min(4, httpToken.length()))).append("...");
            }
            return sb.toString();
        }
    }
}
