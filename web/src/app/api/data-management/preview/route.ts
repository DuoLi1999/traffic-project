import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");
const REAL_DATA_ROOT = path.join(PROJECT_ROOT, "real-data");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    if (category === "accident") {
      const summaryPath = path.join(DATA_ROOT, "accident-data/real-summary.json");
      if (!fs.existsSync(summaryPath)) {
        return NextResponse.json({ error: "暂无事故数据" }, { status: 404 });
      }
      const data = JSON.parse(fs.readFileSync(summaryPath, "utf-8"));
      return NextResponse.json({
        overview: data.overview,
        byViolationType: (data.byViolationType || []).slice(0, 10),
        period: data.period,
      });
    }

    if (category === "knowledge-base" && id) {
      const entryPath = path.join(DATA_ROOT, `knowledge-base/entries/${id}.json`);
      const resolved = path.resolve(entryPath);
      if (!resolved.startsWith(path.resolve(path.join(DATA_ROOT, "knowledge-base/entries")))) {
        return NextResponse.json({ error: "非法路径" }, { status: 400 });
      }
      if (!fs.existsSync(resolved)) {
        return NextResponse.json({ error: "条目不存在" }, { status: 404 });
      }
      const entry = JSON.parse(fs.readFileSync(resolved, "utf-8"));
      if (entry.content && entry.content.length > 1000) {
        entry.content = entry.content.slice(0, 1000) + "...";
      }
      return NextResponse.json(entry);
    }

    if (category === "knowledge-base" && !id) {
      const indexPath = path.join(DATA_ROOT, "knowledge-base/index.json");
      if (!fs.existsSync(indexPath)) {
        return NextResponse.json({ entries: [], totalCount: 0 });
      }
      const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
      // Enrich entries with date and content length
      const entries = (index.entries || []).map((e: { id: string; title: string; category: string; tags: string[] }) => {
        try {
          const ep = path.join(DATA_ROOT, `knowledge-base/entries/${e.id}.json`);
          const entry = JSON.parse(fs.readFileSync(ep, "utf-8"));
          return { ...e, date: entry.date || "", contentLength: (entry.content || "").length };
        } catch {
          return { ...e, date: "", contentLength: 0 };
        }
      });
      return NextResponse.json({ entries, totalCount: index.totalCount || 0 });
    }

    if (category === "files") {
      const dir = searchParams.get("dir");
      const dirMap: Record<string, string> = {
        accident: path.join(REAL_DATA_ROOT, "数据汇总"),
        document: path.join(REAL_DATA_ROOT, "宣传材料"),
        analytics: path.join(DATA_ROOT, "analytics"),
        custom: path.join(DATA_ROOT, "custom"),
      };

      const targetDir = dirMap[dir || ""];
      if (!targetDir) {
        return NextResponse.json({ error: "无效的目录" }, { status: 400 });
      }
      if (!fs.existsSync(targetDir)) {
        return NextResponse.json({ files: [] });
      }

      const files = listFiles(targetDir, targetDir);
      return NextResponse.json({ files });
    }

    return NextResponse.json({ error: "缺少 category 参数" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function listFiles(dir: string, baseDir: string): Array<{ name: string; sizeBytes: number; modifiedAt: string; path: string }> {
  if (!fs.existsSync(dir)) return [];
  const results: Array<{ name: string; sizeBytes: number; modifiedAt: string; path: string }> = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath, baseDir));
    } else {
      const stat = fs.statSync(fullPath);
      results.push({
        name: entry.name,
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        path: path.relative(baseDir, fullPath),
      });
    }
  }
  return results;
}