"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, FileText } from "lucide-react";

const DOC_TYPES = [
  { value: "summary", label: "工作总结", desc: "月度/季度/年度宣传教育工作总结" },
  { value: "report", label: "汇报材料", desc: "向上级汇报的工作进展和成效" },
  { value: "briefing", label: "情况通报", desc: "交通安全形势分析通报" },
  { value: "plan", label: "工作方案", desc: "专项宣传活动方案" },
  { value: "experience", label: "经验交流", desc: "宣传教育工作经验做法" },
];

export default function WritingPage() {
  const [docType, setDocType] = useState("summary");
  const [timePeriod, setTimePeriod] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/skills/doc-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          timePeriod: timePeriod || undefined,
          keyPoints: keyPoints || undefined,
          reference: reference || undefined,
        }),
      });
      const data = await res.json();
      setResult(data.content);
    } catch {
      setResult("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  const selectedType = DOC_TYPES.find((t) => t.value === docType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">材料撰写</h1>
        <p className="text-muted-foreground">
          根据工作数据和参考材料，生成符合公文规范的各类工作材料
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              材料设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                材料类型
              </label>
              <Select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
              {selectedType && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedType.desc}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                时间范围
              </label>
              <Input
                placeholder="例如：2026年1月、2026年第一季度、2025年度"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                重点内容
              </label>
              <Input
                placeholder="例如：春运安全宣传、酒驾整治专项行动配合宣传"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">
                参考材料 <span className="text-muted-foreground font-normal">(选填)</span>
              </label>
              <Textarea
                placeholder="粘贴已有的参考材料、往期总结或相关数据，AI 会据此生成内容..."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                rows={5}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  撰写中...
                </>
              ) : (
                "生成材料"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>材料预览</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="ai-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p>填写左侧表单并点击&ldquo;生成材料&rdquo;查看预览</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
