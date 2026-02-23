import { NextResponse } from "next/server";
import { queryItems } from "@/lib/store";
import type { PlanVersion } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const versions = queryItems<PlanVersion>(
    "plan-versions",
    (v) => v.planId === params.id
  );
  versions.sort((a, b) => b.version - a.version);
  return NextResponse.json(versions);
}
