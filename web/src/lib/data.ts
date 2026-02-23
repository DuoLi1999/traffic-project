import fs from "fs";
import path from "path";
import type {
  AccidentData,
  MaterialIndex,
  MaterialDetail,
  PlatformAnalytics,
  KBIndex,
  KBEntry,
} from "./types";

const DATA_ROOT = path.join(process.cwd(), "..", "data");

function readJSON<T>(filePath: string): T {
  const fullPath = path.join(DATA_ROOT, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getAccidentData(): AccidentData {
  // Prefer real aggregated data, fall back to mock
  try {
    return readJSON<AccidentData>("accident-data/real-summary.json");
  } catch {
    return readJSON<AccidentData>("accident-data/2025-summary.json");
  }
}

export function getAccidentDataByYear(year: number): AccidentData | null {
  try {
    return readJSON<AccidentData>(`accident-data/by-year/${year}.json`);
  } catch {
    return null;
  }
}

export function getMaterialIndex(): MaterialIndex {
  return readJSON<MaterialIndex>("materials/index.json");
}

export function getMaterialDetail(id: string): MaterialDetail | null {
  try {
    return readJSON<MaterialDetail>(`materials/items/${id}.json`);
  } catch {
    return null;
  }
}

export function getAnalytics(platform: string): PlatformAnalytics | null {
  try {
    return readJSON<PlatformAnalytics>(`analytics/${platform}-202601.json`);
  } catch {
    return null;
  }
}

export function getAllAnalytics(): PlatformAnalytics[] {
  const platforms = ["wechat", "weibo", "douyin"];
  return platforms
    .map((p) => getAnalytics(p))
    .filter((a): a is PlatformAnalytics => a !== null);
}

export function searchMaterials(
  query: string,
  type?: string
): MaterialDetail[] {
  const index = getMaterialIndex();
  let filtered = index.materials;

  if (type && type !== "all") {
    filtered = filtered.filter((m) => m.type === type);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return filtered.map((m) => {
    const detail = getMaterialDetail(m.id);
    return detail || ({ ...m, filename: "", source: "", description: "", location: "", date: "", usageCount: 0 } as MaterialDetail);
  });
}

const TEMPLATE_ROOT = path.join(process.cwd(), "..", "templates");

export function getTemplate(name: string): string {
  try {
    return fs.readFileSync(path.join(TEMPLATE_ROOT, name), "utf-8");
  } catch {
    return "";
  }
}

// ── Knowledge base ──

export function getKBIndex(): KBIndex | null {
  try {
    return readJSON<KBIndex>("knowledge-base/index.json");
  } catch {
    return null;
  }
}

export function getKBEntry(id: string): KBEntry | null {
  try {
    return readJSON<KBEntry>(`knowledge-base/entries/${id}.json`);
  } catch {
    return null;
  }
}

export function searchKB(query: string, category?: KBEntry["category"]): KBEntry[] {
  const index = getKBIndex();
  if (!index) return [];

  const q = query.toLowerCase();
  let matched = index.entries.filter((e) => {
    if (category && e.category !== category) return false;
    return (
      e.title.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return matched
    .slice(0, 5)
    .map((e) => getKBEntry(e.id))
    .filter((e): e is KBEntry => e !== null);
}
