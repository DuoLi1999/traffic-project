"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Radio,
  TrendingUp,
  AlertTriangle,
  Hash,
  Loader2,
} from "lucide-react";

// Sample sentiment data
const SENTIMENT_ITEMS = [
  { id: "1", title: "某市交警暴力执法引热议", source: "微博", sentiment: "negative" as const, heat: 9500, time: "2026-02-22 14:30", summary: "网友热议某市交警在执法过程中态度恶劣，视频在社交平台大量传播" },
  { id: "2", title: "交警护送迷路老人回家", source: "抖音", sentiment: "positive" as const, heat: 8200, time: "2026-02-22 10:15", summary: "暖心视频获赞百万，展现交警正面形象" },
  { id: "3", title: "高速追尾致3人死亡", source: "今日头条", sentiment: "negative" as const, heat: 7800, time: "2026-02-21 22:00", summary: "重大事故引发公众对高速安全的讨论" },
  { id: "4", title: "122交通安全日宣传活动", source: "微信", sentiment: "positive" as const, heat: 5600, time: "2026-02-21 09:00", summary: "各地积极开展宣传活动，反响热烈" },
  { id: "5", title: "电动车头盔新规引争议", source: "微博", sentiment: "neutral" as const, heat: 6300, time: "2026-02-20 16:45", summary: "部分市民认为新规过于严格，但多数支持安全措施" },
  { id: "6", title: "春运期间交通拥堵严重", source: "微信", sentiment: "negative" as const, heat: 4200, time: "2026-02-20 08:30", summary: "多地反映春运高峰拥堵问题，呼吁加强疏导" },
];

const ALERTS = [
  { level: "red", title: "暴力执法舆情扩散", description: "某市交警执法视频持续发酵，24小时内传播量突破50万", time: "2026-02-22 15:00" },
  { level: "yellow", title: "高速事故舆论关注", description: "追尾事故引发高速安全讨论，建议发布安全提示", time: "2026-02-21 23:00" },
];

const HOT_WORDS = [
  { word: "交通安全", count: 3280 },
  { word: "酒驾", count: 2150 },
  { word: "电动车", count: 1890 },
  { word: "高速公路", count: 1650 },
  { word: "头盔", count: 1420 },
  { word: "春运", count: 1380 },
  { word: "违章", count: 1250 },
  { word: "事故", count: 1180 },
  { word: "交警", count: 1050 },
  { word: "安全带", count: 980 },
  { word: "闯红灯", count: 920 },
  { word: "行人", count: 860 },
];

const SENTIMENT_COLORS = {
  positive: "text-green-600 bg-green-50 border-green-200",
  negative: "text-red-600 bg-red-50 border-red-200",
  neutral: "text-gray-600 bg-gray-50 border-gray-200",
};

const SENTIMENT_LABELS = {
  positive: "正面",
  negative: "负面",
  neutral: "中性",
};

export default function SentimentPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">舆情监测</h1>
        <p className="text-muted-foreground">
          实时监测交通安全相关舆论动态
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            <Radio className="h-4 w-4 mr-1" />
            舆情总览
          </TabsTrigger>
          <TabsTrigger active={activeTab === "alerts"} onClick={() => setActiveTab("alerts")}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            预警中心
          </TabsTrigger>
          <TabsTrigger active={activeTab === "hotwords"} onClick={() => setActiveTab("hotwords")}>
            <Hash className="h-4 w-4 mr-1" />
            热词分析
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">今日舆情总量</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">68</div>
                    <p className="text-xs text-muted-foreground">正面舆情</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">32</div>
                    <p className="text-xs text-muted-foreground">负面舆情</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-gray-600">56</div>
                    <p className="text-xs text-muted-foreground">中性舆情</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sentiment List */}
              <Card>
                <CardHeader>
                  <CardTitle>实时舆情列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SENTIMENT_ITEMS.map((item) => (
                      <div key={item.id} className="rounded-lg border p-4 hover:shadow-sm transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <Badge className={`text-xs ${SENTIMENT_COLORS[item.sentiment]}`}>
                                {SENTIMENT_LABELS[item.sentiment]}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{item.summary}</p>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <div className="flex items-center gap-1 text-orange-600">
                              <TrendingUp className="h-3 w-3" />
                              <span className="text-sm font-medium">{item.heat.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-gray-400">热度</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>来源：{item.source}</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-center">
                <p className="text-sm text-blue-600">
                  实时舆情数据需对接舆情监测平台API，当前展示为模拟数据
                </p>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    舆情预警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ALERTS.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">当前无预警信息</p>
                  ) : (
                    <div className="space-y-3">
                      {ALERTS.map((alert, i) => (
                        <div
                          key={i}
                          className={`rounded-lg border p-4 ${
                            alert.level === "red"
                              ? "border-red-200 bg-red-50"
                              : alert.level === "yellow"
                                ? "border-yellow-200 bg-yellow-50"
                                : "border-blue-200 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={alert.level === "red" ? "destructive" : "warning"}>
                              {alert.level === "red" ? "红色预警" : alert.level === "yellow" ? "黄色预警" : "蓝色预警"}
                            </Badge>
                            <span className="text-sm font-medium">{alert.title}</span>
                          </div>
                          <p className="text-xs text-gray-600">{alert.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "hotwords" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    热词云
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 justify-center py-4">
                    {HOT_WORDS.map((hw, i) => {
                      const size = Math.max(14, Math.min(32, 14 + (hw.count / 200)));
                      const opacity = Math.max(0.5, 1 - i * 0.04);
                      return (
                        <span
                          key={hw.word}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
                          style={{ fontSize: `${size}px`, opacity }}
                        >
                          {hw.word}
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>热词排行</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {HOT_WORDS.map((hw, i) => (
                      <div key={hw.word} className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          i < 3 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-sm flex-1">{hw.word}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(hw.count / HOT_WORDS[0].count) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">{hw.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
