"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TimeDistribution } from "@/lib/types";

interface Props {
  data: TimeDistribution[];
}

export function TimeDistributionChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.period,
    事故数: d.accidents,
    死亡人数: d.fatalities,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={11} angle={-20} textAnchor="end" height={50} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="事故数" fill="#3b82f6" />
        <Bar dataKey="死亡人数" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
