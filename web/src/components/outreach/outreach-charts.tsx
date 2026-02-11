"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { ViolationType, WeatherRelated, TimeDistribution } from "@/lib/types";
import type { PieLabelRenderProps } from "recharts";
import { CHART_COLORS } from "@/lib/constants";

interface Props {
  violationData: ViolationType[];
  weatherData: WeatherRelated[];
  timeData: TimeDistribution[];
}

export function OutreachCharts({ violationData, weatherData, timeData }: Props) {
  const violationChart = violationData.map((d) => ({
    name: d.type,
    数量: d.count,
  }));

  const weatherChart = weatherData.map((d) => ({
    name: d.weather,
    value: d.accidents,
  }));

  const timeChart = timeData.map((d) => ({
    name: d.period,
    事故数: d.accidents,
    死亡数: d.fatalities,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>违法类型分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="name" fontSize={12} width={100} />
              <Tooltip />
              <Bar dataKey="数量" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>天气因素分析</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={weatherChart}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(props: PieLabelRenderProps) =>
                  `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                }
                fontSize={12}
              >
                {weatherChart.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>事故时段分布</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="事故数" fill="#3b82f6" />
              <Bar dataKey="死亡数" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
