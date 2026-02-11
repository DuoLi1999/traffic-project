"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { ReviewResult } from "@/lib/types";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
} from "lucide-react";
import { PlannedFeatures } from "@/components/ui/planned-features";

const PLANNED = [
  { name: "线上多级审核", description: "支持人工审核流转，多级审批流程管理" },
  { name: "审核知识库", description: "积累审核经验，自动学习优化审核规则" },
];

const STAGE_ICONS = {
  pass: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  block: <XCircle className="h-5 w-5 text-red-600" />,
};

const RESULT_CONFIG = {
  approved: { label: "审核通过", color: "text-green-600", badge: "success" as const },
  revision_required: {
    label: "建议修改",
    color: "text-yellow-600",
    badge: "warning" as const,
  },
  rejected: {
    label: "审核不通过",
    color: "text-red-600",
    badge: "destructive" as const,
  },
};

export default function ReviewPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);

  async function handleReview() {
    if (!content) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/skills/content-reviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      alert("审核失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">内容审核</h1>
        <p className="text-muted-foreground">
          三级审核：格式与敏感词 → 内容质量 → 政策合规
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            待审核内容
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="粘贴需要审核的宣传内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
          />
          <div className="flex items-center gap-4">
            <Button onClick={handleReview} disabled={loading || !content}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  审核中...
                </>
              ) : (
                "开始审核"
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              提示：输入包含&ldquo;最好&rdquo;、&ldquo;暴力执法&rdquo;等词汇可触发审核警告/阻断
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Final Result */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">审核结果</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
                <Badge
                  variant={RESULT_CONFIG[result.finalResult].badge}
                  className="text-base px-4 py-1"
                >
                  {RESULT_CONFIG[result.finalResult].label}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stage Details */}
          {result.stages.map((stage, i) => (
            <Card key={stage.stage}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {i + 1}
                    </span>
                    {stage.stageName}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {STAGE_ICONS[stage.result]}
                    <span className="text-sm font-medium">
                      {stage.result === "pass"
                        ? "通过"
                        : stage.result === "warning"
                          ? "警告"
                          : "阻断"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              {stage.issues.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    {stage.issues.map((issue, j) => (
                      <div
                        key={j}
                        className={`rounded-md border p-3 ${
                          issue.level === "block"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              issue.level === "block"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {issue.level === "block" ? "阻断" : "警告"}
                          </Badge>
                          <span className="text-sm font-medium">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-sm">{issue.text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          建议：{issue.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
              {stage.issues.length === 0 && (
                <CardContent>
                  <p className="text-sm text-green-600">未发现问题</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <PlannedFeatures features={PLANNED} />
    </div>
  );
}
