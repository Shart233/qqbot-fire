package onebot.napcat;

import onebot.util.JsonUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * NapCat 实例启动器 (跨平台: Windows + Linux)
 *
 * 在 Java 进程中直接管理 NapCat 子进程的生命周期，
 * 支持从 BotConsole 内启动/停止/查看多个 NapCat 实例。
 *
 * 每个实例使用独立的 NAPCAT_WORKDIR，避免配置和缓存冲突。
 * 自动根据 QQ 号生成 OneBot11 配置文件 (分配 WS/HTTP/WebUI 端口)。
 *
 * Windows: 通过 NapCatWinBootMain.exe + DLL 注入启动 QQ
 * Linux:   通过 node napcat.mjs 或 napcat.sh 脚本启动
 *
 * 用法:
 *   var launcher = new NapCatLauncher("/opt/NapCat");
 *   launcher.setWorkRoot("/opt/NapCat/instances");
 *   launcher.start("bot1", "123456", 3001, 3003, 6101);
 *   launcher.stop("bot1");
 */
public class NapCatLauncher {

    private static final Logger logger = LogManager.getLogger(NapCatLauncher.class);
    private static final boolean IS_WINDOWS = System.getProperty("os.name", "").toLowerCase().contains("win");

    /** NapCat.Shell 安装目录 */
    private String napCatDir;
    /** 实例工作目录根路径 (每个实例创建子目录) */
    private String workRoot;

    /** 运行中的实例: name -> Process */
    private final Map<String, NapCatProcess> processes = new ConcurrentHashMap<>();

    public NapCatLauncher() {}

    public NapCatLauncher(String napCatDir) {
        this.napCatDir = napCatDir;
    }

    public String getNapCatDir() { return napCatDir; }
    public void setNapCatDir(String napCatDir) { this.napCatDir = napCatDir; }

    public String getWorkRoot() { return workRoot; }
    public void setWorkRoot(String workRoot) { this.workRoot = workRoot; }

    // ==================== 启动/停止 ====================

    /**
     * 启动一个 NapCat 实例
     *
     * @param name      实例名称 (唯一标识)
     * @param qqUin     QQ 号 (用于快速登录)
     * @param wsPort    WebSocket 服务端口
     * @param httpPort  HTTP 服务端口
     * @param webuiPort WebUI 端口
     */
    public void start(String name, String qqUin, int wsPort, int httpPort, int webuiPort) throws IOException {
        if (napCatDir == null || napCatDir.isEmpty()) {
            throw new IllegalStateException("未设置 NapCat 目录，请先 /napcat dir <路径>");
        }
        if (workRoot == null || workRoot.isEmpty()) {
            workRoot = napCatDir + "/instances";
        }

        // 校验 NapCat 目录
        Path napCatPath = Path.of(napCatDir);
        if (!Files.exists(napCatPath.resolve("napcat.mjs"))) {
            throw new IllegalStateException("NapCat 目录无效，找不到 napcat.mjs: " + napCatDir);
        }

        if (processes.containsKey(name)) {
            throw new IllegalStateException("实例 '" + name + "' 已在运行中");
        }

        // 创建工作目录
        Path instanceDir = Path.of(workRoot, name);
        Path configDir = instanceDir.resolve("config");
        Files.createDirectories(configDir);

        // 生成 OneBot11 配置 (如果不存在)
        Path onebotConfig = configDir.resolve("onebot11_" + qqUin + ".json");
        if (!Files.exists(onebotConfig)) {
            generateOneBotConfig(onebotConfig, wsPort, httpPort);
            logger.info("已生成 OneBot11 配置: {}", onebotConfig);
        }

        // 构建启动命令和环境变量
        List<String> cmd;
        var envMap = new LinkedHashMap<String, String>();
        envMap.put("NAPCAT_WORKDIR", instanceDir.toAbsolutePath().toString());
        envMap.put("NAPCAT_MAIN_PATH", napCatPath.resolve("napcat.mjs").toString());
        envMap.put("NAPCAT_WEBUI_PREFERRED_PORT", String.valueOf(webuiPort));

        if (IS_WINDOWS) {
            cmd = buildWindowsCommand(napCatPath, qqUin, envMap);
        } else {
            cmd = buildLinuxCommand(napCatPath, qqUin);
        }

        var pb = new ProcessBuilder(cmd);
        pb.directory(napCatPath.toFile());
        pb.environment().putAll(envMap);
        pb.redirectErrorStream(true);

        Path logFile = instanceDir.resolve("napcat-" + name + ".log");
        // 不使用 pb.redirectOutput(file)，改为 InputStream 捕获实现实时日志流

        Process process = pb.start();

        // 启动后台输出读取器 (写日志文件 + 环形缓冲 + 可选实时转发)
        var outputReader = new NapCatOutputReader(name, process.getInputStream(), logFile);
        outputReader.start();

        var np = new NapCatProcess();
        np.name = name;
        np.qqUin = qqUin;
        np.wsPort = wsPort;
        np.httpPort = httpPort;
        np.webuiPort = webuiPort;
        np.workDir = instanceDir.toString();
        np.logFile = logFile.toString();
        np.outputReader = outputReader;
        np.process = process;
        np.pid = process.pid();
        processes.put(name, np);

        logger.info("NapCat 实例已启动: {} QQ={} PID={} WS={} HTTP={} WebUI={} [{}]",
                name, qqUin, process.pid(), wsPort, httpPort, webuiPort,
                IS_WINDOWS ? "Windows" : "Linux");
    }

    // ==================== Windows 启动 ====================

    /**
     * Windows: NapCatWinBootMain.exe + DLL 注入启动 QQ
     */
    private List<String> buildWindowsCommand(Path napCatPath, String qqUin,
                                              Map<String, String> envMap) throws IOException {
        if (!Files.exists(napCatPath.resolve("NapCatWinBootMain.exe"))) {
            throw new IllegalStateException("找不到 NapCatWinBootMain.exe: " + napCatPath);
        }

        String qqPath = findQQPathWindows();

        // 生成 loadNapCat.js
        String mainPath = napCatDir.replace("\\", "/") + "/napcat.mjs";
        Path loadScript = napCatPath.resolve("loadNapCat.js");
        Files.writeString(loadScript, "(async () => {await import(\"file:///" + mainPath + "\")})()\n");

        String launcher = napCatPath.resolve("NapCatWinBootMain.exe").toString();
        String hookDll = napCatPath.resolve("NapCatWinBootHook.dll").toString();

        // Windows 额外环境变量
        envMap.put("NAPCAT_PATCH_PACKAGE", napCatPath.resolve("qqnt.json").toString());
        envMap.put("NAPCAT_LOAD_PATH", loadScript.toString());
        envMap.put("NAPCAT_INJECT_PATH", hookDll);
        envMap.put("NAPCAT_LAUNCHER_PATH", launcher);

        return new ArrayList<>(List.of(launcher, qqPath, hookDll, qqUin));
    }

    // ==================== Linux 启动 ====================

    /**
     * Linux: 优先使用 napcat.sh，其次用 node napcat.mjs
     */
    private List<String> buildLinuxCommand(Path napCatPath, String qqUin) throws IOException {
        Path napCatSh = napCatPath.resolve("napcat.sh");

        if (Files.exists(napCatSh)) {
            // 使用官方启动脚本
            return new ArrayList<>(List.of("bash", napCatSh.toString(), qqUin));
        }

        // 查找 node
        String nodePath = findNodePath();
        return new ArrayList<>(List.of(nodePath, napCatPath.resolve("napcat.mjs").toString(), qqUin));
    }

    // ==================== 停止 ====================

    /** 停止指定实例 */
    public boolean stop(String name) {
        var np = processes.remove(name);
        if (np == null) return false;

        if (np.outputReader != null) {
            np.outputReader.stop();
        }
        if (np.process.isAlive()) {
            np.process.destroyForcibly();
            logger.info("NapCat 实例已停止: {} PID={}", name, np.pid);
        }
        return true;
    }

    /** 停止所有实例 */
    public void stopAll() {
        for (var name : new ArrayList<>(processes.keySet())) {
            stop(name);
        }
    }

    /** 获取所有实例信息 */
    public Collection<NapCatProcess> listInstances() {
        processes.values().removeIf(np -> !np.process.isAlive());
        return Collections.unmodifiableCollection(processes.values());
    }

    /** 是否有指定实例在运行 */
    public boolean isRunning(String name) {
        var np = processes.get(name);
        if (np == null) return false;
        if (!np.process.isAlive()) {
            processes.remove(name);
            return false;
        }
        return true;
    }

    // ==================== OneBot 配置生成 ====================

    private void generateOneBotConfig(Path path, int wsPort, int httpPort) throws IOException {
        var wsServer = new LinkedHashMap<String, Object>();
        wsServer.put("enable", true);
        wsServer.put("name", "ws");
        wsServer.put("host", "127.0.0.1");
        wsServer.put("port", wsPort);
        wsServer.put("reportSelfMessage", false);
        wsServer.put("enableForcePushEvent", true);
        wsServer.put("messagePostFormat", "array");
        wsServer.put("token", "");
        wsServer.put("debug", false);
        wsServer.put("heartInterval", 30000);

        var httpServer = new LinkedHashMap<String, Object>();
        httpServer.put("enable", true);
        httpServer.put("name", "http");
        httpServer.put("host", "127.0.0.1");
        httpServer.put("port", httpPort);
        httpServer.put("enableCors", true);
        httpServer.put("enableWebsocket", false);
        httpServer.put("messagePostFormat", "array");
        httpServer.put("token", "");
        httpServer.put("debug", false);

        var network = new LinkedHashMap<String, Object>();
        network.put("httpServers", List.of(httpServer));
        network.put("httpSseServers", List.of());
        network.put("httpClients", List.of());
        network.put("websocketServers", List.of(wsServer));
        network.put("websocketClients", List.of());
        network.put("plugins", List.of());

        var timeout = new LinkedHashMap<String, Object>();
        timeout.put("baseTimeout", 10000);
        timeout.put("maxTimeout", 1800000);

        var config = new LinkedHashMap<String, Object>();
        config.put("network", network);
        config.put("musicSignUrl", "");
        config.put("enableLocalFile2Url", false);
        config.put("parseMultMsg", false);
        config.put("timeout", timeout);

        Files.writeString(path, JsonUtil.toJson(config));
    }

    // ==================== 查找 QQ (Windows) ====================

    private String findQQPathWindows() throws IOException {
        // 从注册表读取
        try {
            var pb = new ProcessBuilder("reg", "query",
                    "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ",
                    "/v", "UninstallString");
            pb.redirectErrorStream(true);
            var proc = pb.start();
            String output = new String(proc.getInputStream().readAllBytes());
            proc.waitFor();

            for (String line : output.split("\n")) {
                if (line.contains("UninstallString")) {
                    String value = line.substring(line.indexOf("REG_SZ") + 6).trim();
                    value = value.replace("\"", "");
                    Path uninstall = Path.of(value);
                    Path qqExe = uninstall.getParent().resolve("QQ.exe");
                    if (Files.exists(qqExe)) {
                        return qqExe.toString();
                    }
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 常见路径回退
        for (String candidate : List.of(
                "C:/Program Files/Tencent/QQNT/QQ.exe",
                "C:/Program Files (x86)/Tencent/QQNT/QQ.exe",
                "D:/Program Files/Tencent/QQNT/QQ.exe"
        )) {
            if (Files.exists(Path.of(candidate))) {
                return candidate;
            }
        }

        throw new IOException("未找到 QQ.exe，请确认 QQ 已安装");
    }

    // ==================== 查找 Node (Linux) ====================

    private String findNodePath() throws IOException {
        // which node
        try {
            var pb = new ProcessBuilder("which", "node");
            pb.redirectErrorStream(true);
            var proc = pb.start();
            String output = new String(proc.getInputStream().readAllBytes()).trim();
            int exitCode = proc.waitFor();
            if (exitCode == 0 && !output.isEmpty()) {
                return output;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 常见路径回退
        for (String candidate : List.of(
                "/usr/bin/node",
                "/usr/local/bin/node",
                "/opt/node/bin/node",
                System.getProperty("user.home", "") + "/.nvm/current/bin/node"
        )) {
            if (Files.exists(Path.of(candidate))) {
                return candidate;
            }
        }

        throw new IOException("未找到 node，请确认已安装 Node.js (apt install nodejs 或 nvm install --lts)");
    }

    // ==================== 数据类 ====================

    public static class NapCatProcess {
        public String name;
        public String qqUin;
        public int wsPort;
        public int httpPort;
        public int webuiPort;
        public String workDir;
        public String logFile;
        public NapCatOutputReader outputReader;
        public Process process;
        public long pid;

        public boolean isAlive() {
            return process != null && process.isAlive();
        }

        @Override
        public String toString() {
            return String.format("[%s] %s QQ=%s PID=%d WS=%d HTTP=%d WebUI=%d",
                    isAlive() ? "运行中" : "已停止",
                    name, qqUin, pid, wsPort, httpPort, webuiPort);
        }
    }
}
