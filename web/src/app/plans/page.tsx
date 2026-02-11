"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlannedFeatures } from "@/components/ui/planned-features";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, Calendar, Lightbulb } from "lucide-react";

const PLANNED = [
  { name: "全流程跟踪", description: "任务分解、责任指派、进度跟踪，实现计划全生命周期管理" },
  { name: "灵活调整管理", description: "版本留存、动态调整，支持计划的迭代与变更记录" },
];

// 根据月份推荐的宣传主题
const MONTH_THEMES: Record<string, { label: string; tags: string[] }> = {
  "1": {
    label: "1月：冬季安全 · 春运启动",
    tags: ["春运安全出行", "冰雪路面驾驶", "年终岁末酒驾整治", "农村道路安全"],
  },
  "2": {
    label: "2月：春节 · 春运返程",
    tags: ["春节自驾安全", "春运返程高峰", "元宵出行提醒", "疲劳驾驶警示"],
  },
  "3": {
    label: "3月：开学季 · 春雨",
    tags: ["开学季校园周边交通", "春雨湿滑路面", "全国两会安保", "一盔一带常态化"],
  },
  "4": {
    label: "4月：清明出行 · 春游高峰",
    tags: ["清明祭扫出行", "春游自驾安全", "货运超载治理", "摩托车/电动车安全"],
  },
  "5": {
    label: "5月：五一长假 · 初夏",
    tags: ["五一假期出行", "旅游景区交通", "初夏暴雨预防", "交通安全宣传月"],
  },
  "6": {
    label: "6月：高考 · 暑期前",
    tags: ["高考爱心护航", "儿童交通安全", "端午出行安全", "暑期出行预热"],
  },
  "7": {
    label: "7月：暑期高峰 · 汛期",
    tags: ["暑期亲子出行", "暴雨洪水应急", "高温疲劳驾驶", "涉水行车安全"],
  },
  "8": {
    label: "8月：暑期 · 开学准备",
    tags: ["暑期出游安全", "台风预警应对", "开学前安全教育", "夜间行车安全"],
  },
  "9": {
    label: "9月：开学季 · 秋季",
    tags: ["开学季护学岗", "中秋出行安全", "秋季团雾预警", "减量控大专项"],
  },
  "10": {
    label: "10月：国庆 · 秋收",
    tags: ["国庆长假出行", "高速公路安全", "农忙农机安全", "秋冬转换安全"],
  },
  "11": {
    label: "11月：入冬 · 交通安全日",
    tags: ["122全国交通安全日", "入冬安全提醒", "大雾天气安全", "老年人出行安全"],
  },
  "12": {
    label: "12月：冬季安全 · 年终",
    tags: ["冰雪路面安全", "年末聚会酒驾", "冬季货运安全", "年终安全总结"],
  },
};

export default function PlansPage() {
  const [month, setMonth] = useState("3");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const themes = MONTH_THEMES[month];

  function handleTagClick(tag: string) {
    setFocus((prev) => {
      if (prev.includes(tag)) return prev;
      return prev ? `${prev}、${tag}` : tag;
    });
  }

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/skills/plan-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, focus: focus || undefined }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">计划管理</h1>
        <p className="text-muted-foreground">
          结合节假日、季节特征、事故数据自动生成月度宣传计划
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            生成月度计划
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              选择月份
            </label>
            <Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  2026年{i + 1}月
                </option>
              ))}
            </Select>
          </div>

          {/* 智能主题推荐 */}
          {themes && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                智能主题推荐
                <span className="font-normal text-muted-foreground">
                  （点击添加到重点方向）
                </span>
              </label>
              <p className="mb-2 text-xs text-muted-foreground">
                {themes.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {themes.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={focus.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              重点方向 / 补充要求
              <span className="ml-1 font-normal text-muted-foreground">
                （可选）
              </span>
            </label>
            <Textarea
              placeholder={"例如：本月重点配合\u201C一盔一带\u201D专项行动，加强农村道路宣传..."}
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              rows={3}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              可输入上级部署、专项行动、本地重点工作等，AI 会据此调整计划侧重
            </p>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "生成计划"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>
              2026年{month}月 月度宣传计划
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
