"use client";

import type { ReviewRecord } from "@/lib/types";
import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";

interface ReviewPipelineProps {
  review: ReviewRecord;
}

export function ReviewPipeline({ review }: ReviewPipelineProps) {
  const aiStages = review.aiResult.stages.map((s) => ({
    label: s.stageName,
    status: s.result === "pass" ? "approved" : s.result === "warning" ? "warning" : "rejected",
  }));

  const humanStages = review.humanStages.map((s) => ({
    label: s.role,
    status: s.action,
    reviewer: s.reviewer,
    comment: s.comment,
    timestamp: s.timestamp,
  }));

  const allStages = [
    ...aiStages.map((s) => ({ ...s, type: "ai" as const })),
    ...humanStages.map((s) => ({ ...s, type: "human" as const })),
  ];

  // Find the current active stage (first pending human stage)
  const currentIndex = allStages.findIndex(
    (s) => s.type === "human" && s.status === "pending"
  );

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-4">
      {allStages.map((stage, i) => {
        const isActive = i === currentIndex;
        const isPassed = stage.status === "approved" || stage.status === "approve";
        const isRejected = stage.status === "rejected" || stage.status === "reject";
        const isWarning = stage.status === "warning" || stage.status === "revise";

        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-6 ${
                  isPassed ? "bg-green-400" : "bg-gray-200"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  isPassed
                    ? "bg-green-100 text-green-600"
                    : isRejected
                      ? "bg-red-100 text-red-600"
                      : isWarning
                        ? "bg-yellow-100 text-yellow-600"
                        : isActive
                          ? "bg-blue-100 text-blue-600 ring-2 ring-blue-400 ring-offset-2"
                          : "bg-gray-100 text-gray-400"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isRejected ? (
                  <XCircle className="h-4 w-4" />
                ) : isActive ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              <span
                className={`text-[10px] text-center leading-tight ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-500"
                }`}
              >
                {stage.label}
              </span>
              {stage.type === "ai" && (
                <span className="text-[9px] text-gray-400">AI</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
