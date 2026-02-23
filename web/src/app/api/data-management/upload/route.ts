import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");
const REAL_DATA_ROOT = path.join(PROJECT_ROOT, "real-data");

const CATEGORY_DIRS: Record<string, string> = {
  accident: path.join(REAL_DATA_ROOT, "数据汇总"),
  document: path.join(REAL_DATA_ROOT, "宣传材料/导入文档"),
  analytics: path.join(DATA_ROOT, "analytics"),
  custom: path.join(DATA_ROOT, "custom"),
};

const CATEGORY_EXTENSIONS: Record<string, string[]> = {
  accident: [".xls", ".xlsx"],
  document: [".doc", ".docx"],
  analytics: [".json"],
  custom: [".json"],
};

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file || !category) {
      return NextResponse.json({ error: "缺少文件或类别参数" }, { status: 400 });
    }

    if (!CATEGORY_DIRS[category]) {
      return NextResponse.json({ error: "无效的类别" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "文件大小超过50MB限制" }, { status: 400 });
    }

    const allowedExts = CATEGORY_EXTENSIONS[category];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `该类别仅支持 ${allowedExts.join(", ")} 格式` },
        { status: 400 }
      );
    }

    const targetDir = CATEGORY_DIRS[category];
    fs.mkdirSync(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, file.name);
    const resolved = path.resolve(targetPath);
    if (!resolved.startsWith(path.resolve(targetDir))) {
      return NextResponse.json({ error: "非法文件路径" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(resolved, buffer);

    return NextResponse.json({
      success: true,
      message: `文件 ${file.name} 已上传到 ${category}`,
      path: resolved,
      size: file.size,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
