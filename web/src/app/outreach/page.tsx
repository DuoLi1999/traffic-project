import { getAccidentData } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlannedFeatures } from "@/components/ui/planned-features";
import { OutreachCharts } from "@/components/outreach/outreach-charts";
import { OutreachReport } from "@/components/outreach/outreach-report";

const PLANNED = [
  { name: "社会化宣传管理", description: "针对企业、学校等社会单位的宣传方案生成与课件制作" },
];

export default function OutreachPage() {
  const accident = getAccidentData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">精准宣传</h1>
        <p className="text-muted-foreground">
          基于事故数据分析的精准宣传方案
        </p>
      </div>

      {/* High Risk Areas */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">高风险区域</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accident.highRiskAreas.map((area) => (
            <Card key={area.location}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{area.location}</CardTitle>
                  <Badge
                    variant={area.riskLevel === "高" ? "destructive" : "warning"}
                  >
                    {area.riskLevel}风险
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">道路类型</span>
                    <span>{area.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">事故数</span>
                    <span className="font-medium">{area.accidents} 起</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">死亡数</span>
                    <span className="font-medium text-red-600">
                      {area.fatalities} 人
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">主要原因</span>
                    <span>{area.mainCause}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">季节特征</span>
                    <span>{area.seasonalPattern}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* High Risk Groups */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">高风险群体</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accident.highRiskGroups.map((group) => (
            <Card key={group.group}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{group.group}</CardTitle>
                  <Badge
                    variant={group.riskLevel === "高" ? "destructive" : "warning"}
                  >
                    {group.riskLevel}风险
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">涉及事故</span>
                    <span className="font-medium">
                      {group.involvedAccidents} 起
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">占比</span>
                    <span>{(group.percentage * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">主要违法</span>
                    <span>{group.mainViolation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <OutreachCharts
        violationData={accident.byViolationType}
        weatherData={accident.weatherRelated}
        timeData={accident.timeDistribution}
      />

      {/* AI Report Generation */}
      <OutreachReport />

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
