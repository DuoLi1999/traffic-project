import { NextResponse } from "next/server";
import { readItem, writeItem, deleteItem } from "@/lib/store";
import type { PlanRecord, PlanVersion } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const plan = readItem<PlanRecord>("plans", params.id);
  if (!plan) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const plan = readItem<PlanRecord>("plans", params.id);
  if (!plan) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }

  const body = await request.json();
  const now = new Date().toISOString();

  // If content changed, save a new version
  if (body.content && body.content !== plan.content) {
    plan.version += 1;
    const version: PlanVersion = {
      id: `pv-${Date.now()}`,
      planId: params.id,
      version: plan.version,
      content: body.content,
      changeNote: body.changeNote || `第${plan.version}版更新`,
      createdAt: now,
    };
    writeItem("plan-versions", version);
  }

  const updated: PlanRecord = {
    ...plan,
    ...body,
    id: params.id,
    version: plan.version,
  };

  writeItem("plans", updated);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = deleteItem("plans", params.id);
  if (!deleted) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
