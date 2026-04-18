# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

基于 NapCat/OneBot 11 的 QQ Bot 客户端。同一仓库包含两个独立代码库：Java 后端和 React Web UI。项目语言以中文为主（注释、UI 文案、文档）。

## 语言要求

所有输出统一使用中文：对话、文档、代码注释、提交说明、计划和总结。

## 构建与运行

**环境要求：** JDK 24+（`build.gradle.kts` 强制要求，注意这是较新版本）。`JAVA_HOME` 必须指向 JDK 24+，Gradle 通过 toolchain 自动检测，但手动编译（`javac`）需要正确设置。

```bash
./gradlew run              # 构建 + 运行（推荐）
./gradlew compileJava      # 仅编译
./gradlew installDist      # 生成分发包到 build/install/qqbot-fire/
```

Java 端无测试、无 CI/CD、无 Linter。编译和运行时强制 UTF-8 编码（`-Dstdout.encoding=UTF-8`）。

### Web UI

```bash
cd web-ui
npm run dev          # Vite 开发服务器 :5173，代理 /api -> :9988（需先启动 Java 后端）
npm run build        # tsc -b && vite build
npm run deploy       # 构建 + 复制 dist/ -> src/resources/web/（发布 UI 变更的标准方式）
npm run lint         # ESLint
```

Vite 代理仅转发 `/api` 前缀的请求，所有 REST 端点必须在此前缀下。

### Docker

```bash
docker compose up -d              # 启动 napcat + qqbot-fire
docker compose up -d --build qqbot-fire  # 代码修改后重新构建
```

容器间通过内部网络 `qqbot-fire-net` 通信，qqbot-fire 连接 NapCat 使用容器名作为主机名（如 `ws://napcat:3000`），而非 localhost。

## 架构

```
Main -> BotConsole.start()
          |
          +-- ConfigManager (config.json 持久化, RSA 加密 Token)
          +-- WebConsoleServer (:9988, JDK HttpServer + 虚拟线程)
          |     +-- WebApiHandler (30+ REST 端点)
          +-- BotInstance[] (每个 Bot 完全独立)
          |     +-- OneBotClient (170+ typed API 方法)
          |     |     +-- ApiProvider 接口
          |     |           +-- OneBotConnection (WebSocket)
          |     |           +-- OneBotHttpConnection (HTTP, 自动探测标准/Debug API)
          |     +-- EventDispatcher -> EventHandler 链 (责任链模式)
          |     +-- ScheduleManager (NTP 同步的 per-bot 定时消息)
          +-- NapCatLauncher (进程管理)
          +-- NapCatConfigDiscovery (读取 onebot11_*.json 配置文件)
```

**核心设计**：零框架（纯 JDK 24 + Log4j2 + Gson），HTTP 服务器使用虚拟线程，多 Bot 架构（每个 BotInstance 拥有独立的配置/连接/分发器/调度器），RSA 2048 Token 加密（存储时带 `RSA:` 前缀）。

## Web UI 技术栈

React 19, Vite 8, TypeScript 6, Tailwind CSS v4, HeroUI v3（原 NextUI）, framer-motion v12, Zustand v5（状态管理）, react-router-dom v7（基于 hash 路由）, next-themes（通过 `class` 属性切换暗色/亮色主题）。

## Git 约定

- **分支命名**：`feature/xxx`、`fix/xxx`、`hotfix/xxx`、`refactor/xxx`。
- 在 `master` 分支上直接开发或从 feature 分支合并。

## Claude Code 配置

- **自动 ESLint 修复钩子**：`.claude/settings.json` 中配置了 PostToolUse 钩子，对 `web-ui/` 下的 `.ts`/`.tsx` 文件在每次编辑后自动运行 `npx eslint --fix`。
- **自动 Java 格式化钩子**：PostToolUse 同一 matcher 下对 `src/**/*.java` 自动运行 google-java-format（AOSP 4 空格风格），通过 `.claude/tools/gjf.sh` wrapper 处理 JDK 24 所需的 `--add-exports` 参数。jar 放在 `.claude/tools/google-java-format.jar`，`.claude/` 已被 gitignore，团队成员需各自放置。
- **Stop 钩子提醒 deploy**：每次会话回合结束时检查 `web-ui/src/` 是否比 `src/resources/web/assets/` 新，若是则在 stderr 打印提醒「请执行 `cd web-ui && npm run deploy`」。
- **`/verify` 技能**：一键编译 Java 后端 + 检查 Web UI lint，用于提交前验证。
- **`/compile` 技能**：仅跑 `./gradlew compileJava`，比 /verify 更轻量，改完 Java 代码随手验证用。
- **`/deploy-ui` 技能**：构建 Web UI 并复制到 `src/resources/web/`，仅用户手动调用。

## 计划文件位置

所有 plan 文件统一放在项目内 `.claude/plans/` 目录，不要写到用户全局目录（如 `C:\Users\Lenovo\.claude\plans\`）。该目录通过 `.gitignore` 的 `.claude/` 规则自动忽略，不会提交到仓库。

## 补充参考

- `AGENTS.md` 包含更详细的包级说明、控制台命令参考和 API 覆盖范围，是深入了解项目的有用补充文档。
- `.claude/rules/` 包含详细的开发模式规则（编码规范、关键注意事项、HeroUI 组件模式、API 端点模式、调度器回调模式），会被自动加载，无需手动引用。
