import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST(request: Request) {
  const body = await request.json();
  const { content, platform } = body;

  if (!content) {
    return NextResponse.json(
      { error: "缺少必要参数：content" },
      { status: 400 }
    );
  }

  try {
    const result = await invokeSkill("content-reviewer", { content, platform });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
