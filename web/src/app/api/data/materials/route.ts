import { NextResponse } from "next/server";
import { searchMaterials, getMaterialIndex } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  if (!query && type === "all") {
    // Return all materials with details
    const materials = searchMaterials("", "all");
    return NextResponse.json(materials);
  }

  const results = searchMaterials(query, type);
  return NextResponse.json(results);
}
