import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST(request: Request) {
  const body = await request.json();
  const { audience, topic, duration, format } = body;

  if (!audience || !topic) {
    return NextResponse.json(
      { error: "缺少必要参数：audience, topic" },
      { status: 400 }
    );
  }

  try {
    const content = await invokeSkill("courseware", {
      audience,
      topic,
      duration: duration || "45",
      format: format || "PPT大纲",
    });
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
