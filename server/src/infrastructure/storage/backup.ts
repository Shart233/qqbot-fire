import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  mkdir,
  readdir,
  lstat,
  realpath,
  readFile,
  writeFile,
  copyFile,
  chmod,
  rm,
} from "node:fs/promises";
import {
  resolve,
  join,
  dirname,
  relative,
  isAbsolute,
  basename,
  sep,
} from "node:path";
import { acquireDataLock } from "./json-store.js";

type Entry = {
  path: string;
  kind: "file" | "directory";
  mode: number;
  sha256?: string;
  size?: number;
};
type Manifest = {
  version: 1;
  createdAt: string;
  entries: Entry[];
  napcatWorkRoot?: string;
};
const manifestFile = "backup-manifest.json";
async function canonical(path: string): Promise<string> {
  try {
    return await realpath(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return join(await canonical(dirname(path)), basename(path));
  }
}
async function paths(source: string, destination: string) {
  source = resolve(source);
  destination = resolve(destination);
  if ((await lstat(source)).isSymbolicLink())
    throw new Error("数据源不能是符号链接");
  source = await realpath(source);
  destination = await canonical(destination);
  const nested = (parent: string, child: string) => {
    const part = relative(parent, child);
    return (
      !part ||
      (!(part === ".." || part.startsWith(".." + sep)) && !isAbsolute(part))
    );
  };
  if (nested(source, destination) || nested(destination, source))
    throw new Error("源与目标目录不能重叠或互为子目录");
  return { source, destination };
}
async function hashFile(path: string) {
  const hash = createHash("sha256");
  let size = 0;
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk);
    size += (chunk as Buffer).length;
  }
  return { sha256: hash.digest("hex"), size };
}
async function walk(
  root: string,
  omitManifest = false,
  path = "",
): Promise<Entry[]> {
  const entries: Entry[] = [];
  for (const name of (await readdir(join(root, path))).sort()) {
    if (
      !path &&
      ([".writer.lock", ".writer.guard"].includes(name) ||
        (omitManifest && name === manifestFile))
    )
      continue;
    if (!path && name === ".transaction.json")
      throw new Error("请先启动服务恢复未完成事务，再停止服务备份");
    const key = path ? path + "/" + name : name;
    const stat = await lstat(join(root, key));
    if (stat.isSymbolicLink()) throw new Error("备份拒绝符号链接：" + key);
    if (!stat.isDirectory() && !stat.isFile())
      throw new Error("备份拒绝非常规文件：" + key);
    const entry: Entry = {
      path: key,
      kind: stat.isDirectory() ? "directory" : "file",
      mode: stat.mode & 0o777,
    };
    if (entry.kind === "file")
      Object.assign(entry, await hashFile(join(root, key)));
    entries.push(entry);
    if (entry.kind === "directory")
      entries.push(...(await walk(root, omitManifest, key)));
  }
  return entries;
}
async function emptyDestination(destination: string) {
  await mkdir(destination, { recursive: true, mode: 0o700 });
  if ((await readdir(destination)).length) throw new Error("目标目录必须为空");
}
async function copyEntries(
  source: string,
  destination: string,
  entries: Entry[],
) {
  for (const entry of entries) {
    const target = join(destination, entry.path);
    if (entry.kind === "directory")
      await mkdir(target, { recursive: true, mode: 0o700 });
    else {
      await mkdir(dirname(target), { recursive: true, mode: 0o700 });
      await copyFile(join(source, entry.path), target);
      await chmod(target, entry.mode);
      const actual = await hashFile(target);
      if (actual.sha256 !== entry.sha256 || actual.size !== entry.size)
        throw new Error("文件校验失败：" + entry.path);
    }
  }
  for (const entry of [...entries].reverse())
    if (entry.kind === "directory")
      await chmod(join(destination, entry.path), entry.mode);
}
export async function createBackup(
  source: string,
  destination: string,
): Promise<Manifest> {
  ({ source, destination } = await paths(source, destination));
  const release = await acquireDataLock(source);
  try {
    const entries = await walk(source);
    let napcatWorkRoot: string | undefined;
    let configured = "";
    try {
      configured =
        (
          JSON.parse(await readFile(join(source, "config.json"), "utf8")) as {
            napCatWorkRoot?: string;
          }
        ).napCatWorkRoot ?? "";
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (configured) {
      const root = await canonical(resolve(configured));
      const part = relative(source, root);
      if (
        part &&
        !(part === ".." || part.startsWith(".." + sep)) &&
        !isAbsolute(part)
      ) {
        napcatWorkRoot = part.split("\\").join("/");
        const components = napcatWorkRoot.split("/");
        for (let index = 1; index <= components.length; index++) {
          const path = components.slice(0, index).join("/");
          if (!entries.some((entry) => entry.path === path))
            entries.push({ path, kind: "directory", mode: 0o700 });
        }
      } else {
        if (!part || entries.some((entry) => entry.path === "backup-external"))
          throw new Error("实例工作目录不能与数据根目录或备份保留目录冲突");
        napcatWorkRoot = "backup-external/napcat-workroot";
        entries.push(
          { path: "backup-external", kind: "directory", mode: 0o700 },
          { path: napcatWorkRoot, kind: "directory", mode: 0o700 },
        );
        const external = await walk(root).catch((error) => {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
          throw error;
        });
        for (const entry of external)
          entries.push({ ...entry, path: napcatWorkRoot + "/" + entry.path });
      }
    }
    entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
    if (entries.some((entry) => entry.path === manifestFile))
      throw new Error("源目录已经是备份，请使用原数据目录");
    await emptyDestination(destination);
    try {
      const externalPrefix = "backup-external/napcat-workroot/";
      await copyEntries(
        source,
        destination,
        entries.filter(
          (entry) =>
            !entry.path.startsWith(externalPrefix) &&
            entry.path !== "backup-external" &&
            entry.path !== "backup-external/napcat-workroot",
        ),
      );
      if (napcatWorkRoot === "backup-external/napcat-workroot") {
        const externalRoot = join(destination, napcatWorkRoot);
        await mkdir(externalRoot, { recursive: true, mode: 0o700 });
        await copyEntries(
          await canonical(resolve(configured)),
          externalRoot,
          entries
            .filter((entry) => entry.path.startsWith(externalPrefix))
            .map((entry) => ({
              ...entry,
              path: entry.path.slice(externalPrefix.length),
            })),
        );
      }
      const manifest: Manifest = {
        version: 1,
        createdAt: new Date().toISOString(),
        entries,
        ...(napcatWorkRoot ? { napcatWorkRoot } : {}),
      };
      await writeFile(
        join(destination, manifestFile),
        JSON.stringify(manifest, null, 2),
        { mode: 0o600 },
      );
      return manifest;
    } catch (error) {
      await rm(destination, { recursive: true, force: true });
      throw error;
    }
  } finally {
    await release();
  }
}
export async function restoreBackup(
  source: string,
  destination: string,
): Promise<void> {
  ({ source, destination } = await paths(source, destination));
  const release = await acquireDataLock(source);
  try {
    const manifest = JSON.parse(
      await readFile(join(source, manifestFile), "utf8"),
    ) as Manifest;
    if (manifest.version !== 1 || !Array.isArray(manifest.entries))
      throw new Error("备份清单格式非法");
    for (const entry of manifest.entries) {
      if (
        typeof entry.path !== "string" ||
        !entry.path ||
        entry.path.includes("\\") ||
        entry.path
          .split("/")
          .some((part) => !part || part === "." || part === "..") ||
        isAbsolute(entry.path) ||
        entry.path === manifestFile ||
        entry.path === ".writer.lock" ||
        !["file", "directory"].includes(entry.kind)
      )
        throw new Error("备份清单路径非法");
    }
    const actual = (await walk(source, true)).sort((a, b) =>
      a.path < b.path ? -1 : a.path > b.path ? 1 : 0,
    );
    if (JSON.stringify(actual) !== JSON.stringify(manifest.entries))
      throw new Error("备份校验失败：文件缺失、被修改或清单不匹配");
    await emptyDestination(destination);
    if (
      manifest.napcatWorkRoot &&
      !actual.some(
        (entry) =>
          entry.path === manifest.napcatWorkRoot && entry.kind === "directory",
      )
    )
      throw new Error("实例工作目录校验失败");
    try {
      await copyEntries(source, destination, actual);
      if (manifest.napcatWorkRoot) {
        const file = join(destination, "config.json");
        const config = JSON.parse(await readFile(file, "utf8")) as Record<
          string,
          unknown
        >;
        config.napCatWorkRoot = join(destination, manifest.napcatWorkRoot);
        await writeFile(file, JSON.stringify(config, null, 2), { mode: 0o600 });
      }
    } catch (error) {
      await rm(destination, { recursive: true, force: true });
      throw error;
    }
  } finally {
    await release();
  }
}
