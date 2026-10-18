// QQ 登录服务默认不保存凭据；在配置初始化后显式开启，供下次启动快速登录。
const { readFileSync, writeFileSync } = require("node:fs");
const marker = "// qqbot-fire：保存登录凭据兼容修复 v1";

function patchNapCatLogin(source) {
  if (source.includes(marker)) return source;
  const candidates = [...source.matchAll(
    /\b([A-Za-z_$][\w$]*)\.initConfig\(\{([^{}]*)\}\);/g,
  )].filter((match) =>
    ["appid", "commonPath", "clientVer"].every((key) =>
      new RegExp("\\b" + key + "\\s*:").test(match[2]),
    ),
  );
  if (candidates.length !== 1)
    throw new Error("无法唯一定位 NapCat 登录初始化，请核对上游版本后更新兼容修复");
  const match = candidates[0];
  const service = match[1];
  const addition = `\n  ${marker}\n  if (typeof ${service}.setRemerberPwd !== "function")\n    throw new Error("QQ 内核不支持保存登录凭据，请核对 QQ/NapCat 版本");\n  ${service}.setRemerberPwd(true);`;
  return source.slice(0, match.index) + match[0] + addition +
    source.slice(match.index + match[0].length);
}

module.exports = { patchNapCatLogin };

if (require.main === module) {
  const path = process.argv[2];
  if (!path) throw new Error("请提供 NapCat 模块路径");
  const source = readFileSync(path, "utf8");
  const patched = patchNapCatLogin(source);
  if (patched !== source) writeFileSync(path, patched);
  process.stdout.write("NapCat 保存登录凭据兼容修复已检查\n");
}
