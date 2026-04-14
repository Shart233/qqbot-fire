package onebot.napcat;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.function.Consumer;

/**
 * NapCat 进程输出读取器
 *
 * 后台守护线程持续读取 NapCat 子进程的 stdout/stderr，同时:
 *   1. 写入日志文件 (保留原有日志功能)
 *   2. 维护环形缓冲区 (最近 500 行，供 /napcat log 快速查看)
 *   3. 可选转发到控制台监听器 (供 /napcat attach 实时流)
 *
 * 生命周期: 随 NapCat 进程创建而启动，进程退出或被 stop 时终止。
 */
public class NapCatOutputReader {

    private static final Logger logger = LogManager.getLogger(NapCatOutputReader.class);
    private static final int BUFFER_SIZE = 500;

    private final String name;
    private final InputStream inputStream;
    private final Path logFile;

    // 环形缓冲区 — reader 线程写，主线程通过 getRecentLines 读，需 synchronized
    private final LinkedList<String> ringBuffer = new LinkedList<>();

    // attach 时设置的回调，volatile 保证可见性
    private volatile Consumer<String> listener = null;

    // 线程控制
    private volatile boolean running = true;
    private volatile boolean readerDone = false;
    private Thread readerThread;

    public NapCatOutputReader(String name, InputStream inputStream, Path logFile) {
        this.name = name;
        this.inputStream = inputStream;
        this.logFile = logFile;
    }

    /** 启动后台读取线程 */
    public void start() {
        readerThread = new Thread(this::readLoop, "napcat-output-" + name);
        readerThread.setDaemon(true);
        readerThread.start();
        logger.debug("[{}] OutputReader 已启动", name);
    }

    /** 停止读取线程 */
    public void stop() {
        running = false;
        if (readerThread != null) {
            readerThread.interrupt();
        }
        logger.debug("[{}] OutputReader 已停止", name);
    }

    /** 进程输出是否已结束 (进程退出) */
    public boolean isDone() {
        return readerDone;
    }

    /** 设置实时日志监听器 (attach 时调用)，传 null 清除 (detach) */
    public void setListener(Consumer<String> listener) {
        this.listener = listener;
    }

    /** 获取最近 n 行日志 (从环形缓冲区) */
    public List<String> getRecentLines(int n) {
        synchronized (ringBuffer) {
            int size = ringBuffer.size();
            int start = Math.max(0, size - n);
            return new ArrayList<>(ringBuffer.subList(start, size));
        }
    }

    // ==================== 读取循环 ====================

    private void readLoop() {
        try (var reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
             var writer = new BufferedWriter(new FileWriter(logFile.toFile(), StandardCharsets.UTF_8, true))) {

            String line;
            while (running && (line = reader.readLine()) != null) {
                // 1. 写入日志文件
                writer.write(line);
                writer.newLine();
                writer.flush();

                // 2. 加入环形缓冲区
                synchronized (ringBuffer) {
                    ringBuffer.addLast(line);
                    if (ringBuffer.size() > BUFFER_SIZE) {
                        ringBuffer.removeFirst();
                    }
                }

                // 3. 转发到监听器 (如果已 attach)
                var cb = listener;
                if (cb != null) {
                    cb.accept(line);
                }
            }
        } catch (IOException e) {
            if (running) {
                logger.error("[{}] 读取进程输出异常", name, e);
            }
        } finally {
            readerDone = true;
            // 通知监听器进程已退出
            var cb = listener;
            if (cb != null) {
                cb.accept(null); // null 表示流结束
            }
            logger.debug("[{}] OutputReader 读取循环结束", name);
        }
    }
}
