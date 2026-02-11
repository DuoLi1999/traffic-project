import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, platform, contentType, style } = body;

  if (!topic || !platform) {
    return NextResponse.json(
      { error: "缺少必要参数：topic, platform" },
      { status: 400 }
    );
  }

  try {
    const content = await invokeSkill("content-producer", {
      topic,
      platform,
      contentType: contentType || "article",
      style,
    });

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
