import { NextResponse } from "next/server";
import { readItem, writeItem } from "@/lib/store";
import type { ReviewRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const review = readItem<ReviewRecord>("reviews", params.id);
  if (!review) {
    return NextResponse.json({ error: "审核记录不存在" }, { status: 404 });
  }
  return NextResponse.json(review);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const review = readItem<ReviewRecord>("reviews", params.id);
  if (!review) {
    return NextResponse.json({ error: "审核记录不存在" }, { status: 404 });
  }

  const body = await request.json();
  const { stageIndex, action, comment, reviewer } = body;

  if (stageIndex === undefined || !action) {
    return NextResponse.json(
      { error: "缺少必要参数：stageIndex, action" },
      { status: 400 }
    );
  }

  if (stageIndex < 0 || stageIndex >= review.humanStages.length) {
    return NextResponse.json(
      { error: "stageIndex 超出范围" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  // Update the specific human stage
  review.humanStages[stageIndex] = {
    ...review.humanStages[stageIndex],
    action,
    comment: comment || "",
    reviewer: reviewer || review.humanStages[stageIndex].role,
    timestamp: now,
  };

  // Check if rejected
  if (action === "reject") {
    review.status = "rejected";
  } else if (action === "approve") {
    // Check if all stages are approved
    const allApproved = review.humanStages.every(
      (s) => s.action === "approve"
    );
    if (allApproved) {
      review.status = "approved";
    }
  }

  review.updatedAt = now;
  writeItem("reviews", review);
  return NextResponse.json(review);
}
