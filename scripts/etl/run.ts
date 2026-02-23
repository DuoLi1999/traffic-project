/**
 * run.ts — ETL 统一入口
 * 按顺序执行: parse-accidents → aggregate-accidents → extract-docs
 */
import { parseAccidents } from "./parse-accidents";
import { aggregateAccidents } from "./aggregate-accidents";
import { extractDocs } from "./extract-docs";

async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║   交通安全数据 ETL 流水线            ║");
  console.log("╚══════════════════════════════════════╝\n");

  const start = Date.now();

  await parseAccidents();
  await aggregateAccidents();
  await extractDocs();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✓ ETL 完成，耗时 ${elapsed}s`);
}

main().catch((err) => {
  console.error("ETL 失败:", err);
  process.exit(1);
});
