import { NextResponse } from "next/server";
import { getAnalytics, getAllAnalytics } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  if (platform) {
    const data = getAnalytics(platform);
    if (!data) {
      return NextResponse.json(
        { error: "Platform not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  }

  const allData = getAllAnalytics();
  return NextResponse.json(allData);
}
