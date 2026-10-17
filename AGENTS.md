# AGENTS.md


## 当前迁移状态（2026-10-18）

默认运行与 Docker 部署已迁移到 TypeScript（`server/`、`packages/`），`src/` 保留 Java 回退代码。默认 `Dockerfile` 和 `docker-compose.yml` 将新后台、前端、NapCat 与 Linux QQ 放在同一个容器；Java 回退使用 `Dockerfile.java` / `compose.java.yml`，轻量外部模式使用 `Dockerfile.typescript` / `compose.typescript.yml`。

- Node 固定 `24.21.0`，使用根目录 npm 工作区与锁文件。
- 新服务验证：`npm run verify`；浏览器回归：`npm run test:ui`。
- 数据在独立 `DATA_DIR`，默认不启用自动调度；正式切换前不能同时运行新旧调度器。
- 新管理接口同步维护 `packages/contracts/` 和 `web-ui/src/api/`；OneBot 具名模型与 Java 保持兼容。
- NapCat 托管只管理本进程创建的进程组；外部扫码通过 WebUI 代理，外部进程由其所属环境启停。
- 计划和验证边界见 `.claude/plans/` 与 `docs/migration/`。后文关于 Java 的入口、编译和回调要求继续适用于回退代码。

基于 NapCat/OneBot 11 的 QQ Bot 客户端。单仓库两套代码：Java 后端（`src/`）+ React Web UI（`web-ui/`）。

本文件是仓库内 agent 的工作入口，记录常用命令、代码入口和容易踩坑的约束。使用方法见 `README.md`，其他开发说明见 `CLAUDE.md`；说明与实际代码不一致时，先核对当前实现。

## 语言要求

- 所有对话使用中文。
- 所有文档使用中文。
- 所有代码注释使用中文。

## 执行要求

- 在生成说明、总结、计划、提交说明时，统一使用中文。
- 在新增或修改 Markdown 文档时，统一使用中文。
- 在新增或修改代码注释时，统一使用中文。
- 开始修改前查看 `git status --short`，保留已有的暂存、未暂存和未跟踪内容，不顺手清理或提交无关改动。
- 计划文件统一放在项目内 `.claude/plans/`，不要写入用户全局计划目录。

## 指令源

- `CLAUDE.md` — 构建/运行命令、目录概览、Git 约定。
- `.claude/rules/*.md` — `code-style`、`gotchas`、`api-patterns`、`heroui-v3`、`scheduler-callbacks`；按修改范围读取相关规则。
- `.claude/skills/verify/SKILL.md`、`.claude/skills/compile/SKILL.md`、`.claude/skills/deploy-ui/SKILL.md` — Java 编译、前端 lint 和 UI 部署流程。
- 自动加载和编辑钩子属于 Claude Code 环境；其他 agent 不应假定它们会执行。`.claude/` 已被 Git 忽略，本地文件缺失时以本文件和实际代码为准。

## 代码入口

- `src/Main.java` → `onebot.console.BotConsole.start()`：启动、控制台命令、多 Bot 生命周期及配置加载。
- `onebot.client`：`BotInstance` 保存每个 Bot 的独立状态；`OneBotClient` 通过 `ApiProvider` 对接 WebSocket/HTTP。
- `onebot.handler`、`onebot.event`：事件模型及 `EventDispatcher` 处理器链。当前连接流程不默认注册消息命令处理器；扩展事件行为需显式注册 `EventHandler`。
- `onebot.scheduler.ScheduleManager`：每个 Bot 独立的 NTP 定时任务、自动连接与发送后停止。
- `onebot.napcat`：进程管理、配置发现、输出读取及 `NapCatLoginClient` 扫码登录。
- `onebot.web`、`onebot.auth`、`onebot.config`：HTTP 服务、REST API、管理员鉴权与配置持久化。
- `web-ui/src/App.tsx`、`api/`、`pages/`、`stores/`：前端路由、请求封装、页面及状态；`components/` 包含布局和复用组件。

## 构建与验证

- 构建脚本是 `build.gradle.kts`（Kotlin DSL），不是 `build.gradle`。
- `sourceSets.main.java.srcDirs("src")` + `resources.srcDirs("src/resources")` — 源码**不**在 `src/main/java/`。
- `Main.java` 位于**默认包**，绝不要加 `package` 声明。其他类在 `onebot.*` 包下。
- 当前没有自动化测试、CI 或 Java Linter。Java 修改至少运行 `.\gradlew.bat compileJava`；编译通过不能代替运行时行为验证。
- Gradle toolchain 固定为 **JDK 24**；确保本机可发现该版本。手动 `javac` 时 `JAVA_HOME` 必须正确。
- `lib/` 仅供手动 `javac` 编译使用，Gradle 构建**忽略**它；不要往里加依赖。
- Java 依赖统一在 `build.gradle.kts` 中声明。编译使用 UTF-8，Gradle 运行任务也配置了标准输出/错误的 UTF-8 编码。

常用命令（在仓库根目录执行，适配 Windows PowerShell）：

```powershell
.\gradlew.bat compileJava       # 编译 Java
.\gradlew.bat run               # 构建并运行
.\gradlew.bat installDist       # 分发包：build/install/qqbot-fire/
npm --prefix web-ui run lint    # 检查前端代码
npm --prefix web-ui run typecheck # TypeScript 类型检查
npm --prefix web-ui run deploy  # 快速构建并复制前端产物
npm --prefix web-ui run deploy:full # 类型检查、构建并复制前端产物
```

Linux 对应使用 `./gradlew`。只修改文档时检查内容和差异即可；修改前端时运行 lint、类型检查及部署，修改两端时分别验证。

## Web UI 关键规则

- **`src/resources/web/` 是构建产物**，绝不直接编辑。每次改完 `web-ui/` 必须运行 `npm --prefix web-ui run deploy`（或 `deploy:full`），通过 `scripts/copy-dist.mjs` 覆盖前端产物，否则后端加载的还是旧版前端。
- `deploy` 实际执行 `build:fast`（仅 Vite 构建）再复制，**不做类型检查**；`build` 执行 `tsc -b` + Vite，`deploy:full` 执行 `build` 再复制。不要把快速部署成功当成类型检查通过。
- Vite 代理只转发 `/api` 前缀（`vite.config.ts` → `http://127.0.0.1:9988`）；所有 REST 端点都必须在此前缀下，UI 开发模式需先启后端。
- Tailwind v4 **CSS-first** 配置：主题在 `web-ui/src/index.css` 的 `@theme` 里，**没有** `tailwind.config.js`，别新建。
- 路由用 `createHashRouter`（hash 路由），状态用 Zustand（`web-ui/src/stores/`），主题用 `next-themes` 的 `class` 属性切换。
- framer-motion v12 类型坑：cubic-bezier 数组必须元组断言 `[0.25, 0.1, 0.25, 1] as [number, number, number, number]`，否则 TS 报 `number[] is not assignable to Easing`。
- Web 构建产出一个 >500 KB chunk 是预期行为（未做代码拆分），不要以为是问题。
- `.claude/settings.json` 配置了前端 ESLint 修复、Java 格式化和部署提醒钩子，依赖 Claude Code 的工具事件及 Bash 环境；使用其他工具修改时须自行执行相应验证。

## HeroUI v3 compound components（易静默失败）

省略子组件**不会报错**，但渲染为空或无交互。必须展开：

- `Switch` → `Switch.Control > Switch.Thumb`
- `Radio` → `Radio.Control > Radio.Indicator` + `Radio.Content`
- `Table` → `Table.Content`（承载 `aria-label`）→ `Header`/`Body`
- `Select` → `Trigger + Value + Indicator + Popover + ListBox`

详见 `.claude/rules/heroui-v3.md`。

## REST API 约定（`onebot.web.WebApiHandler`）

- 所有端点走 `/api` 前缀剥离后的 `route()` → `routeAuth`/`routeBot`/`routeSchedule`/`routeNapCat`/`routeConsole`/`routeLogs`，子路由按动作和 HTTP 方法分派。新增端点在对应 `route*` 里加 case。
- 强制使用辅助方法：`readBodyAsMap`、`sendOk`、`sendError`、`requireBot`/`requireConnectedBot`、`botToMap`/`taskToMap`、`ConvertUtil.toLong(...)`。不要手写 JSON 序列化。
- 前端请求统一复用 `web-ui/src/api/client.ts`，端点和类型放在 `api/endpoints.ts`、`api/types.ts`，成功响应是 `{"ok": true, "data": ...}`，错误响应是 `{"ok": false, "error": "..."}`。

## 管理员鉴权与扫码登录

- `route()` 在分派 `/auth` 后执行 `requireAuth()`，其他 API 必须通过管理员 Bearer token 校验。首次启动设置密码，密码使用 BCrypt，管理员会话使用 HS256 JWT；改密流程维护 `pwdVer` 以吊销旧会话。
- 前端鉴权入口在 `App.tsx`，页面包括 `SetupPage`、`LoginPage`、`SettingsPage`；`api/client.ts` 负责携带 token 和处理未授权响应。
- `WebConsoleServer` 当前监听 `127.0.0.1:9988`，远程访问及 Docker 端口可达性需核对监听地址，不能仅依据 README 中的访问示例判断。
- NapCat 扫码登录由 `NapCatLoginClient` 和 `NcLoginPage` 协作，通过后端访问对应实例的本地 WebUI 与二维码缓存；保持管理员会话、OneBot token 和 NapCat WebUI 凭据各自的用途。

## ScheduleManager 回调注入（4 处，必须同步）

新增或修改 `BotConnector`、`healthCheck`、`afterSendStopper` 类回调时，需要在**全部 4 处**同步，否则某条路径会缺失回调。按方法名定位，不依赖容易过期的行号：

1. `BotConsole.connectWebSocket()`：WebSocket 连接。
2. `BotConsole.connectHttp()`：HTTP 连接；`autoConnectBot()` 最终复用连接流程。
3. `BotConsole.loadConfig()`：加载配置后为已有任务启动调度器。
4. `WebApiHandler.ensureSchedulerStarted()`：Web API 启动调度器。

- **调度器跨 Bot 连接生命周期常驻**。`disconnectInstance()` 只清理 Bot 连接和调度器的 Bot 引用，不能调用 `scheduler.stop()`，否则发送后停止会让其他启用任务不再触发。删除 Bot、清空配置和进程退出时才停止调度器。
- **`afterSendStopper` 必须在独立线程里执行断开和停止进程**，使用 `new Thread(..., "auto-stop-" + name).start()`；WebSocket 关闭和 NapCat 停止可能耗时数秒，不应阻塞调度器主循环。
- 修改调度器等待逻辑时，核对分钟边界、NTP 时间、自动连接预热及失败重试，避免非正等待时长造成忙等。

## Java 编码风格（与默认不同）

- `onebot.model` 字段用 **snake_case**（`group_id`、`user_id`），匹配 OneBot 11 JSON 键；Gson 直接映射，别改。
- `onebot.config` 字段用 camelCase，匹配 `config.json`。
- 注释/日志中文，标识符英文。`var` 局部变量、单行 getter/setter、`// ---- 分组 ----` 字段分组是现有风格。

## 运行时产物（gitignore，勿提交）

`config.json`、`.keys/`（RSA 密钥和 JWT 密钥）、`napcat_instances.json`、`schedules.json` / `schedules_<botName>.json`（`default` Bot 用无后缀文件，其他 Bot 用 `_<名称>`）、`logs/`。不要提交真实配置、凭据或日志。

Docker 下 `docker-entrypoint.sh` 将配置、密钥、日志和数据目录中已有的任务文件软链到 `/app/data` 卷；新增持久化文件或修改任务保存路径时，同时核对入口脚本和实际写入位置。

## 平台

开发主环境是 Windows + PowerShell 5.1。Bash 的 `&&` 串联在本地 shell 不可用；独立命令分开执行，依赖前一步成功时用 `if ($?) { ... }` 或检查 `$LASTEXITCODE`。进程管理脚本在 `scripts/`，NapCat 脚本有 `.bat` / `.sh` 两套，`fire-stop.sh`、`fire-restart.sh` 为 Linux 脚本。
