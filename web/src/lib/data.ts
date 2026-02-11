import fs from "fs";
import path from "path";
import type {
  AccidentData,
  MaterialIndex,
  MaterialDetail,
  PlatformAnalytics,
} from "./types";

const DATA_ROOT = path.join(process.cwd(), "..", "data");

function readJSON<T>(filePath: string): T {
  const fullPath = path.join(DATA_ROOT, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getAccidentData(): AccidentData {
  return readJSON<AccidentData>("accident-data/2025-summary.json");
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
