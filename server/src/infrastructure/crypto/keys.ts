import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  randomBytes,
  createPrivateKey,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
  constants,
} from "node:crypto";

export function base64(value: string): Buffer {
  const stripped = value.trim();
  if (
    !stripped ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      stripped,
    )
  )
    throw new Error("密钥或密文 Base64 损坏");
  return Buffer.from(stripped, "base64");
}
export async function loadJwtSecret(dataDir: string): Promise<Buffer> {
  const dir = join(dataDir, ".keys");
  const path = join(dir, "jwt.secret");
  try {
    const secret = base64(await readFile(path, "utf8"));
    if (secret.length < 32) throw new Error("JWT 密钥长度不足");
    return secret;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await mkdir(dir, { recursive: true, mode: 0o700 });
    const secret = randomBytes(32);
    await writeFile(path, secret.toString("base64"), {
      flag: "wx",
      mode: 0o600,
    });
    return secret;
  }
}
export async function loadRsa(dataDir: string) {
  const dir = join(dataDir, ".keys");
  const privateKey = createPrivateKey({
    key: base64(await readFile(join(dir, "private.key"), "utf8")),
    type: "pkcs8",
    format: "der",
  });
  const publicKey = createPublicKey({
    key: base64(await readFile(join(dir, "public.key"), "utf8")),
    type: "spki",
    format: "der",
  });
  if (!createPublicKey(privateKey).equals(publicKey))
    throw new Error("RSA 公私钥不匹配");
  return {
    decrypt(value: string): string {
      if (!value.startsWith("RSA:")) return value;
      try {
        const encrypted = base64(value.slice(4));
        if (
          encrypted.length !==
          Math.ceil(privateKey.asymmetricKeyDetails!.modulusLength! / 8)
        )
          throw new Error("密文长度错误");
        const decrypted = privateDecrypt(
          { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
          encrypted,
        );
        return new TextDecoder("utf-8", { fatal: true }).decode(decrypted);
      } catch {
        throw new Error("RSA 解密失败；禁止覆盖原数据，请使用离线转换流程");
      }
    },
    encrypt(value: string): string {
      if (!value) return value;
      return (
        "RSA:" +
        publicEncrypt(
          { key: publicKey, padding: constants.RSA_PKCS1_PADDING },
          Buffer.from(value),
        ).toString("base64")
      );
    },
  };
}

export async function ensureRsa(dataDir: string) {
  const dir = join(dataDir, ".keys");
  const { access } = await import("node:fs/promises");
  let exists = false;
  for (const name of ["private.key", "public.key"]) {
    try {
      await access(join(dir, name));
      exists = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  if (exists) return loadRsa(dataDir);
  const { generateKeyPair } = await import("node:crypto");
  const pair = await new Promise<{ publicKey: Buffer; privateKey: Buffer }>(
    (resolve, reject) => {
      generateKeyPair(
        "rsa",
        {
          modulusLength: 2048,
          publicKeyEncoding: { type: "spki", format: "der" },
          privateKeyEncoding: { type: "pkcs8", format: "der" },
        },
        (error, publicKey, privateKey) => {
          if (error) reject(error);
          else resolve({ publicKey, privateKey });
        },
      );
    },
  );
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(
    join(dir, "private.key"),
    pair.privateKey.toString("base64"),
    { flag: "wx", mode: 0o600 },
  );
  await writeFile(join(dir, "public.key"), pair.publicKey.toString("base64"), {
    flag: "wx",
    mode: 0o600,
  });
  return loadRsa(dataDir);
}
