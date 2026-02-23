/**
 * parse-accidents.ts
 * 解析 HTML-table 格式的 XLS 事故数据文件，输出标准化 JSON
 */
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";

const ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = path.join(ROOT, "real-data/数据汇总");
const OUT_DIR = path.join(ROOT, "data/etl-output");

// ── Minor accident files (简易事故) ──

interface MinorAccident {
  id: string;
  time: string;
  location: string;
  minorInjuries: number;
  cause: string;
}

interface GeneralAccident {
  id: string;
  time: string;
  fatalities: number;
  injuries: number;
  cause: string;
  propertyDamage: number;
}

function readGBKFile(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  // Try GBK first, fall back to UTF-8
  try {
    const decoded = iconv.decode(buf, "gbk");
    if (decoded.includes("<html") || decoded.includes("<table")) return decoded;
  } catch { /* ignore */ }
  return buf.toString("utf-8");
}

function extractText(el: cheerio.Cheerio<cheerio.AnyNode>, $: cheerio.CheerioAPI): string {
  // Data is inside <a title="..."> tags
  const a = el.find("a");
  if (a.length > 0) {
    return (a.attr("title") || a.text()).trim();
  }
  return el.text().trim();
}

function parseMinorAccidentFile(filePath: string): MinorAccident[] {
  console.log(`  解析简易事故: ${path.basename(filePath)}`);
  const html = readGBKFile(filePath);
  const $ = cheerio.load(html);
  const results: MinorAccident[] = [];

  // Find data rows: skip header row(s) with <b> tags
  $("table tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 5) return;
    // Skip header rows
    if ($(cells[0]).find("b").length > 0) return;

    const id = extractText($(cells[0]), $);
    const time = extractText($(cells[1]), $);
    const location = extractText($(cells[2]), $);
    const minorInjuries = parseInt(extractText($(cells[3]), $), 10) || 0;
    const cause = extractText($(cells[4]), $);

    if (!id || !time || time === "事故发生时间") return;

    results.push({ id, time, location, minorInjuries, cause });
  });

  console.log(`    → ${results.length} 条记录`);
  return results;
}

function parseGeneralAccidentFile(filePath: string): GeneralAccident[] {
  console.log(`  解析一般事故: ${path.basename(filePath)}`);
  const html = readGBKFile(filePath);
  const $ = cheerio.load(html);
  const results: GeneralAccident[] = [];

  $("table tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 6) return;
    if ($(cells[0]).find("b").length > 0) return;

    const id = extractText($(cells[0]), $);
    const time = extractText($(cells[1]), $);
    const fatalities = parseInt(extractText($(cells[2]), $), 10) || 0;
    const injuries = parseInt(extractText($(cells[3]), $), 10) || 0;
    const cause = extractText($(cells[4]), $);
    const propertyDamage = parseFloat(extractText($(cells[5]), $)) || 0;

    if (!id || !time || time === "事故发生时间") return;

    results.push({ id, time, fatalities, injuries, cause, propertyDamage });
  });

  console.log(`    → ${results.length} 条记录`);
  return results;
}

// ── Handle the 2013-2014 frameset format ──

function parseFramesetFile(filePath: string): MinorAccident[] {
  // This file uses Excel frameset HTML with a reference to sheet001.htm
  // The actual data may be in a .files/ subdirectory or embedded
  const dir = filePath.replace(/\.xls$/, ".files");
  const sheetPath = path.join(dir, "sheet001.htm");

  if (fs.existsSync(sheetPath)) {
    return parseMinorAccidentFile(sheetPath);
  }

  // If no .files directory, try parsing the file directly
  // (it may contain the data inline in some cases)
  console.log(`  注意: ${path.basename(filePath)} 无 .files 目录，尝试直接解析`);
  return parseMinorAccidentFile(filePath);
}

// ── Main export ──

export async function parseAccidents(): Promise<void> {
  console.log("=== Phase 1: 解析事故数据 ===\n");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Parse minor accidents
  const minorFiles = [
    path.join(DATA_DIR, "2015年-2020年简易事故.xls"),
    path.join(DATA_DIR, "2021年-2023年1月16日简易事故.xls"),
  ];

  let allMinor: MinorAccident[] = [];
  for (const f of minorFiles) {
    if (fs.existsSync(f)) {
      allMinor = allMinor.concat(parseMinorAccidentFile(f));
    } else {
      console.log(`  跳过（文件不存在）: ${path.basename(f)}`);
    }
  }

  // Try 2013-2014 file (frameset format)
  const file2013 = path.join(DATA_DIR, "2013年-2014年简易事故.xls");
  if (fs.existsSync(file2013)) {
    allMinor = allMinor.concat(parseFramesetFile(file2013));
  }

  // Parse general accidents
  const generalFile = path.join(DATA_DIR, "2013年-2022年一般事故.xls");
  let allGeneral: GeneralAccident[] = [];
  if (fs.existsSync(generalFile)) {
    allGeneral = parseGeneralAccidentFile(generalFile);
  }

  // Write output
  const minorOut = path.join(OUT_DIR, "minor-accidents.json");
  fs.writeFileSync(minorOut, JSON.stringify(allMinor, null, 2), "utf-8");
  console.log(`\n  输出: ${minorOut} (${allMinor.length} 条)`);

  const generalOut = path.join(OUT_DIR, "general-accidents.json");
  fs.writeFileSync(generalOut, JSON.stringify(allGeneral, null, 2), "utf-8");
  console.log(`  输出: ${generalOut} (${allGeneral.length} 条)\n`);
}
