import { NextResponse } from "next/server";
import { request } from "@/lib/api/client";

export async function POST() {
  try {
    const path = `/api/v1/settings/scraper/run`;
    const raw = await request<any>(path, { method: "POST" });
    const data = raw.data || raw;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to trigger sync" },
      { status: error.status || 500 }
    );
  }
}
