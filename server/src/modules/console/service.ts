import type { BotService } from "../bots/service.js";
import type { ScheduleService } from "../scheduler/service.js";
import type { NapCatService } from "../napcat/service.js";
import { ApiError } from "../../http/errors.js";

const help = `QQBot-Fire 控制台
/bot add|remove|list|use|rename 管理 Bot
/set mode|ws|http|wstoken|httptoken <值>
/show 查看配置；/config clear [Bot名称]
/connect /disconnect /reconnect /connectall /disconnectall
/status /friends /groups /members <群号>
/send group|private <号码> <消息>
/schedule list|add|remove|on|off|test|autostart 定时任务
/napcat dir|workroot|start|stop|list|memory|forget|log|discover
/logout 退出当前 QQ 登录；/web 查看服务状态`;
function split(input: string, count = 2): string[] {
  const result: string[] = [];
  let rest = input.trim();
  while (result.length < count - 1 && rest) {
    const match = /^(\S+)(?:\s+([\s\S]*))?$/.exec(rest)!;
    result.push(match[1]!);
    rest = match[2] ?? "";
  }
  if (rest) result.push(rest);
  return result;
}
const format = (value: unknown) =>
  typeof value === "string" ? value : JSON.stringify(value, null, 2);
function id(input: string | undefined) {
  const value = Number(input);
  if (
    !input ||
    !/^\d+$/.test(input) ||
    !Number.isSafeInteger(value) ||
    value <= 0
  )
    throw new ApiError(400, "号码必须为正安全整数");
  return value;
}
function requireArg(input: string | undefined, usage: string): string {
  if (!input) throw new ApiError(400, "用法: " + usage);
  return input;
}
export type ConsoleRuntime = {
  startWeb: (port?: number) => Promise<string>;
  stopWeb: () => Promise<string>;
  webStatus: () => string;
  quit: () => void;
  output: (line: string) => void;
};
export class ConsoleService {
  private detach: (() => void) | undefined;
  private queue: Promise<unknown> = Promise.resolve();
  constructor(
    private readonly bots: BotService,
    private readonly schedules: ScheduleService,
    private readonly napcat: NapCatService,
    private readonly runtime?: ConsoleRuntime,
  ) {}
  execute(line: string, source: "web" | "terminal" = "web"): Promise<string> {
    const work = this.queue
      .catch(() => {})
      .then(async () => {
        try {
          return (await this.run(line.trim(), source)) + "\n";
        } catch (error) {
          return (
            "命令执行失败: " +
            (error instanceof Error ? error.message : "未知错误") +
            "\n"
          );
        }
      });
    this.queue = work;
    return work;
  }
  close() {
    this.detach?.();
    this.detach = undefined;
  }
  private async active() {
    const name = (await this.bots.list()).activeBot;
    if (!name) throw new ApiError(400, "请先添加 Bot");
    return name;
  }
  private async run(line: string, source: "web" | "terminal"): Promise<string> {
    if (!line.startsWith("/")) return "命令需以 / 开头";
    const [cmd = "", rest = ""] = split(line.slice(1));
    const [sub = "", args = ""] = split(rest);
    const command = cmd.toLowerCase();
    switch (command) {
      case "help":
      case "h":
        return help;
      case "show":
        return format(await this.bots.list());
      case "bot":
      case "b": {
        switch (sub.toLowerCase()) {
          case "add":
          case "new": {
            const name = requireArg(args, "/bot add <名称>");
            await this.bots.add(name);
            await this.bots.setActive(name);
            return "已添加并切换 Bot: " + name;
          }
          case "remove":
          case "rm":
          case "del":
            await this.schedules.removeBot(
              requireArg(args, "/bot remove <名称>"),
            );
            return "已删除 Bot: " + args;
          case "list":
          case "ls":
            return format(await this.bots.list());
          case "use":
          case "switch":
          case "sw":
            await this.bots.setActive(requireArg(args, "/bot use <名称>"));
            return "当前 Bot: " + args;
          case "rename": {
            const [from, to] = split(args);
            await this.schedules.renameBot(
              requireArg(from, "/bot rename <旧名称> <新名称>"),
              requireArg(to, "/bot rename <旧名称> <新名称>"),
            );
            return "已重命名: " + to;
          }
          default:
            return "用法: /bot add|remove|list|use|rename";
        }
      }
      case "set": {
        const name = await this.active();
        const value = requireArg(args, "/set <配置项> <值>").replace(
          /^"([\s\S]*)"$/,
          "$1",
        );
        const fields = {
          ws: "wsUrl",
          http: "httpUrl",
          wstoken: "wsToken",
          httptoken: "httpToken",
        } as const;
        if (sub === "mode") {
          if (value !== "ws" && value !== "http")
            throw new ApiError(400, "模式只能是 ws 或 http");
          await this.bots.updateConfig(name, { mode: value });
        } else if (sub in fields)
          await this.bots.updateConfig(name, {
            [fields[sub as keyof typeof fields]]: value,
          });
        else return "未知配置项，可用: mode, ws, http, wstoken, httptoken";
        return "[" + name + "] 配置已保存";
      }
      case "config":
        if (sub !== "clear") return "用法: /config clear [Bot名称]";
        if (args) await this.bots.clearConfig(args);
        else await this.schedules.clearBots();
        return "配置已清除";
      case "connect":
      case "c":
        await this.bots.connect(await this.active());
        return "已连接";
      case "disconnect":
      case "dc":
        await this.bots.disconnect(await this.active());
        return "已断开";
      case "reconnect":
      case "rc":
        await this.bots.connect(await this.active(), true);
        return "已重连";
      case "connectall":
      case "ca":
        return format(await this.bots.connectAll());
      case "disconnectall":
      case "dca":
        return format(await this.bots.disconnectAll());
      case "status":
      case "s":
        return format(await this.bots.status(await this.active()));
      case "friends":
        return format(await this.bots.friends(await this.active()));
      case "groups":
        return format(await this.bots.groups(await this.active()));
      case "members":
        return format(await this.bots.members(await this.active(), id(rest)));
      case "send": {
        const [target, message] = split(args);
        const type =
          sub === "group" || sub === "g"
            ? "group"
            : sub === "private" || sub === "p"
              ? "private"
              : undefined;
        if (!type) return "用法: /send group|private <号码> <消息>";
        return format(
          await this.bots.send(
            await this.active(),
            type,
            id(target),
            requireArg(message, "/send <类型> <号码> <消息>"),
          ),
        );
      }
      case "schedule":
      case "sch":
        return this.schedule(sub, args);
      case "napcat":
      case "nc":
        return this.napcatCommand(sub, args, source);
      case "logout":
        await this.bots.call(await this.active(), "bot_exit");
        return "已发送 QQ 退出登录请求";
      case "web":
        if (source === "terminal" && this.runtime) {
          if (sub === "stop") return this.runtime.stopWeb();
          if (sub === "start") {
            const port = args ? id(args) : undefined;
            if (port && port > 65535)
              throw new ApiError(400, "端口必须在 1 至 65535 之间");
            return this.runtime.startWeb(port);
          }
          return this.runtime.webStatus();
        }
        return sub === "stop"
          ? "请通过服务管理器或终端关闭服务；Web 控制台不关闭自身连接"
          : "Web 控制台正在运行，监听地址由 HOST 和 PORT 配置";
      case "quit":
      case "exit":
      case "q":
        if (source === "terminal" && this.runtime) {
          this.runtime.quit();
          return "正在关闭服务";
        }
        return "Web 控制台不支持 /quit 命令；请在运行服务的终端关闭";
      default:
        return "未知命令: /" + command + "，输入 /help 查看帮助";
    }
  }
  private async schedule(sub: string, args: string) {
    const bot = await this.active(),
      scheduler = await this.schedules.get(bot);
    switch (sub.toLowerCase()) {
      case "list":
      case "ls":
        return format(await scheduler.list());
      case "add": {
        const [name, time, type, targets, message] = split(args, 5);
        if (type !== "group" && type !== "private")
          throw new ApiError(400, "目标类型必须是 group 或 private");
        await scheduler.upsert({
          name: requireArg(
            name,
            "/schedule add <名称> <HH:mm> <类型> <号码,...> <消息>",
          ),
          time: requireArg(time, "/schedule add"),
          targetType: type,
          targets: requireArg(targets, "/schedule add").split(",").map(id),
          message: requireArg(message, "/schedule add"),
        });
        return "定时任务已添加: " + name;
      }
      case "remove":
      case "rm":
        await scheduler.remove(requireArg(args, "/schedule remove <名称>"));
        return "任务已删除: " + args;
      case "on":
      case "off":
        await scheduler.setFlags(requireArg(args, "/schedule on|off <名称>"), {
          enabled: sub === "on",
        });
        return "任务已" + (sub === "on" ? "启用" : "禁用");
      case "test":
        await scheduler.trigger(requireArg(args, "/schedule test <名称>"));
        return "任务已触发";
      case "autostart": {
        const [name, toggle] = split(args);
        if (!toggle)
          return format(
            (await scheduler.list()).find((task) => task.name === name) ??
              "任务不存在",
          );
        await scheduler.setFlags(
          requireArg(name, "/schedule autostart <名称> [on|off]"),
          { autoConnect: ["on", "true", "1"].includes(toggle) },
        );
        return "自动连接已更新";
      }
      default:
        return "用法: /schedule list|add|remove|on|off|test|autostart";
    }
  }
  private async napcatCommand(
    sub: string,
    args: string,
    source: "web" | "terminal",
  ) {
    switch (sub.toLowerCase()) {
      case "dir":
      case "workroot":
        if (!args) return format(await this.napcat.config());
        await this.napcat.updateConfig(
          sub === "dir" ? { napCatDir: args } : { workRoot: args },
        );
        return "NapCat 路径已保存";
      case "start": {
        const [name, qq, port] = split(args, 3);
        return format(
          await this.napcat.start(
            requireArg(name, "/napcat start <名称> [QQ号] [端口]"),
            qq,
            port ? id(port) : undefined,
          ),
        );
      }
      case "stop":
        return format(
          await this.napcat.stop(requireArg(args, "/napcat stop <名称|all>")),
        );
      case "list":
      case "ls":
        return format(
          (await this.napcat.list()).map(
            ({ webuiToken: _secret, ...item }) => item,
          ),
        );
      case "memory":
      case "mem":
        return format(await this.napcat.listSaved());
      case "forget":
        return format(
          await this.napcat.forget(
            requireArg(args, "/napcat forget <名称|all>"),
          ),
        );
      case "attach":
      case "a":
        if (source === "terminal" && this.runtime) {
          const name = requireArg(args, "/napcat attach <名称>");
          const detach = this.napcat.subscribe(name, (line) =>
            this.runtime!.output(`[${name}] ${line}\n`),
          );
          this.detach?.();
          this.detach = detach;
          return (
            "已接管实时日志，输入 /napcat detach 退出\n" +
            this.napcat.log(name).lines.slice(-30).join("\n")
          );
        }
      case "log":
        return this.napcat
          .log(requireArg(args, "/napcat log <名称>"))
          .lines.slice(-30)
          .join("\n");
      case "detach":
      case "d":
        this.detach?.();
        this.detach = undefined;
        return "日志快照已结束；实时日志请打开 NapCat 日志页面";
      case "discover":
        return format(await this.napcat.discover());
      default:
        return "用法: /napcat dir|workroot|start|stop|list|memory|forget|log|discover";
    }
  }
}
