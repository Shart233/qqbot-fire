import { test, expect } from "@playwright/test";

test("初始化、真实接口、主题、Bot 上下文与全页面在桌面和手机可用", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByLabel("新密码", { exact: true }).fill("test-password-123");
  await page
    .getByLabel("确认新密码", { exact: true })
    .fill("test-password-123");
  await page.getByRole("button", { name: "确认并进入控制台" }).click();
  await expect(
    page.getByRole("heading", { name: "运行总览", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main > div")).toHaveCSS("opacity", "1");
  const connected = page.waitForResponse((response) =>
    response.url().endsWith("/api/bots/default/connect"),
  );
  await page.getByRole("button", { name: "连接", exact: true }).click();
  expect((await connected).status()).toBe(200);
  await expect(page.getByText("模拟 QQ · HTTP", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "切换到浅色主题" }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.screenshot({
    path: "output/migration-dashboard-light.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "切换到深色主题" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const token = await page.evaluate(() => localStorage.getItem("adminToken"));
  const headers = { Authorization: `Bearer ${token}` };
  expect(
    (
      await page.request.post("/api/bots", {
        headers,
        data: { name: "sample" },
      })
    ).status(),
  ).toBe(200);
  expect(
    (
      await page.request.post("/api/bots/sample/schedules", {
        headers,
        data: {
          name: "中文 / 测试",
          time: "23:59",
          targetType: "private",
          targets: [42],
          message: "模拟环境的任务",
          enabled: false,
        },
      })
    ).status(),
  ).toBe(200);
  await page.reload();
  const switched = page.waitForResponse((response) =>
    response.url().endsWith("/api/bots/sample/active"),
  );
  await page.getByLabel("当前操作 Bot").selectOption("sample");
  expect((await switched).status()).toBe(200);
  await expect(page.getByLabel("当前操作 Bot")).toHaveValue("sample");
  await page.getByRole("link", { name: "定时任务", exact: true }).click();
  await expect(
    page.getByRole("table").getByText("中文 / 测试", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("main > div")).toHaveCSS("opacity", "1");
  await page.screenshot({
    path: "output/migration-schedules-dark.png",
    fullPage: true,
  });
  await page.getByLabel("当前操作 Bot").selectOption("default");
  const routes = {
    bots: "Bot 实例",
    messages: "消息发送",
    contacts: "好友与群",
    napcat: "NapCat 管理",
    "nc-login": "QQ 扫码登录",
    "nc-logs": "NapCat 日志",
    console: "控制台",
    "server-logs": "服务端日志",
    logs: "操作日志",
    settings: "修改管理员密码",
    dashboard: "运行总览",
  };
  for (const [route, title] of Object.entries(routes)) {
    await page.goto("/#/" + route);
    await expect(
      page.locator("main").getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(page.locator("main > div")).toHaveCSS("opacity", "1");
    if (route === "napcat") {
      const config = await (
        await page.request.get("/api/bots/default/config", { headers })
      ).json();
      await page
        .getByRole("button", { name: "添加外部实例", exact: true })
        .click();
      const form = page.getByRole("dialog");
      await form.getByLabel("实例名称", { exact: true }).fill("remote-test");
      await form.getByLabel("QQ 号", { exact: true }).fill("12345");
      await form
        .getByLabel("WebUI 地址", { exact: true })
        .fill(config.data.httpUrl);
      await form
        .getByLabel("WebUI Token", { exact: true })
        .fill("test-webui-token");
      await form
        .getByLabel("OneBot HTTP 地址", { exact: true })
        .fill(config.data.httpUrl);
      await form
        .getByRole("button", { name: "保存外部实例", exact: true })
        .click();
      await expect(form).toBeHidden();
      await page
        .getByRole("button", { name: "扫码登录 remote-test", exact: true })
        .click();
      await expect(page.getByRole("img", { name: /二维码/ })).toBeVisible();
      await expect(page.getByRole("img", { name: /二维码/ })).toHaveAttribute(
        "src",
        /^data:image\/png;base64,/,
      );
      await page.goto("/#/napcat");
      await expect(
        page.getByText("remote-test", { exact: true }),
      ).toBeVisible();
    }
    if (route === "contacts")
      await expect(
        page.getByRole("cell", { name: "模拟好友", exact: true }),
      ).toBeVisible();
    if (route === "messages") {
      await expect(
        page.getByRole("combobox", { name: "选择 Bot", exact: true }),
      ).toHaveValue("default");
      await page.getByPlaceholder("群号", { exact: true }).fill("123");
      await page
        .getByPlaceholder("输入消息内容...")
        .fill("仅发送至模拟 OneBot");
      const sent = page.waitForResponse((response) =>
        response.url().endsWith("/api/bots/default/send"),
      );
      await page.getByRole("button", { name: "发送消息", exact: true }).click();
      expect((await sent).status()).toBe(200);
      await expect(page.getByPlaceholder("输入消息内容...")).toHaveValue("");
      await page.getByPlaceholder("输入消息内容...").fill("模拟未决，请勿重发");
      const unknown = page.waitForResponse((response) =>
        response.url().endsWith("/api/bots/default/send"),
      );
      await page.getByRole("button", { name: "发送消息", exact: true }).click();
      expect((await unknown).status()).toBe(504);
      await expect(
        page.getByText("操作结果未决", { exact: true }),
      ).toBeVisible();
      await expect(page.getByPlaceholder("输入消息内容...")).toHaveValue(
        "模拟未决，请勿重发",
      );
    }
    if (route === "bots") {
      const trigger = page
        .getByRole("button", { name: "配置", exact: true })
        .first();
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect
        .poll(() =>
          dialog.evaluate((el) => el.contains(document.activeElement)),
        )
        .toBe(true);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    await expect(page.locator("body")).not.toContainText("此接口尚未迁移");
  }
  await page.screenshot({
    path: "output/migration-dashboard-dark.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "运行总览", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main > div")).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "output/migration-dashboard-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
