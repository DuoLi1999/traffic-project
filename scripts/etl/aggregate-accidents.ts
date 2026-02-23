/**
 * aggregate-accidents.ts
 * 将 ETL 中间产物聚合为 AccidentData 格式
 */
import fs from "fs";
import path from "path";
import { mapCause } from "./cause-mapping";

const ROOT = path.resolve(__dirname, "../..");
const ETL_DIR = path.join(ROOT, "data/etl-output");
const OUT_DIR = path.join(ROOT, "data/accident-data");
const BY_YEAR_DIR = path.join(OUT_DIR, "by-year");

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

interface AccidentRecord {
  year: number;
  month: number;
  hour: number;
  location: string;
  cause: string;
  fatalities: number;
  injuries: number;
  propertyDamage: number;
  type: "minor" | "general";
}

function parseTime(raw: string): { year: number; month: number; hour: number } | null {
  // Format: "2015-01-01 16:20:00.0" or similar
  const m = raw.match(/(\d{4})-(\d{2})-\d{2}\s+(\d{2})/);
  if (!m) return null;
  return { year: parseInt(m[1]), month: parseInt(m[2]), hour: parseInt(m[3]) };
}

function normalizeRecords(): AccidentRecord[] {
  const records: AccidentRecord[] = [];

  // Load minor accidents
  const minorPath = path.join(ETL_DIR, "minor-accidents.json");
  if (fs.existsSync(minorPath)) {
    const minor: MinorAccident[] = JSON.parse(fs.readFileSync(minorPath, "utf-8"));
    for (const r of minor) {
      const t = parseTime(r.time);
      if (!t) continue;
      records.push({
        year: t.year, month: t.month, hour: t.hour,
        location: r.location || "",
        cause: mapCause(r.cause),
        fatalities: 0,
        injuries: r.minorInjuries,
        propertyDamage: 0,
        type: "minor",
      });
    }
  }

  // Load general accidents
  const generalPath = path.join(ETL_DIR, "general-accidents.json");
  if (fs.existsSync(generalPath)) {
    const general: GeneralAccident[] = JSON.parse(fs.readFileSync(generalPath, "utf-8"));
    for (const r of general) {
      const t = parseTime(r.time);
      if (!t) continue;
      records.push({
        year: t.year, month: t.month, hour: t.hour,
        location: r.cause ? "" : "", // general accidents don't have location field
        cause: mapCause(r.cause),
        fatalities: r.fatalities,
        injuries: r.injuries,
        propertyDamage: r.propertyDamage,
        type: "general",
      });
    }
  }

  return records;
}

function getTimePeriod(hour: number): string {
  if (hour >= 0 && hour < 6) return "凌晨(0-6时)";
  if (hour >= 6 && hour < 9) return "早高峰(6-9时)";
  if (hour >= 9 && hour < 11) return "上午(9-11时)";
  if (hour >= 11 && hour < 14) return "午间(11-14时)";
  if (hour >= 14 && hour < 17) return "下午(14-17时)";
  if (hour >= 17 && hour < 20) return "晚高峰(17-20时)";
  return "夜间(20-24时)";
}

interface AggResult {
  period: string;
  generatedDate: string;
  region: string;
  overview: {
    totalAccidents: number;
    totalFatalities: number;
    totalInjuries: number;
    totalPropertyDamage: number;
    yoyAccidentChange: number;
    yoyFatalityChange: number;
  };
  monthlyTrend: { month: number; accidents: number; fatalities: number; injuries: number }[];
  byAccidentType: { type: string; count: number; percentage: number; fatalities: number }[];
  byViolationType: { type: string; count: number; percentage: number; fatalities?: number }[];
  highRiskAreas: {
    location: string; type: string; accidents: number; fatalities: number;
    mainCause: string; riskLevel: string; seasonalPattern: string;
  }[];
  highRiskGroups: {
    group: string; involvedAccidents: number; percentage: number;
    mainViolation: string; riskLevel: string;
  }[];
  weatherRelated: { weather: string; accidents: number; percentage: number }[];
  timeDistribution: { period: string; accidents: number; fatalities: number }[];
}

function aggregate(records: AccidentRecord[], period: string): AggResult {
  const total = records.length;
  const totalFatalities = records.reduce((s, r) => s + r.fatalities, 0);
  const totalInjuries = records.reduce((s, r) => s + r.injuries, 0);
  const totalPropertyDamage = Math.round(records.reduce((s, r) => s + r.propertyDamage, 0) / 10000); // 转万元

  // Monthly trend
  const monthMap = new Map<number, { accidents: number; fatalities: number; injuries: number }>();
  for (let m = 1; m <= 12; m++) monthMap.set(m, { accidents: 0, fatalities: 0, injuries: 0 });
  for (const r of records) {
    const entry = monthMap.get(r.month)!;
    entry.accidents++;
    entry.fatalities += r.fatalities;
    entry.injuries += r.injuries;
  }
  const monthlyTrend = Array.from(monthMap.entries()).map(([month, d]) => ({ month, ...d }));

  // By violation type (cause)
  const causeMap = new Map<string, { count: number; fatalities: number }>();
  for (const r of records) {
    const entry = causeMap.get(r.cause) || { count: 0, fatalities: 0 };
    entry.count++;
    entry.fatalities += r.fatalities;
    causeMap.set(r.cause, entry);
  }
  const byViolationType = Array.from(causeMap.entries())
    .map(([type, d]) => ({
      type,
      count: d.count,
      percentage: total > 0 ? Math.round((d.count / total) * 10000) / 10000 : 0,
      fatalities: d.fatalities > 0 ? d.fatalities : undefined,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // By accident type (minor vs general)
  const minorCount = records.filter(r => r.type === "minor").length;
  const generalCount = records.filter(r => r.type === "general").length;
  const generalFatalities = records.filter(r => r.type === "general").reduce((s, r) => s + r.fatalities, 0);
  const byAccidentType = [
    { type: "简易事故", count: minorCount, percentage: total > 0 ? Math.round((minorCount / total) * 10000) / 10000 : 0, fatalities: 0 },
    { type: "一般事故", count: generalCount, percentage: total > 0 ? Math.round((generalCount / total) * 10000) / 10000 : 0, fatalities: generalFatalities },
  ].filter(t => t.count > 0);

  // High risk areas (by location, for minor accidents that have location)
  const locMap = new Map<string, { count: number; fatalities: number; causes: Map<string, number> }>();
  for (const r of records) {
    if (!r.location) continue;
    // Normalize location: extract road name (e.g., "G3 493公里" → "G3")
    const roadMatch = r.location.match(/^([GS]\d+|京台|青兰|泰新|济广|莱泰)/);
    const road = roadMatch ? roadMatch[1] : r.location.slice(0, 10);
    const entry = locMap.get(road) || { count: 0, fatalities: 0, causes: new Map() };
    entry.count++;
    entry.fatalities += r.fatalities;
    entry.causes.set(r.cause, (entry.causes.get(r.cause) || 0) + 1);
    locMap.set(road, entry);
  }
  const highRiskAreas = Array.from(locMap.entries())
    .filter(([, d]) => d.count >= 10)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([location, d]) => {
      const topCause = Array.from(d.causes.entries()).sort((a, b) => b[1] - a[1])[0];
      return {
        location,
        type: "高速公路",
        accidents: d.count,
        fatalities: d.fatalities,
        mainCause: topCause ? topCause[0] : "未知",
        riskLevel: d.count > 500 ? "极高" : d.count > 200 ? "高" : d.count > 50 ? "中" : "低",
        seasonalPattern: "全年",
      };
    });

  // Time distribution
  const timeMap = new Map<string, { accidents: number; fatalities: number }>();
  for (const r of records) {
    const period = getTimePeriod(r.hour);
    const entry = timeMap.get(period) || { accidents: 0, fatalities: 0 };
    entry.accidents++;
    entry.fatalities += r.fatalities;
    timeMap.set(period, entry);
  }
  const timeDistribution = Array.from(timeMap.entries())
    .map(([period, d]) => ({ period, ...d }))
    .sort((a, b) => b.accidents - a.accidents);

  return {
    period,
    generatedDate: new Date().toISOString().split("T")[0],
    region: "泰安高速公路辖区",
    overview: {
      totalAccidents: total,
      totalFatalities,
      totalInjuries,
      totalPropertyDamage,
      yoyAccidentChange: 0,
      yoyFatalityChange: 0,
    },
    monthlyTrend,
    byAccidentType,
    byViolationType,
    highRiskAreas,
    highRiskGroups: [], // Cannot derive from available data
    weatherRelated: [], // Cannot derive from available data
    timeDistribution,
  };
}

export async function aggregateAccidents(): Promise<void> {
  console.log("=== Phase 1b: 聚合事故数据 ===\n");

  fs.mkdirSync(BY_YEAR_DIR, { recursive: true });

  const allRecords = normalizeRecords();
  console.log(`  总记录数: ${allRecords.length}`);

  // Group by year
  const byYear = new Map<number, AccidentRecord[]>();
  for (const r of allRecords) {
    const arr = byYear.get(r.year) || [];
    arr.push(r);
    byYear.set(r.year, arr);
  }

  // Compute YoY for full summary
  const years = Array.from(byYear.keys()).sort();
  console.log(`  年份范围: ${years[0]} - ${years[years.length - 1]}`);

  // Generate per-year files
  for (const year of years) {
    const records = byYear.get(year)!;
    const result = aggregate(records, `${year}年`);

    // Compute YoY vs previous year
    const prevRecords = byYear.get(year - 1);
    if (prevRecords) {
      const prevTotal = prevRecords.length;
      const prevFatalities = prevRecords.reduce((s, r) => s + r.fatalities, 0);
      if (prevTotal > 0) {
        result.overview.yoyAccidentChange = Math.round(((records.length - prevTotal) / prevTotal) * 10000) / 10000;
      }
      if (prevFatalities > 0) {
        const curFatalities = records.reduce((s, r) => s + r.fatalities, 0);
        result.overview.yoyFatalityChange = Math.round(((curFatalities - prevFatalities) / prevFatalities) * 10000) / 10000;
      }
    }

    const outPath = path.join(BY_YEAR_DIR, `${year}.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`  输出: by-year/${year}.json (${records.length} 条)`);
  }

  // Generate full summary
  const fullSummary = aggregate(allRecords, `${years[0]}-${years[years.length - 1]}年`);

  // Compute YoY using last two years
  if (years.length >= 2) {
    const lastYear = years[years.length - 1];
    const prevYear = years[years.length - 2];
    const lastRecords = byYear.get(lastYear)!;
    const prevRecords = byYear.get(prevYear)!;
    if (prevRecords.length > 0) {
      fullSummary.overview.yoyAccidentChange = Math.round(((lastRecords.length - prevRecords.length) / prevRecords.length) * 10000) / 10000;
    }
    const lastFat = lastRecords.reduce((s, r) => s + r.fatalities, 0);
    const prevFat = prevRecords.reduce((s, r) => s + r.fatalities, 0);
    if (prevFat > 0) {
      fullSummary.overview.yoyFatalityChange = Math.round(((lastFat - prevFat) / prevFat) * 10000) / 10000;
    }
  }

  const summaryPath = path.join(OUT_DIR, "real-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(fullSummary, null, 2), "utf-8");
  console.log(`\n  输出: ${summaryPath}\n`);
}
