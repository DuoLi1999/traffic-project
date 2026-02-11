"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { AccidentType } from "@/lib/types";
import { CHART_COLORS } from "@/lib/constants";

interface Props {
  data: AccidentType[];
}

export function AccidentTypePie({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.type,
    value: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={(props: PieLabelRenderProps) =>
            `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={true}
          fontSize={12}
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
