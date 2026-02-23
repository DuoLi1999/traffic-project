"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, AlertTriangle, Zap, History } from "lucide-react";

const TRIGGER_RULES = [
  { id: "1", name: "暴雨橙色预警", source: "气象局API", condition: "预警等级 >= 橙色", action: "自动生成暴雨安全提示", enabled: true },
  { id: "2", name: "大雾红色预警", source: "气象局API", condition: "能见度 < 50m", action: "自动生成大雾行车提示", enabled: true },
  { id: "3", name: "重大事故", source: "指挥中心", condition: "死亡人数 >= 3", action: "启动应急宣传响应", enabled: false },
  { id: "4", name: "冰雪路面", source: "气象局API", condition: "路面温度 < 0°C 且有降水", action: "自动生成冰雪路面提示", enabled: true },
  { id: "5", name: "节假日高峰", source: "流量监测", condition: "高速流量 > 日均150%", action: "发布拥堵提示和绕行建议", enabled: false },
];

const TRIGGER_LOG = [
  { time: "2026-02-20 08:30", rule: "暴雨橙色预警", status: "已触发", result: "已生成3条应急内容" },
  { time: "2026-02-18 06:15", rule: "大雾红色预警", status: "已触发", result: "已生成3条应急内容" },
  { time: "2026-02-15 14:00", rule: "节假日高峰", status: "未启用", result: "规则已禁用" },
  { time: "2026-02-10 22:30", rule: "冰雪路面", status: "已触发", result: "已生成3条应急内容" },
];

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState("generate");
  const [eventType, setEventType] = useState("暴雨预警");
  const [alertLevel, setAlertLevel] = useState("黄色");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    if (!area || !description) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/skills/emergency-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, alertLevel, area, description }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">应急响应</h1>
        <p className="text-muted-foreground">
          快速生成多平台应急宣传内容包
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "generate"} onClick={() => setActiveTab("generate")}>
            <AlertTriangle className="h-4 w-4 mr-1" />
            应急生成
          </TabsTrigger>
          <TabsTrigger active={activeTab === "trigger"} onClick={() => setActiveTab("trigger")}>
            <Zap className="h-4 w-4 mr-1" />
            触发配置
          </TabsTrigger>
          <TabsTrigger active={activeTab === "log"} onClick={() => setActiveTab("log")}>
            <History className="h-4 w-4 mr-1" />
            触发记录
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "generate" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    预警信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">事件类型</label>
                      <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value="暴雨预警">暴雨预警</option>
                        <option value="暴雪预警">暴雪预警</option>
                        <option value="大雾预警">大雾预警</option>
                        <option value="台风预警">台风预警</option>
                        <option value="道路封闭">道路封闭</option>
                        <option value="重大事故">重大事故</option>
                        <option value="交通管制">交通管制</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">预警等级</label>
                      <Select value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)}>
                        <option value="蓝色">蓝色（一般）</option>
                        <option value="黄色">黄色（较重）</option>
                        <option value="橙色">橙色（严重）</option>
                        <option value="红色">红色（特别严重）</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">影响区域</label>
                    <Input
                      placeholder="例如：G15高速K100-K200段"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">事件描述</label>
                    <Textarea
                      placeholder="描述事件详情、影响范围、已采取措施..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !area || !description}
                    className="w-full"
                    variant="destructive"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />生成应急内容包...</>
                    ) : (
                      "生成应急内容包"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>应急内容包</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="ai-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "trigger" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      智能触发规则
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      需对接气象/指挥中心系统
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    配置自动触发应急宣传的规则。当外部系统推送预警数据满足条件时，自动启动应急宣传流程。
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {TRIGGER_RULES.map((rule) => (
                      <div
                        key={rule.id}
                        className={`rounded-lg border p-4 ${rule.enabled ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50/50"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{rule.name}</span>
                            <Badge variant={rule.enabled ? "success" : "secondary"} className="text-xs">
                              {rule.enabled ? "已启用" : "已禁用"}
                            </Badge>
                          </div>
                          <button
                            className={`text-xs px-3 py-1 rounded-full transition ${
                              rule.enabled
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            }`}
                          >
                            {rule.enabled ? "禁用" : "启用"}
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-400">数据源：</span>
                            {rule.source}
                          </div>
                          <div>
                            <span className="text-gray-400">触发条件：</span>
                            {rule.condition}
                          </div>
                          <div>
                            <span className="text-gray-400">响应动作：</span>
                            {rule.action}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "log" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  触发历史记录
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRIGGER_LOG.map((log, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-36">{log.time}</span>
                        <span className="text-sm font-medium">{log.rule}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={log.status === "已触发" ? "success" : "secondary"} className="text-xs">
                          {log.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{log.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
