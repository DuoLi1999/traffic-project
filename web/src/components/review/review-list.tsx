"use client";

import type { ReviewRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface ReviewListProps {
  reviews: ReviewRecord[];
  roleFilter: string;
  onSelect: (review: ReviewRecord) => void;
  selectedId?: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" }> = {
  pending_human: { label: "待审批", variant: "warning" },
  approved: { label: "已通过", variant: "success" },
  rejected: { label: "已驳回", variant: "destructive" },
};

export function ReviewList({ reviews, roleFilter, onSelect, selectedId }: ReviewListProps) {
  const filtered = roleFilter === "全部"
    ? reviews
    : reviews.filter((r) => {
        const currentStage = r.humanStages.find((s) => s.action === "pending");
        return currentStage && currentStage.role === roleFilter;
      });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        暂无审核记录
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((review) => {
        const currentStage = review.humanStages.find((s) => s.action === "pending");
        const statusConfig = STATUS_CONFIG[review.status] || STATUS_CONFIG.pending_human;

        return (
          <div
            key={review.id}
            onClick={() => onSelect(review)}
            className={`cursor-pointer rounded-lg border p-3 transition hover:shadow-sm ${
              selectedId === review.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
                {review.content.slice(0, 80)}
                {review.content.length > 80 ? "..." : ""}
              </p>
              <Badge variant={statusConfig.variant} className="ml-2 shrink-0">
                {statusConfig.label}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(review.createdAt).toLocaleString("zh-CN")}
              </span>
              {review.status === "pending_human" && currentStage && (
                <span className="text-blue-600 font-medium">
                  当前：{currentStage.role}
                </span>
              )}
              {review.status === "approved" && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-3 w-3" />
                  全部通过
                </span>
              )}
              {review.status === "rejected" && (
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-3 w-3" />
                  已驳回
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
