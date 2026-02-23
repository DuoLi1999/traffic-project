import { NextResponse } from "next/server";
import { getAccidentData } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getAccidentData();
  return NextResponse.json(data);
}
