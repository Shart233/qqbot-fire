// QQ 的主入口按受管实例选择 NapCat 模块，避免写死共享工作目录。
const { pathToFileURL } = require("node:url");
(async () => {
  await import(pathToFileURL(process.env.NAPCAT_MAIN_PATH || "/opt/napcat/napcat.mjs").href);
})().catch(error => { console.error("NapCat 加载失败", error); process.exit(1); });
