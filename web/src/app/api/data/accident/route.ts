import { NextResponse } from "next/server";
import { getAccidentData } from "@/lib/data";

export async function GET() {
  const data = getAccidentData();
  return NextResponse.json(data);
}
