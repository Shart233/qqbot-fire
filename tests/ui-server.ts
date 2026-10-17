import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer } from "node:http";
import { createApp } from "../server/src/bootstrap.js";
const dataDir = await mkdtemp(join(tmpdir(), "qqbot-ui-"));
let messages = 0;
const mock = createServer(async (req, res) => {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const params = raw ? JSON.parse(raw) : {};
  if (req.url?.startsWith("/api/")) {
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        code: 0,
        data: req.url.endsWith("/auth/login")
          ? { Credential: "mock-session" }
          : {
              isLogin: false,
              isOffline: false,
              loginError: "",
              qrcodeurl: "https://qrcode.qq.com/test",
            },
      }),
    );
    return;
  }
  if (String(params.message?.[0]?.data?.text ?? "").includes("模拟未决")) {
    req.socket.destroy();
    return;
  }
  const action = req.url?.slice(1);
  const data =
    action === "get_login_info"
      ? { user_id: 12345, nickname: "模拟 QQ" }
      : action === "get_friend_list"
        ? [{ user_id: 42, nickname: "模拟好友", remark: "测试联系人" }]
        : action === "get_group_list"
          ? [
              {
                group_id: 123,
                group_name: "模拟测试群",
                member_count: 2,
                max_member_count: 200,
              },
            ]
          : action === "get_status"
            ? { online: true }
            : action?.startsWith("send_")
              ? { message_id: ++messages }
              : {
                  app_name: "模拟 OneBot",
                  app_version: "1.0",
                  protocol_version: "v11",
                };
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ status: "ok", retcode: 0, data }));
});
await new Promise<void>((resolve) => mock.listen(0, "127.0.0.1", resolve));
const mockUrl = `http://127.0.0.1:${(mock.address() as { port: number }).port}`;
await writeFile(
  join(dataDir, "config.json"),
  JSON.stringify({
    bots: {
      default: {
        mode: "http",
        httpUrl: mockUrl,
        wsUrl: "",
        httpToken: "",
        wsToken: "",
      },
    },
    activeBot: "default",
  }),
);
const app = await createApp({
  dataDir,
  logger: false,
  staticDir: resolve("web-ui/dist"),
});
await app.listen({ host: "127.0.0.1", port: 19989 });
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.once(signal, () => {
    void (async () => {
      await app.close();
      mock.closeAllConnections();
      await new Promise<void>((resolve) => mock.close(() => resolve()));
      await rm(dataDir, { recursive: true, force: true });
    })();
  });
