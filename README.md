# QQBot-Fire

> NapCat OneBot 11 Java Bot 客户端 — 纯 JDK 24，零框架依赖，内置 NapCat 多开管理

基于 [NapCat](https://napneko.github.io/) 的 OneBot 11 协议，通过 WebSocket / HTTP 双模式对接 QQ Bot。
支持同时运行多个 Bot 实例（双开/多开），并可直接从控制台启动和管理 NapCat 进程。

## 特性

- **多实例管理 (双开)** — 同时运行多个 QQ Bot，每个 Bot 独立配置、独立连接
- **NapCat 进程管理** — 从控制台直接启动/停止 NapCat 实例，自动生成配置和分配端口
- **双模式连接** — WebSocket（API + 事件）和 HTTP（标准 OneBot 11 + NapCat Debug API 自动探测）
- **交互式控制台** — `/` 命令配置、连接、发消息、管理定时任务
- **事件驱动架构** — EventDispatcher 责任链分发，自定义 Handler 扩展
- **NTP 精确定时** — 基于网络时间的定时消息调度器
- **安全存储** — RSA 2048 加密 Token，配置持久化
- **消息构建器** — 链式 API，支持 20+ 消息段类型
- **跨平台** — Windows + Linux，零框架依赖（纯 JDK 24 + Log4j2）

## 快速开始

### 环境要求

- JDK 24+
- NapCat 实例（已登录 QQ）— 或由本项目自动启动

### 编译运行

```bash
# 编译
javac -cp "lib/*" -d out -sourcepath src src/Main.java

# Windows
java -cp "out;lib/*;src/resources" Main

# Linux
java -cp "out:lib/*:src/resources" Main

# Linux 后台运行
nohup java -cp "out:lib/*:src/resources" Main > qqbot.log 2>&1 &
```

也可以直接用 IntelliJ IDEA 打开项目，运行 `Main.java`。

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

### 其他

| 命令 | 说明 |
|---|---|
| `/logout` | 退出 QQ 登录 |
| `/quit` | 退出程序（自动停止所有连接和 NapCat 实例） |
| `/help` | 显示帮助 |

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

## 项目结构

```
src/
├── Main.java                          # 入口
├── onebot/
│   ├── client/
│   │   ├── ApiProvider.java           # API 提供者接口
│   │   ├── BotInstance.java           # Bot 实例数据类 (多开)
│   │   ├── OneBotClient.java          # 高层 API 客户端 (60+ 方法)
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
│   └── util/
│       ├── JsonUtil.java              # 轻量 JSON 序列化/反序列化
│       ├── CryptoUtil.java            # RSA 加解密
│       └── NtpUtil.java               # NTP 时间同步
scripts/
├── napcat-instance.bat                # NapCat 单实例启动 (Windows)
├── napcat-instance.sh                 # NapCat 单实例启动 (Linux)
├── napcat-multi.bat                   # NapCat 批量多开 (Windows)
└── napcat-multi.sh                    # NapCat 批量多开 (Linux)
lib/
├── log4j-api-2.24.3.jar
└── log4j-core-2.24.3.jar
```

## 架构

```
                    ┌─────────────────────────────┐
                    │        BotConsole            │
                    │    (交互式控制台, 多实例)      │
                    └────────┬────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
 ┌────────▼──────┐  ┌───────▼────────┐  ┌──────▼───────────┐
 │ BotInstance[] │  │ NapCatLauncher │  │ ScheduleManager[]│
 │ (多个 Bot)    │  │ (NapCat 进程)  │  │ (per-bot 定时)   │
 └────────┬──────┘  └────────────────┘  └──────────────────┘
          │
 ┌────────▼───────┐
 │ OneBotClient   │
 │ (60+ API 方法)  │
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
- [ ] **Web 管理面板** — 浏览器端配置与监控 Dashboard
- [ ] **群管工具集** — 自动审批、关键词过滤、违规计数
- [ ] **AI 对话集成** — 接入 LLM 实现智能聊天

## License

MIT
