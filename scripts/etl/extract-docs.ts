/**
 * extract-docs.ts
 * 从 DOCX/DOC 文件提取文本，生成知识库条目
 */
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { execSync } from "child_process";

const ROOT = path.resolve(__dirname, "../..");
const KB_DIR = path.join(ROOT, "data/knowledge-base");
const ENTRIES_DIR = path.join(KB_DIR, "entries");

interface KBEntry {
  id: string;
  title: string;
  category: "work-summary" | "work-plan" | "scheme" | "opinion-report" | "campaign";
  source: string;
  date: string;
  content: string;
  summary: string;
  tags: string[];
}

interface KBIndex {
  version: string;
  lastUpdated: string;
  totalCount: number;
  entries: Array<{ id: string; title: string; category: string; tags: string[] }>;
}

// ── Category detection ──

const CATEGORY_RULES: Array<[RegExp, KBEntry["category"]]> = [
  [/总结/, "work-summary"],
  [/计划|工作要点/, "work-plan"],
  [/方案|措施|细则/, "scheme"],
  [/舆情|汇报|情况|报告/, "opinion-report"],
  [/宣传|宣讲|科普|提醒|注意|危险|历史|古代|救助/, "campaign"],
];

function detectCategory(filename: string, dirPath: string): KBEntry["category"] {
  const fullPath = dirPath + "/" + filename;
  for (const [pattern, cat] of CATEGORY_RULES) {
    if (pattern.test(fullPath)) return cat;
  }
  return "campaign";
}

// ── Date extraction ──

function extractDate(filename: string, dirName: string): string {
  // Try YYYYMMDD prefix in directory name
  const dirMatch = dirName.match(/(\d{8})/);
  if (dirMatch) {
    const d = dirMatch[1];
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }
  // Try year in filename
  const yearMatch = filename.match(/(20\d{2})年/);
  if (yearMatch) return `${yearMatch[1]}-01-01`;
  return "未知";
}

// ── Tag extraction ──

const TAG_KEYWORDS = [
  "酒驾", "醉驾", "超速", "疲劳驾驶", "安全带", "头盔",
  "春运", "国庆", "暑期", "高考", "开学",
  "暴雨", "冰雪", "大雾", "团雾", "恶劣天气",
  "高速公路", "国省道", "农村道路", "城市道路",
  "货车", "客车", "电动车", "摩托车", "危化品",
  "宣传", "教育", "培训", "执法", "整治",
  "舆情", "投诉", "处置", "应急",
  "抖音", "微信", "微博", "新媒体",
  "工作总结", "工作计划", "方案", "细则",
];

function extractTags(text: string, filename: string): string[] {
  const combined = filename + " " + text.slice(0, 2000);
  return TAG_KEYWORDS.filter(kw => combined.includes(kw));
}

// ── Title extraction ──

function extractTitle(filename: string, dirName: string): string {
  // Remove date prefix from directory name
  const cleaned = dirName.replace(/^\d{8}\s*/, "").trim();
  if (cleaned) return cleaned;
  // Use filename without extension
  return filename.replace(/\.(docx?|xlsx?)$/i, "").trim();
}

// ── Text extraction ──

async function extractTextFromDocx(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value.trim();
  } catch (e) {
    console.log(`    mammoth 解析失败: ${path.basename(filePath)}, 尝试 textutil`);
    return extractTextWithTextutil(filePath);
  }
}

function extractTextWithTextutil(filePath: string): string {
  try {
    const tmpTxt = filePath + ".tmp.txt";
    execSync(`textutil -convert txt -output "${tmpTxt}" "${filePath}"`, { timeout: 30000 });
    const text = fs.readFileSync(tmpTxt, "utf-8");
    fs.unlinkSync(tmpTxt);
    return text.trim();
  } catch (e) {
    console.log(`    textutil 也失败: ${path.basename(filePath)}`);
    return "";
  }
}

async function extractTextFromDoc(filePath: string): Promise<string> {
  return extractTextWithTextutil(filePath);
}

// ── Collect document files ──

interface DocFile {
  filePath: string;
  filename: string;
  dirName: string;
  parentDir: string;
}

function collectDocFiles(): DocFile[] {
  const files: DocFile[] = [];

  // 宣传材料 directory
  const xuanchuanDir = path.join(ROOT, "real-data/宣传材料");
  if (fs.existsSync(xuanchuanDir)) {
    for (const subDir of fs.readdirSync(xuanchuanDir)) {
      const subPath = path.join(xuanchuanDir, subDir);
      if (!fs.statSync(subPath).isDirectory()) continue;
      for (const file of fs.readdirSync(subPath)) {
        if (/\.(docx?|xlsx?)$/i.test(file) && !file.startsWith("~$")) {
          // Skip xlsx files (not documents)
          if (/\.xlsx?$/i.test(file) && !file.endsWith(".docx")) continue;
          files.push({
            filePath: path.join(subPath, file),
            filename: file,
            dirName: file.replace(/\.(docx?)$/i, ""),
            parentDir: subDir,
          });
        }
      }
    }
  }

  // 3月份 directory
  const marchDir = path.join(ROOT, "real-data/3月份");
  if (fs.existsSync(marchDir)) {
    for (const subDir of fs.readdirSync(marchDir)) {
      const subPath = path.join(marchDir, subDir);
      if (!fs.statSync(subPath).isDirectory()) continue;
      for (const file of fs.readdirSync(subPath)) {
        if (/\.docx$/i.test(file) && !file.startsWith("~$")) {
          files.push({
            filePath: path.join(subPath, file),
            filename: file,
            dirName: subDir,
            parentDir: "3月份",
          });
        }
      }
    }
  }

  return files;
}

// ── Main export ──

export async function extractDocs(): Promise<void> {
  console.log("=== Phase 2: 提取知识库文档 ===\n");

  fs.mkdirSync(ENTRIES_DIR, { recursive: true });

  const docFiles = collectDocFiles();
  console.log(`  发现 ${docFiles.length} 个文档文件\n`);

  const entries: KBEntry[] = [];
  let counter = 1;

  for (const doc of docFiles) {
    const ext = path.extname(doc.filename).toLowerCase();
    let text = "";

    console.log(`  [${counter}] ${doc.filename}`);

    if (ext === ".docx") {
      text = await extractTextFromDocx(doc.filePath);
    } else if (ext === ".doc") {
      text = await extractTextFromDoc(doc.filePath);
    }

    if (!text || text.length < 10) {
      console.log(`    → 跳过（内容过短或提取失败）`);
      counter++;
      continue;
    }

    const id = `kb-${String(counter).padStart(3, "0")}`;
    const title = extractTitle(doc.filename, doc.dirName);
    const category = detectCategory(doc.filename, doc.parentDir);
    const date = extractDate(doc.filename, doc.dirName);
    const tags = extractTags(text, doc.filename);
    const summary = text.slice(0, 500);

    const entry: KBEntry = { id, title, category, source: doc.filename, date, content: text, summary, tags };

    // Write individual entry
    const entryPath = path.join(ENTRIES_DIR, `${id}.json`);
    fs.writeFileSync(entryPath, JSON.stringify(entry, null, 2), "utf-8");
    entries.push(entry);

    console.log(`    → ${id}: ${title} (${category}, ${text.length}字, ${tags.length}标签)`);
    counter++;
  }

  // Write index
  const index: KBIndex = {
    version: "1.0",
    lastUpdated: new Date().toISOString(),
    totalCount: entries.length,
    entries: entries.map(e => ({
      id: e.id, title: e.title, category: e.category, tags: e.tags,
    })),
  };

  const indexPath = path.join(KB_DIR, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf-8");
  console.log(`\n  输出: ${indexPath} (${entries.length} 条知识库条目)\n`);
}
