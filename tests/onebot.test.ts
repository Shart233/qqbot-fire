import test from "node:test";
import assert from "node:assert/strict";
import { createServer, type RequestListener } from "node:http";
import { WebSocketServer } from "ws";
import {
  HttpTransport,
  WsTransport,
  UnknownOutcomeError,
} from "../packages/onebot/src/index.js";

async function http(t: test.TestContext, handler: RequestListener) {
  const server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  );
  return `http://127.0.0.1:${(server.address() as { port: number }).port}`;
}

for (const debug of [false, true])
  test(`HTTP ${debug ? "Debug" : "标准"} 模式保留数组、认证和发送参数`, async (t) => {
    let sent = 0;
    const url = await http(t, async (req, res) => {
      let body = "";
      for await (const part of req) body += part;
      const data = JSON.parse(body);
      if (debug && req.url !== "/api/Debug/call/debug-primary") {
        res.writeHead(404).end();
        return;
      }
      assert.equal(
        req.headers.authorization,
        debug ? 'Bearer "fixture-token"' : "Bearer fixture-token",
      );
      const action = debug ? data.action : req.url!.slice(1);
      const params = debug ? data.params : data;
      if (action === "send_private_msg") {
        assert.equal(params.user_id, 42);
        sent++;
      }
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          status: "ok",
          retcode: 0,
          data:
            action === "get_friend_list"
              ? [{ user_id: 42, nickname: "测试", remark: "" }]
              : action === "send_private_msg"
                ? { message_id: 99 }
                : { user_id: 42, nickname: "测试" },
        }),
      );
    });
    const transport = new HttpTransport(url, "fixture-token");
    await transport.connect();
    assert.deepEqual(await transport.call("get_friend_list"), [
      { user_id: 42, nickname: "测试", remark: "" },
    ]);
    assert.deepEqual(
      await transport.call("send_private_msg", {
        user_id: 42,
        message: "测试",
      }),
      { message_id: 99 },
    );
    assert.equal(sent, 1);
    await transport.close();
  });

test("HTTP 响应超时为未决且绝不自动重发副作用请求", async (t) => {
  let sends = 0;
  const url = await http(t, (req, res) => {
    if (req.url === "/get_login_info") {
      res.end('{"status":"ok","retcode":0,"data":{}}');
    } else sends++;
  });
  const transport = new HttpTransport(url, "", { timeoutMs: 40 });
  await transport.connect();
  await assert.rejects(
    transport.call("send_private_msg", { user_id: 42, message: "测试" }),
    UnknownOutcomeError,
  );
  assert.equal(sends, 1);
  await transport.close();
});

test("WS 乱序 echo 不串请求，事件独立分派，关闭清理未决请求", async (t) => {
  const server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
  await new Promise<void>((resolve) => server.on("listening", resolve));
  t.after(
    () =>
      new Promise<void>((resolve) => {
        for (const client of server.clients) client.terminate();
        server.close(() => resolve());
      }),
  );
  const requests: { echo: string; action: string }[] = [];
  server.on("connection", (socket) =>
    socket.on("message", (message) => {
      const request = JSON.parse(message.toString());
      if (request.action === "hang") return;
      requests.push(request);
      if (requests.length === 2) {
        socket.send(JSON.stringify({ post_type: "message", message: "事件" }));
        for (const item of requests.toReversed())
          socket.send(
            JSON.stringify({
              status: "ok",
              retcode: 0,
              echo: item.echo,
              data: { action: item.action },
            }),
          );
      }
    }),
  );
  const transport = new WsTransport(
    `ws://127.0.0.1:${(server.address() as { port: number }).port}`,
    "",
    { timeoutMs: 1000 },
  );
  let events = 0;
  transport.onEvent(() => {
    events++;
  });
  await transport.connect();
  const results = await Promise.all([
    transport.call("first"),
    transport.call("second"),
  ]);
  assert.deepEqual(results, [{ action: "first" }, { action: "second" }]);
  assert.equal(events, 1);
  const pending = assert.rejects(transport.call("hang"), UnknownOutcomeError);
  await transport.close();
  await pending;
  assert.equal(transport.connected, false);
});

test("WS 超时迟到响应不被派发为事件，手动断开后不自动重连", async (t) => {
  const server = new WebSocketServer({ host: "127.0.0.1", port: 0 });
  await new Promise<void>((resolve) => server.on("listening", resolve));
  t.after(
    () =>
      new Promise<void>((resolve) => {
        for (const socket of server.clients) socket.terminate();
        server.close(() => resolve());
      }),
  );
  let connections = 0;
  server.on("connection", (socket) => {
    connections++;
    socket.on("message", (message) => {
      const { echo } = JSON.parse(message.toString());
      setTimeout(() => {
        if (socket.readyState === 1)
          socket.send(
            JSON.stringify({ status: "ok", retcode: 0, echo, data: {} }),
          );
      }, 60);
    });
  });
  const transport = new WsTransport(
    `ws://127.0.0.1:${(server.address() as { port: number }).port}`,
    "",
    { timeoutMs: 20, reconnectMs: 10 },
  );
  let events = 0;
  transport.onEvent(() => {
    events++;
  });
  await transport.connect();
  await assert.rejects(transport.call("hang"), UnknownOutcomeError);
  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(events, 0);
  await transport.close();
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(connections, 1);
});

test("HTTP 连接中取消不会再探测 Debug 接口", async (t) => {
  let requests = 0;
  let received!: () => void;
  const arrived = new Promise<void>((resolve) => {
    received = resolve;
  });
  const url = await http(t, () => {
    requests++;
    received();
  });
  const transport = new HttpTransport(url, "", { timeoutMs: 200 });
  const failed = assert.rejects(transport.connect());
  await arrived;
  await transport.close();
  await failed;
  assert.equal(requests, 1);
  assert.equal(transport.connected, false);
});
