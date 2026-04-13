package onebot.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * NTP 时间同步工具
 *
 * 通过 NTP 协议获取精确网络时间，不依赖本地系统时钟。
 * 使用 SNTP (Simple NTP) 协议，无第三方依赖。
 *
 * NTP 服务器列表 (按优先级):
 *   - ntp.aliyun.com (阿里云)
 *   - ntp.tencent.com (腾讯云)
 *   - cn.pool.ntp.org (中国 NTP 池)
 *   - time.windows.com (微软)
 */
public class NtpUtil {

    private static final Logger logger = LogManager.getLogger(NtpUtil.class);

    private static final String[] NTP_SERVERS = {
            "ntp.aliyun.com",
            "ntp.tencent.com",
            "cn.pool.ntp.org",
            "time.windows.com"
    };

    private static final int NTP_PORT = 123;
    private static final int TIMEOUT_MS = 3000;
    private static final long NTP_EPOCH_OFFSET = 2208988800L; // 1900-01-01 到 1970-01-01 的秒数

    /** 本地时钟与 NTP 的偏移量 (毫秒)，正值表示本地时钟快 */
    private static long clockOffset = 0;
    private static long lastSyncTime = 0;
    private static String lastServer = "";

    /**
     * 同步 NTP 时间
     * 尝试多个服务器，取第一个成功的
     * @return true 同步成功
     */
    public static boolean sync() {
        for (String server : NTP_SERVERS) {
            try {
                long offset = queryNtpOffset(server);
                clockOffset = offset;
                lastSyncTime = System.currentTimeMillis();
                lastServer = server;
                logger.info("NTP 同步成功: server={}, offset={}ms", server, offset);
                return true;
            } catch (Exception e) {
                logger.debug("NTP 服务器 {} 不可用: {}", server, e.getMessage());
            }
        }
        logger.warn("所有 NTP 服务器同步失败，使用本地时钟");
        return false;
    }

    /**
     * 获取 NTP 校准后的当前时间戳 (毫秒)
     */
    public static long currentTimeMillis() {
        return System.currentTimeMillis() - clockOffset;
    }

    /**
     * 获取 NTP 校准后的当前时间
     */
    public static ZonedDateTime now() {
        return Instant.ofEpochMilli(currentTimeMillis()).atZone(ZoneId.systemDefault());
    }

    /**
     * 获取 NTP 校准后的当前时间字符串 (HH:mm)
     */
    public static String nowHHmm() {
        return now().format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    /**
     * 获取 NTP 校准后的当前时间字符串 (HH:mm:ss)
     */
    public static String nowHHmmss() {
        return now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    /**
     * 获取时钟偏移量 (毫秒)
     */
    public static long getClockOffset() {
        return clockOffset;
    }

    /**
     * 获取上次同步时间
     */
    public static long getLastSyncTime() {
        return lastSyncTime;
    }

    /**
     * 获取上次同步的服务器
     */
    public static String getLastServer() {
        return lastServer;
    }

    /**
     * 是否已同步
     */
    public static boolean isSynced() {
        return lastSyncTime > 0;
    }

    // ==================== NTP 协议实现 ====================

    /**
     * 查询 NTP 服务器，返回本地时钟与 NTP 的偏移量 (毫秒)
     *
     * SNTP 计算公式:
     *   offset = ((T2 - T1) + (T3 - T4)) / 2
     *   T1 = 客户端发送时间
     *   T2 = 服务器接收时间
     *   T3 = 服务器发送时间
     *   T4 = 客户端接收时间
     */
    private static long queryNtpOffset(String server) throws Exception {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setSoTimeout(TIMEOUT_MS);
            InetAddress address = InetAddress.getByName(server);

            // 构造 NTP 请求包 (48 字节)
            byte[] buffer = new byte[48];
            buffer[0] = 0x1B; // LI=0, VN=3, Mode=3 (Client)

            // T1: 客户端发送时间
            long t1 = System.currentTimeMillis();

            DatagramPacket request = new DatagramPacket(buffer, buffer.length, address, NTP_PORT);
            socket.send(request);

            // 接收响应
            DatagramPacket response = new DatagramPacket(buffer, buffer.length);
            socket.receive(response);

            // T4: 客户端接收时间
            long t4 = System.currentTimeMillis();

            // 解析 T2 (Receive Timestamp, 偏移 32-39)
            long t2 = parseNtpTimestamp(buffer, 32);

            // 解析 T3 (Transmit Timestamp, 偏移 40-47)
            long t3 = parseNtpTimestamp(buffer, 40);

            // 计算偏移量: offset = ((T2 - T1) + (T3 - T4)) / 2
            // 正值 = 本地时钟比 NTP 快
            long offset = ((t2 - t1) + (t3 - t4)) / 2;

            // 偏移量取反，因为我们需要 "本地时间 - offset = NTP时间"
            return -offset;
        }
    }

    /**
     * 解析 NTP 时间戳 (8 字节: 4字节秒 + 4字节小数秒)
     * @return Unix 毫秒时间戳
     */
    private static long parseNtpTimestamp(byte[] buffer, int offset) {
        // 秒部分 (4 字节无符号整数)
        long seconds = 0;
        for (int i = 0; i < 4; i++) {
            seconds = (seconds << 8) | (buffer[offset + i] & 0xFF);
        }

        // 小数秒部分 (4 字节)
        long fraction = 0;
        for (int i = 4; i < 8; i++) {
            fraction = (fraction << 8) | (buffer[offset + i] & 0xFF);
        }

        // 转为 Unix 毫秒时间戳
        long millis = (seconds - NTP_EPOCH_OFFSET) * 1000;
        millis += (fraction * 1000) / 0x100000000L;

        return millis;
    }
}
