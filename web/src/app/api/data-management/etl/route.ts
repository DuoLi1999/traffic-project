import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const DATA_ROOT = path.join(PROJECT_ROOT, "data");
const LOCK_PATH = path.join(DATA_ROOT, ".etl-running");
const STATUS_PATH = path.join(DATA_ROOT, ".etl-status.json");

export async function POST(request: NextRequest) {
  try {
    if (fs.existsSync(LOCK_PATH)) {
      return NextResponse.json({ error: "ETL 正在运行中，请稍后再试" }, { status: 409 });
    }

    const body = await request.json().catch(() => ({}));
    const target: string = body.target || "all";

    fs.writeFileSync(LOCK_PATH, new Date().toISOString());

    const writeStatus = (status: string, log: string) => {
      fs.writeFileSync(STATUS_PATH, JSON.stringify({
        lastRun: new Date().toISOString(),
        status,
        log,
      }));
    };

    writeStatus("running", "ETL 启动中...");

    const scriptPath = path.join(PROJECT_ROOT, "scripts/etl");
    let cmd: string;
    if (target === "extract-docs") {
      cmd = `cd "${scriptPath}" && npx tsx extract-docs.ts`;
    } else {
      cmd = `cd "${scriptPath}" && npx tsx run.ts`;
    }

    exec(cmd, { timeout: 300000, cwd: scriptPath }, (error, stdout, stderr) => {
      try { fs.unlinkSync(LOCK_PATH); } catch { /* ok */ }
      const log = (stdout || "") + (stderr ? "\n[stderr]\n" + stderr : "");
      if (error) {
        writeStatus("error", log + "\n[error] " + error.message);
      } else {
        writeStatus("success", log);
      }
    });

    return NextResponse.json({ success: true, message: "ETL 已启动", target });
  } catch (err) {
    try { fs.unlinkSync(LOCK_PATH); } catch { /* ok */ }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
