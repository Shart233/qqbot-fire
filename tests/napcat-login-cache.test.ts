import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

const require = createRequire(import.meta.url);
const { patchNapCatLogin } = require("../docker/patch-napcat-login.cjs") as {
  patchNapCatLogin(source: string): string;
};

const fixture = `async function initializeLogin(service) {
  service.initConfig({ appid: "test", commonPath: "/persistent", clientVer: "test" });
}`;

test("QQ 初始化后开启保存凭据，扫码登录记录能供下次启动读取", async () => {
  const initialize = runInNewContext(
    patchNapCatLogin(fixture) + "\ninitializeLogin;",
  ) as (service: object) => Promise<void>;
  let remember = false;
  const history: string[] = [];
  const service = {
    initConfig() { remember = false; },
    setRemerberPwd(value: boolean) { remember = value; },
    scanLogin() { if (remember) history.push("test-account"); },
  };
  await initialize(service);
  service.scanLogin();
  await initialize(service);
  assert.deepEqual(history, ["test-account"]);
});

test("重复执行兼容修复保持内容不变", () => {
  const once = patchNapCatLogin(fixture);
  assert.equal(patchNapCatLogin(once), once);
});

test("上游初始化结构缺失或存在歧义时拒绝修改", () => {
  assert.throws(() => patchNapCatLogin("export const version = 1;"), /初始化/);
  assert.throws(() => patchNapCatLogin(fixture + fixture), /初始化/);
});

test("QQ 缺少保存凭据接口时明确报错，避免假装已经启用", async () => {
  const initialize = runInNewContext(
    patchNapCatLogin(fixture) + "\ninitializeLogin;",
  ) as (service: object) => Promise<void>;
  await assert.rejects(initialize({ initConfig() {} }), /保存登录凭据/);
});
