import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { HttpTransport, OneBotClient } from "../packages/onebot/src/index.js";

test("类型化客户端保持 Java 参数转换、可选字段、特殊动作名与返回形态", async (t) => {
  const received: { action: string; params: unknown }[] = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    const action = req.url!.slice(1);
    received.push({ action, params: JSON.parse(body) });
    res.setHeader("content-type", "application/json");
    const data =
      action === "get_login_info"
        ? { user_id: 42, nickname: "测试" }
        : action === "send_group_msg"
          ? { message_id: 99 }
          : action === "get_group_msg_history"
            ? { messages: [{ message_id: 8 }] }
            : action === "get_friend_list"
              ? [{ user_id: 7, nickname: "好友", remark: "" }]
              : {};
    res.end(JSON.stringify({ status: "ok", retcode: 0, data }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const transport = new HttpTransport(
    `http://127.0.0.1:${(server.address() as { port: number }).port}`,
  );
  t.after(async () => {
    await transport.close();
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  await transport.connect();
  received.length = 0;
  const client = new OneBotClient(transport);
  assert.deepEqual(await client.getLoginInfo(), {
    user_id: 42,
    nickname: "测试",
  });
  const full = client as unknown as {
    sendGroupMsg: (id: number, message: string) => Promise<number>;
    getGroupMsgHistory: (id: number, count: number) => Promise<unknown>;
    setGroupAnonymousBan: (
      id: number,
      anonymous: unknown,
      flag: string | null,
      duration: number,
    ) => Promise<void>;
    getFriendList: () => Promise<unknown>;
    handleQuickOperation: (
      context: Record<string, unknown>,
      operation: Record<string, unknown>,
    ) => Promise<unknown>;
    uploadFileStream: (...args: unknown[]) => Promise<unknown>;
  };
  assert.equal(await full.sendGroupMsg(123, "中文"), 99);
  assert.deepEqual(await full.getGroupMsgHistory(123, 5), [{ message_id: 8 }]);
  await full.setGroupAnonymousBan(123, null, "flag", 60);
  assert.deepEqual(await full.getFriendList(), [
    {
      user_id: 7,
      nickname: "好友",
      remark: "",
      sex: null,
      level: 0,
      age: 0,
      qid: null,
    },
  ]);
  await full.handleQuickOperation({ message_id: 8 }, { reply: "回复" });
  await full.uploadFileStream(
    "stream",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  );
  assert.deepEqual(received, [
    { action: "get_login_info", params: {} },
    {
      action: "send_group_msg",
      params: {
        group_id: "123",
        message: [{ type: "text", data: { text: "中文" } }],
      },
    },
    { action: "get_group_msg_history", params: { group_id: "123", count: 5 } },
    {
      action: "set_group_anonymous_ban",
      params: { group_id: "123", flag: "flag", duration: 60 },
    },
    { action: "get_friend_list", params: {} },
    {
      action: ".handle_quick_operation",
      params: { context: { message_id: 8 }, operation: { reply: "回复" } },
    },
    {
      action: "upload_file_stream",
      params: { stream_id: "stream", file_retention: 300000 },
    },
  ]);
  await assert.rejects(full.sendGroupMsg(9007199254740992, "拒绝不安全整数"));
});

test("166 个公开调用签名的请求与实际 Java 客户端夹具逐项一致", async () => {
  const { readFile } = await import("node:fs/promises");
  const fixtures = JSON.parse(
    await readFile(
      new URL("./fixtures/onebot-java.json", import.meta.url),
      "utf8",
    ),
  ) as {
    name: string;
    signature: string;
    args: unknown[];
    action: string;
    params: unknown;
  }[];
  let actual: { action: string; params: unknown } | undefined;
  const transport = {
    connected: true,
    async connect() {},
    async close() {},
    async call<T>(action: string, params: Record<string, unknown> = {}) {
      actual = { action, params };
      return { message_id: 99, yes: true, messages: [] } as T;
    },
  };
  const client = new OneBotClient(transport);
  const methods = client as unknown as Record<
    string,
    (...args: unknown[]) => Promise<unknown>
  >;
  for (const fixture of fixtures) {
    actual = undefined;
    assert.equal(typeof methods[fixture.name], "function", fixture.signature);
    await methods[fixture.name]!.apply(client, fixture.args);
    assert.deepEqual(
      actual,
      { action: fixture.action, params: fixture.params },
      fixture.signature,
    );
  }
  assert.equal(fixtures.length, 166);
});

test("兼容 NapCat 用数字或字符串返回的模型布尔字段", async () => {
  const transport = {
    connected: true,
    async connect() {},
    async close() {},
    async call<T>(action: string) {
      return (
        action === "get_group_info"
          ? { group_id: 42, group_all_shut: 1 }
          : { group_id: 42, user_id: 7, is_robot: "0" }
      ) as T;
    },
  };
  const client = new OneBotClient(transport);
  assert.equal((await client.getGroupInfo(42)).group_all_shut, true);
  assert.equal((await client.getGroupMemberInfo(42, 7)).is_robot, false);
});
