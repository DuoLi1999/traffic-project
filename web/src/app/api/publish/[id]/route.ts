import { NextResponse } from "next/server";
import { readItem } from "@/lib/store";
import type { PublishJob } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const job = readItem<PublishJob>("publish", params.id);
  if (!job) {
    return NextResponse.json({ error: "发布任务不存在" }, { status: 404 });
  }
  return NextResponse.json(job);
}
