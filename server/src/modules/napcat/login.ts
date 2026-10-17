import QRCode from "qrcode";
import { createHash } from "node:crypto";
import { lstat, readFile, open } from "node:fs/promises";
import { join } from "node:path";
import { constants } from "node:fs";

export type LoginInstance = {
  name: string;
  qqUin: string;
  workDir: string;
  webuiPort: number;
  startedAt: number;
  alive: () => boolean;
  host?: string;
  webuiUrl?: string;
  token?: () => Promise<string>;
};
export type LoginStatus = {
  name: string;
  qqUin: string;
  state: "stopped" | "waiting" | "qr_ready" | "logged_in" | "error";
  message: string;
  qrImage: string;
  qrVersion: string;
  canRefresh: boolean;
};
const digest = (bytes: string | Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
export class NapCatLoginClient {
  private credential = "";
  private expiresAt = 0;
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly instance: LoginInstance) {}
  private serial<T>(operation: () => Promise<T>): Promise<T> {
    const promise = this.queue.catch(() => {}).then(operation);
    this.queue = promise;
    return promise;
  }
  status(): Promise<LoginStatus> {
    return this.serial(() => this.readStatus());
  }
  refresh(): Promise<void> {
    return this.serial(async () => {
      await this.request("/QQLogin/RefreshQRcode");
    });
  }
  private async readStatus(): Promise<LoginStatus> {
    const result: LoginStatus = {
      name: this.instance.name,
      qqUin: this.instance.qqUin,
      state: "waiting",
      message: "正在等待 NapCat 生成二维码",
      qrImage: "",
      qrVersion: "",
      canRefresh: false,
    };
    if (!this.instance.alive()) {
      result.state = "stopped";
      result.message = "实例尚未启动，请先启动再扫码";
      return result;
    }
    let loginError = "";
    let qrContent = "";
    try {
      const status = await this.request("/QQLogin/CheckLoginStatus");
      result.canRefresh = true;
      if (status.isLogin === true) {
        result.state = "logged_in";
        result.message = "QQ 已登录，可以返回 Bot 页面查看连接状态";
        return result;
      }
      qrContent = typeof status.qrcodeurl === "string" ? status.qrcodeurl : "";
      loginError =
        typeof status.loginError === "string" ? status.loginError : "";
      if (loginError) {
        result.state = "error";
        result.message = loginError;
        if (loginError.includes("二维码") && loginError.includes("过期"))
          return result;
      }
      if (status.isOffline === true) {
        result.state = "error";
        result.message = "QQ 已离线，请重启此实例后重新扫码";
        return result;
      }
    } catch {
      result.message = "登录状态暂不可用，正在重试；可先尝试扫描下方二维码";
    }
    // WebUI 返回的是二维码内容而非图片地址，在本地编码，不请求任意外网图片。
    if (this.instance.webuiUrl || qrContent) {
      try {
        if (!qrContent && result.canRefresh) {
          const qr = await this.request("/QQLogin/GetQQLoginQrcode");
          qrContent = typeof qr.qrcode === "string" ? qr.qrcode : "";
        }
        if (qrContent && qrContent.length <= 4096 && !loginError) {
          result.qrImage = await QRCode.toDataURL(qrContent, {
            width: 320,
            margin: 4,
          });
          result.qrVersion = digest(qrContent);
          result.state = "qr_ready";
          result.message = "请使用手机 QQ 扫码，并在手机上确认登录";
        }
      } catch {
        result.message = "二维码尚未就绪，请稍后重试";
      }
      if (this.instance.webuiUrl || result.qrImage) return result;
    }
    const path = join(this.instance.workDir, "cache/qrcode.png");
    try {
      const stat = await lstat(path);
      if (
        !stat.isFile() ||
        stat.isSymbolicLink() ||
        stat.mtimeMs < this.instance.startedAt ||
        stat.size > 1024 * 1024
      )
        return result;
      const file = await open(
        path,
        constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0),
      );
      let bytes: Buffer;
      try {
        const buffer = Buffer.alloc(1024 * 1024 + 1);
        const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
        bytes = buffer.subarray(0, bytesRead);
      } finally {
        await file.close();
      }
      if (
        bytes.length < 8 ||
        bytes.length > 1024 * 1024 ||
        !bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      )
        return result;
      result.qrImage = "data:image/png;base64," + bytes.toString("base64");
      result.qrVersion = digest(bytes);
      result.state = "qr_ready";
      if (result.canRefresh)
        result.message =
          (loginError ? loginError + " " : "") +
          "请使用手机 QQ 扫码，并在手机上确认登录";
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT")
        result.message = "二维码暂不可读，请稍后刷新";
    }
    return result;
  }
  private async request(path: string): Promise<Record<string, unknown>> {
    if (!this.credential || Date.now() >= this.expiresAt) await this.login();
    let response = await this.post(path, {}, this.credential);
    if (response.message === "Unauthorized" || response.code === 401) {
      this.credential = "";
      await this.login();
      response = await this.post(path, {}, this.credential);
    }
    return this.data(response);
  }
  private data(response: Record<string, unknown>): Record<string, unknown> {
    if (response.code !== 0) throw new Error("NapCat 暂时无法处理登录请求");
    return response.data &&
      typeof response.data === "object" &&
      !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : {};
  }
  private async login() {
    let token: unknown;
    if (this.instance.token) token = await this.instance.token();
    else {
      const path = join(this.instance.workDir, "config/webui.json");
      const stat = await lstat(path);
      if (stat.isSymbolicLink() || stat.size > 64 * 1024)
        throw new Error("NapCat 登录配置非法");
      token = (JSON.parse(await readFile(path, "utf8")) as { token?: unknown })
        .token;
    }
    if (typeof token !== "string") throw new Error("NapCat 登录配置尚未就绪");
    const auth = this.data(
      await this.post("/auth/login", { hash: digest(token + ".napcat") }, ""),
    );
    if (typeof auth.Credential !== "string" || !auth.Credential)
      throw new Error("NapCat 认证需要额外验证");
    this.credential = auth.Credential;
    this.expiresAt = Date.now() + 50 * 60_000;
  }
  private async post(
    path: string,
    body: unknown,
    credential: string,
  ): Promise<Record<string, unknown>> {
    if (
      !Number.isInteger(this.instance.webuiPort) ||
      this.instance.webuiPort < 1 ||
      this.instance.webuiPort > 65535
    )
      throw new Error("WebUI 端口无效");
    const response = await fetch(
      (this.instance.webuiUrl ??
        `http://${this.instance.host ?? "127.0.0.1"}:${this.instance.webuiPort}`) +
        `/api${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(credential ? { Authorization: "Bearer " + credential } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(4000),
        redirect: "error",
      },
    );
    if (response.status === 401) return { code: 401, message: "Unauthorized" };
    if (!response.ok) throw new Error("NapCat 登录接口暂不可用");
    const text = await response.text();
    if (text.length > 1024 * 1024) throw new Error("NapCat 响应过大");
    const result: unknown = JSON.parse(text);
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new Error("NapCat 响应异常");
    return result as Record<string, unknown>;
  }
}
