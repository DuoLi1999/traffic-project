"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlannedFeatures } from "@/components/ui/planned-features";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES } from "@/lib/constants";
import { AnalyticsPlatformView } from "@/components/analytics/platform-view";
import { CrossPlatformComparison } from "@/components/analytics/cross-platform";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, FileBarChart } from "lucide-react";

const PLANNED = [
  { name: "社会舆情监测", description: "对接舆情平台，实时监测交通安全相关舆论动态" },
  { name: "影响效果关联分析", description: "将宣传数据与事故数据关联，评估宣传对事故率的实际影响" },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState<PlatformAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data/analytics");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleGenerateReport() {
    setReportLoading(true);
    setReport("");
    try {
      const res = await fetch("/api/skills/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      setReport(json.content);
    } catch {
      setReport("生成失败，请重试");
    } finally {
      setReportLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  const platforms = ["all", "wechat", "weibo", "douyin"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">传播分析</h1>
        <p className="text-muted-foreground">多平台传播效果数据分析</p>
      </div>

      <Tabs>
        <TabsList>
          {platforms.map((p) => (
            <TabsTrigger
              key={p}
              active={activeTab === p}
              onClick={() => setActiveTab(p)}
            >
              {p === "all" ? "总览" : PLATFORM_NAMES[p]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent>
          {activeTab === "all" ? (
            <CrossPlatformComparison data={data} />
          ) : (
            <AnalyticsPlatformView
              data={data.find((d) => d.platform === activeTab) || null}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* AI Report Generation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="h-5 w-5" />
              AI 分析报告
            </CardTitle>
            <Button onClick={handleGenerateReport} disabled={reportLoading}>
              {reportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "生成分析报告"
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            基于当前传播数据，AI 自动生成月度效果分析报告
          </p>
        </CardHeader>
        {report && (
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report}
              </ReactMarkdown>
            </div>
          </CardContent>
        )}
      </Card>

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
