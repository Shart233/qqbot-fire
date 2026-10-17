import { IdentifierSchema } from "@qqbot/contracts";
import { Value } from "@sinclair/typebox/value";

export type StoredBot = {
  mode: "ws" | "http";
  wsUrl: string;
  httpUrl: string;
  wsToken: string;
  httpToken: string;
  napCatInstanceName?: string;
  qqUin?: string;
};
export type Config = {
  bots: Record<string, StoredBot>;
  activeBot: string | null;
  napCatDir?: string;
  napCatWorkRoot?: string;
  admin?: { passwordHash: string; sessionVersion: number };
};
export const emptyBot = (): StoredBot => ({
  mode: "ws",
  wsUrl: "ws://127.0.0.1:3001",
  httpUrl: "http://127.0.0.1:6099",
  wsToken: "",
  httpToken: "",
});
export const defaultConfig = (): Config => ({
  bots: { default: emptyBot() },
  activeBot: "default",
});

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("数据格式应为对象");
  return value as Record<string, unknown>;
}
function text(value: unknown, fallback = ""): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") throw new Error("配置字符串字段格式错误");
  return value;
}
export function normalizeConfig(input: unknown): Config {
  const raw = object(input);
  const rawBots = raw.bots === undefined ? { default: raw } : object(raw.bots);
  const bots: Record<string, StoredBot> = Object.create(null) as Record<
    string,
    StoredBot
  >;
  for (const [name, value] of Object.entries(rawBots)) {
    if (!Value.Check(IdentifierSchema, name)) throw new Error("Bot 名称非法");
    const bot = object(value);
    const mode = text(bot.mode, "ws");
    if (mode !== "ws" && mode !== "http") throw new Error("连接模式非法");
    const legacy = text(bot.accessToken);
    bots[name] = {
      mode,
      wsUrl: text(bot.wsUrl, emptyBot().wsUrl),
      httpUrl: text(bot.httpUrl, emptyBot().httpUrl),
      wsToken: text(bot.wsToken) || legacy,
      httpToken: text(bot.httpToken) || legacy,
    };
    if (bot.napCatInstanceName !== undefined)
      bots[name].napCatInstanceName = text(bot.napCatInstanceName);
    if (bot.qqUin !== undefined) bots[name].qqUin = text(bot.qqUin);
  }
  const active = text(raw.activeBot);
  const config: Config = {
    bots,
    activeBot: Object.hasOwn(bots, active)
      ? active
      : (Object.keys(bots)[0] ?? null),
  };
  if (raw.napCatDir !== undefined) config.napCatDir = text(raw.napCatDir);
  if (raw.napCatWorkRoot !== undefined)
    config.napCatWorkRoot = text(raw.napCatWorkRoot);
  if (raw.admin !== undefined) {
    const admin = object(raw.admin);
    const passwordHash = text(admin.passwordHash);
    if (
      passwordHash &&
      !/^\$2[aby]\$\d\d\$[./a-zA-Z0-9]{53}$/.test(passwordHash)
    )
      throw new Error("管理员 BCrypt 哈希损坏");
    const sessionVersion = admin.sessionVersion ?? 0;
    if (!Number.isSafeInteger(sessionVersion) || (sessionVersion as number) < 0)
      throw new Error("会话版本非法");
    if (passwordHash)
      config.admin = { passwordHash, sessionVersion: sessionVersion as number };
  }
  return config;
}
