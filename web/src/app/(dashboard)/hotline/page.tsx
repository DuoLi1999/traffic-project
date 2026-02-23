"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  ListFilter,
  Brain,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";

const SAMPLE_TICKETS = [
  { id: "T-20260222-001", caller: "张先生", phone: "138****5678", category: "违章查询", content: "咨询闯红灯罚款如何缴纳", sentiment: "neutral" as const, status: "已回复", time: "2026-02-22 14:30", assignee: "窗口1" },
  { id: "T-20260222-002", caller: "李女士", phone: "139****1234", category: "事故处理", content: "追尾事故对方不配合处理", sentiment: "negative" as const, status: "处理中", time: "2026-02-22 13:15", assignee: "窗口3" },
  { id: "T-20260222-003", caller: "王先生", phone: "136****9012", category: "信号灯故障", content: "某路口红绿灯不亮", sentiment: "negative" as const, status: "已转办", time: "2026-02-22 11:00", assignee: "设施科" },
  { id: "T-20260222-004", caller: "赵女士", phone: "137****3456", category: "驾照办理", content: "咨询驾照换证流程", sentiment: "neutral" as const, status: "已回复", time: "2026-02-22 10:45", assignee: "AI客服" },
  { id: "T-20260222-005", caller: "陈先生", phone: "135****7890", category: "建议投诉", content: "建议增设学校门口减速带", sentiment: "positive" as const, status: "已记录", time: "2026-02-22 09:30", assignee: "宣传科" },
];

const SENTIMENT_COLORS = {
  positive: "text-green-600 bg-green-50",
  negative: "text-red-600 bg-red-50",
  neutral: "text-gray-600 bg-gray-50",
};

const SENTIMENT_LABELS = {
  positive: "正面",
  negative: "负面",
  neutral: "中性",
};

const STATUS_COLORS: Record<string, string> = {
  "已回复": "bg-green-100 text-green-700",
  "处理中": "bg-yellow-100 text-yellow-700",
  "已转办": "bg-blue-100 text-blue-700",
  "已记录": "bg-gray-100 text-gray-700",
};

export default function HotlinePage() {
  const [activeTab, setActiveTab] = useState("tickets");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">12345热线</h1>
        <p className="text-muted-foreground">
          热线工单管理与智能分派
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 p-4 text-center">
        <p className="text-sm text-blue-600">
          本页面需对接12345市民服务热线平台API，当前展示为模拟数据
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")}>
            <Phone className="h-4 w-4 mr-1" />
            工单列表
          </TabsTrigger>
          <TabsTrigger active={activeTab === "dispatch"} onClick={() => setActiveTab("dispatch")}>
            <ListFilter className="h-4 w-4 mr-1" />
            智能分派
          </TabsTrigger>
          <TabsTrigger active={activeTab === "analysis"} onClick={() => setActiveTab("analysis")}>
            <Brain className="h-4 w-4 mr-1" />
            情感分析
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "tickets" && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">48</div>
                    <p className="text-xs text-muted-foreground">今日工单</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">35</div>
                    <p className="text-xs text-muted-foreground">已处理</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">8</div>
                    <p className="text-xs text-muted-foreground">处理中</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">5</div>
                    <p className="text-xs text-muted-foreground">待处理</p>
                  </CardContent>
                </Card>
              </div>

              {/* Ticket List */}
              <Card>
                <CardHeader>
                  <CardTitle>工单列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {SAMPLE_TICKETS.map((ticket) => (
                      <div key={ticket.id} className="rounded-lg border p-4 hover:shadow-sm transition">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 font-mono">{ticket.id}</span>
                              <Badge className={`text-xs ${STATUS_COLORS[ticket.status] || "bg-gray-100"}`}>
                                {ticket.status}
                              </Badge>
                              <Badge className={`text-xs ${SENTIMENT_COLORS[ticket.sentiment]}`}>
                                {SENTIMENT_LABELS[ticket.sentiment]}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-800">{ticket.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.caller} {ticket.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.time}
                          </span>
                          <span>处理人：{ticket.assignee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "dispatch" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListFilter className="h-5 w-5" />
                    智能分派配置
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    需对接12345平台API
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { category: "违章查询", target: "AI客服自动回复", priority: "低" },
                    { category: "驾照办理", target: "AI客服自动回复", priority: "低" },
                    { category: "事故处理", target: "事故科", priority: "高" },
                    { category: "信号灯故障", target: "设施科", priority: "中" },
                    { category: "建议投诉", target: "宣传科", priority: "中" },
                    { category: "道路施工", target: "秩序科", priority: "中" },
                    { category: "紧急救援", target: "指挥中心", priority: "紧急" },
                  ].map((rule) => (
                    <div key={rule.category} className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm font-medium">{rule.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{rule.target}</span>
                        <Badge variant={rule.priority === "紧急" ? "destructive" : rule.priority === "高" ? "warning" : "secondary"} className="text-xs">
                          {rule.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "analysis" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  来电情感分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-green-50">
                      <div className="text-2xl font-bold text-green-600">42%</div>
                      <p className="text-xs text-green-700">正面/中性</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-50">
                      <div className="text-2xl font-bold text-yellow-600">31%</div>
                      <p className="text-xs text-yellow-700">咨询类</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50">
                      <div className="text-2xl font-bold text-red-600">27%</div>
                      <p className="text-xs text-red-700">投诉/不满</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">高频投诉关键词</h4>
                    <div className="flex flex-wrap gap-2">
                      {["等待时间长", "态度不好", "信号灯故障", "停车难", "罚款不合理", "处理慢"].map((word) => (
                        <Badge key={word} variant="outline" className="text-red-600 border-red-200">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                    详细情感分析报告需对接语音识别和NLP服务
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
