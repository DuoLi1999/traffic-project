"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES } from "@/lib/constants";
import { AnalyticsPlatformView } from "@/components/analytics/platform-view";
import { CrossPlatformComparison } from "@/components/analytics/cross-platform";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, FileBarChart, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState<PlatformAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState("");
  const [correlationLoading, setCorrelationLoading] = useState(false);
  const [correlationReport, setCorrelationReport] = useState("");

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

  async function handleCorrelationAnalysis() {
    setCorrelationLoading(true);
    setCorrelationReport("");
    try {
      const res = await fetch("/api/skills/correlation-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      setCorrelationReport(json.content);
    } catch {
      setCorrelationReport("生成失败，请重试");
    } finally {
      setCorrelationLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  const platforms = ["all", "wechat", "weibo", "douyin", "correlation"];

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
              {p === "all" ? "总览" : p === "correlation" ? (
                <><TrendingUp className="h-4 w-4 mr-1" />效果关联分析</>
              ) : PLATFORM_NAMES[p]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent>
          {activeTab === "correlation" ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      宣传效果与违法/事故关联分析
                    </CardTitle>
                    <Button onClick={handleCorrelationAnalysis} disabled={correlationLoading}>
                      {correlationLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />分析中...</>
                      ) : (
                        "生成关联分析报告"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    分析宣传曝光量与违法率、事故率的关联关系，评估宣传效果
                  </p>
                </CardHeader>
                {correlationReport && (
                  <CardContent>
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {correlationReport}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ) : activeTab === "all" ? (
            <CrossPlatformComparison data={data} />
          ) : (
            <AnalyticsPlatformView
              data={data.find((d) => d.platform === activeTab) || null}
            />
          )}
        </TabsContent>
      </Tabs>

      {activeTab !== "correlation" && (
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
              <div className="ai-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {report}
                </ReactMarkdown>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
