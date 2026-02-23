import { NextResponse } from "next/server";
import { queryItems, writeItem } from "@/lib/store";
import type { PlanTask } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const tasks = queryItems<PlanTask>("tasks", (t) => t.planId === params.id);
  tasks.sort((a, b) => a.week - b.week);
  return NextResponse.json(tasks);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const now = new Date().toISOString();

  const task: PlanTask = {
    id: `task-${Date.now()}`,
    planId: params.id,
    title: body.title || "新任务",
    description: body.description || "",
    assignee: body.assignee || "",
    status: body.status || "pending",
    priority: body.priority || "P1",
    dueDate: body.dueDate || "",
    week: body.week || 1,
    createdAt: now,
    updatedAt: now,
  };

  writeItem("tasks", task);
  return NextResponse.json(task);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { taskId, ...updates } = body;

  if (!taskId) {
    return NextResponse.json({ error: "缺少 taskId" }, { status: 400 });
  }

  const tasks = queryItems<PlanTask>("tasks", (t) => t.id === taskId);
  if (tasks.length === 0) {
    return NextResponse.json({ error: "任务不存在" }, { status: 404 });
  }

  const task = tasks[0];
  const updated: PlanTask = {
    ...task,
    ...updates,
    id: taskId,
    updatedAt: new Date().toISOString(),
  };

  writeItem("tasks", updated);
  return NextResponse.json(updated);
}
