"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";

interface ReviewActionProps {
  reviewId: string;
  stageIndex: number;
  stageName: string;
  onAction: (action: string, comment: string) => void;
  disabled?: boolean;
}

export function ReviewAction({
  stageIndex,
  stageName,
  onAction,
  disabled,
}: ReviewActionProps) {
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);

  if (disabled) {
    return (
      <div className="text-sm text-gray-500 italic py-2">
        等待前序审核完成
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">
        当前阶段：{stageName}（第{stageIndex + 1}级审批）
      </p>

      {showComment && (
        <Textarea
          placeholder="输入审批意见..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onAction("approve", comment)}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          通过
        </Button>
        <Button
          onClick={() => {
            if (!showComment) {
              setShowComment(true);
              return;
            }
            onAction("reject", comment);
          }}
          variant="destructive"
          size="sm"
        >
          <XCircle className="h-4 w-4 mr-1" />
          驳回
        </Button>
        <Button
          onClick={() => {
            if (!showComment) {
              setShowComment(true);
              return;
            }
            onAction("revise", comment);
          }}
          variant="outline"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          批注
        </Button>
      </div>
    </div>
  );
}
