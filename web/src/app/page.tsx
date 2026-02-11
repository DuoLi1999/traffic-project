import { getAccidentData, getAllAnalytics } from "@/lib/data";
import { formatNumber, formatMoney, formatPercent } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart";
import { AccidentTypePie } from "@/components/dashboard/accident-type-pie";
import { TimeDistributionChart } from "@/components/dashboard/time-distribution-chart";
import { PlatformSummary } from "@/components/dashboard/platform-summary";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Users,
  TrendingDown,
  Eye,
  UserPlus,
} from "lucide-react";

export default function DashboardPage() {
  const accident = getAccidentData();
  const analytics = getAllAnalytics();

  const totalReach =
    analytics.reduce(
      (sum, a) => sum + (a.summary.totalReads || a.summary.totalViews || 0),
      0
    );
  const totalFollowers = analytics.reduce(
    (sum, a) => sum + a.summary.newFollowers,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">数据看板</h1>
        <p className="text-muted-foreground">
          {accident.period} · {accident.region} · 数据更新于 {accident.generatedDate}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="交通事故总数"
          value={accident.overview.totalAccidents.toLocaleString()}
          change={`同比 ${formatPercent(accident.overview.yoyAccidentChange)}`}
          changeType="positive"
          icon={AlertTriangle}
        />
        <StatCard
          title="死亡人数"
          value={accident.overview.totalFatalities.toString()}
          change={`同比 ${formatPercent(accident.overview.yoyFatalityChange)}`}
          changeType="positive"
          icon={TrendingDown}
        />
        <StatCard
          title="受伤人数"
          value={accident.overview.totalInjuries.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="全平台触达"
          value={formatNumber(totalReach)}
          change="2026年1月"
          icon={Eye}
        />
        <StatCard
          title="新增关注"
          value={formatNumber(totalFollowers)}
          change="2026年1月"
          icon={UserPlus}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>月度事故趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={accident.monthlyTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>事故类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <AccidentTypePie data={accident.byAccidentType} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>事故时段分布</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeDistributionChart data={accident.timeDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>各平台传播数据（2026年1月）</CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformSummary data={analytics} />
          </CardContent>
        </Card>
      </div>

      {/* High Risk Areas Table */}
      <Card>
        <CardHeader>
          <CardTitle>高风险区域</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">位置</th>
                  <th className="pb-3 font-medium">类型</th>
                  <th className="pb-3 font-medium">事故数</th>
                  <th className="pb-3 font-medium">死亡数</th>
                  <th className="pb-3 font-medium">主要原因</th>
                  <th className="pb-3 font-medium">风险等级</th>
                  <th className="pb-3 font-medium">季节特征</th>
                </tr>
              </thead>
              <tbody>
                {accident.highRiskAreas.map((area) => (
                  <tr key={area.location} className="border-b last:border-0">
                    <td className="py-3 font-medium">{area.location}</td>
                    <td className="py-3">{area.type}</td>
                    <td className="py-3">{area.accidents}</td>
                    <td className="py-3">{area.fatalities}</td>
                    <td className="py-3">{area.mainCause}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          area.riskLevel === "高" ? "destructive" : "warning"
                        }
                      >
                        {area.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {area.seasonalPattern}
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
