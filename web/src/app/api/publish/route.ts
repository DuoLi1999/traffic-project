import { NextResponse } from "next/server";
import { listItems, writeItem } from "@/lib/store";
import type { PublishJob } from "@/lib/types";

export async function GET() {
  const jobs = listItems<PublishJob>("publish");
  jobs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { content, platforms } = body;

  if (!content || !platforms || platforms.length === 0) {
    return NextResponse.json(
      { error: "缺少必要参数：content, platforms" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  const job: PublishJob = {
    id: `pub-${Date.now()}`,
    content,
    platforms,
    status: "publishing",
    results: platforms.map((p: string) => ({
      platform: p,
      status: "publishing",
    })),
    createdAt: now,
  };

  writeItem("publish", job);

  // Simulate async publishing (update to published after save)
  setTimeout(() => {
    const updated: PublishJob = {
      ...job,
      status: "published",
      results: platforms.map((p: string) => ({
        platform: p,
        status: "published",
        url: `https://${p}.example.com/post/${Date.now()}`,
      })),
    };
    writeItem("publish", updated);
  }, 1500);

  return NextResponse.json(job);
}
