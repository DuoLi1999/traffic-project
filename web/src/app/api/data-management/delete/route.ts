import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");
const REAL_DATA_ROOT = path.join(PROJECT_ROOT, "real-data");

const TYPE_DIRS: Record<string, string> = {
  "raw-file": path.join(REAL_DATA_ROOT, "数据汇总"),
  "document": path.join(REAL_DATA_ROOT, "宣传材料"),
  "analytics": path.join(DATA_ROOT, "analytics"),
  "custom": path.join(DATA_ROOT, "custom"),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json({ error: "缺少 type 或 id 参数" }, { status: 400 });
    }

    if (type === "kb-entry") {
      return deleteKBEntry(id);
    }

    const baseDir = TYPE_DIRS[type];
    if (!baseDir) {
      return NextResponse.json({ error: "无效的类型" }, { status: 400 });
    }

    const targetPath = path.resolve(path.join(baseDir, id));
    if (!targetPath.startsWith(path.resolve(baseDir))) {
      return NextResponse.json({ error: "非法文件路径" }, { status: 400 });
    }

    if (!fs.existsSync(targetPath)) {
      return NextResponse.json({ error: "文件不存在" }, { status: 404 });
    }

    fs.unlinkSync(targetPath);
    return NextResponse.json({ success: true, message: `已删除 ${id}` });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function deleteKBEntry(id: string) {
  const entryPath = path.join(DATA_ROOT, "knowledge-base/entries", `${id}.json`);
  const resolved = path.resolve(entryPath);
  if (!resolved.startsWith(path.resolve(path.join(DATA_ROOT, "knowledge-base/entries")))) {
    return NextResponse.json({ error: "非法路径" }, { status: 400 });
  }
  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: "条目不存在" }, { status: 404 });
  }

  fs.unlinkSync(resolved);

  // Update index.json
  const indexPath = path.join(DATA_ROOT, "knowledge-base/index.json");
  if (fs.existsSync(indexPath)) {
    try {
      const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
      index.entries = index.entries.filter((e: { id: string }) => e.id !== id);
      index.totalCount = index.entries.length;
      index.lastUpdated = new Date().toISOString();
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    } catch { /* skip */ }
  }

  return NextResponse.json({ success: true, message: `已删除知识库条目 ${id}` });
}
