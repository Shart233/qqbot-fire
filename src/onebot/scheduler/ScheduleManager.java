package onebot.scheduler;

import onebot.client.OneBotClient;
import onebot.util.GsonFactory;
import onebot.util.NtpUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Supplier;

/**
 * 定时消息任务管理器
 *
 * 使用 NTP 校准时间实现精确定时。
 * 调度线程精确计算到下一个最近触发点的间隔，sleep 到那个时刻再执行。
 * 每小时自动重新同步一次 NTP。
 *
 * 用法:
 *   var mgr = new ScheduleManager();
 *   mgr.addTask("morning", "05:00", List.of(123L, 456L), "早上好！");
 *   mgr.setBot(bot);
 *   mgr.start();
 */
public class ScheduleManager {

    private static final Logger logger = LogManager.getLogger(ScheduleManager.class);
    private static final String SCHEDULE_FILE_PREFIX = "schedules";
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final long NTP_RESYNC_INTERVAL_MS = 3600_000; // 每小时重新同步 NTP
    private static final long RETRY_DELAY_MS = 3 * 60_000; // 连接失败后重试间隔：3 分钟
    private static final int MAX_RETRIES = 2; // 连接失败最大重试次数

    private final List<ScheduleTask> tasks = new CopyOnWriteArrayList<>();
    private volatile OneBotClient bot;
    private volatile Thread schedulerThread;
    private final AtomicBoolean running = new AtomicBoolean(false);

    /**
     * 执行互斥锁。
     * 串行化 executeTask：自动调度触发（ntp-scheduler 线程）与手动触发
     * （triggerNow / Web 测试发送 的 HTTP 虚拟线程）可能同时跑同一任务，
     * 一个线程在 autoStop 后把 this.bot 置 null，另一个线程的发送循环就会 NPE。
     * 加锁后两者互斥，杜绝并发置空导致的空指针。
     */
    private final Object executeLock = new Object();

    /**
     * Bot 自动连接回调。
     * 当定时任务触发时 bot==null，调度器会调用此回调尝试自动启动 NapCat 并连接 Bot。
     * 返回连接成功的 OneBotClient，失败返回 null。
     */
    @FunctionalInterface
    public interface BotConnector {
        OneBotClient tryConnect();
    }

    private BotConnector botConnector;

    /** 发送完成后停止回调。停止 NapCat 实例并断开 Bot 连接。 */
    private Runnable afterSendStopper;

    public void setAfterSendStopper(Runnable stopper) {
        this.afterSendStopper = stopper;
    }

    /**
     * 连接活性检查回调。判断当前 bot 引用的底层连接是否真正可用。
     * 用于规避 WS 断开后 onClose 清了 wsRef 但 scheduler.bot 仍残留僵尸引用的场景。
     * 未注入时默认认为活着（向后兼容）。
     */
    private Supplier<Boolean> healthCheck;

    public void setHealthCheck(Supplier<Boolean> healthCheck) {
        this.healthCheck = healthCheck;
    }

    /** bot 引用是否真正可用（非空且底层连接活着） */
    private boolean isBotAlive() {
        if (bot == null) return false;
        if (healthCheck == null) return true;
        try {
            return Boolean.TRUE.equals(healthCheck.get());
        } catch (Exception e) {
            return false;
        }
    }

    /** Bot 实例名称，用于区分定时任务文件 (schedules_<botName>.json) */
    private final String botName;

    /** 无参构造 (向后兼容，使用 schedules.json) */
    public ScheduleManager() {
        this(null);
    }

    /**
     * @param botName Bot 实例名称，null 或 "default" 使用 schedules.json，
     *                其他名称使用 schedules_<botName>.json
     */
    public ScheduleManager(String botName) {
        this.botName = botName;
        loadTasks();
    }

    public void setBot(OneBotClient bot) {
        this.bot = bot;
    }

    public void setBotConnector(BotConnector connector) {
        this.botConnector = connector;
    }

    // ==================== 任务管理 ====================

    /**
     * 添加定时任务
     * @param name   任务名 (唯一标识)
     * @param time   每天执行时间 (HH:mm 格式, 如 "05:00")
     * @param targets 目标 QQ 号列表
     * @param message 要发送的消息内容
     */
    public void addTask(String name, String time, List<Long> targets, String message) {
        addTask(name, time, targets, "private", message);
    }

    /**
     * 添加定时任务
     * @param name       任务名 (唯一标识)
     * @param time       每天执行时间 (HH:mm 格式)
     * @param targets    目标列表 (QQ号或群号)
     * @param targetType "private" 或 "group"
     * @param message    要发送的消息内容
     */
    public void addTask(String name, String time, List<Long> targets, String targetType, String message) {
        LocalTime.parse(time, TIME_FMT); // 验证格式

        // 保留旧任务的 autoConnect、autoStopAfterSend 和 enabled 状态（upsert 语义）
        boolean prevAutoConnect = false;
        boolean prevAutoStopAfterSend = false;
        boolean prevEnabled = true;
        for (var old : tasks) {
            if (old.name.equals(name)) {
                prevAutoConnect = old.autoConnect;
                prevAutoStopAfterSend = old.autoStopAfterSend;
                prevEnabled = old.enabled;
                break;
            }
        }
        tasks.removeIf(t -> t.name.equals(name));

        var task = new ScheduleTask();
        task.name = name;
        task.time = time;
        task.targets = new ArrayList<>(targets);
        task.targetType = "group".equals(targetType) ? "group" : "private";
        task.message = message;
        task.enabled = prevEnabled;
        task.autoConnect = prevAutoConnect;
        task.autoStopAfterSend = prevAutoStopAfterSend;
        tasks.add(task);
        saveTasks();

        logger.info("添加定时任务: {} -> {} 发送到 {} 个{}", name, time, targets.size(),
                "group".equals(task.targetType) ? "群" : "好友");

        // 如果调度器正在运行，中断 sleep 让它重新计算
        if (schedulerThread != null) {
            schedulerThread.interrupt();
        }
    }

    /** 删除任务 */
    public boolean removeTask(String name) {
        boolean removed = tasks.removeIf(t -> t.name.equals(name));
        if (removed) {
            saveTasks();
            logger.info("删除定时任务: {}", name);
            if (schedulerThread != null) schedulerThread.interrupt();
        }
        return removed;
    }

    /** 启用/禁用任务 */
    public boolean toggleTask(String name, boolean enabled) {
        for (var task : tasks) {
            if (task.name.equals(name)) {
                task.enabled = enabled;
                saveTasks();
                if (schedulerThread != null) schedulerThread.interrupt();
                return true;
            }
        }
        return false;
    }

    /** 设置任务的自动连接开关 */
    public boolean setAutoConnect(String name, boolean autoConnect) {
        for (var task : tasks) {
            if (task.name.equals(name)) {
                task.autoConnect = autoConnect;
                saveTasks();
                logger.info("任务 {} 自动连接: {}", name, autoConnect ? "开启" : "关闭");
                return true;
            }
        }
        return false;
    }

    /** 设置任务的发送后自动停止开关 */
    public boolean setAutoStopAfterSend(String name, boolean autoStop) {
        for (var task : tasks) {
            if (task.name.equals(name)) {
                task.autoStopAfterSend = autoStop;
                saveTasks();
                logger.info("任务 {} 发送后自动停止: {}", name, autoStop ? "开启" : "关闭");
                return true;
            }
        }
        return false;
    }

    /** 调度器是否正在运行 */
    public boolean isRunning() {
        return running.get();
    }

    /** 获取所有任务 */
    public List<ScheduleTask> getTasks() {
        return Collections.unmodifiableList(tasks);
    }

    /** 获取指定任务 */
    public ScheduleTask getTask(String name) {
        return tasks.stream().filter(t -> t.name.equals(name)).findFirst().orElse(null);
    }

    // ==================== NTP 精确调度引擎 ====================

    /** 启动调度 */
    public void start() {
        if (!running.compareAndSet(false, true)) return;

        // 同步 NTP 时间
        System.out.println("正在同步 NTP 时间...");
        if (NtpUtil.sync()) {
            System.out.println("NTP 同步成功, 服务器: " + NtpUtil.getLastServer()
                    + ", 偏移: " + NtpUtil.getClockOffset() + "ms"
                    + ", 当前精确时间: " + NtpUtil.nowHHmmss());
        } else {
            System.out.println("NTP 同步失败，使用本地系统时间");
        }

        schedulerThread = new Thread(this::schedulerLoop, "ntp-scheduler");
        schedulerThread.setDaemon(true);
        schedulerThread.start();

        logger.info("NTP 精确调度器已启动, 共 {} 个任务", tasks.size());
    }

    /** 停止调度 */
    public void stop() {
        if (!running.compareAndSet(true, false)) return;
        var t = schedulerThread;
        if (t != null) {
            t.interrupt();
            schedulerThread = null;
        }
        logger.info("调度器已停止");
    }

    /** 手动触发指定任务 */
    public void triggerNow(String name) {
        var task = getTask(name);
        if (task != null) {
            executeTask(task);
        }
    }

    /**
     * 调度主循环
     * 精确计算到下一个触发时刻的毫秒数，sleep 到那个点再执行。
     */
    private void schedulerLoop() {
        long lastNtpSync = NtpUtil.getLastSyncTime();
        // 记录今天已执行的任务，避免重复
        Set<String> executedToday = new HashSet<>();
        // 连接失败重试计划：任务名 -> 下次重试的 epoch ms
        Map<String, Long> retryAt = new HashMap<>();
        // 已重试次数：任务名 -> 次数
        Map<String, Integer> retryCount = new HashMap<>();
        String lastDate = NtpUtil.now().toLocalDate().toString();

        while (running.get()) {
            try {
                // 定期重新同步 NTP
                if (System.currentTimeMillis() - lastNtpSync > NTP_RESYNC_INTERVAL_MS) {
                    if (NtpUtil.sync()) {
                        lastNtpSync = NtpUtil.getLastSyncTime();
                        logger.debug("NTP 重新同步成功, offset={}ms", NtpUtil.getClockOffset());
                    }
                }

                // 日期切换，重置已执行记录和重试计划
                String today = NtpUtil.now().toLocalDate().toString();
                if (!today.equals(lastDate)) {
                    executedToday.clear();
                    retryAt.clear();
                    retryCount.clear();
                    lastDate = today;
                    logger.debug("日期切换: {}", today);
                }

                ZonedDateTime now = NtpUtil.now();
                LocalTime nowLocal = now.toLocalTime();
                long nowMs = System.currentTimeMillis();

                // 60 秒窗口匹配，防止 sleep 抖动导致错过整分钟
                for (var task : tasks) {
                    if (!task.enabled || executedToday.contains(task.name)) continue;
                    LocalTime target = LocalTime.parse(task.time, TIME_FMT);
                    long diffSeconds = Duration.between(target, nowLocal).getSeconds();
                    if (diffSeconds >= 0 && diffSeconds < 60) {
                        executedToday.add(task.name);
                        logger.info("NTP 时间 {} 触发任务: {}", NtpUtil.nowHHmmss(), task.name);
                        handleOutcome(task, executeTask(task), retryAt, retryCount);
                    }
                }

                // 到点的连接失败重试（独立于整点窗口，不受 60s 限制）
                if (!retryAt.isEmpty()) {
                    for (var task : tasks) {
                        Long at = retryAt.get(task.name);
                        if (at == null || nowMs < at) continue;
                        retryAt.remove(task.name);
                        if (!task.enabled) continue;
                        int n = retryCount.getOrDefault(task.name, 0);
                        logger.info("重试任务 [{}]（第 {}/{} 次）", task.name, n, MAX_RETRIES);
                        handleOutcome(task, executeTask(task), retryAt, retryCount);
                    }
                }

                // 计算到下一个最近触发点的等待时间（含重试时刻）
                long sleepMs = calcSleepMs(now, executedToday, retryAt);
                if (sleepMs > 0) {
                    // 防御：sleepMs 过小意味着刚好踩到窗口边界，强制抬到 100ms 避免忙等
                    if (sleepMs < 100) {
                        logger.warn("计算出的 sleep 时长过短 ({}ms)，强制抬到 100ms 以避免忙等", sleepMs);
                        sleepMs = 100;
                    }
                    logger.debug("下次触发在 {} 秒后", sleepMs / 1000);
                    Thread.sleep(sleepMs);
                } else {
                    // 没有待执行的任务，sleep 到明天 00:00
                    long msToMidnight = ChronoUnit.MILLIS.between(now, now.toLocalDate().plusDays(1).atStartOfDay(now.getZone()));
                    logger.debug("今日任务已全部完成，等待 {} 秒到明天", msToMidnight / 1000);
                    Thread.sleep(msToMidnight + 1000); // +1s 缓冲
                }

            } catch (InterruptedException e) {
                // 被中断说明有任务变更或需要停止，重新循环
                if (running.get()) {
                    logger.debug("调度器被中断，重新计算");
                }
            } catch (Exception e) {
                logger.error("调度器异常", e);
                try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
            }
        }
    }

    /**
     * 计算到下一个最近触发时刻的毫秒数（含整点任务与待重试任务）
     * @return 毫秒数, 0 表示今天没有更多任务也没有待重试
     */
    private long calcSleepMs(ZonedDateTime now, Set<String> executedToday, Map<String, Long> retryAt) {
        long minSleep = Long.MAX_VALUE;

        for (var task : tasks) {
            if (!task.enabled || executedToday.contains(task.name)) continue;

            LocalTime targetTime = LocalTime.parse(task.time, TIME_FMT);
            ZonedDateTime targetDateTime = now.toLocalDate().atTime(targetTime).atZone(now.getZone());

            long diffMs = ChronoUnit.MILLIS.between(now, targetDateTime);
            if (diffMs > 0) {
                // sleep 到目标时刻即可，不提前唤醒。
                // 之前用 Math.max(diffMs - 1000, 1) 想防抖，但 diffMs∈(0,1000] 时被钳为 1ms，
                // 醒来后 nowLocal 仍比 target 早一点，窗口匹配 diffSeconds>=0 不成立，
                // 然后又算出 adjusted=1ms，形成 ~1000 次/秒的忙等死循环。
                long adjusted = Math.max(diffMs, 50);
                if (adjusted < minSleep) {
                    minSleep = adjusted;
                }
            }
        }

        // 纳入待重试时刻：避免明明有 pending 重试却 sleep 到明天而错过
        if (!retryAt.isEmpty()) {
            long nowMs = System.currentTimeMillis();
            for (long at : retryAt.values()) {
                long diffMs = Math.max(at - nowMs, 50);
                if (diffMs < minSleep) {
                    minSleep = diffMs;
                }
            }
        }

        return minSleep == Long.MAX_VALUE ? 0 : minSleep;
    }

    /**
     * 处理任务执行结果，决定是否安排重试。
     * 仅 RETRY（连接不可用）且未超次数时排入重试计划；DONE 一律不重试。
     */
    private void handleOutcome(ScheduleTask task, ExecOutcome outcome,
                               Map<String, Long> retryAt, Map<String, Integer> retryCount) {
        if (outcome != ExecOutcome.RETRY) {
            // 成功或已发送：清理可能残留的重试状态
            retryAt.remove(task.name);
            retryCount.remove(task.name);
            return;
        }
        int n = retryCount.getOrDefault(task.name, 0);
        if (n >= MAX_RETRIES) {
            logger.warn("任务 [{}] 连接失败已达最大重试次数 {}，今日放弃", task.name, MAX_RETRIES);
            retryCount.remove(task.name);
            return;
        }
        retryCount.put(task.name, n + 1);
        retryAt.put(task.name, System.currentTimeMillis() + RETRY_DELAY_MS);
        logger.info("任务 [{}] 连接失败，将在 {} 分钟后重试（已安排第 {}/{} 次）",
                task.name, RETRY_DELAY_MS / 60_000, n + 1, MAX_RETRIES);
    }

    // ==================== 执行任务 ====================

    /**
     * 任务执行结果。
     * DONE  — 已进入发送流程（无论成功/部分失败），不应重试，避免重复发送。
     * RETRY — 因 Bot 连接不可用（autoConnect 失败/账号未上线）根本没发出去，
     *         值得稍后重试。仅对开启 autoConnect 的任务返回。
     */
    private enum ExecOutcome { DONE, RETRY }

    /**
     * 执行任务（加锁外壳）。
     * 通过 executeLock 串行化，杜绝自动调度与手动触发并发跑同一任务时
     * 一方置空 bot、另一方 NPE 的竞态。实现见 {@link #doExecuteTask}。
     */
    private ExecOutcome executeTask(ScheduleTask task) {
        synchronized (executeLock) {
            return doExecuteTask(task);
        }
    }

    private ExecOutcome doExecuteTask(ScheduleTask task) {
        // 僵尸引用清理：bot 非空但底层 WS 已断（onClose 清了 wsRef 但 scheduler.bot 没同步）
        if (bot != null && !isBotAlive()) {
            logger.info("检测到 Bot 连接已失效，清理僵尸引用，任务: {}", task.name);
            this.bot = null;
        }

        if (bot == null && task.autoConnect && botConnector != null) {
            logger.info("Bot 未连接，任务 [{}] 已启用自动启动，尝试启动 NapCat 并连接...", task.name);
            try {
                OneBotClient connected = botConnector.tryConnect();
                if (connected != null) {
                    this.bot = connected;
                    logger.info("自动连接成功");
                }
            } catch (Exception e) {
                logger.error("自动连接失败", e);
            }
        }
        if (bot == null || !isBotAlive()) {
            logger.warn("Bot 未连接{}，跳过任务: {}",
                    task.autoConnect ? "且自动连接失败" : "(未启用自动启动)", task.name);
            this.bot = null;
            // 开启 autoConnect 却连不上 → 多半是 NapCat 冷启动慢/账号未上线，值得稍后重试；
            // 未开 autoConnect 则没有自愈手段，重试无意义，直接结束。
            return task.autoConnect ? ExecOutcome.RETRY : ExecOutcome.DONE;
        }

        // 取一次局部快照：整个发送循环只认这个引用。
        // 即使 autoStop 或其他路径在循环期间把 this.bot 置 null，
        // 本次发送也只会得到可控的 API 异常，而不是 NPE。
        final OneBotClient client = this.bot;

        logger.info("执行定时任务: {} -> 发送到 {} 个目标 (NTP时间: {})",
                task.name, task.targets.size(), NtpUtil.nowHHmmss());
        int success = 0, fail = 0;

        boolean isGroup = "group".equals(task.targetType);
        for (long targetId : task.targets) {
            // 发送前探活：连接已僵死则放弃剩余目标，不再逐个硬等超时。
            // 避免「NapCat 已不响应仍把 4 个目标各等满一个超时周期」的长时间空转。
            if (!isBotAlive()) {
                logger.warn("Bot 连接已失效，放弃任务 [{}] 剩余 {} 个目标",
                        task.name, task.targets.size() - success - fail);
                this.bot = null;
                break;
            }
            try {
                if (isGroup) {
                    client.sendGroupMsg(targetId, task.message);
                } else {
                    client.sendPrivateMsg(targetId, task.message);
                }
                success++;
                logger.debug("定时消息已发送: {} -> {} ({})", task.name, targetId, task.targetType);
                Thread.sleep(1000); // 间隔 1 秒，避免频率限制
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return ExecOutcome.DONE; // 已开始发送，中断也不重试，避免重复
            } catch (Exception e) {
                fail++;
                logger.error("定时消息发送失败: {} -> {}", task.name, targetId, e);
            }
        }

        task.lastExecuted = NtpUtil.currentTimeMillis();
        logger.info("任务 {} 执行完成: 成功={}, 失败={}", task.name, success, fail);

        // 发送完自动停止 NapCat + 断开连接。
        // 仅当至少有一条发送成功时才停：若全军覆没（success==0），多半是 NapCat
        // 已僵死/掉线，此时停掉连接只会让后续手动重发也发不出去，更难恢复。
        if (task.autoStopAfterSend && afterSendStopper != null) {
            if (success == 0) {
                logger.warn("任务 [{}] 全部发送失败（成功=0），疑似 NapCat 异常，跳过自动停止以保留连接便于排查/重发",
                        task.name);
            } else {
                logger.info("任务 [{}] 发送完成，正在自动停止 NapCat 并断开连接...", task.name);
                try {
                    afterSendStopper.run();
                    this.bot = null;
                } catch (Exception e) {
                    logger.error("发送后自动停止失败", e);
                }
            }
        }

        return ExecOutcome.DONE;
    }

    // ==================== 持久化 ====================

    /** 获取当前 Bot 对应的定时任务文件路径 */
    private String getScheduleFile() {
        if (botName == null || botName.isEmpty() || "default".equals(botName)) {
            return SCHEDULE_FILE_PREFIX + ".json";
        }
        return SCHEDULE_FILE_PREFIX + "_" + botName + ".json";
    }

    private void loadTasks() {
        try {
            Path path = Path.of(getScheduleFile());
            if (Files.exists(path)) {
                String json = Files.readString(path);
                java.lang.reflect.Type listType = new com.google.gson.reflect.TypeToken<List<ScheduleTask>>(){}.getType();
                List<ScheduleTask> loaded = GsonFactory.gson().fromJson(json, listType);
                if (loaded != null) {
                    // 过滤无效任务
                    loaded.stream()
                            .filter(t -> t.name != null && !t.name.isEmpty() && t.time != null && !t.time.isEmpty())
                            .forEach(t -> {
                                if (t.targets == null) t.targets = new ArrayList<>();
                                tasks.add(t);
                            });
                }
                logger.debug("已加载 {} 个定时任务", tasks.size());
            }
        } catch (Exception e) {
            logger.warn("加载定时任务失败: {}", e.getMessage());
        }
    }

    public void saveTasks() {
        try {
            Files.writeString(Path.of(getScheduleFile()), GsonFactory.gson().toJson(tasks));
            logger.debug("定时任务已保存");
        } catch (IOException e) {
            logger.warn("保存定时任务失败", e);
        }
    }

    // ==================== 任务数据类 ====================

    public static class ScheduleTask {
        public String name = "";
        public String time = "";
        public List<Long> targets = new ArrayList<>();
        public String targetType = "private"; // "private" 或 "group"
        public String message = "";
        public boolean enabled = true;
        public boolean autoConnect = false; // 触发时自动启动 NapCat + 连接 Bot
        public boolean autoStopAfterSend = false; // 发送完自动停止 NapCat + 断开连接
        public transient long lastExecuted = 0;

        @Override
        public String toString() {
            return String.format("[%s] %s %s -> %d%s \"%s\"%s%s",
                    enabled ? "ON" : "OFF", name, time, targets.size(),
                    "group".equals(targetType) ? "群" : "人",
                    message.length() > 20 ? message.substring(0, 20) + "..." : message,
                    autoConnect ? " [自动启动]" : "",
                    autoStopAfterSend ? " [发送后停止]" : "");
        }
    }
}
