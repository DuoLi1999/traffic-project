import { NextResponse } from "next/server";
import { invokeSkill } from "@/lib/skill-router";

export async function POST() {
  try {
    const content = await invokeSkill("analytics", {});
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "技能调用失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
