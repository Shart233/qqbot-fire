import type { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { ScheduleTaskSchema, ok, type ScheduleTask } from "@qqbot/contracts";
import type { ScheduleService } from "./service.js";

export function registerScheduleRoutes(
  app: FastifyInstance,
  schedules: ScheduleService,
) {
  type Bot = { Params: { name: string } };
  type Task = { Params: { name: string; taskName: string } };
  const base = "/api/bots/:name/schedules";
  app.get<Bot>(base, async (req) => ok(await schedules.list(req.params.name)));
  app.post<Bot & { Body: ScheduleTask }>(
    base,
    { schema: { body: ScheduleTaskSchema } },
    async (req) => {
      await schedules.save(req.params.name, req.body);
      return ok({ message: "任务已添加" });
    },
  );
  app.put<Task & { Body: Omit<ScheduleTask, "name"> }>(
    base + "/:taskName",
    { schema: { body: Type.Omit(ScheduleTaskSchema, ["name"]) } },
    async (req) => {
      await schedules.save(
        req.params.name,
        { ...req.body, name: req.params.taskName },
        req.params.taskName,
      );
      return ok({ updated: req.params.taskName });
    },
  );
  app.delete<Task>(base + "/:taskName", async (req) => {
    await (await schedules.get(req.params.name)).remove(req.params.taskName);
    return ok({ deleted: req.params.taskName });
  });
  app.put<Task & { Body: { enabled: boolean } }>(
    base + "/:taskName/toggle",
    { schema: { body: Type.Object({ enabled: Type.Boolean() }) } },
    async (req) => {
      await (
        await schedules.get(req.params.name)
      ).setFlags(req.params.taskName, req.body);
      return ok({ task: req.params.taskName, enabled: req.body.enabled });
    },
  );
  app.put<Task & { Body: { autoConnect: boolean } }>(
    base + "/:taskName/autoconnect",
    { schema: { body: Type.Object({ autoConnect: Type.Boolean() }) } },
    async (req) => {
      await (
        await schedules.get(req.params.name)
      ).setFlags(req.params.taskName, req.body);
      return ok({
        task: req.params.taskName,
        autoConnect: req.body.autoConnect,
      });
    },
  );
  app.post<Task>(base + "/:taskName/test", async (req) => {
    await (await schedules.get(req.params.name)).trigger(req.params.taskName);
    return ok({ message: "任务已触发" });
  });
}
