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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES, PLATFORM_COLORS } from "@/lib/constants";

interface Props {
  data: PlatformAnalytics | null;
}

export function AnalyticsPlatformView({ data }: Props) {
  if (!data) {
    return <p className="mt-4 text-muted-foreground">暂无数据</p>;
  }

  const isVideo = data.platform === "douyin";
  const readKey = isVideo ? "播放量" : "阅读量";

  const weeklyData = data.weeklyTrend.map((w) => ({
    name: `第${w.week}周`,
    [readKey]: w.reads || w.views || 0,
    点赞: w.likes,
    转发: w.shares,
  }));

  const topicData = data.topicAnalysis.map((t) => ({
    topic: t.topic,
    avgReads: t.avgReads || t.avgViews || 0,
    互动率: parseFloat(((t.avgInteractionRate || 0) * 100).toFixed(1)),
    发布量: t.posts,
  }));

  return (
    <div className="space-y-6 mt-4">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">发布量</p>
            <p className="text-xl font-bold">{data.summary.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{readKey}</p>
            <p className="text-xl font-bold">
              {(
                data.summary.totalReads || data.summary.totalViews || 0
              ).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">互动率</p>
            <p className="text-xl font-bold">
              {(data.summary.avgInteractionRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">新增关注</p>
            <p className="text-xl font-bold">
              {data.summary.newFollowers.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>周度趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={readKey}
                  stroke={PLATFORM_COLORS[data.platform] || "#3b82f6"}
                  strokeWidth={2}
                />
                <Line type="monotone" dataKey="点赞" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="转发" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>话题分析</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={topicData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" fontSize={12} />
                <PolarRadiusAxis fontSize={10} />
                <Radar
                  name="互动率"
                  dataKey="互动率"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>热门内容排行</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">排名</th>
                  <th className="pb-3 font-medium">标题</th>
                  <th className="pb-3 font-medium">发布日期</th>
                  <th className="pb-3 font-medium">{readKey}</th>
                  <th className="pb-3 font-medium">点赞</th>
                  <th className="pb-3 font-medium">转发</th>
                  <th className="pb-3 font-medium">互动率</th>
                  <th className="pb-3 font-medium">话题</th>
                </tr>
              </thead>
              <tbody>
                {data.topContent.map((c, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 font-medium">{i + 1}</td>
                    <td className="py-3 max-w-xs truncate">{c.title}</td>
                    <td className="py-3">{c.publishDate}</td>
                    <td className="py-3">
                      {(c.reads || c.views || 0).toLocaleString()}
                    </td>
                    <td className="py-3">{c.likes.toLocaleString()}</td>
                    <td className="py-3">{c.shares.toLocaleString()}</td>
                    <td className="py-3">
                      {(c.interactionRate * 100).toFixed(1)}%
                    </td>
                    <td className="py-3">
                      <Badge variant="secondary">{c.topic}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
