import { parseArgs } from "node:util";
import { exportRollback } from "./infrastructure/storage/rollback.js";
const { values } = parseArgs({
  options: {
    source: { type: "string" },
    legacy: { type: "string" },
    destination: { type: "string" },
  },
});
if (!values.source || !values.legacy || !values.destination) {
  console.error(
    "用法：npm run export:rollback -- --source <新服务停止后的数据目录> --legacy <最终旧数据副本> --destination <空回退目录>",
  );
  process.exitCode = 1;
} else
  try {
    console.log(
      JSON.stringify(
        await exportRollback({
          source: values.source,
          legacy: values.legacy,
          destination: values.destination,
        }),
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : "回退导出失败");
    process.exitCode = 1;
  }
