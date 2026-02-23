"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OutreachCharts } from "@/components/outreach/outreach-charts";
import { OutreachReport } from "@/components/outreach/outreach-report";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { AccidentData } from "@/lib/types";
import {
  Loader2,
  Target,
  GraduationCap,
} from "lucide-react";

const AUDIENCES = [
  "进校园（中小学生）",
  "进社区（居民）",
  "进企业（货运/客运驾驶人）",
  "进农村（村民）",
  "进家庭（家长与儿童）",
  "进媒体（新闻工作者）",
  "进公共场所（公众）",
];

const TOPICS = [
  "交通安全基础知识",
  "一盔一带安全守护",
  "酒驾醉驾危害",
  "电动车安全骑行",
  "儿童出行安全",
  "农村道路安全",
  "高速公路安全驾驶",
  "恶劣天气安全出行",
  "疲劳驾驶防范",
  "大货车盲区认知",
];

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState("data");
  const [accident, setAccident] = useState<AccidentData | null>(null);
  const [loading, setLoading] = useState(true);

  // Courseware state
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [duration, setDuration] = useState("30");
  const [format, setFormat] = useState("PPT课件");
  const [cwLoading, setCwLoading] = useState(false);
  const [cwResult, setCwResult] = useState("");

  useEffect(() => {
    fetch("/api/data/accident")
      .then((r) => r.json())
      .then((data) => {
        setAccident(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleGenerateCourseware() {
    setCwLoading(true);
    setCwResult("");
    try {
      const res = await fetch("/api/skills/courseware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, topic, duration, format }),
      });
      const data = await res.json();
      setCwResult(data.content);
    } catch {
      setCwResult("生成失败，请重试");
    } finally {
      setCwLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">精准宣传</h1>
        <p className="text-muted-foreground">
          基于事故数据分析的精准宣传方案 + 七进宣讲课件生成
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "data"} onClick={() => setActiveTab("data")}>
            <Target className="h-4 w-4 mr-1" />
            数据分析
          </TabsTrigger>
          <TabsTrigger active={activeTab === "courseware"} onClick={() => setActiveTab("courseware")}>
            <GraduationCap className="h-4 w-4 mr-1" />
            宣讲课件
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "data" && accident && (
            <div className="space-y-6">
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

              {/* AI Report */}
              <OutreachReport />
            </div>
          )}

          {activeTab === "courseware" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    生成宣讲课件
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">受众类型</label>
                      <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                        {AUDIENCES.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">宣讲主题</label>
                      <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">时长（分钟）</label>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        min="15"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">输出格式</label>
                      <Select value={format} onChange={(e) => setFormat(e.target.value)}>
                        <option value="PPT课件">PPT课件大纲</option>
                        <option value="讲稿">讲稿</option>
                        <option value="教案">教案</option>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={handleGenerateCourseware} disabled={cwLoading} className="w-full">
                    {cwLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />生成中...</>
                    ) : (
                      "生成课件"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {cwResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>宣讲课件</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {cwResult}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
