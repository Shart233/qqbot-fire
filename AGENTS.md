# AGENTS.md

基于 NapCat/OneBot 11 的 QQ Bot 客户端。单仓库两套代码：Java 后端（`src/`）+ React Web UI（`web-ui/`）。

详细命令与架构说明见 `README.md` 和 `CLAUDE.md`。本文件只收录 agent 容易踩坑的约束。

## 语言要求

- 所有对话使用中文。
- 所有文档使用中文。
- 所有代码注释使用中文。

## 执行要求

- 在生成说明、总结、计划、提交说明时，统一使用中文。
- 在新增或修改 Markdown 文档时，统一使用中文。
- 在新增或修改代码注释时，统一使用中文。

## 指令源

- `CLAUDE.md` — 构建/运行命令、目录概览、Git 约定（自动加载）
- `.claude/rules/*.md` — `code-style`、`gotchas`、`api-patterns`、`heroui-v3`、`scheduler-callbacks`（自动加载，无需手动引用）
- `.claude/skills/verify`、`.claude/skills/deploy-ui` — 一键验证与 UI 部署

## 构建与验证

- 构建脚本是 `build.gradle.kts`（Kotlin DSL），不是 `build.gradle`。
- `sourceSets.main.java.srcDirs("src")` + `resources.srcDirs("src/resources")` — 源码**不**在 `src/main/java/`。
- `Main.java` 位于**默认包**，绝不要加 `package` 声明。其他类在 `onebot.*` 包下。
- 无测试、无 CI、无 Java Linter。验证修改只能跑 `./gradlew compileJava`（或 `/verify` 技能）。
- 环境要求 JDK 24+（toolchain 强制），手动 `javac` 时 `JAVA_HOME` 必须正确。
- `lib/` 仅供手动 `javac` 编译使用，Gradle 构建**忽略**它；不要往里加依赖。

## Web UI 关键规则

- **`src/resources/web/` 是构建产物**，绝不直接编辑。每次改完 `web-ui/` 必须 `cd web-ui && npm run deploy`（= `build` + `scripts/copy-dist.mjs` 覆盖到 `src/resources/web/`），否则后端加载的还是旧版前端。
- Vite 代理只转发 `/api` 前缀（`vite.config.ts` → `http://127.0.0.1:9988`）；所有 REST 端点都必须在此前缀下，UI 开发模式需先启后端。
- Tailwind v4 **CSS-first** 配置：主题在 `web-ui/src/index.css` 的 `@theme` 里，**没有** `tailwind.config.js`，别新建。
- 路由用 `createHashRouter`（hash 路由），状态用 Zustand（`web-ui/src/stores/`），主题用 `next-themes` 的 `class` 属性切换。
- framer-motion v12 类型坑：cubic-bezier 数组必须元组断言 `[0.25, 0.1, 0.25, 1] as [number, number, number, number]`，否则 TS 报 `number[] is not assignable to Easing`。
- Web 构建产出一个 >500 KB chunk 是预期行为（未做代码拆分），不要以为是问题。
- `.claude/settings.json` 对 `web-ui/*.{ts,tsx}` 的 Write/Edit 有 PostToolUse 钩子自动跑 `eslint --fix`（bash 语法，PowerShell 不会触发）。

## HeroUI v3 compound components（易静默失败）

省略子组件**不会报错**，但渲染为空或无交互。必须展开：

- `Switch` → `Switch.Control > Switch.Thumb`
- `Radio` → `Radio.Control > Radio.Indicator` + `Radio.Content`
- `Table` → `Table.Content`（承载 `aria-label`）→ `Header`/`Body`
- `Select` → `Trigger + Value + Indicator + Popover + ListBox`

详见 `.claude/rules/heroui-v3.md`。

## REST API 约定（`onebot.web.WebApiHandler`）

- 所有端点走 `/api` 前缀剥离后的 `route()` → `routeBot`/`routeSchedule`/`routeNapCat`/`routeConsole`/`routeLogs`，用 `switch (action, method)` 分派。新增端点在对应 `route*` 里加 case。
- 强制使用辅助方法：`readBodyAsMap`、`sendOk`、`sendError`、`requireBot`/`requireConnectedBot`、`botToMap`/`taskToMap`、`ConvertUtil.toLong(...)`。不要手写 JSON 序列化。

## ScheduleManager 回调注入（4 处，必须同步）

新增 `BotConnector` 或 `afterSendStopper` 类回调时，需要在**全部 4 处**注入，否则某条路径会缺失回调：

1. `BotConsole.java` 初始 Bot 连接流程（~行 678）
2. `BotConsole.java` `autoConnectBot` 重连路径（~行 707）
3. `BotConsole.java` 调度器重载重启路径（~行 1617）
4. `WebApiHandler.java` `ensureSchedulerStarted()`（~行 1072）

**`afterSendStopper` 必须在新线程里执行**：它在调度器线程的 `executeTask()` 内被调用，而 `disconnectInstance()` 会 `scheduler.stop()` 中断自身 → 死锁。用 `new Thread(..., "auto-stop-" + name).start()` 解耦。

## Java 编码风格（与默认不同）

- `onebot.model` 字段用 **snake_case**（`group_id`、`user_id`），匹配 OneBot 11 JSON 键；Gson 直接映射，别改。
- `onebot.config` 字段用 camelCase，匹配 `config.json`。
- 注释/日志中文，标识符英文。`var` 局部变量、单行 getter/setter、`// ---- 分组 ----` 字段分组是现有风格。

## 运行时产物（gitignore，勿提交）

`config.json`、`.keys/`（RSA 密钥）、`schedules.json` / `schedules_<botName>.json`（`default` Bot 用无后缀文件，其他 Bot 用 `_<名称>`）、`logs/`。Docker 下 `docker-entrypoint.sh` 把这些软链到 `/app/data` 卷。

## 平台

开发主环境是 Windows + PowerShell 5.1。Bash 的 `&&` 串联在本地 shell 不可用；用 `;` 或 `; if ($?) { ... }`。跨平台脚本在 `scripts/`（`.bat` + `.sh` 成对）。
