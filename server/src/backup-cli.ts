import { parseArgs } from "node:util";
import {
  createBackup,
  restoreBackup,
} from "./infrastructure/storage/backup.js";
const { values } = parseArgs({
  options: {
    source: { type: "string" },
    destination: { type: "string" },
    restore: { type: "boolean", default: false },
  },
});
if (!values.source || !values.destination)
  throw new Error(
    "用法：--source <已停止的数据目录或备份> --destination <空目录> [--restore]",
  );
if (values.restore) {
  await restoreBackup(values.source, values.destination);
  console.log("完整备份校验并恢复完成，请核对路径后启动服务");
} else {
  const manifest = await createBackup(values.source, values.destination);
  console.log(
    `完整备份完成：${manifest.entries.filter((entry) => entry.kind === "file").length} 个文件（包含实例、账号、日志和密钥）`,
  );
}
