package onebot.scheduler;

import onebot.client.OneBotClient;
import onebot.util.JsonUtil;
import onebot.util.NtpUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

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
    private static final String SCHEDULE_FILE = "schedules.json";
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final long NTP_RESYNC_INTERVAL_MS = 3600_000; // 每小时重新同步 NTP

    private final List<ScheduleTask> tasks = new CopyOnWriteArrayList<>();
    private OneBotClient bot;
    private volatile Thread schedulerThread;
    private volatile boolean running = false;

    public ScheduleManager() {
        loadTasks();
    }

    public void setBot(OneBotClient bot) {
        this.bot = bot;
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
        LocalTime.parse(time, TIME_FMT); // 验证格式
        tasks.removeIf(t -> t.name.equals(name));

        var task = new ScheduleTask();
        task.name = name;
        task.time = time;
        task.targets = new ArrayList<>(targets);
        task.message = message;
        task.enabled = true;
        tasks.add(task);
        saveTasks();

        logger.info("添加定时任务: {} -> {} 发送到 {} 个目标", name, time, targets.size());

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
        if (running) return;
        running = true;

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
        running = false;
        if (schedulerThread != null) {
            schedulerThread.interrupt();
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
        String lastDate = NtpUtil.now().toLocalDate().toString();

        while (running) {
            try {
                // 定期重新同步 NTP
                if (System.currentTimeMillis() - lastNtpSync > NTP_RESYNC_INTERVAL_MS) {
                    if (NtpUtil.sync()) {
                        lastNtpSync = NtpUtil.getLastSyncTime();
                        logger.debug("NTP 重新同步成功, offset={}ms", NtpUtil.getClockOffset());
                    }
                }

                // 日期切换，重置已执行记录
                String today = NtpUtil.now().toLocalDate().toString();
                if (!today.equals(lastDate)) {
                    executedToday.clear();
                    lastDate = today;
                    logger.debug("日期切换: {}", today);
                }

                ZonedDateTime now = NtpUtil.now();
                String nowTime = now.format(TIME_FMT);

                // 检查是否有任务需要立即执行
                for (var task : tasks) {
                    if (task.enabled && task.time.equals(nowTime) && !executedToday.contains(task.name)) {
                        executedToday.add(task.name);
                        logger.info("NTP 时间 {} 触发任务: {}", NtpUtil.nowHHmmss(), task.name);
                        executeTask(task);
                    }
                }

                // 计算到下一个最近触发点的等待时间
                long sleepMs = calcSleepMs(now, executedToday);
                if (sleepMs > 0) {
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
                if (running) {
                    logger.debug("调度器被中断，重新计算");
                }
            } catch (Exception e) {
                logger.error("调度器异常", e);
                try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
            }
        }
    }

    /**
     * 计算到下一个最近触发时刻的毫秒数
     * @return 毫秒数, 0 表示今天没有更多任务
     */
    private long calcSleepMs(ZonedDateTime now, Set<String> executedToday) {
        long minSleep = Long.MAX_VALUE;

        for (var task : tasks) {
            if (!task.enabled || executedToday.contains(task.name)) continue;

            LocalTime targetTime = LocalTime.parse(task.time, TIME_FMT);
            ZonedDateTime targetDateTime = now.toLocalDate().atTime(targetTime).atZone(now.getZone());

            long diffMs = ChronoUnit.MILLIS.between(now, targetDateTime);
            if (diffMs > 0 && diffMs < minSleep) {
                minSleep = diffMs;
            }
        }

        return minSleep == Long.MAX_VALUE ? 0 : minSleep;
    }

    // ==================== 执行任务 ====================

    private void executeTask(ScheduleTask task) {
        if (bot == null) {
            logger.warn("Bot 未连接，跳过任务: {}", task.name);
            return;
        }

        logger.info("执行定时任务: {} -> 发送到 {} 个目标 (NTP时间: {})",
                task.name, task.targets.size(), NtpUtil.nowHHmmss());
        int success = 0, fail = 0;

        for (long userId : task.targets) {
            try {
                bot.sendPrivateMsg(userId, task.message);
                success++;
                logger.debug("定时消息已发送: {} -> {}", task.name, userId);
                Thread.sleep(1000); // 间隔 1 秒，避免频率限制
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception e) {
                fail++;
                logger.error("定时消息发送失败: {} -> {}", task.name, userId, e);
            }
        }

        task.lastExecuted = NtpUtil.currentTimeMillis();
        logger.info("任务 {} 执行完成: 成功={}, 失败={}", task.name, success, fail);
    }

    // ==================== 持久化 ====================

    @SuppressWarnings("unchecked")
    private void loadTasks() {
        try {
            Path path = Path.of(SCHEDULE_FILE);
            if (Files.exists(path)) {
                String json = Files.readString(path);
                List<Map<String, Object>> list = JsonUtil.parseArray(json);
                for (Object item : list) {
                    if (item instanceof Map map) {
                        var task = new ScheduleTask();
                        task.name = str(map.get("name"));
                        task.time = str(map.get("time"));
                        task.message = str(map.get("message"));
                        task.enabled = map.get("enabled") instanceof Boolean b ? b : true;
                        task.targets = new ArrayList<>();
                        if (map.get("targets") instanceof List targets) {
                            for (Object t : targets) {
                                if (t instanceof Number n) task.targets.add(n.longValue());
                                else if (t instanceof String s) {
                                    try { task.targets.add(Long.parseLong(s)); } catch (NumberFormatException ignored) {}
                                }
                            }
                        }
                        if (!task.name.isEmpty() && !task.time.isEmpty()) {
                            tasks.add(task);
                        }
                    }
                }
                logger.debug("已加载 {} 个定时任务", tasks.size());
            }
        } catch (Exception e) {
            logger.warn("加载定时任务失败: {}", e.getMessage());
        }
    }

    private void saveTasks() {
        try {
            var list = new ArrayList<Map<String, Object>>();
            for (var task : tasks) {
                var map = new LinkedHashMap<String, Object>();
                map.put("name", task.name);
                map.put("time", task.time);
                map.put("targets", task.targets);
                map.put("message", task.message);
                map.put("enabled", task.enabled);
                list.add(map);
            }
            Files.writeString(Path.of(SCHEDULE_FILE), JsonUtil.toJson(list));
            logger.debug("定时任务已保存");
        } catch (IOException e) {
            logger.warn("保存定时任务失败", e);
        }
    }

    private static String str(Object obj) {
        return obj != null ? String.valueOf(obj) : "";
    }

    // ==================== 任务数据类 ====================

    public static class ScheduleTask {
        public String name = "";
        public String time = "";
        public List<Long> targets = new ArrayList<>();
        public String message = "";
        public boolean enabled = true;
        public long lastExecuted = 0;

        @Override
        public String toString() {
            return String.format("[%s] %s %s -> %d人 \"%s\"",
                    enabled ? "ON" : "OFF", name, time, targets.size(),
                    message.length() > 20 ? message.substring(0, 20) + "..." : message);
        }
    }
}
