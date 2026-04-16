# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概述

基于 NapCat/OneBot 11 的 QQ Bot 客户端。同一仓库包含两个独立代码库：Java 后端和 React Web UI。项目语言以中文为主（注释、UI 文案、文档）。

## 构建与运行

**环境要求：** JDK 24+（`build.gradle.kts` 强制要求，注意这是较新版本）

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

## 关键注意事项

- **`Main.java` 在默认包中** — 绝不要添加 `package` 声明。
- **非标准源码目录结构**：`src/` 而非 `src/main/java/`，在 `build.gradle.kts` 的 sourceSets 中配置。
- **`src/resources/web/` 是构建产物** — 来自 `web-ui/` 的输出。绝不要直接编辑；始终在 `web-ui/src/` 下修改后运行 `npm run deploy`。
- **Tailwind v4 CSS-first 配置**：主题 token 通过 `web-ui/src/index.css` 中的 `@theme` 定义，没有 `tailwind.config.js`。
- **framer-motion v12 类型问题**：cubic-bezier 数组必须转换为元组：`[0.25, 0.1, 0.25, 1] as [number, number, number, number]`。
- `config.json`、`.keys/`、`schedules*.json`、`logs/` 是 gitignore 的运行时产物。
- **定时任务文件命名**：`default` Bot 使用 `schedules.json`，其他 Bot 使用 `schedules_<名称>.json`。
- `lib/` 目录存放手动编译用的 JAR 包，Gradle 构建会忽略它们（从 Maven Central 拉取依赖）。
- Web 构建产出单个 >500 KB 的 chunk（预期行为，未配置代码拆分）。

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

## 补充参考

`AGENTS.md` 包含更详细的包级说明、控制台命令参考和 API 覆盖范围，是深入了解项目的有用补充文档。
