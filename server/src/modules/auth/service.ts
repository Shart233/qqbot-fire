import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  normalizeConfig,
  defaultConfig,
  type Config,
} from "../../infrastructure/storage/config.js";
import type { JsonStore } from "../../infrastructure/storage/json-store.js";
import { ApiError } from "../../http/errors.js";

export class AuthService {
  private readonly failures = new Map<
    string,
    { count: number; lockedUntil: number; updatedAt: number }
  >();
  constructor(
    private readonly store: JsonStore,
    private readonly secret: Uint8Array,
    private readonly now = Date.now,
  ) {}
  private async config(): Promise<Config> {
    return normalizeConfig(
      await this.store.read("config.json", defaultConfig()),
    );
  }
  async initialized(): Promise<boolean> {
    return Boolean((await this.config()).admin);
  }
  private async issue(config: Config) {
    const now = this.now();
    const token = await new SignJWT({
      sessionVersion: config.admin!.sessionVersion,
    })
      .setSubject("admin")
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Math.floor(now / 1000))
      .setExpirationTime(Math.floor(now / 1000) + 7 * 24 * 3600)
      .sign(this.secret);
    return { token, expiresAt: now + 7 * 24 * 3600 * 1000 };
  }
  private validatePassword(password: string) {
    if (password.length < 10) throw new ApiError(400, "密码长度至少 10 位");
    if (Buffer.byteLength(password, "utf8") > 72)
      throw new ApiError(400, "密码不能超过 72 个 UTF-8 字节");
  }
  async setup(password: string) {
    this.validatePassword(password);
    const config = await this.store.update(
      "config.json",
      async (raw) => {
        const current = normalizeConfig(raw);
        if (current.admin)
          throw new ApiError(409, "密码已初始化，请改用修改密码");
        current.admin = {
          passwordHash: await hash(password, 10),
          sessionVersion: 1,
        };
        return current;
      },
      defaultConfig(),
    );
    return this.issue(config);
  }
  async login(password: string, ip: string) {
    const config = await this.config();
    if (!config.admin) throw new ApiError(409, "密码尚未初始化");
    const now = this.now();
    for (const [key, value] of this.failures)
      if (value.updatedAt + 15 * 60_000 <= now && value.lockedUntil <= now)
        this.failures.delete(key);
    const failure = this.failures.get(ip);
    if (failure && failure.lockedUntil > now)
      throw new ApiError(
        429,
        "登录尝试过多，请稍后再试",
        Math.max(1, Math.floor((failure.lockedUntil - now) / 1000)),
      );
    if (!password) throw new ApiError(400, "密码不能为空");
    if (!(await compare(password, config.admin.passwordHash))) {
      const current = this.failures.get(ip) ?? {
        count: 0,
        lockedUntil: 0,
        updatedAt: now,
      };
      current.count++;
      current.updatedAt = now;
      if (current.count >= 5) current.lockedUntil = now + 15 * 60_000;
      this.failures.set(ip, current);
      throw new ApiError(401, "密码错误");
    }
    // 改密与登录并发时，不给旧密码签发新版本会话。
    const latest = await this.config();
    if (latest.admin?.passwordHash !== config.admin.passwordHash)
      throw new ApiError(401, "密码已修改，请重新登录");
    this.failures.delete(ip);
    return this.issue(config);
  }
  async authorize(header?: string) {
    const config = await this.config();
    if (!config.admin) throw new ApiError(401, "管理员密码未初始化");
    const token = /^Bearer\s+(.+)$/i.exec(header?.trim() ?? "")?.[1];
    if (!token) throw new ApiError(401, "未登录");
    try {
      const { payload } = await jwtVerify(token, this.secret, {
        algorithms: ["HS256"],
        subject: "admin",
        currentDate: new Date(this.now()),
      });
      if (
        payload.sessionVersion !== config.admin.sessionVersion ||
        typeof payload.exp !== "number"
      )
        throw new Error("会话版本不匹配");
    } catch {
      throw new ApiError(401, "登录已过期");
    }
  }
  async changePassword(oldPassword: string, newPassword: string) {
    this.validatePassword(newPassword);
    await this.store.update(
      "config.json",
      async (raw) => {
        const config = normalizeConfig(raw);
        if (!config.admin) throw new ApiError(409, "密码尚未初始化");
        if (!(await compare(oldPassword, config.admin.passwordHash)))
          throw new ApiError(401, "原密码错误");
        config.admin = {
          passwordHash: await hash(newPassword, 10),
          sessionVersion: config.admin.sessionVersion + 1,
        };
        return config;
      },
      defaultConfig(),
    );
    return { changed: true };
  }
}
