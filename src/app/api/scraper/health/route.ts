import { NextResponse } from "next/server";
import { getHealth } from "@/lib/api/scraper";

export async function GET() {
  try {
    const health = await getHealth();
    return NextResponse.json(health);
  } catch (error: any) {
    return NextResponse.json({ 
      status: "failed", 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
