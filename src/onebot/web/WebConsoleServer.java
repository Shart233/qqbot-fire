package onebot.web;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import onebot.console.BotConsole;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.Executors;

/**
 * 内嵌 HTTP 服务器，提供 Web 管理控制台。
 *
 * 功能:
 *   - /api/*  路由到 WebApiHandler（REST API）
 *   - 其他路径 serve 静态文件（index.html, style.css, app.js 等）
 *
 * 基于 JDK 内置 com.sun.net.httpserver，零额外依赖。
 */
public class WebConsoleServer {

    private static final Logger logger = LogManager.getLogger(WebConsoleServer.class);

    private static final Map<String, String> MIME_TYPES = Map.ofEntries(
            Map.entry("html", "text/html; charset=utf-8"),
            Map.entry("htm", "text/html; charset=utf-8"),
            Map.entry("css", "text/css; charset=utf-8"),
            Map.entry("js", "application/javascript; charset=utf-8"),
            Map.entry("json", "application/json; charset=utf-8"),
            Map.entry("png", "image/png"),
            Map.entry("jpg", "image/jpeg"),
            Map.entry("jpeg", "image/jpeg"),
            Map.entry("gif", "image/gif"),
            Map.entry("svg", "image/svg+xml"),
            Map.entry("ico", "image/x-icon"),
            Map.entry("woff", "font/woff"),
            Map.entry("woff2", "font/woff2"),
            Map.entry("ttf", "font/ttf")
    );

    /** 静态文件目录候选路径 */
    private static final String[] STATIC_DIRS = {
            "src/resources/web",
            "resources/web"
    };

    private final BotConsole console;
    private final int port;
    private HttpServer server;
    private Path staticDir;

    public WebConsoleServer(BotConsole console, int port) {
        this.console = console;
        this.port = port;
        this.staticDir = resolveStaticDir();
    }

    public WebConsoleServer(BotConsole console) {
        this(console, 8080);
    }

    /**
     * 启动 HTTP 服务器
     */
    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        // REST API
        server.createContext("/api", new CorsHandler(new WebApiHandler(console)));

        // 静态文件
        server.createContext("/", new CorsHandler(this::handleStaticFile));

        server.start();
        logger.info("Web 控制台已启动: http://127.0.0.1:{}", port);
        logger.info("静态文件目录: {}", staticDir != null ? staticDir : "classpath:/web/");
    }

    /**
     * 停止 HTTP 服务器
     */
    public void stop() {
        if (server != null) {
            server.stop(1);
            logger.info("Web 控制台已停止");
        }
    }

    public int getPort() {
        return port;
    }

    public boolean isRunning() {
        return server != null;
    }

    // ==================== 静态文件处理 ====================

    private void handleStaticFile(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();

        // 默认路由到 index.html
        if ("/".equals(path) || path.isEmpty()) {
            path = "/index.html";
        }

        // 安全检查: 防止路径穿越
        if (path.contains("..")) {
            sendError(exchange, 403, "Forbidden");
            return;
        }

        // 去掉开头的 /
        String relativePath = path.startsWith("/") ? path.substring(1) : path;
        String ext = getExtension(relativePath);
        String contentType = MIME_TYPES.getOrDefault(ext, "application/octet-stream");

        byte[] content = null;

        // 1) 从文件系统读取
        if (staticDir != null) {
            Path filePath = staticDir.resolve(relativePath);
            if (Files.exists(filePath) && Files.isRegularFile(filePath)) {
                content = Files.readAllBytes(filePath);
            }
        }

        // 2) 从 classpath 读取
        if (content == null) {
            try (InputStream is = getClass().getClassLoader().getResourceAsStream("web/" + relativePath)) {
                if (is != null) {
                    content = is.readAllBytes();
                }
            }
        }

        // 3) SPA 回退: 非 API、非文件请求返回 index.html
        if (content == null && !relativePath.contains(".")) {
            if (staticDir != null) {
                Path indexPath = staticDir.resolve("index.html");
                if (Files.exists(indexPath)) {
                    content = Files.readAllBytes(indexPath);
                    contentType = "text/html; charset=utf-8";
                }
            }
            if (content == null) {
                try (InputStream is = getClass().getClassLoader().getResourceAsStream("web/index.html")) {
                    if (is != null) {
                        content = is.readAllBytes();
                        contentType = "text/html; charset=utf-8";
                    }
                }
            }
        }

        if (content == null) {
            sendError(exchange, 404, "Not Found: " + path);
            return;
        }

        // 缓存控制: 开发模式不缓存
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Cache-Control", "no-cache");
        exchange.sendResponseHeaders(200, content.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(content);
        }
    }

    // ==================== CORS 包装 ====================

    /**
     * 添加 CORS 头并处理 OPTIONS 预检请求
     */
    private static class CorsHandler implements HttpHandler {
        private final HttpHandler delegate;

        CorsHandler(HttpHandler delegate) {
            this.delegate = delegate;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            exchange.getResponseHeaders().set("Access-Control-Max-Age", "86400");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            delegate.handle(exchange);
        }
    }

    // ==================== 辅助方法 ====================

    private static Path resolveStaticDir() {
        for (String dir : STATIC_DIRS) {
            Path p = Path.of(dir);
            if (Files.isDirectory(p)) {
                return p.toAbsolutePath();
            }
        }
        return null;
    }

    private static String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot + 1).toLowerCase() : "";
    }

    private static void sendError(HttpExchange exchange, int code, String message) throws IOException {
        byte[] body = message.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(code, body.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(body);
        }
    }
}
