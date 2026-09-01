import { NextResponse } from "next/server";
import { request } from "@/lib/api/client";

export async function GET() {
  try {
    const path = `/api/v1/dashboard`;
    const raw = await request<any>(path);
    const dashData = raw.data || raw;
    return NextResponse.json(dashData);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch dashboard data" },
      { status: error.status || 500 }
    );
  }
}
