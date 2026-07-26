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
    /**
     * 单目标发送失败后的内联补发配置。
     * 冷启动/QQ 链路未热时，首批 send_private_msg 可能撞穿超时墙漏发个别目标（连接是好的，只是慢）。
     * 既然连接此刻正热，就地立即重投命中率远高于跨周期重试，且无需再冷启动。
     * 在同一次 executeTask 内、autoStop 之前完成，最多补发 TARGET_RESEND_ROUNDS 轮，每轮间隔 TARGET_RESEND_GAP_MS。
     */
    private static final int TARGET_RESEND_ROUNDS = 2;
    private static final long TARGET_RESEND_GAP_MS = 3_000;
    /**
     * 预热提前量：秒。
     * 触发前 N 秒就提前拉起 NapCat + 登录 QQ，等真正触发时端口早开、账号在线，秒发不迟到。
     * NapCat 冷启动到「消息通道真正可用」波动极大：快时 10 余秒，慢时实测达 11 分钟
     * （WS 端口早开、get_login_info 秒回，但 send_private_msg 一直排队不响应），
     * 故提前量取 20 分钟覆盖最坏情况。仅对 autoConnect=true 的任务生效。
     */
    private static final long PREWARM_LEAD_MS = 20 * 60_000;
    /**
     * 存在「超时未决」目标时，autoStop 前的滞留时长。
     * 超时不代表 NapCat 死了，多半只是消息通道还在排队；此刻立刻 pkill NapCat
     * 会把排队中的消息一起杀掉，反而真漏发。故留出窗口让积压请求自然投递完再停。
     */
    private static final long UNKNOWN_LINGER_MS = 15 * 60_000;

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
        // 已预热的 occurrence 标记（值为 "任务名@目标日期"），避免同一次触发前反复拉起 NapCat。
        // 用目标日期而非"今天"标记，因为 00:01 任务的预热落在前一天 23:51，跨午夜后 executedToday
        // 会被清空但预热标记要延续到触发那一刻，故独立维护、按 occurrence 日期去重。
        Set<String> prewarmed = new HashSet<>();
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
                    // 清理已过期的预热标记（目标日期早于今天的），避免集合无限增长。
                    // 今天及以后的标记保留：00:01 任务在前一天 23:51 打的标记，key 日期是今天，必须留住
                    // 直到 00:01 触发，否则 calcSleepMs 会重新为它算预热点、重复拉起 NapCat。
                    prewarmed.removeIf(k -> {
                        int at = k.lastIndexOf('@');
                        return at >= 0 && k.substring(at + 1).compareTo(today) < 0;
                    });
                    lastDate = today;
                    logger.debug("日期切换: {}", today);

                    // 补执行：日期切换时若已过某任务的触发窗口（NTP 同步/sleep 抖动导致晚醒），立即补发
                    ZonedDateTime nowAfterSwitch = NtpUtil.now();
                    LocalTime nowAfterSwitchLocal = nowAfterSwitch.toLocalTime();
                    for (var task : tasks) {
                        if (!task.enabled || executedToday.contains(task.name)) continue;
                        LocalTime target = LocalTime.parse(task.time, TIME_FMT);
                        long missedSeconds = Duration.between(target, nowAfterSwitchLocal).getSeconds();
                        if (missedSeconds >= 60) {
                            executedToday.add(task.name);
                            logger.info("日期切换补执行: 任务 {} (计划 {}, 当前 {}, 延迟 {}s)",
                                    task.name, task.time, NtpUtil.nowHHmmss(), missedSeconds);
                            handleOutcome(task, executeTask(task), retryAt, retryCount);
                        }
                    }
                }

                ZonedDateTime now = NtpUtil.now();
                LocalTime nowLocal = now.toLocalTime();
                long nowMs = System.currentTimeMillis();

                // 预热：触发前 PREWARM_LEAD_MS 内提前拉起 NapCat 登录，使真正触发时端口早开、账号在线，秒发不迟到。
                // 仅对 autoConnect 任务生效；bot 已连着则跳过（无需重复拉起）。
                for (var task : tasks) {
                    if (!task.enabled || !task.autoConnect) continue;
                    // 去重用 occurrence 粒度（prewarmed: 任务名@目标日期），不能用 executedToday.contains(name)：
                    // 00:01 跨午夜任务的预热窗口落在前一天 23:51，此刻 executedToday 仍含当天已执行的
                    // 同名任务（要到 00:00 才 clear），若用它做守卫会把「明天那次」的预热误杀 →
                    // 睡到 00:01 现场冷启动 → 冷启动竞速漏发。改由 nextTargetDateTime 定位下一次
                    // occurrence，prewarmed 按其目标日期去重，跨午夜也不会漏预热或重复拉起。
                    ZonedDateTime next = nextTargetDateTime(task, now);
                    long untilMs = ChronoUnit.MILLIS.between(now, next);
                    if (untilMs > 0 && untilMs <= PREWARM_LEAD_MS) {
                        String key = task.name + "@" + next.toLocalDate();
                        if (prewarmed.contains(key)) continue;
                        prewarmed.add(key);
                        if (isBotAlive()) {
                            logger.debug("任务 [{}] 已有活连接，跳过预热", task.name);
                            continue;
                        }
                        logger.info("任务 [{}] 进入预热窗口（{}秒后触发），提前拉起 NapCat 并登录...",
                                task.name, untilMs / 1000);
                        prewarm(task);
                    }
                }

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

                // 计算到下一个最近触发点的等待时间（含重试时刻、预热时刻）
                long sleepMs = calcSleepMs(now, executedToday, retryAt, prewarmed);
                if (sleepMs > 0) {
                    // 防御：sleepMs 过小意味着刚好踩到窗口边界，强制抬到 100ms 避免忙等
                    if (sleepMs < 100) {
                        logger.warn("计算出的 sleep 时长过短 ({}ms)，强制抬到 100ms 以避免忙等", sleepMs);
                        sleepMs = 100;
                    }
                    logger.debug("下次触发在 {} 秒后", sleepMs / 1000);
                    Thread.sleep(sleepMs);
                } else {
                    // 没有待执行的任务，直接睡到次日最早任务时刻（提前 2 秒留余量）
                    var tomorrow = now.toLocalDate().plusDays(1);
                    var zone = now.getZone();
                    LocalTime earliestTask = null;
                    for (var task : tasks) {
                        if (!task.enabled) continue;
                        LocalTime t = LocalTime.parse(task.time, TIME_FMT);
                        if (earliestTask == null || t.isBefore(earliestTask)) {
                            earliestTask = t;
                        }
                    }
                    var wakeTarget = earliestTask != null
                            ? tomorrow.atTime(earliestTask).atZone(zone).minusSeconds(2)
                            : tomorrow.atStartOfDay(zone);
                    long sleepToTomorrow = ChronoUnit.MILLIS.between(now, wakeTarget);
                    if (sleepToTomorrow < 1000) sleepToTomorrow = 1000;
                    logger.debug("今日任务已全部完成，等待 {} 秒到明天 {}",
                            sleepToTomorrow / 1000,
                            earliestTask != null ? earliestTask : "00:00");
                    Thread.sleep(sleepToTomorrow);
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
    private long calcSleepMs(ZonedDateTime now, Set<String> executedToday, Map<String, Long> retryAt,
                             Set<String> prewarmed) {
        long minSleep = Long.MAX_VALUE;

        for (var task : tasks) {
            if (!task.enabled) continue;

            // 用「下一次 occurrence」而非今天的固定时刻：已执行的任务顺延到明天同刻。
            // 历史 bug：这里对已执行任务直接 continue，单任务配置在当天执行完后 minSleep
            // 恒为 MAX → 返回 0 → schedulerLoop 走 else 分支一觉睡到「次日触发前 2 秒」，
            // 把下面的预热唤醒点整个跳过，预热隔夜必然失效、天天退化成 00:01 现场冷启动。
            ZonedDateTime targetDateTime = upcomingOccurrence(task, now, executedToday);

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

        // 纳入预热唤醒点：autoConnect 任务在「下次触发 - 预热提前量」时刻必须醒来拉起 NapCat。
        // 否则调度器会一觉睡到触发时刻，来不及预热就退化成 00:01 现连（又迟到）。
        // 去重同样用 occurrence 粒度的 prewarmed，不能用 executedToday.contains(name)——理由见
        // schedulerLoop 预热循环处注释：跨午夜任务 23:51 唤醒点会被当天的 executedToday 误杀。
        for (var task : tasks) {
            if (!task.enabled || !task.autoConnect) continue;
            // 同样用 upcomingOccurrence：刚触发完时 nextTargetDateTime 因 60s 容差仍返回
            // 「今天刚过去的那一次」，算出的预热点是负数被丢弃，等于这一轮又没排上预热唤醒。
            ZonedDateTime next = upcomingOccurrence(task, now, executedToday);
            String key = task.name + "@" + next.toLocalDate();
            if (prewarmed.contains(key)) continue; // 本 occurrence 已预热，无需再为它醒来
            long prewarmAt = ChronoUnit.MILLIS.between(now, next) - PREWARM_LEAD_MS;
            if (prewarmAt > 0 && prewarmAt < minSleep) {
                minSleep = prewarmAt;
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
     * 计算任务从 now 起「下一次」触发的绝对时刻。
     * 若今天的触发点已过（now 晚于今天 target），则返回明天的 target。
     * 用于预热窗口判断——跨午夜任务（如 00:01）在前一天 23:51 时，其下一次触发是"今天+1天"的 00:01。
     */
    private ZonedDateTime nextTargetDateTime(ScheduleTask task, ZonedDateTime now) {
        LocalTime target = LocalTime.parse(task.time, TIME_FMT);
        ZonedDateTime todayTarget = now.toLocalDate().atTime(target).atZone(now.getZone());
        // 已过今天触发点（留 60s 容差，正在触发窗口内的不算"已过"）则顺延到明天
        if (ChronoUnit.MILLIS.between(now, todayTarget) < -60_000) {
            return todayTarget.plusDays(1);
        }
        return todayTarget;
    }

    /**
     * 计算任务「下一次仍待执行」的触发时刻，是 sleep/预热唤醒点计算的统一基准。
     *
     * 与 {@link #nextTargetDateTime} 的差别在于对刚执行完的 occurrence 的处理：
     * nextTargetDateTime 留了 60s 容差（触发窗口内不算"已过"），刚在 00:01:21 触发完时
     * 它仍返回今天 00:01:00 —— 那个时刻已经没有任何唤醒价值，据此算出的 sleep 与预热点
     * 全是负数，会被整轮丢弃。故这里对已执行的任务强制顺延到下一天。
     */
    private ZonedDateTime upcomingOccurrence(ScheduleTask task, ZonedDateTime now, Set<String> executedToday) {
        ZonedDateTime next = nextTargetDateTime(task, now);
        if (executedToday.contains(task.name) && !next.isAfter(now)) {
            next = next.plusDays(1);
        }
        return next;
    }

    /**
     * 预热：提前拉起 NapCat 并登录 QQ，但不发送任何消息。
     * 复用 botConnector.tryConnect()（内部完成"启动 NapCat→等端口→连接→等账号在线"全流程），
     * 成功后把连接挂到 this.bot，等真正触发时 executeTask 直接复用这个活连接秒发。
     * 预热失败不排重试、不报错致命——真正触发时 executeTask 的 autoConnect 仍会再试一次兜底。
     */
    private void prewarm(ScheduleTask task) {
        if (botConnector == null) return;
        synchronized (executeLock) {
            // 二次确认：拿到锁后连接可能已被别的路径建立
            if (isBotAlive()) return;
            try {
                OneBotClient connected = botConnector.tryConnect();
                if (connected != null) {
                    this.bot = connected;
                    logger.info("任务 [{}] 预热成功，账号已上线，等待触发时刻秒发", task.name);
                } else {
                    logger.warn("任务 [{}] 预热失败（NapCat/登录未就绪），触发时将走常规自动连接兜底", task.name);
                }
            } catch (Exception e) {
                logger.error("任务 [{}] 预热异常", task.name, e);
            }
        }
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

        boolean isGroup = "group".equals(task.targetType);

        // 首轮发送全部目标。传入快照副本，避免 subList 视图逃逸后被 updateTask 换引用影响。
        int total = task.targets.size();
        SendResult result = sendToTargets(task, new ArrayList<>(task.targets), client, isGroup);
        List<Long> failed = result.failed();
        // 超时未决目标全程累积、绝不重投，理由见 SendResult 注释。
        List<Long> unknown = new ArrayList<>(result.unknown());

        // 内联补发：连接此刻正热，就地立即重投「明确失败」的目标，在 autoStop 之前完成，
        // 避免跨周期又冷启动。仅重投失败子集，成功与未决目标都不会重复收到。
        int round = 0;
        while (!failed.isEmpty() && round < TARGET_RESEND_ROUNDS && isBotAlive()) {
            round++;
            logger.info("任务 [{}] {} 个目标发送失败，内联补发第 {}/{} 轮: {}",
                    task.name, failed.size(), round, TARGET_RESEND_ROUNDS, failed);
            try {
                Thread.sleep(TARGET_RESEND_GAP_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break; // 被中断（任务变更/停止）：放弃补发，走收尾
            }
            result = sendToTargets(task, failed, client, isGroup);
            failed = result.failed();
            unknown.addAll(result.unknown());
        }
        int success = total - failed.size() - unknown.size();

        task.lastExecuted = NtpUtil.currentTimeMillis();
        if (failed.isEmpty() && unknown.isEmpty()) {
            logger.info("任务 {} 执行完成: 成功={}, 失败=0", task.name, success);
        } else if (failed.isEmpty()) {
            logger.warn("任务 {} 执行完成: 成功={}, 超时未决={} (目标: {})；请求已交给 NapCat，"
                    + "稍后多半仍会投递，故不重投以免对方收到重复消息", task.name, success, unknown.size(), unknown);
        } else {
            logger.warn("任务 {} 执行完成: 成功={}, 失败={} (最终仍失败的目标: {}), 超时未决={}",
                    task.name, success, failed.size(), failed, unknown);
        }

        // 发送完自动停止 NapCat + 断开连接。
        if (task.autoStopAfterSend && afterSendStopper != null) {
            if (!unknown.isEmpty()) {
                // 有未决目标：NapCat 多半只是消息通道排队慢（实测可达 11 分钟），此刻 pkill
                // 会把排队中的消息一并杀掉。推迟停止，让积压请求自然投递完再收工。
                scheduleLingeringStop(task, unknown);
            } else if (success == 0) {
                // 全部「明确失败」才判定 NapCat 异常：保留连接便于排查/手动重发。
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

    /**
     * 存在超时未决目标时的延迟停止：滞留 {@link #UNKNOWN_LINGER_MS} 后再停 NapCat。
     * 用独立守护线程，不阻塞调度器主循环对下一次任务的计算。
     */
    private void scheduleLingeringStop(ScheduleTask task, List<Long> unknown) {
        final Runnable stopper = this.afterSendStopper;
        logger.info("任务 [{}] 有 {} 个目标超时未决 {}，推迟 {} 分钟再停止 NapCat，给排队中的消息留出投递时间",
                task.name, unknown.size(), unknown, UNKNOWN_LINGER_MS / 60_000);
        Thread t = new Thread(() -> {
            try {
                Thread.sleep(UNKNOWN_LINGER_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
            try {
                logger.info("任务 [{}] 未决滞留窗口结束，停止 NapCat 并断开连接", task.name);
                stopper.run();
                this.bot = null;
            } catch (Exception e) {
                logger.error("任务 [{}] 延迟自动停止失败", task.name, e);
            }
        }, "linger-stop-" + task.name);
        t.setDaemon(true);
        t.start();
    }

    /**
     * 一批目标的发送结果。
     *
     * failed  — 明确失败（连接已废、QQ 返回错误码等），可以安全重投。
     * unknown — 调用超时，结果未决：请求已经写给 NapCat，只是响应没按时回来。
     *           这类目标绝不能重投——实测 NapCat 冷启动后消息通道会排队十余分钟，
     *           期间每次调用都超时，若逐轮重投，等它恢复时积压请求会一次性全部投递，
     *           对方瞬间收到成堆重复消息（2026-07-19 与 07-26 均实测到每人收 3 条）。
     */
    private record SendResult(List<Long> failed, List<Long> unknown) {}

    /**
     * 向一批目标发送任务消息，返回发送结果（明确失败的可重投，超时未决的不可重投）。
     * 发送前探活：连接僵死则放弃剩余目标并全部计入失败（连接已废，硬等超时无意义）。
     * 单目标异常仅归类记录，不中断其余目标。
     */
    private SendResult sendToTargets(ScheduleTask task, List<Long> targets, OneBotClient client, boolean isGroup) {
        List<Long> failed = new ArrayList<>();
        List<Long> unknown = new ArrayList<>();
        for (int i = 0; i < targets.size(); i++) {
            long targetId = targets.get(i);
            // 发送前探活：连接已僵死则放弃剩余目标，不再逐个硬等超时。
            // 剩余目标（含当前）全部计入失败，交由上层决定是否补发。
            if (!isBotAlive()) {
                List<Long> remaining = targets.subList(i, targets.size());
                logger.warn("Bot 连接已失效，放弃任务 [{}] 剩余 {} 个目标", task.name, remaining.size());
                this.bot = null;
                failed.addAll(remaining);
                break;
            }
            try {
                if (isGroup) {
                    client.sendGroupMsg(targetId, task.message);
                } else {
                    client.sendPrivateMsg(targetId, task.message);
                }
                logger.debug("定时消息已发送: {} -> {} ({})", task.name, targetId, task.targetType);
                Thread.sleep(1000); // 间隔 1 秒，避免频率限制
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                // 已开始发送，中断则把当前及剩余目标计入失败并停止（不重复发已成功的）
                failed.addAll(targets.subList(i, targets.size()));
                break;
            } catch (onebot.client.OneBotTimeoutException e) {
                // 结果未决，不进重投队列：NapCat 很可能只是慢，稍后仍会把这条真正发出去。
                unknown.add(targetId);
                logger.warn("定时消息发送超时（结果未决，不重投以免重复投递）: {} -> {} ({})",
                        task.name, targetId, e.getMessage());
            } catch (Exception e) {
                failed.add(targetId);
                logger.error("定时消息发送失败: {} -> {}", task.name, targetId, e);
            }
        }
        return new SendResult(failed, unknown);
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
