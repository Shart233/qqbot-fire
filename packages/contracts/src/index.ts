import { Type, type Static } from "@sinclair/typebox";

export const IdentifierSchema = Type.String({
  pattern: "^[a-zA-Z0-9_-]{1,64}$",
});
export const SafeIdSchema = Type.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
});
export const PasswordSchema = Type.Object({
  password: Type.String({ minLength: 1 }),
});
export const ChangePasswordSchema = Type.Object({
  oldPassword: Type.String(),
  newPassword: Type.String(),
});
export const BotConfigSchema = Type.Object({
  name: IdentifierSchema,
  mode: Type.Union([Type.Literal("ws"), Type.Literal("http")]),
  wsUrl: Type.String(),
  httpUrl: Type.String(),
  wsToken: Type.String(),
  httpToken: Type.String(),
});
export type BotConfig = Static<typeof BotConfigSchema>;
export type BotInfo = BotConfig & {
  connected: boolean;
  userId: number | null;
  nickname: string | null;
};
export type BotListResponse = { bots: BotInfo[]; activeBot: string | null };
export const ScheduleTaskSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  time: Type.String({ pattern: "^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$" }),
  targets: Type.Array(SafeIdSchema, { minItems: 1 }),
  targetType: Type.Union([Type.Literal("group"), Type.Literal("private")]),
  message: Type.String(),
  enabled: Type.Optional(Type.Boolean()),
  autoConnect: Type.Optional(Type.Boolean()),
  autoStopAfterSend: Type.Optional(Type.Boolean()),
});
export type ScheduleTask = Static<typeof ScheduleTaskSchema>;
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
export function ok<T>(data: T): ApiResponse<T> {
  return { ok: true, data };
}
export { managementRoutes } from "./routes.js";
export const BotPatchSchema = Type.Partial(
  Type.Omit(BotConfigSchema, ["name"]),
);
export const AddBotSchema = Type.Object({ name: IdentifierSchema });
export const RenameBotSchema = Type.Object({ newName: IdentifierSchema });
export const SendMessageSchema = Type.Object({
  type: Type.Union([Type.Literal("private"), Type.Literal("group")]),
  target: SafeIdSchema,
  message: Type.String(),
});
export const PortSchema = Type.Integer({ minimum: 1, maximum: 65535 });
export const NapCatConfigPatchSchema = Type.Object({
  napCatDir: Type.Optional(Type.String()),
  workRoot: Type.Optional(Type.String()),
});
export const NapCatStartSchema = Type.Object({
  name: IdentifierSchema,
  qq: Type.Optional(Type.String({ pattern: "^[1-9][0-9]{0,15}$" })),
  webuiPort: Type.Optional(PortSchema),
});
export const NapCatNameSchema = Type.Object({ name: IdentifierSchema });
export const NapCatSavedPatchSchema = Type.Object({
  name: IdentifierSchema,
  qqUin: Type.Optional(Type.String({ pattern: "^[1-9][0-9]{0,15}$" })),
  webuiPort: Type.Optional(PortSchema),
});
export const ExternalNapCatSchema = Type.Object({
  name: IdentifierSchema,
  qqUin: Type.String({ pattern: "^[1-9][0-9]{0,15}$" }),
  webuiUrl: Type.String({ minLength: 1, maxLength: 2048 }),
  webuiToken: Type.String({ minLength: 1, maxLength: 4096 }),
  wsUrl: Type.Optional(Type.String()),
  httpUrl: Type.Optional(Type.String()),
  wsToken: Type.Optional(Type.String()),
  httpToken: Type.Optional(Type.String()),
});
export type ExternalNapCat = Static<typeof ExternalNapCatSchema>;
export type NapCatInstance = {
  external?: boolean;
  webuiUrl?: string;
  name: string;
  qqUin: string;
  wsPort: number;
  httpPort: number;
  webuiPort: number;
  webuiToken: string;
  workDir: string;
  pid: number;
  alive: boolean;
  saved: boolean;
};

export type * from "./management.js";
export type StoredScheduleTask = ScheduleTask & {
  enabled: boolean;
  autoConnect: boolean;
  autoStopAfterSend: boolean;
};
