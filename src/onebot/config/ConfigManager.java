package onebot.config;

import com.google.gson.reflect.TypeToken;
import onebot.client.BotInstance;
import onebot.napcat.NapCatLauncher;
import onebot.util.CryptoUtil;
import onebot.util.GsonFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 配置持久化管理器
 *
 * 从 BotConsole 提取，负责 config.json 的读写。
 * 支持两种格式:
 *   新格式: { "bots": { "name": {...}, ... }, "activeBot": "name", "napCatDir": "...", "napCatWorkRoot": "..." }
 *   旧格式: { "mode": "ws", "wsUrl": "...", ... }  (自动迁移)
 */
public class ConfigManager {

    private static final Logger logger = LogManager.getLogger(ConfigManager.class);
    private static final String CONFIG_FILE = "config.json";
    private static final String DEFAULT_BOT_NAME = "default";

    /** 配置加载结果 */
    public record LoadResult(
            Map<String, BotInstance> bots,
            String activeBotName,
            String napCatDir,
            String napCatWorkRoot
    ) {}

    /**
     * 加载配置文件，返回解析结果。
     * 如果配置不存在或解析失败，返回包含默认 Bot 的结果。
     */
    @SuppressWarnings("unchecked")
    public static LoadResult load() {
        try {
            CryptoUtil.init();
            Path path = Path.of(CONFIG_FILE);
            if (!Files.exists(path)) {
                var bots = new LinkedHashMap<String, BotInstance>();
                bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
                return new LoadResult(bots, DEFAULT_BOT_NAME, null, null);
            }

            String json = Files.readString(path);
            Type mapType = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> cfg = GsonFactory.gson().fromJson(json, mapType);

            var bots = new LinkedHashMap<String, BotInstance>();
            String activeBotName = null;
            String napCatDir = null;
            String napCatWorkRoot = null;

            if (cfg.containsKey("bots") && cfg.get("bots") instanceof Map botsMap) {
                for (var entry : ((Map<String, Object>) botsMap).entrySet()) {
                    String name = entry.getKey();
                    if (entry.getValue() instanceof Map botCfg) {
                        var inst = new BotInstance(name);
                        if (botCfg.get("mode") instanceof String v) inst.setMode(v);
                        if (botCfg.get("wsUrl") instanceof String v) inst.setWsUrl(v);
                        if (botCfg.get("httpUrl") instanceof String v) inst.setHttpUrl(v);
                        if (botCfg.get("wsToken") instanceof String v) inst.setWsToken(CryptoUtil.decrypt(v));
                        if (botCfg.get("httpToken") instanceof String v) inst.setHttpToken(CryptoUtil.decrypt(v));
                        // 兼容旧版 accessToken
                        if (botCfg.get("accessToken") instanceof String v) {
                            String decrypted = CryptoUtil.decrypt(v);
                            if (inst.getWsToken().isEmpty()) inst.setWsToken(decrypted);
                            if (inst.getHttpToken().isEmpty()) inst.setHttpToken(decrypted);
                        }
                        bots.put(name, inst);
                    }
                }
                if (cfg.get("activeBot") instanceof String ab && bots.containsKey(ab)) {
                    activeBotName = ab;
                } else if (!bots.isEmpty()) {
                    activeBotName = bots.keySet().iterator().next();
                }
                if (cfg.get("napCatDir") instanceof String v) napCatDir = v;
                if (cfg.get("napCatWorkRoot") instanceof String v) napCatWorkRoot = v;
            } else if (cfg.containsKey("mode")) {
                // 旧格式: 自动迁移
                var inst = new BotInstance(DEFAULT_BOT_NAME);
                if (cfg.get("mode") instanceof String v) inst.setMode(v);
                if (cfg.get("wsUrl") instanceof String v) inst.setWsUrl(v);
                if (cfg.get("httpUrl") instanceof String v) inst.setHttpUrl(v);
                if (cfg.get("accessToken") instanceof String v) {
                    String decrypted = CryptoUtil.decrypt(v);
                    inst.setWsToken(decrypted);
                    inst.setHttpToken(decrypted);
                }
                bots.put(DEFAULT_BOT_NAME, inst);
                activeBotName = DEFAULT_BOT_NAME;
            } else {
                bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
                activeBotName = DEFAULT_BOT_NAME;
            }

            logger.debug("已加载 {} 个 Bot 配置", bots.size());
            return new LoadResult(bots, activeBotName, napCatDir, napCatWorkRoot);
        } catch (Exception e) {
            logger.warn("加载配置文件失败，使用默认配置: {}", e.getMessage());
            var bots = new LinkedHashMap<String, BotInstance>();
            bots.put(DEFAULT_BOT_NAME, new BotInstance(DEFAULT_BOT_NAME));
            return new LoadResult(bots, DEFAULT_BOT_NAME, null, null);
        }
    }

    /**
     * 保存配置到 config.json
     */
    public static void save(Map<String, BotInstance> bots, String activeBotName, NapCatLauncher launcher) {
        try {
            var botsMap = new LinkedHashMap<String, Object>();
            for (var inst : bots.values()) {
                var botCfg = new LinkedHashMap<String, Object>();
                botCfg.put("mode", inst.getMode());
                botCfg.put("wsUrl", inst.getWsUrl());
                botCfg.put("httpUrl", inst.getHttpUrl());
                botCfg.put("wsToken", CryptoUtil.encrypt(inst.getWsToken()));
                botCfg.put("httpToken", CryptoUtil.encrypt(inst.getHttpToken()));
                botsMap.put(inst.getName(), botCfg);
            }

            var cfg = new LinkedHashMap<String, Object>();
            cfg.put("bots", botsMap);
            cfg.put("activeBot", activeBotName);

            if (launcher.getNapCatDir() != null) {
                cfg.put("napCatDir", launcher.getNapCatDir());
            }
            if (launcher.getWorkRoot() != null) {
                cfg.put("napCatWorkRoot", launcher.getWorkRoot());
            }

            Files.writeString(Path.of(CONFIG_FILE), GsonFactory.pretty().toJson(cfg));
            logger.debug("配置已保存 ({} 个 Bot)", bots.size());
        } catch (IOException e) {
            logger.warn("保存配置文件失败", e);
        }
    }
}
