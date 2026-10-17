import type { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";
import { ok } from "@qqbot/contracts";
import type { ConsoleService } from "./service.js";
export function registerConsoleRoutes(
  app: FastifyInstance,
  console: ConsoleService,
) {
  app.post<{ Body: { command: string } }>(
    "/api/console/exec",
    {
      schema: {
        body: Type.Object({
          command: Type.String({ minLength: 1, pattern: "\\S" }),
        }),
      },
    },
    async (req) => ok({ output: await console.execute(req.body.command) }),
  );
}
