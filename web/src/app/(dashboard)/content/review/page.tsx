"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReviewPipeline } from "@/components/review/review-pipeline";
import { ReviewAction } from "@/components/review/review-action";
import { ReviewList } from "@/components/review/review-list";
import { KnowledgeBase } from "@/components/review/knowledge-base";
import type { ReviewResult, ReviewRecord } from "@/lib/types";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  Send,
  ClipboardList,
  History,
} from "lucide-react";

const STAGE_ICONS = {
  pass: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  block: <XCircle className="h-5 w-5 text-red-600" />,
};

const RESULT_CONFIG = {
  approved: { label: "审核通过", badge: "success" as const },
  revision_required: { label: "建议修改", badge: "warning" as const },
  rejected: { label: "审核不通过", badge: "destructive" as const },
};

const ROLE_FILTERS = ["全部", "新媒体负责人初审", "科室领导复审", "分管领导终审"];

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState("ai");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<ReviewResult | null>(null);

  // Human review state
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewRecord | null>(null);
  const [roleFilter, setRoleFilter] = useState("全部");

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/data/reviews");
      const data = await res.json();
      setReviews(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (activeTab === "workflow" || activeTab === "records") {
      fetchReviews();
    }
  }, [activeTab, fetchReviews]);

  async function handleReview() {
    if (!content) return;
    setLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/skills/content-reviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch {
      alert("审核失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitHumanReview() {
    if (!content || !aiResult) return;
    setSubmitting(true);
    try {
      await fetch("/api/data/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform: "wechat" }),
      });
      await fetchReviews();
      setActiveTab("workflow");
    } catch {
      alert("提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReviewAction(action: string, comment: string) {
    if (!selectedReview) return;
    const currentStageIndex = selectedReview.humanStages.findIndex(
      (s) => s.action === "pending"
    );
    if (currentStageIndex === -1) return;

    try {
      const res = await fetch(`/api/data/reviews/${selectedReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageIndex: currentStageIndex,
          action,
          comment,
        }),
      });
      const updated = await res.json();
      setSelectedReview(updated);
      await fetchReviews();
    } catch {
      alert("操作失败");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">内容审核</h1>
        <p className="text-muted-foreground">
          AI三级审核 + 四级人工审批流程
        </p>
      </div>

      <Tabs>
        <TabsList>
          <TabsTrigger active={activeTab === "ai"} onClick={() => setActiveTab("ai")}>
            <Shield className="h-4 w-4 mr-1" />
            AI审核
          </TabsTrigger>
          <TabsTrigger active={activeTab === "workflow"} onClick={() => setActiveTab("workflow")}>
            <ClipboardList className="h-4 w-4 mr-1" />
            审批流程
          </TabsTrigger>
          <TabsTrigger active={activeTab === "records"} onClick={() => setActiveTab("records")}>
            <History className="h-4 w-4 mr-1" />
            审核记录
          </TabsTrigger>
        </TabsList>

        <TabsContent>
          {activeTab === "ai" && (
            <div className="space-y-4">
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
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />审核中...</>
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

              {aiResult && (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">审核结果</h3>
                          <p className="text-sm text-muted-foreground">{aiResult.summary}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={RESULT_CONFIG[aiResult.finalResult].badge} className="text-base px-4 py-1">
                            {RESULT_CONFIG[aiResult.finalResult].label}
                          </Badge>
                          {aiResult.finalResult !== "rejected" && (
                            <Button
                              onClick={handleSubmitHumanReview}
                              disabled={submitting}
                              size="sm"
                            >
                              {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <><Send className="h-4 w-4 mr-1" />提交人工审核</>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {aiResult.stages.map((stage, i) => (
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
                              {stage.result === "pass" ? "通过" : stage.result === "warning" ? "警告" : "阻断"}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {stage.issues.length > 0 ? (
                          <div className="space-y-3">
                            {stage.issues.map((issue, j) => (
                              <div
                                key={j}
                                className={`rounded-md border p-3 ${
                                  issue.level === "block" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={issue.level === "block" ? "destructive" : "warning"}>
                                    {issue.level === "block" ? "阻断" : "警告"}
                                  </Badge>
                                  <span className="text-sm font-medium">{issue.category}</span>
                                </div>
                                <p className="text-sm">{issue.text}</p>
                                <p className="mt-1 text-xs text-muted-foreground">建议：{issue.suggestion}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">未发现问题</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "workflow" && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div className="flex gap-2 mb-3">
                  {ROLE_FILTERS.map((role) => (
                    <button
                      key={role}
                      onClick={() => setRoleFilter(role)}
                      className={`text-xs px-3 py-1 rounded-full transition ${
                        roleFilter === role
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <ReviewList
                  reviews={reviews}
                  roleFilter={roleFilter}
                  onSelect={setSelectedReview}
                  selectedId={selectedReview?.id}
                />

                {selectedReview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">审核详情</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                        {selectedReview.content}
                      </div>

                      <ReviewPipeline review={selectedReview} />

                      {selectedReview.status === "pending_human" && (
                        <ReviewAction
                          reviewId={selectedReview.id}
                          stageIndex={selectedReview.humanStages.findIndex(
                            (s) => s.action === "pending"
                          )}
                          stageName={
                            selectedReview.humanStages.find((s) => s.action === "pending")
                              ?.role || ""
                          }
                          onAction={handleReviewAction}
                        />
                      )}

                      {/* Show completed stage comments */}
                      {selectedReview.humanStages
                        .filter((s) => s.action !== "pending" && s.comment)
                        .map((s, i) => (
                          <div key={i} className="text-xs border-l-2 border-gray-200 pl-3">
                            <span className="font-medium">{s.role}</span>
                            <span className="text-gray-500 ml-2">
                              {s.action === "approve" ? "通过" : s.action === "reject" ? "驳回" : "批注"}
                            </span>
                            {s.comment && (
                              <p className="text-gray-600 mt-0.5">{s.comment}</p>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <KnowledgeBase />
              </div>
            </div>
          )}

          {activeTab === "records" && (
            <div className="space-y-4">
              <ReviewList
                reviews={reviews}
                roleFilter="全部"
                onSelect={setSelectedReview}
                selectedId={selectedReview?.id}
              />

              {selectedReview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">审核详情</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {selectedReview.content.slice(0, 300)}
                      {selectedReview.content.length > 300 ? "..." : ""}
                    </div>
                    <ReviewPipeline review={selectedReview} />
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
