import test from "node:test";
import assert from "node:assert/strict";
import { EventDispatcher, EventView } from "../packages/onebot/src/events.js";

test("事件链保持注册顺序、异常隔离和处理后终止，不同 Bot 独立推进", async () => {
  const errors: unknown[] = [];
  const a = new EventDispatcher((error) => errors.push(error));
  const b = new EventDispatcher();
  const calls: string[] = [];
  a.addHandler(async () => {
    calls.push("first");
    throw new Error("单个处理器失败");
  });
  a.addHandler(async (event) => {
    calls.push(event.getDisplayName() + ":" + event.getPlainText());
    return true;
  });
  a.addHandler(() => {
    calls.push("不应执行");
    return false;
  });
  const raw = {
    post_type: "message",
    message_type: "group",
    self_id: 42,
    user_id: 7,
    group_id: 8,
    sender: { nickname: "昵称", card: "群名片", role: "admin" },
    message: [
      { type: "text", data: { text: "你好" } },
      { type: "at", data: { qq: "42" } },
      { type: "text", data: { text: "世界" } },
    ],
  };
  assert.equal(await a.dispatch(raw), true);
  assert.deepEqual(calls, ["first", "群名片:你好世界"]);
  assert.equal(errors.length, 1);
  const event = new EventView(raw);
  assert.equal(event.isGroupMessage(), true);
  assert.equal(event.hasAt(42), true);
  assert.equal(event.isFromAdmin(), true);
  assert.equal(await b.dispatch(raw), false);
});
