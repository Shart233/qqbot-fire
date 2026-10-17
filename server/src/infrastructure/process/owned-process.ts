import { spawn, execFile, type ChildProcess } from "node:child_process";
import { promisify } from "node:util";
import { access, writeFile, readFile, realpath } from "node:fs/promises";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";

export type LaunchSpec = {
  command: string;
  args: string[];
  cwd: string;
  env: NodeJS.ProcessEnv;
};
const run = promisify(execFile);
async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
export async function buildLaunch(
  napcatDir: string,
  workDir: string,
  qqUin: string,
  webuiPort: number,
): Promise<LaunchSpec> {
  const main = join(napcatDir, "napcat.mjs");
  if (!(await exists(main)))
    throw new Error("NapCat 目录无效，找不到 napcat.mjs");
  const env = {
    ...process.env,
    NAPCAT_WORKDIR: workDir,
    NAPCAT_MAIN_PATH: main,
    NAPCAT_WEBUI_PREFERRED_PORT: String(webuiPort),
  };
  if (process.platform === "win32") {
    const launcher = join(napcatDir, "NapCatWinBootMain.exe"),
      hook = join(napcatDir, "NapCatWinBootHook.dll");
    if (!(await exists(launcher)) || !(await exists(hook)))
      throw new Error("NapCat Windows 启动器或注入 DLL 缺失");
    const candidates = [
      process.env.QQ_PATH,
      "C:/Program Files/Tencent/QQNT/QQ.exe",
      "C:/Program Files (x86)/Tencent/QQNT/QQ.exe",
      "D:/Program Files/Tencent/QQNT/QQ.exe",
    ];
    let qqPath: string | undefined;
    for (const path of candidates)
      if (path && (await exists(path))) {
        qqPath = path;
        break;
      }
    if (!qqPath) {
      try {
        const { stdout } = await run(
          "reg.exe",
          [
            "query",
            "HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\QQ",
            "/v",
            "UninstallString",
          ],
          { timeout: 3000 },
        );
        const uninstall =
          /REG_SZ\s+"?(.+?)(?:\\Uninstall\.exe|\\uninstall\.exe)"?/i.exec(
            stdout,
          )?.[1];
        if (uninstall && (await exists(join(uninstall, "QQ.exe"))))
          qqPath = join(uninstall, "QQ.exe");
      } catch {
        /* 注册表不可用时由显式 QQ_PATH 提供安装路径。 */
      }
    }
    if (!qqPath) throw new Error("未找到 QQ.exe，请设置 QQ_PATH");
    const load = join(workDir, "loadNapCat.js");
    await writeFile(
      load,
      `(async () => { await import(${JSON.stringify(pathToFileURL(main).href)}) })()\n`,
      { mode: 0o600 },
    );
    Object.assign(env, {
      NAPCAT_PATCH_PACKAGE: join(napcatDir, "qqnt.json"),
      NAPCAT_LOAD_PATH: load,
      NAPCAT_INJECT_PATH: hook,
      NAPCAT_LAUNCHER_PATH: launcher,
    });
    return {
      command: launcher,
      args: [qqPath, hook, qqUin],
      cwd: napcatDir,
      env,
    };
  }
  if (
    (await exists(join(napcatDir, "NapCatWinBootMain.exe"))) &&
    !(await exists(join(napcatDir, "napcat.sh"))) &&
    !(await exists(join(napcatDir, "napcat-run.sh")))
  )
    throw new Error(
      "WSL 托管模式需要 Linux NapCat；Windows NapCat 请在 Windows 原生 Node 中托管或使用外部连接模式",
    );
  Object.assign(env, {
    HOME: join(workDir, "home"),
    XDG_CONFIG_HOME: join(workDir, "home/.config"),
  });
  for (const script of ["napcat-run.sh", "napcat.sh"])
    if (await exists(join(napcatDir, script)))
      return {
        command: "bash",
        args: [join(napcatDir, script), qqUin],
        cwd: napcatDir,
        env,
      };
  for (const qq of [
    process.env.QQ_PATH,
    "/opt/QQ/qq",
    "/usr/bin/qq",
    "/usr/local/bin/qq",
  ])
    if (qq && (await exists(qq))) {
      const appDir = join(dirname(await realpath(qq)), "resources/app");
      try {
        const pkg = JSON.parse(
          await readFile(join(appDir, "package.json"), "utf8"),
        ) as { main?: string };
        const loader = await readFile(
          join(appDir, pkg.main ?? "loadNapCat.js"),
          "utf8",
        );
        if (!loader.includes("NAPCAT_MAIN_PATH") && !loader.includes(main))
          throw new Error("QQ 未配置此 NapCat 入口");
      } catch {
        throw new Error(
          "QQ 主入口尚未适配此 NapCat，请使用已安装的 napcat-run.sh 或 napcat.sh 启动器",
        );
      }
      const args = [
        qq,
        "--no-sandbox",
        "-q",
        qqUin,
        "--user-data-dir=" + join(workDir, "qq-profile"),
      ];
      if (await exists("/usr/bin/xvfb-run"))
        return {
          command: "/usr/bin/xvfb-run",
          args: ["-a", "--server-args=-screen 0 1280x720x24", ...args],
          cwd: napcatDir,
          env,
        };
      return { command: qq, args: args.slice(1), cwd: napcatDir, env };
    }
  throw new Error(
    "未找到 Linux QQ 或 NapCat 启动器，请安装 Linux QQ 并提供 napcat-run.sh / napcat.sh；不能用普通 Node 直接加载 Shell 模块",
  );
}

export class OwnedProcess {
  readonly child: ChildProcess;
  readonly startedAt = Date.now();
  readonly exited: Promise<void>;
  private stopping: Promise<void> | undefined;
  private processClosed = false;
  constructor(spec: LaunchSpec, onOutput: (line: string) => void) {
    this.child = spawn(spec.command, spec.args, {
      cwd: spec.cwd,
      env: spec.env,
      detached: process.platform !== "win32",
      windowsHide: true,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    // 启动器自行退出时立即结束其进程组，避免保留可被复用的旧进程号。
    this.child.once("exit", () => {
      void this.stop().catch(() => {});
    });
    this.exited = new Promise((resolve) => {
      this.child.once("close", () => {
        this.processClosed = true;
        resolve();
      });
    });
    for (const stream of [this.child.stdout, this.child.stderr]) {
      let buffer = "";
      stream?.setEncoding("utf8");
      stream?.on("data", (chunk: string) => {
        buffer += chunk;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";
        for (const line of lines) onOutput(line.slice(0, 8192));
        if (buffer.length > 8192) {
          onOutput(buffer.slice(0, 8192));
          buffer = "";
        }
      });
      stream?.once("end", () => {
        if (buffer) onOutput(buffer.slice(0, 8192));
      });
    }
  }
  get pid(): number {
    return this.child.pid ?? 0;
  }
  get alive(): boolean {
    return (
      this.child.pid !== undefined &&
      this.child.exitCode === null &&
      this.child.signalCode === null &&
      !this.processClosed
    );
  }
  async ready(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.child.once("spawn", resolve);
      this.child.once("error", reject);
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!this.alive) throw new Error("NapCat 启动后立即退出");
  }
  stop(): Promise<void> {
    this.stopping ??= this.doStop();
    return this.stopping;
  }
  private async doStop() {
    if (!this.pid) return;
    if (process.platform === "win32") {
      if (this.alive)
        await run("taskkill.exe", ["/PID", String(this.pid), "/T", "/F"], {
          timeout: 5000,
        });
    } else {
      // 独立进程组仅由本次 spawn 创建；不按 QQ 号或通用进程名搜索和终止。
      try {
        process.kill(-this.pid, "SIGTERM");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
      }
      const groupAlive = () => {
        try {
          process.kill(-this.pid, 0);
          return true;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
          throw error;
        }
      };
      // 父进程退出不代表整个进程组退出，QQ 子进程可能已关闭标准输出。
      const deadline = Date.now() + 1500;
      while (groupAlive() && Date.now() < deadline)
        await new Promise((resolve) => setTimeout(resolve, 25));
      if (groupAlive())
        try {
          process.kill(-this.pid, "SIGKILL");
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
        }
    }
    await this.exited;
  }
}
