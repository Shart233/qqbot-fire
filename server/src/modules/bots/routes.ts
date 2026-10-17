import type { FastifyInstance } from "fastify";
import {
  AddBotSchema,
  BotPatchSchema,
  RenameBotSchema,
  SendMessageSchema,
  ok,
  type BotConfig,
} from "@qqbot/contracts";
import { ApiError } from "../../http/errors.js";
import type { ScheduleService } from "../scheduler/service.js";
import { BotService } from "./service.js";

export function registerBotRoutes(
  app: FastifyInstance,
  bots: BotService,
  schedules: ScheduleService,
) {
  type Named = { Params: { name: string } };
  app.get("/api/bots", async () => ok(await bots.list()));
  app.post<{ Body: { name: string } }>(
    "/api/bots",
    { schema: { body: AddBotSchema } },
    async (req) => ok(await bots.add(req.body.name)),
  );
  app.delete<Named>("/api/bots/:name", async (req) =>
    ok(await schedules.removeBot(req.params.name)),
  );
  app.put<Named & { Body: { newName: string } }>(
    "/api/bots/:name/rename",
    { schema: { body: RenameBotSchema } },
    async (req) =>
      ok(await schedules.renameBot(req.params.name, req.body.newName)),
  );
  app.put<Named>("/api/bots/:name/active", async (req) =>
    ok(await bots.setActive(req.params.name)),
  );
  app.get<Named>("/api/bots/:name/config", async (req) =>
    ok(await bots.getConfig(req.params.name)),
  );
  app.put<Named & { Body: Partial<Omit<BotConfig, "name">> }>(
    "/api/bots/:name/config",
    { schema: { body: BotPatchSchema } },
    async (req) => ok(await bots.updateConfig(req.params.name, req.body)),
  );
  app.post<Named>("/api/bots/:name/config/clear", async (req) =>
    ok(await bots.clearConfig(req.params.name)),
  );
  app.post<Named>("/api/bots/:name/connect", async (req) =>
    ok(await bots.connect(req.params.name)),
  );
  app.post<Named>("/api/bots/:name/reconnect", async (req) =>
    ok(await bots.connect(req.params.name, true)),
  );
  app.post<Named>("/api/bots/:name/disconnect", async (req) =>
    ok(await bots.disconnect(req.params.name)),
  );
  app.get<Named>("/api/bots/:name/status", async (req) =>
    ok(await bots.status(req.params.name)),
  );
  app.get<Named>("/api/bots/:name/friends", async (req) =>
    ok(await bots.friends(req.params.name)),
  );
  app.get<Named>("/api/bots/:name/groups", async (req) =>
    ok(await bots.groups(req.params.name)),
  );
  app.get<{ Params: { name: string; groupId: string } }>(
    "/api/bots/:name/groups/:groupId/members",
    async (req) => {
      const groupId = Number(req.params.groupId);
      if (
        !/^\d+$/.test(req.params.groupId) ||
        !Number.isSafeInteger(groupId) ||
        groupId <= 0
      )
        throw new ApiError(400, "群号格式错误");
      return ok(await bots.members(req.params.name, groupId));
    },
  );
  app.post<
    Named & {
      Body: { type: "group" | "private"; target: number; message: string };
    }
  >(
    "/api/bots/:name/send",
    { schema: { body: SendMessageSchema } },
    async (req) =>
      ok(
        await bots.send(
          req.params.name,
          req.body.type,
          req.body.target,
          req.body.message,
        ),
      ),
  );
  app.post("/api/connect-all", async () => ok(await bots.connectAll()));
  app.post("/api/disconnect-all", async () => ok(await bots.disconnectAll()));
  app.post("/api/config/clear", async () => ok(await schedules.clearBots()));
}
