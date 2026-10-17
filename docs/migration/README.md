# TypeScript 迁移记录

本目录记录当前工作区的迁移基线，不把编译通过等同于完整兼容。Java 源码、已有改动和正式运行数据均保留；新服务使用独立数据目录和 9989 开发端口。

## 兼容盘点

- `onebot-methods.json`：当前 Java OneBotClient 公开签名逐项登记，状态为待迁移，不能用通用 call 方法冒充全部类型化 API 完成。
- `console-commands.json`：当前控制台顶层命令和子命令分派清单。
- `api-inventory.json`：逐端点方法、路径、模块及实现状态。
- `working-tree-baseline.txt`：实施前已有改动记录；不包含真实配置、密钥和日志。

## 已冻结策略

调度预热 4 分钟、连接失败间隔 3 分钟最多重试 2 次；启动只补发同日且不超过 23 小时；目标状态为 SENDING、SUCCESS、FAILED、UNKNOWN，崩溃恢复将 SENDING 转为 UNKNOWN；未决滞留 15 分钟，账本保留 14 天。调度器跨连接生命周期常驻，自动停止不能停止调度循环。

默认 Bot 任务/账本文件分别为 schedules.json、schedules_state.json，其他 Bot 使用 schedules_<名称>.json、schedules_state_<名称>.json。账本与任务不能按宽泛通配符混读。

管理员密码最低 10 位；连续 5 次失败锁定 15 分钟；JWT 有效期 7 天，只接受 HS256 和 admin 身份。新服务使用独立持久化会话版本，切换时管理员重新登录。退出保留旧版语义，仅由前端移除会话，不吊销所有会话。

名称遵循当前 Java 白名单：字母、数字、下划线、短横线，长度 1–64。中文名称是计划与实际源码的冲突项，当前不得悄悄放开文件名约束。

## 仍需外部验收

尚未对正式账号执行连接或发送。真实账号测试、Java 调度误差基线、旧 UI 基线截图、NapCat 实测版本及共享实例关系、Windows 原生/Docker 验收、两日调度观察和七天回退窗口必须单独留存证据。
