import { NextResponse } from "next/server";
import { listItems, writeItem } from "@/lib/store";
import type { ReviewRecord, HumanReviewStage } from "@/lib/types";
import { invokeSkill } from "@/lib/skill-router";
import type { ReviewResult } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let reviews = listItems<ReviewRecord>("reviews");

  if (status) {
    reviews = reviews.filter((r) => r.status === status);
  }

  reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { content, platform } = body;

  if (!content) {
    return NextResponse.json(
      { error: "缺少必要参数：content" },
      { status: 400 }
    );
  }

  // Run AI review first
  const aiResult = (await invokeSkill("content-reviewer", {
    content,
    platform,
  })) as ReviewResult;

  const now = new Date().toISOString();

  const humanStages: HumanReviewStage[] = [
    {
      role: "创作员提交",
      reviewer: "",
      action: "approve",
      comment: "提交人工审核",
      timestamp: now,
    },
    {
      role: "新媒体负责人初审",
      reviewer: "",
      action: "pending",
      comment: "",
      timestamp: "",
    },
    {
      role: "科室领导复审",
      reviewer: "",
      action: "pending",
      comment: "",
      timestamp: "",
    },
    {
      role: "分管领导终审",
      reviewer: "",
      action: "pending",
      comment: "",
      timestamp: "",
    },
  ];

  const review: ReviewRecord = {
    id: `review-${Date.now()}`,
    content,
    platform: platform || "wechat",
    aiResult,
    humanStages,
    status: "pending_human",
    createdAt: now,
    updatedAt: now,
  };

  writeItem("reviews", review);
  return NextResponse.json(review);
}
