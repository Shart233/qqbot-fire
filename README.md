# QQBot-Fire

基于 NapCat / OneBot 11 的 QQ Bot 管理项目。默认使用 TypeScript 后端与 React 管理页面，支持多 Bot、扫码登录、定时消息、执行账本和管理员鉴权。

**默认 Docker 镜像同时包含项目、NapCat 和 Linux QQ，一个容器即可运行。** Java 代码和旧部署入口继续保留，用于迁移回退。

## Docker 启动

需要 Docker 与 Docker Compose。在仓库根目录执行：

```bash
docker compose up -d --build
docker compose logs -f qqbot-fire
```

打开 [管理页面](http://localhost:9988)，首次访问设置管理员密码。在「NapCat 管理」中填写实例名称和 QQ 号，启动后点击「扫码登录」。连接地址、随机 Token 和独立实例目录会自动生成，无需另外部署 NapCat 或手动开放它的端口。

默认只把管理页面绑定到本机。需要从其他机器访问时设置 `FIRE_BIND=0.0.0.0`，也可通过反向代理访问。主机端口由 `FIRE_PORT` 设置，默认 `9988`。

配置、密钥、任务、执行账本、日志以及 QQ 账号目录均保存在 `qqbot-fire-typescript-data` 卷中。重建容器保留数据，并自动恢复已保存的托管实例。不要使用 `docker compose down -v` 作为普通停止操作。

自动调度默认关闭。核对账号、任务和导入数据后，通过 `SCHEDULING_ENABLED=true` 启用并重建容器；不要同时运行新旧调度器。手动发送和手动测试任务会实际发送消息。

详见 [单容器部署](docs/migration/单容器部署.md)。

## 本机开发

固定使用 Node.js **24.21.0**，在仓库根目录安装依赖：

```bash
npm ci
npm run verify
npm run start:server
```

本机默认访问 `http://127.0.0.1:9989`，数据目录为 `data/typescript/`。Windows 与 WSL 应分别安装依赖，不要共用 `node_modules`。开发后端使用 `npm run dev:server`；前端开发使用 `npm --prefix web-ui run dev`，代理地址按实际后端端口设置。

本机托管 NapCat 需要安装相应平台的 QQ 和 NapCat。Linux 可直接采用同容器方案，或提供有效的 `napcat-run.sh` / `napcat.sh`；普通 Node 无法替代 Linux QQ 的 Shell 加载环境。Windows 可通过 `QQ_PATH` 指定 QQ.exe。

## 外部 NapCat

「NapCat 管理 → 添加外部实例」可以登记其他容器或主机上的 NapCat。填写后台能访问的 WebUI 地址、WebUI Token 及 OneBot 地址，即可在项目页面扫码，无需共享二维码文件。外部实例的启动与停止由其所在环境负责。

## 开发命令

| 命令 | 用途 |
|---|---|
| `npm run verify` | 后端类型检查、行为测试、构建，前端 lint、类型检查、构建及部署 |
| `npm run test:ui` | 浏览器回归，需要 Playwright 浏览器或 `CHROMIUM_PATH` |
| `npm run build:server` | 编译后端及共享包 |
| `npm --prefix web-ui run deploy:full` | 检查前端并更新构建产物 |
| `npm run import:legacy -- ...` | 检查并导入旧数据副本 |
| `npm run export:rollback -- ...` | 合并执行记录并导出 Java 回退副本 |
| `npm run backup:data -- ...` | 备份完整数据、账号与日志 |
| `npm run restore:data -- ...` | 校验完整备份并恢复到空目录 |

在本机终端运行时支持业务命令、实时日志接管、`/web start [端口]`、`/web stop` 和 `/quit`。关闭 Web 不会停止 Bot 或调度器。容器不依赖交互式终端。

## 目录

- `server/`：Fastify 后端、调度、NapCat、鉴权、控制台与存储。
- `packages/contracts/`：共享管理接口与参数校验。
- `packages/onebot/`：OneBot 传输、类型化客户端、消息与事件。
- `web-ui/`：React 管理页面。
- `src/`：保留的 Java 回退实现；`src/resources/web/` 为前端构建产物。
- `deploy/qqbot-fire.service`：本机 Linux 服务模板。

## 迁移与验证

- [运行、升级与回退](docs/migration/运行新服务.md)
- [单容器部署及备份恢复](docs/migration/单容器部署.md)
- [验证记录与尚未验收的项目](docs/migration/验证记录.md)
- [Java 旧版说明归档](docs/migration/Java旧版运行说明.md)

默认 Dockerfile 和 Compose 使用新后端。Java 回退使用 `Dockerfile.java` 和 `compose.java.yml`，轻量外部模式使用 `Dockerfile.typescript` 和 `compose.typescript.yml`。部署入口调整不会迁移或覆盖正在运行的原业务数据；正式切换前仍须停止旧服务、备份并核对最终副本。
