import type { FastifyInstance } from "fastify";
import { readdir, lstat, open } from "node:fs/promises";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { constants } from "node:fs";
import { ok } from "@qqbot/contracts";
import { ApiError } from "../../http/errors.js";

export function registerLogRoutes(app: FastifyInstance, dataDir: string) {
  const logDir = join(dataDir, "logs");
  app.get("/api/logs/list", async () => {
    let names: string[];
    try {
      names = await readdir(logDir);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return ok([]);
      throw error;
    }
    const files = await Promise.all(
      names
        .sort()
        .filter((name) => name.endsWith(".log"))
        .map(async (name) => {
          const stat = await lstat(join(logDir, name));
          return stat.isFile() && !stat.isSymbolicLink()
            ? { name, size: stat.size, modified: stat.mtimeMs }
            : null;
        }),
    );
    return ok(files.filter((file) => file !== null));
  });
  app.get<{ Querystring: { file?: string; lines?: string } }>(
    "/api/logs/read",
    async (req) => {
      const name = req.query.file ?? "qqbot-fire.log";
      if (
        name.includes("..") ||
        /[/\\\x00-\x1f]/.test(name) ||
        !name.endsWith(".log")
      )
        throw new ApiError(400, "非法文件名");
      const parsed = Number(req.query.lines ?? 200);
      const count =
        !Number.isInteger(parsed) || parsed < 1 ? 200 : Math.min(parsed, 2000);
      const path = join(logDir, name);
      try {
        const stat = await lstat(path);
        if (!stat.isFile() || stat.isSymbolicLink())
          throw new ApiError(400, "非法文件名");
        if (stat.size > 32 * 1024 * 1024)
          throw new ApiError(413, "日志文件过大");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT")
          return ok({ file: name, lines: [], total: 0 });
        throw error;
      }
      const file = await open(
        path,
        constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
      );
      const stream = file.createReadStream({
        encoding: "utf8",
        autoClose: false,
      });
      const reader = createInterface({ input: stream, crlfDelay: Infinity });
      const tail: string[] = [];
      let total = 0;
      try {
        for await (const line of reader) {
          total++;
          tail.push(line);
          if (tail.length > count) tail.shift();
        }
      } finally {
        reader.close();
        stream.destroy();
        await file.close();
      }
      return ok({
        file: name,
        lines: tail,
        total,
        from: Math.max(0, total - count),
      });
    },
  );
}
