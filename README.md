# QQBot-Fire

> NapCat OneBot 11 Java Bot 客户端 — 纯 JDK 24，零框架依赖

基于 [NapCat](https://napneko.github.io/) 的 OneBot 11 协议，通过 WebSocket / HTTP 双模式对接 QQ Bot。

## 特性

- **双模式连接** — WebSocket（参照 [NapLink](https://github.com/aspect-build/naplink) 架构）和 HTTP（NapCat Debug API）
- **交互式控制台** — `/` 命令配置、连接、发消息、管理定时任务
- **事件驱动架构** — EventDispatcher 责任链分发，自定义 Handler 扩展
- **NTP 精确定时** — 基于网络时间的定时消息调度器
- **安全存储** — RSA 2048 加密 Token，配置持久化
- **消息构建器** — 链式 API，支持 20+ 消息段类型
- **零框架依赖** — 纯 JDK 24 + Log4j2，无 Maven/Gradle

## 快速开始

### 环境要求

- JDK 24+
- NapCat 实例（已登录 QQ）

### 运行

```bash
# IntelliJ IDEA 直接运行 Main.java
# 或命令行编译运行:
javac -cp "lib/*" -d out -sourcepath src src/Main.java
java -cp "out;lib/*;src/resources" Main
```

### 首次配置

```
> /set mode http
> /set http http://127.0.0.1:6099
> /set token your_access_token
> /connect
登录成功 — QQ: 123456, 昵称: MyBot
```

配置自动保存到 `config.json`，下次启动无需重复设置。

## 控制台命令

| 命令 | 说明 |
|---|---|
| `/set mode <ws\|http>` | 切换连接模式 |
| `/set ws <url>` | 设置 WebSocket 地址 |
| `/set http <url>` | 设置 HTTP API 地址 |
| `/set token <token>` | 设置 Access Token |
| `/show` | 显示当前配置 |
| `/connect` | 连接 Bot |
| `/disconnect` | 断开连接 |
| `/status` | 查看 Bot 状态 |
| `/send group <群号> <消息>` | 发送群消息 |
| `/send private <QQ> <消息>` | 发送私聊消息 |
| `/friends` | 获取好友列表 |
| `/groups` | 获取群列表 |
| `/members <群号>` | 获取群成员列表 |
| `/schedule add <名称> <HH:mm> <QQ,...> <消息>` | 添加定时任务 |
| `/schedule list` | 查看定时任务 |
| `/schedule test <名称>` | 立即测试执行 |
| `/logout` | 退出 QQ 登录 |
| `/quit` | 退出程序 |

## 项目结构

```
src/
├── Main.java                          # 入口
├── onebot/
│   ├── client/
│   │   ├── ApiProvider.java           # API 提供者接口
│   │   ├── OneBotClient.java          # 高层 API 客户端 (60+ 方法)
│   │   ├── OneBotConnection.java      # WebSocket 连接 (echo 请求-响应匹配)
│   │   ├── OneBotHttpConnection.java  # HTTP 连接 (NapCat Debug API)
│   │   └── OneBotException.java       # 异常
│   ├── console/
│   │   └── BotConsole.java            # 交互式控制台
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
│   │   └── ScheduleManager.java       # NTP 精确定时调度器
│   └── util/
│       ├── JsonUtil.java              # 轻量 JSON 序列化/反序列化
│       ├── CryptoUtil.java            # RSA 加解密
│       └── NtpUtil.java               # NTP 时间同步
lib/
├── log4j-api-2.24.3.jar
└── log4j-core-2.24.3.jar
```

## 架构

```
                    ┌─────────────────────────┐
                    │      BotConsole          │
                    │   (交互式控制台)          │
                    └────────┬────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───────┐  ┌──▼───────┐  ┌──▼──────────┐
     │ OneBotClient   │  │ Schedule │  │ Command     │
     │ (60+ API 方法)  │  │ Manager  │  │ Handler     │
     └────────┬───────┘  └──────────┘  └─────────────┘
              │
     ┌────────▼────────────────────┐
     │       ApiProvider           │
     ├─────────────┬───────────────┤
     │ WebSocket    │    HTTP       │
     │ (echo匹配)   │ (Debug API)   │
     └─────────────┴───────────────┘
              │
     ┌────────▼───────┐
     │   NapCat        │
     │  (QQ Bot 框架)   │
     └────────────────┘
```

## 连接模式对比

| | WebSocket | HTTP |
|---|---|---|
| API 调用 | `{action, params, echo}` 通过 WS | POST Debug API |
| 事件接收 | 实时推送 | 不支持 |
| Token | URL query `?access_token=xxx` | Header `Bearer "xxx"` |
| 自动重连 | 支持 | 无状态 |

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
- [NapLink](https://github.com/aspect-build/naplink) — WebSocket SDK 架构参考
- [OneBot 11](https://github.com/botuniverse/onebot-11) — 标准化 Bot 协议

## License

MIT
