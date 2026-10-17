import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  readdir,
  rm,
  symlink,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createBackup,
  restoreBackup,
} from "../server/src/infrastructure/storage/backup.js";
import { acquireDataLock } from "../server/src/infrastructure/storage/json-store.js";

test("完整备份恢复包含日志、账号二进制和实例目录，校验损坏时不写目标", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-backup-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const source = join(dir, "source"),
    backup = join(dir, "backup"),
    restored = join(dir, "restored");
  await mkdir(join(source, "napcat-instances/demo/home/.config/QQ"), {
    recursive: true,
  });
  await mkdir(join(source, "logs"));
  await mkdir(join(source, "empty"));
  await writeFile(join(source, "config.json"), '{"bots":{}}');
  const bytes = Buffer.from([0, 255, 13, 10, 71]);
  await writeFile(
    join(source, "napcat-instances/demo/home/.config/QQ/session.db"),
    bytes,
  );
  await writeFile(join(source, "logs/server.log"), "中文日志\n");
  const release = await acquireDataLock(source);
  try {
    await assert.rejects(createBackup(source, backup), /锁|运行|占用/);
  } finally {
    await release();
  }
  await createBackup(source, backup);
  await restoreBackup(backup, restored);
  assert.deepEqual(
    await readFile(
      join(restored, "napcat-instances/demo/home/.config/QQ/session.db"),
    ),
    bytes,
  );
  assert.equal(
    await readFile(join(restored, "logs/server.log"), "utf8"),
    "中文日志\n",
  );
  assert.deepEqual(await readdir(join(restored, "empty")), []);
  assert.equal((await readdir(restored)).includes(".writer.lock"), false);
  await writeFile(join(backup, "config.json"), "tampered");
  const badTarget = join(dir, "bad-target");
  await assert.rejects(restoreBackup(backup, badTarget), /校验/);
  assert.deepEqual(await readdir(badTarget).catch(() => []), []);
  await assert.rejects(
    createBackup(source, join(source, "nested")),
    /子目录|重叠/,
  );
});

test("备份拒绝跨目录符号链接和未恢复的事务，不复制其他目录文件", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-backup-links-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const source = join(dir, "source");
  await mkdir(source);
  await writeFile(join(dir, "outside"), "不能复制");
  await symlink(join(dir, "outside"), join(source, "link"));
  await assert.rejects(createBackup(source, join(dir, "backup")), /符号链接/);
  await rm(join(source, "link"));
  await writeFile(join(source, ".transaction.json"), "{}");
  await assert.rejects(createBackup(source, join(dir, "backup")), /事务/);
});

test("备份包含自定义实例目录，恢复后路径指向新副本而非原账号目录", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-backup-root-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const source = join(dir, "source"),
    external = join(dir, "custom-instances"),
    backup = join(dir, "backup"),
    target = join(dir, "target");
  await mkdir(source);
  await mkdir(join(external, "demo/config"), { recursive: true });
  await writeFile(
    join(source, "config.json"),
    JSON.stringify({ bots: {}, napCatWorkRoot: external }),
  );
  await writeFile(
    join(external, "demo/config/webui.json"),
    '{"token":"secret"}',
  );
  await createBackup(source, backup);
  await restoreBackup(backup, target);
  const config = JSON.parse(
    await readFile(join(target, "config.json"), "utf8"),
  );
  assert.ok(config.napCatWorkRoot.startsWith(target));
  assert.equal(
    await readFile(
      join(config.napCatWorkRoot, "demo/config/webui.json"),
      "utf8",
    ),
    '{"token":"secret"}',
  );
  assert.equal(
    JSON.parse(await readFile(join(source, "config.json"), "utf8"))
      .napCatWorkRoot,
    external,
  );
});

test("尚未创建实例的目录也可备份恢复，内部绝对路径重定位到副本", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-backup-empty-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const source = join(dir, "source"),
    backup = join(dir, "backup"),
    target = join(dir, "target");
  await mkdir(source);
  await writeFile(
    join(source, "config.json"),
    JSON.stringify({
      bots: {},
      napCatWorkRoot: join(source, "instances/not-created"),
    }),
  );
  await createBackup(source, backup);
  await restoreBackup(backup, target);
  const config = JSON.parse(
    await readFile(join(target, "config.json"), "utf8"),
  );
  assert.equal(config.napCatWorkRoot, join(target, "instances/not-created"));
  assert.deepEqual(await readdir(config.napCatWorkRoot), []);
});
