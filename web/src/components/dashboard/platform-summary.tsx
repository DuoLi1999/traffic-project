"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PlatformAnalytics } from "@/lib/types";
import { PLATFORM_NAMES, PLATFORM_COLORS } from "@/lib/constants";

interface Props {
  data: PlatformAnalytics[];
}

export function PlatformSummary({ data }: Props) {
  const chartData = data.map((d) => ({
    name: PLATFORM_NAMES[d.platform] || d.platform,
    platform: d.platform,
    阅读量: d.summary.totalReads || d.summary.totalViews || 0,
    互动率: parseFloat((d.summary.avgInteractionRate * 100).toFixed(1)),
    新增关注: d.summary.newFollowers,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Bar dataKey="阅读量">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PLATFORM_COLORS[entry.platform] || "#3b82f6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
