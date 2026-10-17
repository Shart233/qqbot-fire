import test from "node:test";
import assert from "node:assert/strict";
import { MessageBuilder } from "../packages/onebot/src/messages.js";
test("链式消息构建保持中文、字符串标识符和独立快照", () => {
  const builder = MessageBuilder.create()
    .text("你好 ")
    .at(42)
    .image("base64://图片");
  const message = builder.build();
  assert.deepEqual(message, [
    { type: "text", data: { text: "你好 " } },
    { type: "at", data: { qq: "42" } },
    { type: "image", data: { file: "base64://图片" } },
  ]);
  message[0]!.data.text = "外部修改";
  builder.text("尾部");
  assert.equal(builder.build()[0]!.data.text, "你好 ");
  assert.equal(message.length, 3);
  assert.throws(() => MessageBuilder.create().at(9007199254740992));
});
