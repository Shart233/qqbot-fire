import test from "node:test";
import assert from "node:assert/strict";
import { createSocket } from "node:dgram";
import { queryNtpOffset } from "../server/src/infrastructure/clock/sntp.js";

function timestamp(buffer: Buffer, index: number, unix: number) {
  const seconds = Math.floor(unix / 1000) + 2208988800;
  buffer.writeUInt32BE(seconds >>> 0, index);
  buffer.writeUInt32BE(Math.floor(((unix % 1000) / 1000) * 2 ** 32), index + 4);
}
async function server(t: test.TestContext, invalid = false) {
  const socket = createSocket("udp4");
  await new Promise<void>((resolve) => socket.bind(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve) => socket.close(() => resolve())));
  socket.on("message", (request, remote) => {
    const packet = Buffer.alloc(48);
    packet[0] = 0x24;
    packet[1] = 2;
    request.copy(packet, 24, 40, 48);
    timestamp(packet, 32, 1700000000110);
    timestamp(packet, 40, 1700000000110);
    if (invalid) packet[24] = packet[24]! ^ 1;
    socket.send(packet, remote.port, remote.address);
  });
  return socket.address().port;
}

test("SNTP 使用四个时间戳计算偏移，异步 UDP 请求不改变系统时间", async (t) => {
  const port = await server(t);
  let reads = 0;
  const offset = await queryNtpOffset("127.0.0.1", {
    port,
    timeoutMs: 1000,
    now: () => (reads++ === 0 ? 1700000000000 : 1700000000020),
  });
  assert.ok(Math.abs(offset - 100) < 1);
});

test("SNTP 拒绝不匹配的原始时间戳，等待可取消且释放 UDP 资源", async (t) => {
  const port = await server(t, true);
  await assert.rejects(
    queryNtpOffset("127.0.0.1", { port, timeoutMs: 1000 }),
    /原始时间戳/,
  );
  const controller = new AbortController();
  const pending = queryNtpOffset("127.0.0.1", {
    port,
    timeoutMs: 5000,
    signal: controller.signal,
  });
  controller.abort();
  await assert.rejects(pending);
});
