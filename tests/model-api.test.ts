import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { BotService } from "../server/src/modules/bots/service.js";
import { JsonStore } from "../server/src/infrastructure/storage/json-store.js";

test("管理服务采用协议模型转换，兼容字符串号码、缺省字段及非列表返回", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "qqbot-model-api-"));
  let noList = false;
  const server = createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "ok",
        retcode: 0,
        data:
          req.url === "/get_login_info"
            ? { user_id: "12345", nickname: "模拟" }
            : req.url === "/get_friend_list"
              ? noList
                ? null
                : [{ user_id: "42" }]
              : req.url === "/get_group_list"
                ? [{ group_id: "7", member_count: "2" }]
                : { message_id: "99" },
      }),
    );
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const bots = new BotService(new JsonStore(dir));
  t.after(async () => {
    await bots.close();
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
    await rm(dir, { recursive: true, force: true });
  });
  await bots.updateConfig("default", {
    mode: "http",
    httpUrl: `http://127.0.0.1:${(server.address() as { port: number }).port}`,
  });
  await bots.connect("default");
  assert.deepEqual(await bots.friends("default"), [
    { userId: 42, nickname: "", remark: "" },
  ]);
  assert.deepEqual(await bots.groups("default"), [
    { groupId: 7, groupName: "", memberCount: 2, maxMemberCount: 0 },
  ]);
  assert.deepEqual(await bots.send("default", "private", 42, "模拟"), {
    messageId: 99,
  });
  noList = true;
  assert.deepEqual(await bots.friends("default"), []);
});
