import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  const { docType, timePeriod, keyPoints, reference } = body;

  if (!docType) {
    return NextResponse.json(
      { error: "缺少必要参数：docType" },
      { status: 400 }
    );
  }

  try {
    const content = await invokeSkill("doc-writer", {
      docType,
      timePeriod,
      keyPoints,
      reference,
    });

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
