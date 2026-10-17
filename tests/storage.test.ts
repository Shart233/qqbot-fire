import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  JsonStore,
  acquireDataLock,
} from "../server/src/infrastructure/storage/json-store.js";

async function directory(t: test.TestContext) {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-storage-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

test("并发更新不丢失写入，重新读取仍为有效 JSON", async (t) => {
  const dir = await directory(t);
  const store = new JsonStore(dir);
  await Promise.all(
    Array.from({ length: 30 }, () =>
      store.update("counter.json", (v: number) => v + 1, 0),
    ),
  );
  assert.equal(await new JsonStore(dir).read("counter.json"), 30);
});

test("损坏文件阻止更新且保留原始字节", async (t) => {
  const dir = await directory(t);
  await writeFile(join(dir, "config.json"), "{损坏");
  const store = new JsonStore(dir);
  await assert.rejects(store.update("config.json", () => ({}), {}));
  assert.equal(await readFile(join(dir, "config.json"), "utf8"), "{损坏");
});

test("更新失败不污染队列，拒绝逃逸数据目录", async (t) => {
  const store = new JsonStore(await directory(t));
  await assert.rejects(
    store.update(
      "a.json",
      () => {
        throw new Error("写入取消");
      },
      0,
    ),
  );
  await store.update("a.json", () => 2, 0);
  assert.equal(await store.read("a.json"), 2);
  await assert.rejects(store.read("../escape.json"));
});

test("同数据目录只能有一个写者，释放后可以再次获取", async (t) => {
  const dir = await directory(t);
  const release = await acquireDataLock(dir);
  await assert.rejects(acquireDataLock(dir), /数据目录/);
  await release();
  const next = await acquireDataLock(dir);
  await next();
});

test("序列化失败保留原文件并清理临时文件", async (t) => {
  const { readdir } = await import("node:fs/promises");
  const dir = await directory(t);
  await writeFile(join(dir, "original.json"), '{"value":1}');
  const store = new JsonStore(dir);
  const circular: Record<string, unknown> = {};
  circular.self = circular;
  await assert.rejects(store.update("original.json", () => circular, {}));
  assert.equal(
    await readFile(join(dir, "original.json"), "utf8"),
    '{"value":1}',
  );
  assert.deepEqual(await readdir(dir), ["original.json"]);
});

test("多文件事务故障后保留日志，重启恢复任务与配置到同一版本", async (t) => {
  const { mkdir, writeFile, rm, readFile } = await import("node:fs/promises");
  const dir = await mkdtemp(join(tmpdir(), "qqbot-transaction-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const store = new JsonStore(dir);
  await store.update("config.json", () => ({ bot: "old" }), { bot: "" });
  await mkdir(join(dir, "new.json"));
  await assert.rejects(
    store.transaction(async () => ({
      "config.json": { bot: "new" },
      "new.json": [42],
    })),
  );
  const journal = JSON.parse(
    await readFile(join(dir, ".transaction.json"), "utf8"),
  );
  assert.equal(journal.version, 1);
  await rm(join(dir, "new.json"), { recursive: true });
  const recovered = new JsonStore(dir);
  await recovered.recover();
  assert.deepEqual(await recovered.read("config.json"), { bot: "new" });
  assert.deepEqual(await recovered.read("new.json"), [42]);
  await assert.rejects(readFile(join(dir, ".transaction.json")), {
    code: "ENOENT",
  });
});
