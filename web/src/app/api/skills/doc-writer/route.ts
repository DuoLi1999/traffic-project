import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST(request: Request) {
  const body = await request.json();
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
