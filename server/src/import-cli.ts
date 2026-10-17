import { parseArgs } from "node:util";
import { importLegacy } from "./infrastructure/storage/import-legacy.js";

const { values } = parseArgs({
  options: {
    source: { type: "string" },
    destination: { type: "string" },
    check: { type: "boolean", default: false },
    timezone: { type: "string" },
  },
});
if (!values.source || !values.destination) {
  console.error(
    "用法：npm run import:legacy -- --source <旧数据副本> --destination <独立新目录> [--check] [--timezone Asia/Shanghai]",
  );
  process.exitCode = 1;
} else {
  try {
    const report = await importLegacy({
      source: values.source,
      destination: values.destination,
      checkOnly: values.check,
      ...(values.timezone ? { timeZone: values.timezone } : {}),
    });
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "导入失败");
    process.exitCode = 1;
  }
}
