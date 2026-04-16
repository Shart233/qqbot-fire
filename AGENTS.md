# AGENTS.md

基于 NapCat/OneBot 11 的 QQ Bot 客户端。同一仓库包含两个独立代码库：Java 后端和 React Web UI。

## 仓库结构

- `src/` — Java 后端（纯 JDK 24，无框架）。入口：`src/Main.java`。
- `src/resources/web/` — **Web UI 构建产物**。绝不要直接编辑；始终从 `web-ui/` 重新构建。
- `web-ui/` — React SPA（管理控制台）。完全独立的 npm 项目。
- `lib/` — 手动编译用的 JAR 包。仅用于手动 `javac` 编译；Gradle 构建会忽略它们。
- `scripts/` — NapCat 多实例启动脚本（bat/sh）。
- `Dockerfile` + `docker-compose.yml` + `docker-entrypoint.sh` — 生产环境 Docker 部署（qqbot-fire + NapCat）。

## Java 后端

### 构建与运行

```bash
./gradlew run                    # 构建 + 运行（推荐）
./gradlew compileJava            # 仅编译
./gradlew installDist            # 生成分发包到 build/install/qqbot-fire/
```

IDE 运行配置：`qqbot-fire [:run]`（Gradle）或 `QQBot-fire`（Java 应用）。

### 非标准源码目录结构（关键）

- `sourceSets.main.java.srcDirs("src")` — 源码位于 `src/`，而非 `src/main/java/`。
- `sourceSets.main.resources.srcDirs("src/resources")` — 包含 `log4j2.xml` 和 Web 构建产物。
- `Main.java` 位于**默认包**中。其他类均在 `src/onebot/` 下的 `onebot.*` 包中。
- 依赖：Log4j2 2.24.3、Gson 2.12.1（Gradle 从 Maven Central 拉取）。
- **无测试。** 无 CI/CD。无 pre-commit hooks。无 Java Linter。

### 关键包说明

| 包 | 用途 |
|---|---|
| `onebot.client` | WS + HTTP 连接，API 客户端（170+ 方法，含频道 Guild） |
| `onebot.config` | `ConfigManager` — 持久化到 `config.json` |
| `onebot.web` | 内嵌 HTTP 服务器（JDK `HttpServer`），REST API（30+ 端点） |
| `onebot.napcat` | NapCat 进程管理，配置自动发现 |
| `onebot.console` | 交互式命令行（`BotConsole`）— 应用主循环入口 |
| `onebot.handler` | 事件分发器（责任链模式） |
| `onebot.scheduler` | NTP 同步的定时消息调度器（per-bot） |
| `onebot.util` | `GsonFactory`、`CryptoUtil`（RSA）、`ConvertUtil`、`NtpUtil` |

## Web UI

### 命令

```bash
cd web-ui
npm run dev          # Vite 开发服务器 :5173，代理 /api -> :9988
npm run build        # tsc -b && vite build -> web-ui/dist/
npm run deploy       # 构建 + 复制 dist/ -> src/resources/web/  ← 发布 UI 变更的标准方式
npm run lint         # ESLint
```

**任何 UI 变更后，都需在 `web-ui/` 下运行 `npm run deploy`**，将构建产物复制到 Java 资源目录。内嵌 HTTP 服务器从 `src/resources/web/` 提供静态文件。

### 技术栈与特殊约定

- React 19、Vite 8、TypeScript 6、Tailwind CSS v4、HeroUI v3、framer-motion v12。
- **Tailwind v4 CSS-first 配置**：主题 token 通过 `web-ui/src/index.css` 中的 `@theme` 定义，没有 `tailwind.config.js`。
- 主题颜色使用 CSS 自定义属性定义在 `web-ui/src/index.css`（`:root`），通过 `@theme { --color-*: var(--*) }` 桥接到 Tailwind。
- 暗色/亮色模式：`next-themes`，通过 `attribute="class"` 切换。
- 路由：`react-router-dom` v7，使用 `createHashRouter`（基于 hash）。
- 状态管理：Zustand stores，位于 `web-ui/src/stores/`。

### TypeScript 注意事项

framer-motion v12 要求 cubic-bezier 数组必须转换为元组类型：
```ts
ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
```
不加类型转换会报 TS 错误：`number[] is not assignable to Easing`。

## Docker

- `docker compose up -d` 同时启动 `napcat`（官方镜像 `mlikiowa/napcat-docker:latest`）和 `qqbot-fire`（从本仓库 Dockerfile 构建）。
- NapCat 容器暴露 WS `:3000`、HTTP `:3001`、WebUI `:6099`。qqbot-fire 暴露 `:9988`。
- 容器共享网络 `qqbot-fire-net`；qqbot-fire 通过 `ws://napcat:3000`（容器名作为主机名）连接 NapCat。
- Dockerfile 采用多阶段构建：`eclipse-temurin:24-jdk`（构建阶段）→ `eclipse-temurin:24-jre`（运行阶段）。
- `docker-entrypoint.sh` 将运行时文件（`config.json`、`.keys/`、`logs/`、`schedules*.json`）软链接到 `/app/data` 卷以实现持久化。
- 命名卷：`napcat-qq`（QQ 登录数据）、`napcat-config`（NapCat 配置）、`qqbot-fire-data`（应用状态）。

## 注意事项

- **绝不要手动编辑 `src/resources/web/`。** 始终在 `web-ui/src/` 下修改后运行 `npm run deploy`。
- Vite 开发服务器将 `/api` 代理到 `http://127.0.0.1:9988` — UI 开发模式下必须先启动 Java 后端。
- `config.json`、`.keys/`、`schedules*.json` 和 `logs/` 是 gitignore 的运行时产物。
- 项目语言以中文为主（注释、UI 文案、文档）。
- Web 构建产出单个 >500 KB 的 chunk（预期行为，未配置代码拆分）。
- `Main.java` 位于默认包中 — 绝不要添加 `package` 声明。
