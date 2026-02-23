import { NextResponse } from "next/server";
import { listItems, writeItem } from "@/lib/store";

interface KBEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  source: string;
  createdAt: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");

  let entries = listItems<KBEntry>("review-kb");

  if (q) {
    const query = q.toLowerCase();
    entries = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
    );
  }

  if (category) {
    entries = entries.filter((e) => e.category === category);
  }

  entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { category, title, content, source } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "缺少必要参数：title, content" },
      { status: 400 }
    );
  }

  const entry: KBEntry = {
    id: `kb-${Date.now()}`,
    category: category || "其他",
    title,
    content,
    source: source || "人工录入",
    createdAt: new Date().toISOString(),
  };

  writeItem("review-kb", entry);
  return NextResponse.json(entry);
}
