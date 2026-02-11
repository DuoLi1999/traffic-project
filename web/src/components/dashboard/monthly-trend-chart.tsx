"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyTrend } from "@/lib/types";

interface Props {
  data: MonthlyTrend[];
}

export function MonthlyTrendChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `${d.month}月`,
    事故数: d.accidents,
    死亡人数: d.fatalities,
    受伤人数: d.injuries,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="事故数"
          stroke="#3b82f6"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="死亡人数"
          stroke="#ef4444"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="受伤人数"
          stroke="#f59e0b"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
