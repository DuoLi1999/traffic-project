"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES } from "@/lib/constants";
import { AnalyticsPlatformView } from "@/components/analytics/platform-view";
import { CrossPlatformComparison } from "@/components/analytics/cross-platform";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState<PlatformAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data/analytics");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    fetchData();
  }, []);

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
    </div>
  );
}
