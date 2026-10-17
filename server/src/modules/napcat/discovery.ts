import { readdir, readFile, lstat } from "node:fs/promises";
import { join, basename } from "node:path";
import { object } from "../../infrastructure/storage/config.js";

export type DiscoveredBot = {
  qqUin: string;
  configFile: string;
  wsHost: string;
  wsPort: number;
  wsToken: string;
  wsEnabled: boolean;
  httpHost: string;
  httpPort: number;
  httpToken: string;
  httpEnabled: boolean;
};
function endpoint(input: unknown) {
  if (!Array.isArray(input) || !input.length)
    return { host: "127.0.0.1", port: 0, token: "", enabled: false };
  const entries = input.map(object);
  const selected = entries.find((item) => item.enable === true) ?? entries[0]!;
  const port = selected.port ?? 0;
  if (
    !Number.isInteger(port) ||
    (port as number) < 0 ||
    (port as number) > 65535
  )
    throw new Error("NapCat 端口非法");
  const host = typeof selected.host === "string" ? selected.host : "127.0.0.1";
  return {
    host: host === "0.0.0.0" || host === "::" ? "127.0.0.1" : host,
    port: port as number,
    token: typeof selected.token === "string" ? selected.token : "",
    enabled: selected.enable === true,
  };
}
export async function readOneBotConfig(
  path: string,
): Promise<DiscoveredBot | null> {
  const match = /^onebot11_(\d+)\.json$/.exec(basename(path));
  if (!match) return null;
  try {
    const stat = await lstat(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 1024 * 1024)
      throw new Error("NapCat 配置文件非法");
    const root = object(JSON.parse(await readFile(path, "utf8")));
    if (!root.network) return null;
    const network = object(root.network);
    const ws = endpoint(network.websocketServers),
      http = endpoint(network.httpServers);
    if (!ws.port && !http.port) return null;
    return {
      qqUin: match[1]!,
      configFile: path,
      wsHost: ws.host,
      wsPort: ws.port,
      wsToken: ws.token,
      wsEnabled: ws.enabled,
      httpHost: http.host,
      httpPort: http.port,
      httpToken: http.token,
      httpEnabled: http.enabled,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
export function mergeConfig(
  base: DiscoveredBot,
  source: DiscoveredBot,
): DiscoveredBot {
  return {
    ...base,
    configFile: source.configFile,
    wsEnabled: base.wsEnabled || source.wsEnabled,
    httpEnabled: base.httpEnabled || source.httpEnabled,
    wsPort: source.wsPort || base.wsPort,
    httpPort: source.httpPort || base.httpPort,
    wsHost:
      source.wsHost && source.wsHost !== "127.0.0.1"
        ? source.wsHost
        : base.wsHost,
    httpHost:
      source.httpHost && source.httpHost !== "127.0.0.1"
        ? source.httpHost
        : base.httpHost,
    wsToken: source.wsToken || base.wsToken,
    httpToken: source.httpToken || base.httpToken,
  };
}
export async function discoverConfigDirectory(
  directory: string,
): Promise<DiscoveredBot[]> {
  let names: string[];
  try {
    names = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const results: DiscoveredBot[] = [];
  for (const name of names.sort())
    if (/^onebot11_\d+\.json$/.test(name)) {
      const config = await readOneBotConfig(join(directory, name));
      if (config) results.push(config);
    }
  return results;
}
export async function discoverAll(
  napcatDir: string,
  workRoot: string,
): Promise<DiscoveredBot[]> {
  const found = new Map<string, DiscoveredBot>();
  const add = (config: DiscoveredBot) => {
    const prior = found.get(config.qqUin);
    found.set(config.qqUin, prior ? mergeConfig(prior, config) : config);
  };
  for (const config of await discoverConfigDirectory(join(napcatDir, "config")))
    add(config);
  let names: string[];
  try {
    names = await readdir(workRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      return [...found.values()];
    throw error;
  }
  for (const name of names.sort()) {
    const path = join(workRoot, name);
    const stat = await lstat(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) continue;
    for (const config of await discoverConfigDirectory(join(path, "config")))
      add(config);
  }
  return [...found.values()];
}
