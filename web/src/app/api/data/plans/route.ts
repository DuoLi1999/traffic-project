import { NextResponse } from "next/server";
import { listItems, writeItem } from "@/lib/store";
import type { PlanRecord, PlanTask, PlanVersion } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const plans = listItems<PlanRecord>("plans");
  plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { month, title, content } = body;

  if (!month || !content) {
    return NextResponse.json(
      { error: "缺少必要参数：month, content" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const id = `plan-${Date.now()}`;

  const plan: PlanRecord = {
    id,
    month,
    title: title || `${month}月月度宣传计划`,
    content,
    createdAt: now,
    version: 1,
    status: "draft",
  };

  writeItem("plans", plan);

  // Save initial version
  const version: PlanVersion = {
    id: `pv-${Date.now()}`,
    planId: id,
    version: 1,
    content,
    changeNote: "初始版本",
    createdAt: now,
  };
  writeItem("plan-versions", version);

  // Auto-decompose into tasks from weekly plan
  const tasks: PlanTask[] = [];
  const weekTitles = [
    "第一周宣传任务",
    "第二周宣传任务",
    "第三周宣传任务",
    "第四周宣传任务",
  ];
  const assignees = ["宣传科-张三", "宣传科-李四", "宣传科-王五", "宣传科-赵六"];

  for (let i = 0; i < 4; i++) {
    // Extract week theme from content if possible
    const weekPattern = new RegExp(`第${["一", "二", "三", "四"][i]}周[\\s\\S]*?\\|\\s*\\*\\*周主题\\*\\*\\s*\\|\\s*(.+?)\\s*\\|`);
    const match = content.match(weekPattern);
    const theme = match ? match[1].trim() : `第${i + 1}周宣传工作`;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7);

    const task: PlanTask = {
      id: `task-${Date.now()}-${i}`,
      planId: id,
      title: `${theme}`,
      description: weekTitles[i],
      assignee: assignees[i],
      status: "pending",
      priority: i === 0 ? "P0" : i <= 2 ? "P1" : "P2",
      dueDate: dueDate.toISOString().split("T")[0],
      week: i + 1,
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
    writeItem("tasks", task);
  }

  return NextResponse.json({ plan, tasks });
}
