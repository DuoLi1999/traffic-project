"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES, PLATFORM_COLORS } from "@/lib/constants";

interface Props {
  data: PlatformAnalytics[];
}

export function CrossPlatformComparison({ data }: Props) {
  // Comparison metrics
  const comparisonData = data.map((d) => ({
    platform: PLATFORM_NAMES[d.platform],
    key: d.platform,
    发布量: d.summary.totalPosts,
    阅读量: d.summary.totalReads || d.summary.totalViews || 0,
    互动率: parseFloat((d.summary.avgInteractionRate * 100).toFixed(1)),
    新增关注: d.summary.newFollowers,
  }));

  // Weekly trend comparison
  const weeklyData = [1, 2, 3, 4].map((week) => {
    const row: Record<string, number | string> = { name: `第${week}周` };
    data.forEach((d) => {
      const w = d.weeklyTrend.find((t) => t.week === week);
      if (w) {
        row[PLATFORM_NAMES[d.platform]] = w.reads || w.views || 0;
      }
    });
    return row;
  });

  // Topic analysis
  const allTopics = new Set<string>();
  data.forEach((d) => {
    d.topicAnalysis.forEach((t) => allTopics.add(t.topic));
  });

  return (
    <div className="space-y-6 mt-4">
      {/* Platform Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {data.map((d) => (
          <Card key={d.platform}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {PLATFORM_NAMES[d.platform]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">发布量</span>
                  <span className="font-medium">{d.summary.totalPosts}篇</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {d.platform === "douyin" ? "播放量" : "阅读量"}
                  </span>
                  <span className="font-medium">
                    {(
                      d.summary.totalReads || d.summary.totalViews || 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">互动率</span>
                  <span className="font-medium">
                    {(d.summary.avgInteractionRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">新增关注</span>
                  <span className="font-medium">
                    {d.summary.newFollowers.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>各平台阅读/播放量对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="阅读量" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>周度趋势对比</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                {data.map((d) => (
                  <Line
                    key={d.platform}
                    type="monotone"
                    dataKey={PLATFORM_NAMES[d.platform]}
                    stroke={PLATFORM_COLORS[d.platform]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content Across Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>各平台热门内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.map((d) => (
              <div key={d.platform}>
                <h4 className="mb-3 font-semibold">
                  {PLATFORM_NAMES[d.platform]}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">标题</th>
                        <th className="pb-2 font-medium">
                          {d.platform === "douyin" ? "播放量" : "阅读量"}
                        </th>
                        <th className="pb-2 font-medium">互动率</th>
                        <th className="pb-2 font-medium">话题</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.topContent.slice(0, 3).map((c, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2">{c.title}</td>
                          <td className="py-2">
                            {(
                              c.reads || c.views || 0
                            ).toLocaleString()}
                          </td>
                          <td className="py-2">
                            {(c.interactionRate * 100).toFixed(1)}%
                          </td>
                          <td className="py-2">
                            <Badge variant="secondary">{c.topic}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
