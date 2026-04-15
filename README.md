# QQBot-Fire

> NapCat OneBot 11 Java Bot 客户端 — JDK 24 + Gradle，内置 NapCat 多开管理

基于 [NapCat](https://napneko.github.io/) 的 OneBot 11 协议，通过 WebSocket / HTTP 双模式对接 QQ Bot。
支持同时运行多个 Bot 实例（双开/多开），并可直接从控制台启动和管理 NapCat 进程。

**160+ typed API wrapper** 完整覆盖 OneBot 11 标准 API 和 NapCat 扩展 API。

## 特性

- **多实例管理 (双开)** — 同时运行多个 QQ Bot，每个 Bot 独立配置、独立连接
- **NapCat 进程管理** — 从控制台直接启动/停止 NapCat 实例，自动生成配置和分配端口
- **双模式连接** — WebSocket（API + 事件）和 HTTP（标准 OneBot 11 + NapCat Debug API 自动探测）
- **交互式控制台** — `/` 命令配置、连接、发消息、管理定时任务
- **事件驱动架构** — EventDispatcher 责任链分发，自定义 Handler 扩展
- **NTP 精确定时** — 基于网络时间的定时消息调度器
- **安全存储** — RSA 2048 加密 Token，配置持久化
- **消息构建器** — 链式 API，支持 20+ 消息段类型
- **完整 API 覆盖** — 160+ typed wrapper 方法，覆盖 OneBot 11 标准 39 个 + NapCat 扩展 120+ 个端点
- **Web 管理控制台** — React SPA（暗色/亮色主题），浏览器端完整管理（JDK 内置 HttpServer 托管）
- **结构化日志** — Log4j2 分级日志，按天滚动，主日志/错误日志/Web API 日志分离
- **跨平台** — Windows + Linux 全面支持（JDK 24 + Gradle）

## 快速开始

### 环境要求

- JDK 24+
- NapCat 实例（已登录 QQ）— 或由本项目自动启动

### 编译运行

**Gradle（推荐）：**

```bash
# 编译
./gradlew compileJava

# 运行
./gradlew run

# 构建 fat jar
./gradlew jar
java -jar build/libs/qqbot-fire.jar
```

**手动编译（无需 Gradle）：**

```bash
# 编译
javac -cp "lib/*" -d out -sourcepath src src/Main.java

# Windows
java -cp "out;lib/*;src/resources" Main

# Linux
java -cp "out:lib/*:src/resources" Main
```

**Linux 后台运行：**

```bash
nohup java -cp "out:lib/*:src/resources" Main &
tail -f logs/qqbot-fire.log
```

也可以直接用 IntelliJ IDEA 打开项目，使用 `qqbot-fire [:run]`（Gradle）或 `QQBot-fire`（Java）运行配置。

### Linux 部署说明

```bash
# 1. 上传项目到服务器
scp -r qqbot-fire/ user@server:/opt/qqbot-fire/

# 2. 确认 JDK 24+
java -version

# 3. 编译
cd /opt/qqbot-fire
javac -cp "lib/*" -d out -sourcepath src src/Main.java

# 4. 启动
java -cp "out:lib/*:src/resources" Main

# 5. 后台运行 (推荐用 screen 或 tmux)
screen -S qqbot
java -cp "out:lib/*:src/resources" Main
# Ctrl+A D 脱离 screen，screen -r qqbot 恢复

# 6. 浏览器访问 Web 控制台
http://服务器IP:8080
```

### 场景一：已有 NapCat 实例，直接连接

如果你已经在运行 NapCat 并开启了 WebSocket 或 HTTP 服务：

```
> /set mode ws
> /set ws ws://127.0.0.1:3001
> /set wstoken your_ws_token
> /connect
[default] 登录成功 — QQ: 123456, 昵称: MyBot
```

### 场景二：自动发现 NapCat 配置并连接（推荐）

NapCat 配置目录下的 `onebot11_<QQ号>.json` 包含了端口和 Token，可自动读取：

```
> /napcat dir C:\NapCat.Shell
> /napcat discover
发现 1 个 QQ Bot 配置:
  QQ=1234567890 WS=ws://127.0.0.1:3001 token=qUo1...
    -> 已创建 Bot: qq1234567890
完成! 新建 1 个，共 1 个 Bot

> /connect
[qq1234567890] 登录成功 — QQ: 1234567890, 昵称: MyBot
```

### 场景三：启动 NapCat 并自动配置

`/napcat start` 只需名称和 QQ 号，端口和 Token 自动从配置读取：

```
> /napcat dir C:\NapCat.Shell
> /napcat start bot1 1234567890
已从配置读取: QQ=1234567890 WS=ws://127.0.0.1:3001 token=qUo1...
NapCat 实例已启动: bot1 QQ=1234567890
  Bot 'qq1234567890' 已自动配置，使用 /connect 连接

> /bot use qq1234567890
> /connect
```

### 场景四：双开（同时运行两个 QQ Bot）

```
# 1. 启动两个 NapCat 实例（端口和 Token 自动读取）
> /napcat dir C:\NapCat.Shell
> /napcat start main 1234567890
> /napcat start sub  9876543210

# 2. 一键全部连接 (Bot 已自动创建和配置)
> /connectall
[qq1234567890] 登录成功 — QQ: 1234567890, 昵称: MainBot
[qq9876543210] 登录成功 — QQ: 9876543210, 昵称: SubBot

# 3. 切换操作目标
> /bot use qq1234567890
[qq1234567890:1234567890] > /send group 123456 你好，我是主号
> /bot use qq9876543210
[qq9876543210:9876543210] > /send group 123456 你好，我是小号

# 4. 查看所有 Bot 状态
> /bot list
  [ON] qq1234567890 WS QQ:1234567890 MainBot <-- 当前
  [ON] qq9876543210 WS QQ:9876543210 SubBot
```

配置自动保存到 `config.json`，下次启动无需重复设置。

## 控制台命令

### Bot 管理（多开）

| 命令 | 说明 |
|---|---|
| `/bot add <名称>` | 添加新 Bot 实例 |
| `/bot remove <名称>` | 删除 Bot 实例 |
| `/bot list` | 列出所有 Bot 及状态 |
| `/bot use <名称>` | 切换当前操作的 Bot |
| `/bot rename <旧名> <新名>` | 重命名 Bot |

### 配置（作用于当前 Bot）

| 命令 | 说明 |
|---|---|
| `/set mode <ws\|http>` | 切换连接模式 |
| `/set ws <url>` | 设置 WebSocket 地址 |
| `/set http <url>` | 设置 HTTP API 地址 |
| `/set wstoken <token>` | 设置 WS Token |
| `/set httptoken <token>` | 设置 HTTP Token |
| `/show` | 显示所有 Bot 配置 |
| `/config clear` | 清除所有 Bot 配置并重置为默认状态 |
| `/config clear <名称>` | 清除指定 Bot 的连接信息（URL 和 Token 归零） |

### 连接管理

| 命令 | 说明 |
|---|---|
| `/connect` | 连接当前 Bot |
| `/disconnect` | 断开当前 Bot |
| `/reconnect` | 重新连接当前 Bot |
| `/connectall` | 连接所有 Bot |
| `/disconnectall` | 断开所有 Bot |

### 运行时命令（当前 Bot）

| 命令 | 说明 |
|---|---|
| `/status` | 查看 Bot 状态 |
| `/send group <群号> <消息>` | 发送群消息 |
| `/send private <QQ> <消息>` | 发送私聊消息 |
| `/friends` | 获取好友列表 |
| `/groups` | 获取群列表 |
| `/members <群号>` | 获取群成员列表 |

### NapCat 进程管理

| 命令 | 说明 |
|---|---|
| `/napcat dir [路径]` | 查看/设置 NapCat.Shell 目录 |
| `/napcat workroot [路径]` | 查看/设置实例工作根目录 |
| `/napcat discover` | 自动发现 NapCat 配置并创建 Bot（优先扫描实例工作目录） |
| `/napcat start <名称> <QQ号> [WebUI端口]` | 启动 NapCat 实例（端口/Token 按 QQ 号精确读取） |
| `/napcat stop <名称\|all>` | 停止 NapCat 实例 |
| `/napcat list` | 查看运行中的 NapCat 实例 |
| `/napcat log <名称>` | 查看实例日志（缓冲区全部内容） |
| `/napcat attach <名称>` | 连接实时日志流（屏幕切换） |
| `/napcat detach` | 断开日志流，回到控制台 |

### 定时任务（当前 Bot）

| 命令 | 说明 |
|---|---|
| `/schedule list` | 查看定时任务 |
| `/schedule add <名称> <HH:mm> <QQ,...> <消息>` | 添加定时任务 |
| `/schedule remove <名称>` | 删除定时任务 |
| `/schedule on/off <名称>` | 启用/禁用任务 |
| `/schedule test <名称>` | 立即测试执行 |

### Web 控制台

| 命令 | 说明 |
|---|---|
| `/web` | 查看 Web 控制台状态 |
| `/web start [端口]` | 启动 Web 控制台（默认 8080） |
| `/web stop` | 停止 Web 控制台 |

### 其他

| 命令 | 说明 |
|---|---|
| `/logout` | 退出 QQ 登录 |
| `/quit` | 退出程序（自动停止所有连接和 NapCat 实例） |
| `/help` | 显示帮助 |

## Web 管理控制台

启动后自动在 http://127.0.0.1:8080 提供 Web 管理界面，功能与控制台命令完全对应。

### 功能

- **仪表盘** — Bot 状态卡片一览，快速连接/断开，5 秒自动刷新
- **Bot 管理** — 添加/删除/配置 Bot，编辑连接信息
- **消息发送** — 选择 Bot → 选择群/好友 → 发消息（QQ 号历史记忆）
- **好友与群** — 好友列表、群列表、点击查看群成员
- **定时任务** — 每个 Bot 的定时任务 CRUD + 开关 + 立即测试
- **NapCat 管理** — 启动/停止实例，自动发现配置，查看实时日志
- **日志** — 实时操作日志
- **状态记忆** — 页面、选择器、Tab 等状态自动保存（localStorage）

### 技术栈

- 后端：JDK 内置 `HttpServer`（零额外依赖）
- 前端：React 19 + TypeScript + Tailwind CSS v4 + HeroUI v3 SPA（暗色/亮色主题）
- 构建：Vite 8，开发时 `/api` 自动代理到 Java 后端 `:8080`
- 通过 REST API 与后端通信
- 使用 `npm run deploy` 构建并拷贝到 `src/resources/web/`

### 使用

```
# 启动程序后自动启动 Web 控制台 (默认端口 8080)
# 浏览器访问:
http://127.0.0.1:8080

# 手动控制:
> /web start 9090    # 指定端口启动
> /web stop          # 停止
> /web               # 查看状态
```

## NapCat 多开

### 原理

每个 NapCat 实例通过 `NAPCAT_WORKDIR` 环境变量隔离配置、缓存和日志。
不同实例使用不同的 WebSocket/HTTP/WebUI 端口，互不干扰。

### 端口分配建议

| 实例 | QQ 号 | WS 端口 | HTTP 端口 | WebUI 端口 |
|---|---|---|---|---|
| bot1 | 1234567890 | 3001 | 3003 | 6101 |
| bot2 | 9876543210 | 3002 | 3004 | 6102 |
| bot3 | ... | 3005 | 3006 | 6103 |

### 方式一：从控制台管理（推荐）

通过 `/napcat` 命令直接在 BotConsole 中启动和管理 NapCat 进程：

```
> /napcat dir C:\NapCat.Shell     # 设置 NapCat 路径（只需一次）
> /napcat start bot1 1234567890           # 启动（端口/Token 自动从配置读取）
> /napcat start bot2 9876543210           # 启动第二个实例
> /napcat list                                          # 查看运行状态
> /napcat log bot1                                      # 查看缓冲区日志
> /napcat attach bot1                                   # 实时日志流 (屏幕切换)
[NapCat] starting...
[NapCat] login success...
--- 已连接到 bot1 的日志流 (输入 /detach 或按回车退出) ---
[NapCat] new message from ...                           ← 实时输出
/detach                                                 ← 回到控制台
--- 已断开 bot1 的日志流 ---
> /napcat stop all                                      # 停止所有
```

启动时自动完成：
- 创建独立工作目录 `<workroot>/<实例名>/`
- 生成 `onebot11_<QQ号>.json` 配置文件（分配 WS/HTTP 端口）
- 启动 NapCat 进程，后台线程实时捕获输出（写日志文件 + 内存缓冲区）

### 方式二：使用脚本批量启动

`scripts/` 目录提供独立的启动脚本，可在 BotConsole 外使用：

**Windows:**
```bat
cd scripts
napcat-multi.bat init          REM 生成配置模板
notepad napcat-instances.conf   REM 编辑配置
napcat-multi.bat start          REM 启动所有实例
napcat-multi.bat status         REM 查看状态
napcat-multi.bat stop           REM 停止所有
```

**Linux:**
```bash
cd scripts
./napcat-multi.sh init          # 生成配置模板
vim napcat-instances.conf       # 编辑配置
./napcat-multi.sh start         # 启动所有实例
./napcat-multi.sh status        # 查看状态
./napcat-multi.sh stop          # 优雅停止所有
./napcat-multi.sh restart       # 重启所有
```

**配置文件格式 (`napcat-instances.conf`):**

Windows:
```conf
NAPCAT_DIR=C:\NapCat.Shell
WORK_ROOT=C:\NapCat.Shell\instances

instance bot1       1234567890    3001    3003      6101
instance bot2       9876543210    3002    3004      6102
```

Linux:
```conf
NAPCAT_DIR=/opt/NapCat
WORK_ROOT=/opt/NapCat/instances

instance bot1       1234567890    3001    3003      6101
instance bot2       9876543210    3002    3004      6102
```

## 连接模式对比

| | WebSocket | HTTP (标准 OneBot 11) | HTTP (NapCat Debug API) |
|---|---|---|---|
| API 调用 | `{action, params, echo}` 通过 WS | `POST /{action}` | `POST /api/Debug/call/debug-primary` |
| 事件接收 | 实时推送 | 不支持 | 不支持 |
| Token | URL query `?access_token=xxx` | `Bearer token` | `Bearer "token"` |
| 自动重连 | 支持 | 无状态 | 无状态 |
| 模式探测 | - | 自动 | 自动 |

HTTP 模式会自动探测：先尝试标准 OneBot 11 接口，失败时回退到 NapCat Debug API。

## 配置文件

### config.json（多 Bot 格式）

```json
{
  "bots": {
    "qq1234567890": {
      "mode": "ws",
      "wsUrl": "ws://127.0.0.1:3001",
      "httpUrl": "http://127.0.0.1:3003",
      "wsToken": "RSA:...",
      "httpToken": "RSA:..."
    },
    "qq9876543210": {
      "mode": "ws",
      "wsUrl": "ws://127.0.0.1:3002",
      "httpUrl": "http://127.0.0.1:3004",
      "wsToken": "RSA:...",
      "httpToken": "RSA:..."
    }
  },
  "activeBot": "qq1234567890",
  "napCatDir": "C:\\NapCat.Shell",
  "napCatWorkRoot": "C:\\NapCat.Shell\\instances"
}
```

WS 和 HTTP 的 Token 独立配置（NapCat 中两者可以不同）。
旧版 `accessToken` 格式会自动迁移，同时赋值给 `wsToken` 和 `httpToken`。

### 定时任务文件

每个 Bot 拥有独立的定时任务文件：
- `default` Bot → `schedules.json`
- 其他 Bot → `schedules_<名称>.json`

### 日志文件

运行时自动创建 `logs/` 目录，包含以下日志文件：

| 文件 | 内容 | 级别 |
|------|------|------|
| `logs/qqbot-fire.log` | 主日志（所有模块） | DEBUG 及以上 |
| `logs/qqbot-fire-error.log` | 错误日志（单独提取） | WARN 及以上 |
| `logs/web-api.log` | Web API 请求日志 | DEBUG 及以上 |

日志按天自动滚动归档（`.log.gz`），主日志保留 30 天，超过 50MB 也会滚动。

```bash
# 实时查看主日志
tail -f logs/qqbot-fire.log

# 只看错误
tail -f logs/qqbot-fire-error.log

# 只看 Web API 请求
tail -f logs/web-api.log

# 搜索关键词
grep "NapCat" logs/qqbot-fire.log
grep "ERROR" logs/qqbot-fire-error.log
```

## 项目结构

```
src/
├── Main.java                          # 入口
├── onebot/
│   ├── client/
│   │   ├── ApiProvider.java           # API 提供者接口
│   │   ├── BotInstance.java           # Bot 实例数据类 (多开)
│   │   ├── OneBotClient.java          # 高层 API 客户端 (160+ 方法)
│   │   ├── OneBotConnection.java      # WebSocket 连接 (echo 请求-响应匹配)
│   │   ├── OneBotHttpConnection.java  # HTTP 连接 (标准 + Debug API 自动探测)
│   │   └── OneBotException.java       # 异常
│   ├── console/
│   │   └── BotConsole.java            # 交互式控制台 (多实例管理)
│   ├── napcat/
│   │   ├── NapCatLauncher.java        # NapCat 进程管理 (Windows + Linux)
│   │   ├── NapCatOutputReader.java    # 实时日志读取 (环形缓冲 + 监听器)
│   │   └── NapCatConfigDiscovery.java # NapCat 配置自动发现 (onebot11_*.json)
│   ├── event/
│   │   ├── OneBotEvent.java           # 通用事件模型
│   │   └── EventType.java             # 事件类型常量
│   ├── handler/
│   │   ├── EventHandler.java          # 处理器接口
│   │   ├── EventDispatcher.java       # 事件分发器 (责任链)
│   │   ├── CommandHandler.java        # Bot 命令处理 (/help /ping /status)
│   │   └── LogHandler.java            # 消息日志记录
│   ├── message/
│   │   ├── MessageSegment.java        # 消息段 (text/image/at/reply 等)
│   │   └── MessageBuilder.java        # 链式消息构建器
│   ├── model/                         # 数据模型 (10 个)
│   ├── scheduler/
│   │   └── ScheduleManager.java       # NTP 精确定时调度器 (per-bot)
│   ├── web/
│   │   ├── WebConsoleServer.java      # 内嵌 HTTP 服务器 (JDK HttpServer)
│   │   └── WebApiHandler.java         # REST API 处理器 (30+ 端点)
│   ├── config/
│   │   └── ConfigManager.java         # 配置持久化 (config.json)
│   └── util/
│       ├── GsonFactory.java           # Gson 实例工厂
│       ├── ConvertUtil.java           # 通用类型转换工具
│       ├── CryptoUtil.java            # RSA 加解密 (线程安全)
│       └── NtpUtil.java               # NTP 时间同步
resources/
├── log4j2.xml                         # 日志配置 (分级输出 + 按天滚动)
└── web/                               # Web UI 构建产物（由 web-ui/ 生成，勿直接编辑）
web-ui/                                    # React SPA 前端项目
├── src/                               # React + TypeScript 源码
├── package.json                       # npm run dev / build / deploy
└── vite.config.ts                     # Vite 配置 (/api 代理到 :8080)
logs/                                      # 运行时自动创建
├── qqbot-fire.log                     # 主日志
├── qqbot-fire-error.log               # 错误日志
└── web-api.log                        # Web API 日志
scripts/
├── napcat-instance.bat                # NapCat 单实例启动 (Windows)
├── napcat-instance.sh                 # NapCat 单实例启动 (Linux)
├── napcat-multi.bat                   # NapCat 批量多开 (Windows)
└── napcat-multi.sh                    # NapCat 批量多开 (Linux)
lib/                                       # 手动编译用 (Gradle 自动拉取依赖)
├── log4j-api-2.24.3.jar
├── log4j-core-2.24.3.jar
└── gson-2.12.1.jar
```

## 架构

```
                    ┌─────────────────────────────┐
                    │        BotConsole            │
                    │    (交互式控制台, 多实例)      │
                    └────────┬────────────────────┘
                             │
     ┌───────────────────────┼──────────────────────┐
     │                       │                      │
 ┌───▼───────────┐  ┌───────▼────────┐  ┌──────────▼──────┐
 │WebConsoleServer│  │ NapCatLauncher │  │ ScheduleManager │
 │(HTTP/REST API) │  │ (NapCat 进程)  │  │ (per-bot 定时)  │
 └───────────────┘  └────────────────┘  └─────────────────┘
         │
 ┌───────▼────────┐
 │ BotInstance[]  │
 │ (多个 Bot)     │
 └────────┬───────┘
          │
 ┌────────▼───────┐
 │ OneBotClient   │
 │ (160+ API 方法) │
 └────────┬───────┘
          │
 ┌────────▼────────────────────┐
 │       ApiProvider           │
 ├─────────────┬───────────────┤
 │ WebSocket   │    HTTP       │
 │ (echo匹配)   │ (自动探测)    │
 └─────────────┴───────────────┘
          │
 ┌────────▼────────────────────┐
 │  NapCat × N                 │
 │  (多个 QQ Bot 实例)          │
 └─────────────────────────────┘
```

## API 覆盖

`OneBotClient` 提供 160+ typed wrapper 方法，完整覆盖：

| 分类 | 端点数 | 说明 |
|------|--------|------|
| OneBot 11 标准 | 39 | 消息收发、好友/群管理、系统信息等 |
| NapCat 消息扩展 | ~15 | 转发消息、已读标记、消息历史 |
| NapCat 好友扩展 | ~10 | 分类好友、单向好友、最近联系人 |
| NapCat 群组扩展 | ~25 | 群详情、群搜索、群相册、群公告 |
| NapCat 群文件 | ~15 | 文件上传/下载/管理/文件夹 |
| NapCat 精华消息 | 3 | 设置/删除/获取精华消息 |
| NapCat 表情扩展 | 4 | 表情点赞/获取 |
| NapCat 个人资料 | ~8 | 头像/资料/在线状态/输入状态 |
| NapCat AI 语音 | 3 | AI 角色列表、语音生成/发送 |
| NapCat Ark 分享 | 5 | 群/用户 Ark 分享、小程序 Ark |
| NapCat 收藏/闪传 | ~10 | 创建收藏、闪传任务/文件 |
| NapCat 在线文件 | 6 | 发送/接收/拒绝/取消在线文件 |
| NapCat 系统杂项 | ~15 | RKey、戳一戳、数据包、机型等 |
| NapCat 流式传输 | 6 | 文件/语音/图片流式上传下载 |

即使没有 typed wrapper，插件也可通过 `callApi("action", params)` 调用任意 API。

## 扩展开发

实现 `EventHandler` 接口即可添加自定义消息处理：

```java
public class MyHandler implements EventHandler {
    private final OneBotClient bot;

    public MyHandler(OneBotClient bot) {
        this.bot = bot;
    }

    @Override
    public boolean handle(OneBotEvent event) {
        if (event.isGroupMessage() && event.getPlainText().contains("你好")) {
            bot.sendGroupMsg(event.getGroupId(), "你好！");
            return true;
        }
        return false;
    }
}
```

## 致谢

- [NapCat](https://napneko.github.io/) — QQ Bot 框架
- [OneBot 11](https://github.com/botuniverse/onebot-11) — 标准化 Bot 协议

## 未来计划

- [ ] **NapCat 隐匿模式** — 反检测机制，让 Bot 行为更接近真人
- [ ] **插件系统** — 热加载 `.jar` 插件，运行时启停
- [ ] **权限管理** — 基于角色的命令权限控制
- [ ] **持久化升级** — SQLite 存储消息记录与调度任务
- [x] **Web 管理面板** — 浏览器端配置与监控 Dashboard（已完成）
- [ ] **群管工具集** — 自动审批、关键词过滤、违规计数
- [ ] **AI 对话集成** — 接入 LLM 实现智能聊天

## License

MIT
