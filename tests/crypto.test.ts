import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadRsa } from "../server/src/infrastructure/crypto/keys.js";

test("Java SunJCE 默认 RSA 密文可读取，中文和空值保持一致", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-crypto-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const fixture = JSON.parse(
    await readFile(
      new URL("./fixtures/java-rsa.json", import.meta.url),
      "utf8",
    ),
  );
  await mkdir(join(dir, ".keys"));
  await writeFile(join(dir, ".keys/public.key"), fixture.publicKey);
  await writeFile(join(dir, ".keys/private.key"), fixture.privateKey);
  const rsa = await loadRsa(dir);
  assert.equal(rsa.decrypt(fixture.cipherText), "兼容测试-token");
  assert.equal(rsa.decrypt(""), "");
  assert.equal(rsa.decrypt("旧明文"), "旧明文");
  assert.equal(rsa.decrypt(rsa.encrypt("新测试")), "新测试");
  assert.throws(() => rsa.decrypt("RSA:AA=="), /解密失败/);
});
