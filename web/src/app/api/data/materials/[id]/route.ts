import { NextResponse } from "next/server";
import { getMaterialDetail } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const material = getMaterialDetail(params.id);
  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }
  return NextResponse.json(material);
}
