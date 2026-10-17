import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { resolve } from "node:path";
import { stat } from "node:fs/promises";
import {
  PasswordSchema,
  ChangePasswordSchema,
  ok,
  managementRoutes,
} from "@qqbot/contracts";
import {
  JsonStore,
  acquireDataLock,
} from "./infrastructure/storage/json-store.js";
import {
  normalizeConfig,
  defaultConfig,
} from "./infrastructure/storage/config.js";
import { loadJwtSecret, loadRsa } from "./infrastructure/crypto/keys.js";
import { AuthService } from "./modules/auth/service.js";
import { ApiError } from "./http/errors.js";
import { BotService } from "./modules/bots/service.js";
import { registerBotRoutes } from "./modules/bots/routes.js";
import { registerLogRoutes } from "./modules/logs/routes.js";
import { NapCatService, type NapCatMode } from "./modules/napcat/service.js";
import { CalibratedClock } from "./infrastructure/clock/sntp.js";
import {
  ConsoleService,
  type ConsoleRuntime,
} from "./modules/console/service.js";
import { registerConsoleRoutes } from "./modules/console/routes.js";
import {
  ScheduleService,
  type ScheduleServiceOptions,
} from "./modules/scheduler/service.js";
import { registerScheduleRoutes } from "./modules/scheduler/routes.js";
import { registerNapCatRoutes } from "./modules/napcat/routes.js";

export type AppOptions = {
  dataDir: string;
  logger?: boolean;
  staticDir?: string;
  napcatMode?: NapCatMode;
  consoleRuntime?: ConsoleRuntime;
  napcatDefaults?: { napcatDir: string; workRoot: string };
  napcatAutoStart?: boolean;
  scheduler?: ScheduleServiceOptions;
  ntpServers?: string[];
  ntpEnabled?: boolean;
};
export async function createApp(options: AppOptions) {
  const dataDir = resolve(options.dataDir);
  const release = await acquireDataLock(dataDir);
  const app = Fastify({
    logger:
      options.logger === false
        ? false
        : {
            redact: [
              "req.headers.authorization",
              "password",
              "oldPassword",
              "newPassword",
              "wsToken",
              "httpToken",
            ],
          },
    bodyLimit: 1024 * 1024,
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false } },
    trustProxy: false,
    routerOptions: { maxParamLength: 4096 },
  });
  try {
    const store = new JsonStore(dataDir);
    await store.recover();
    const config = normalizeConfig(
      await store.read("config.json", defaultConfig()),
    );
    if (
      Object.values(config.bots).some(
        (bot) =>
          bot.wsToken.startsWith("RSA:") || bot.httpToken.startsWith("RSA:"),
      )
    ) {
      const rsa = await loadRsa(dataDir);
      for (const bot of Object.values(config.bots)) {
        rsa.decrypt(bot.wsToken);
        rsa.decrypt(bot.httpToken);
      }
    }
    const auth = new AuthService(store, await loadJwtSecret(dataDir));
    app.addHook("onClose", release);
    app.setErrorHandler((error, request, reply) => {
      if (error instanceof ApiError) {
        if (error.retryAfter) reply.header("Retry-After", error.retryAfter);
        return reply
          .code(error.statusCode)
          .send({ ok: false, error: error.message });
      }
      const framework = error as {
        statusCode?: number;
        validation?: unknown;
        code?: string;
      };
      if (framework.validation || framework.statusCode === 400)
        return reply.code(400).send({ ok: false, error: "请求参数非法" });
      if (framework.statusCode === 413)
        return reply.code(413).send({ ok: false, error: "请求体过大" });
      request.log.error({ err: error }, "请求处理失败");
      return reply.code(500).send({ ok: false, error: "服务器内部错误" });
    });
    const publicAuth = new Set([
      "/api/auth/status",
      "/api/auth/setup",
      "/api/auth/login",
      "/api/auth/logout",
    ]);
    app.addHook("onRequest", async (request) => {
      const path = request.url.split("?")[0]!;
      if (
        (path === "/api" || path.startsWith("/api/")) &&
        !publicAuth.has(path)
      )
        await auth.authorize(request.headers.authorization);
    });
    app.get("/api/auth/status", async () =>
      ok({ initialized: await auth.initialized() }),
    );
    app.post<{ Body: { password: string } }>(
      "/api/auth/setup",
      { schema: { body: PasswordSchema } },
      async (request) => ok(await auth.setup(request.body.password)),
    );
    app.post<{ Body: { password: string } }>(
      "/api/auth/login",
      { schema: { body: PasswordSchema } },
      async (request) =>
        ok(await auth.login(request.body.password, request.ip)),
    );
    app.post<{ Body: { oldPassword: string; newPassword: string } }>(
      "/api/auth/change-password",
      { schema: { body: ChangePasswordSchema } },
      async (request) =>
        ok(
          await auth.changePassword(
            request.body.oldPassword,
            request.body.newPassword,
          ),
        ),
    );
    app.post("/api/auth/logout", async () => ok({ loggedOut: true }));
    const bots = new BotService(store);
    app.addHook("onClose", async () => {
      await bots.close();
    });
    if (options.napcatDefaults)
      await store.update(
        "config.json",
        (raw) => {
          const value = normalizeConfig(raw);
          value.napCatDir ||= options.napcatDefaults!.napcatDir;
          value.napCatWorkRoot ||= options.napcatDefaults!.workRoot;
          return value;
        },
        defaultConfig(),
      );
    const napcat = new NapCatService(store, bots, options.napcatMode);
    await napcat.validate();
    app.addHook("onClose", async () => {
      await napcat.close();
    });
    registerNapCatRoutes(app, napcat);
    if (options.napcatAutoStart && napcat.mode === "managed")
      for (const saved of await napcat.listSaved()) {
        if (saved.external) continue;
        try {
          await napcat.start(saved.name);
        } catch (error) {
          app.log.error(
            { err: error, instance: saved.name },
            "NapCat 恢复失败，可在管理页面重试",
          );
        }
      }
    const clock =
      options.scheduler?.clock ??
      (options.scheduler?.enabled && options.ntpEnabled !== false
        ? new CalibratedClock(options.ntpServers)
        : undefined);
    const schedules = new ScheduleService(store, bots, napcat, {
      ...options.scheduler,
      ...(clock ? { clock } : {}),
      onError: (error) => app.log.error({ err: error }, "调度执行失败"),
    });
    app.addHook("onClose", async () => {
      if (clock instanceof CalibratedClock) await clock.close();
      await schedules.close();
    });
    await schedules.initialize();
    registerScheduleRoutes(app, schedules);
    const consoleService = new ConsoleService(
      bots,
      schedules,
      napcat,
      options.consoleRuntime,
    );
    registerConsoleRoutes(app, consoleService);
    app.decorate("executeConsole", (line: string) =>
      consoleService.execute(line, "terminal"),
    );
    app.addHook("onClose", async () => {
      consoleService.close();
    });
    registerBotRoutes(app, bots, schedules);
    registerLogRoutes(app, dataDir);
    for (const [method, url, module] of managementRoutes) {
      if (
        module === "auth" ||
        module === "bots" ||
        module === "logs" ||
        module === "napcat" ||
        module === "scheduler" ||
        module === "console"
      )
        continue;
      app.route({
        method,
        url,
        handler: async () => {
          throw new ApiError(501, "此接口尚未迁移：" + module);
        },
      });
    }
    app.get("/health", async () => ({
      status: "ok",
      implementation: "typescript",
      scheduling: schedules.enabled,
      timeZone: schedules.timeZone,
    }));
    if (
      options.staticDir &&
      (await stat(options.staticDir).catch(() => undefined))?.isDirectory()
    )
      await app.register(fastifyStatic, {
        root: resolve(options.staticDir),
        index: "index.html",
      });
    app.setNotFoundHandler((request, reply) =>
      reply
        .code(404)
        .send({ ok: false, error: "未知 API: " + request.url.split("?")[0] }),
    );
    await app.ready();
    if (clock instanceof CalibratedClock)
      clock.start(() => {
        void schedules
          .recalibrate()
          .catch((error) => app.log.error({ err: error }, "校时后重算失败"));
      });
    return app;
  } catch (error) {
    await app.close().catch(() => {});
    await release();
    throw error;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    executeConsole(line: string): Promise<string>;
  }
}
