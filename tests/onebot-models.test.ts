import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeModel } from "../packages/onebot/src/normalize.js";
import { OneBotClient } from "../packages/onebot/src/index.js";

test("所有协议模型的缺省值、空值和转换边界与实际 Java 夹具一致", async () => {
  const fixtures = JSON.parse(
    await readFile(
      new URL("./fixtures/onebot-models-java.json", import.meta.url),
      "utf8",
    ),
  ) as { model: string; input: unknown; expected?: unknown; error?: boolean }[];
  assert.equal(fixtures.length, 35);
  for (const f of fixtures) {
    if (f.error) assert.throws(() => normalizeModel(f.model, f.input), f.model);
    else
      assert.deepEqual(
        normalizeModel(f.model, f.input),
        f.expected,
        f.model + " " + JSON.stringify(f.input),
      );
  }
});

test("高层客户端保留 Java 通用 Map 包裹，所有具名模型经过转换", async () => {
  let data: unknown = [{ user_id: "7", nickname: 42 }];
  const transport = {
    connected: true,
    async connect() {},
    async close() {},
    async call<T>() {
      return data as T;
    },
  };
  const client = new OneBotClient(transport);
  assert.deepEqual(await client.callApi("raw"), { data });
  assert.deepEqual(await client.callApiRaw("raw"), data);
  const friends = await client.getFriendList();
  assert.equal(friends[0]!.user_id, 7);
  assert.equal(friends[0]!.nickname, "42");
  assert.equal(friends[0]!.remark, null);
  data = { sender: { user_id: "7" } };
  const message = await client.getMsg(99);
  assert.equal(message.message_id, 0);
  assert.equal(message.sender?.user_id, 7);
  assert.equal(message.sender?.nickname, null);
});
