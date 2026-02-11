import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST(request: Request) {
  const body = await request.json();
  const { question } = body;

  if (!question) {
    return NextResponse.json(
      { error: "缺少必要参数：question" },
      { status: 400 }
    );
  }

  try {
    const answer = await invokeSkill("public-relations", { question });
    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
