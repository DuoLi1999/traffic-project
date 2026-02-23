import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");
const REAL_DATA_ROOT = path.join(PROJECT_ROOT, "real-data");

function dirSize(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(p);
    else total += fs.statSync(p).size;
  }
  return total;
}

function countFiles(dir: string, extensions?: string[]): number {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(p, extensions);
    } else if (!extensions || extensions.some((e) => entry.name.endsWith(e))) {
      count++;
    }
  }
  return count;
}

function latestMtime(dir: string): Date | null {
  if (!fs.existsSync(dir)) return null;
  let latest: Date | null = null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    const mt = entry.isDirectory() ? latestMtime(p) : fs.statSync(p).mtime;
    if (mt && (!latest || mt > latest)) latest = mt;
  }
  return latest;
}

export async function GET() {
  try {
    let accidentRecords = 0;
    const etlOutputDir = path.join(DATA_ROOT, "etl-output");
    if (fs.existsSync(etlOutputDir)) {
      for (const f of fs.readdirSync(etlOutputDir)) {
        if (f.endsWith(".json")) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(etlOutputDir, f), "utf-8"));
            if (Array.isArray(data)) accidentRecords += data.length;
          } catch { /* skip */ }
        }
      }
    }

    let kbEntries = 0;
    const kbIndexPath = path.join(DATA_ROOT, "knowledge-base/index.json");
    if (fs.existsSync(kbIndexPath)) {
      try {
        const idx = JSON.parse(fs.readFileSync(kbIndexPath, "utf-8"));
        kbEntries = idx.totalCount || 0;
      } catch { /* skip */ }
    }

    const analyticsDir = path.join(DATA_ROOT, "analytics");
    const analyticsFiles = countFiles(analyticsDir, [".json"]);
    const diskUsageBytes = dirSize(DATA_ROOT) + dirSize(REAL_DATA_ROOT);

    const accidentDataDir = path.join(REAL_DATA_ROOT, "数据汇总");
    const docDir = path.join(REAL_DATA_ROOT, "宣传材料");

    const sources = [
      {
        name: "事故数据", category: "accident",
        recordCount: accidentRecords,
        fileCount: countFiles(accidentDataDir, [".xls", ".xlsx"]),
        sizeBytes: dirSize(accidentDataDir),
        lastUpdated: latestMtime(accidentDataDir)?.toISOString() || null,
        status: accidentRecords > 0 ? "ready" : "empty",
      },
      {
        name: "知识库", category: "knowledge-base",
        recordCount: kbEntries,
        fileCount: countFiles(path.join(DATA_ROOT, "knowledge-base/entries"), [".json"]),
        sizeBytes: dirSize(path.join(DATA_ROOT, "knowledge-base")),
        lastUpdated: latestMtime(path.join(DATA_ROOT, "knowledge-base"))?.toISOString() || null,
        status: kbEntries > 0 ? "ready" : "empty",
      },
      {
        name: "宣传文档", category: "document",
        recordCount: countFiles(docDir, [".doc", ".docx"]),
        fileCount: countFiles(docDir),
        sizeBytes: dirSize(docDir),
        lastUpdated: latestMtime(docDir)?.toISOString() || null,
        status: countFiles(docDir) > 0 ? "ready" : "empty",
      },
      {
        name: "分析数据", category: "analytics",
        recordCount: analyticsFiles,
        fileCount: analyticsFiles,
        sizeBytes: dirSize(analyticsDir),
        lastUpdated: latestMtime(analyticsDir)?.toISOString() || null,
        status: analyticsFiles > 0 ? "ready" : "empty",
      },
    ];

    const etlStatusPath = path.join(DATA_ROOT, ".etl-status.json");
    let etl = { lastRun: null as string | null, status: "idle" as string, log: "" };
    if (fs.existsSync(etlStatusPath)) {
      try { etl = JSON.parse(fs.readFileSync(etlStatusPath, "utf-8")); } catch { /* skip */ }
    }
    if (fs.existsSync(path.join(DATA_ROOT, ".etl-running"))) {
      etl.status = "running";
    }

    return NextResponse.json({ accidentRecords, kbEntries, analyticsFiles, diskUsageBytes, sources, etl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
