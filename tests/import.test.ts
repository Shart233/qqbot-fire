import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  readdir,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importLegacy } from "../server/src/infrastructure/storage/import-legacy.js";

async function fixture(t: test.TestContext) {
  const parent = await mkdtemp(join(tmpdir(), "qqbot-import-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const source = join(parent, "旧数据");
  const destination = join(parent, "新数据");
  await mkdir(source);
  await writeFile(
    join(source, "config.json"),
    JSON.stringify({
      mode: "http",
      httpUrl: "http://127.0.0.1:3000",
      accessToken: "fixture-token",
    }),
  );
  await writeFile(
    join(source, "schedules.json"),
    JSON.stringify([
      {
        name: "test",
        time: "12:00",
        targets: [123],
        message: "测试",
        targetType: "private",
        enabled: true,
      },
    ]),
  );
  await writeFile(
    join(source, "schedules_state.json"),
    JSON.stringify({
      version: 1,
      records: {
        "test@2026-10-13": {
          date: "2026-10-13",
          taskName: "test",
          targetStates: { "123": "UNKNOWN" },
          retryCount: 0,
          nextRetryAt: 0,
          updatedAt: 1,
        },
      },
    }),
  );
  return { parent, source, destination };
}

test("预检查不写入，导入保留源数据和未决账本并阻止重复覆盖", async (t) => {
  const { source, destination } = await fixture(t);
  const before = await readFile(join(source, "config.json"), "utf8");
  const preview = await importLegacy({ source, destination, checkOnly: true });
  assert.equal(preview.imported, false);
  await assert.rejects(readdir(destination));
  const result = await importLegacy({ source, destination });
  assert.equal(result.imported, true);
  assert.equal(await readFile(join(source, "config.json"), "utf8"), before);
  const config = JSON.parse(
    await readFile(join(destination, "config.json"), "utf8"),
  );
  assert.equal(config.bots.default.httpToken, "fixture-token");
  assert.equal(config.bots.default.wsToken, "fixture-token");
  assert.equal(config.activeBot, "default");
  assert.deepEqual(
    JSON.parse(
      await readFile(join(destination, "schedules_state.json"), "utf8"),
    ).records["test@2026-10-13"].targetStates,
    { "123": "UNKNOWN" },
  );
  assert.equal(
    await readFile(join(destination, "legacy-backup/config.json"), "utf8"),
    before,
  );
  await assert.rejects(importLegacy({ source, destination }), /非空|重复/);
});

test("非法目标数字、损坏账本及缺失 RSA 密钥均阻止导入", async (t) => {
  const { source, destination } = await fixture(t);
  await writeFile(
    join(source, "schedules.json"),
    '[{"name":"test","time":"12:00","targets":[9007199254740993],"message":"x","targetType":"group"}]',
  );
  await assert.rejects(importLegacy({ source, destination }), /安全整数/);
  await writeFile(join(source, "schedules.json"), "[]");
  await writeFile(join(source, "schedules_state.json"), "{");
  await assert.rejects(importLegacy({ source, destination }), /JSON|账本/);
  await writeFile(
    join(source, "schedules_state.json"),
    '{"version":1,"records":{}}',
  );
  await writeFile(
    join(source, "config.json"),
    '{"mode":"ws","accessToken":"RSA:AA=="}',
  );
  await assert.rejects(importLegacy({ source, destination }), /密钥|RSA/);
  await assert.rejects(readdir(destination));
});

test("支持空目标目录但禁止符号链接目标覆盖其他目录", async (t) => {
  const { source, destination, parent } = await fixture(t);
  await mkdir(destination);
  assert.equal((await importLegacy({ source, destination })).imported, true);
  const { symlink } = await import("node:fs/promises");
  const elsewhere = join(parent, "其他目录");
  const alias = join(parent, "链接");
  await mkdir(elsewhere);
  await symlink(elsewhere, alias, "dir");
  await assert.rejects(
    importLegacy({ source, destination: alias }),
    /符号链接/,
  );
  assert.deepEqual(await readdir(elsewhere), []);
});
