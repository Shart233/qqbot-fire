import type { FastifyInstance } from "fastify";
import {
  ok,
  ExternalNapCatSchema,
  type ExternalNapCat,
  NapCatConfigPatchSchema,
  NapCatStartSchema,
  NapCatNameSchema,
  NapCatSavedPatchSchema,
} from "@qqbot/contracts";
import type { NapCatService } from "./service.js";
export function registerNapCatRoutes(
  app: FastifyInstance,
  napcat: NapCatService,
) {
  app.put<{ Body: ExternalNapCat }>(
    "/api/napcat/external",
    { schema: { body: ExternalNapCatSchema } },
    async (req) => ok(await napcat.registerExternal(req.body)),
  );
  app.get("/api/napcat/config", async () => ok(await napcat.config()));
  app.put<{ Body: { napCatDir?: string; workRoot?: string } }>(
    "/api/napcat/config",
    { schema: { body: NapCatConfigPatchSchema } },
    async (req) => ok(await napcat.updateConfig(req.body)),
  );
  app.post<{ Body: { name: string; qq?: string; webuiPort?: number } }>(
    "/api/napcat/start",
    { schema: { body: NapCatStartSchema } },
    async (req) =>
      ok(await napcat.start(req.body.name, req.body.qq, req.body.webuiPort)),
  );
  app.post<{ Body: { name: string } }>(
    "/api/napcat/stop",
    { schema: { body: NapCatNameSchema } },
    async (req) => ok(await napcat.stop(req.body.name)),
  );
  app.get("/api/napcat/instances", async () => ok(await napcat.list()));
  app.get("/api/napcat/saved", async () => ok(await napcat.listSaved()));
  app.put<{ Body: { name: string; qqUin?: string; webuiPort?: number } }>(
    "/api/napcat/saved",
    { schema: { body: NapCatSavedPatchSchema } },
    async (req) => {
      const { name, ...patch } = req.body;
      return ok(await napcat.updateSaved(name, patch));
    },
  );
  app.post<{ Body: { name: string } }>(
    "/api/napcat/forget",
    { schema: { body: NapCatNameSchema } },
    async (req) => ok(await napcat.forget(req.body.name)),
  );
  app.post("/api/napcat/discover", async () => ok(await napcat.discover()));
  app.get<{ Params: { name: string } }>(
    "/api/napcat/instances/:name/log",
    async (req) => ok(napcat.log(req.params.name)),
  );
  app.get<{ Params: { name: string } }>(
    "/api/napcat/instances/:name/login",
    async (req, reply) => {
      reply.header("Cache-Control", "no-store");
      return ok(await napcat.login(req.params.name));
    },
  );
  app.post<{ Params: { name: string } }>(
    "/api/napcat/instances/:name/login/refresh",
    async (req, reply) => {
      reply.header("Cache-Control", "no-store");
      return ok(await napcat.refresh(req.params.name));
    },
  );
}
