"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, AlertTriangle } from "lucide-react";
import { PlannedFeatures } from "@/components/ui/planned-features";

const PLANNED = [
  { name: "智能触发", description: "对接气象、交管等外部系统，自动触发应急响应流程" },
  { name: "舆情处置辅助", description: "监测突发事件舆情，辅助生成应对话术与声明" },
];

export default function EmergencyPage() {
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
              <label className="mb-1.5 block text-sm font-medium">
                事件类型
              </label>
              <Select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
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
              <label className="mb-1.5 block text-sm font-medium">
                预警等级
              </label>
              <Select
                value={alertLevel}
                onChange={(e) => setAlertLevel(e.target.value)}
              >
                <option value="蓝色">蓝色（一般）</option>
                <option value="黄色">黄色（较重）</option>
                <option value="橙色">橙色（严重）</option>
                <option value="红色">红色（特别严重）</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              影响区域
            </label>
            <Input
              placeholder="例如：G15高速K100-K200段"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              事件描述
            </label>
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
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成应急内容包...
              </>
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
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
