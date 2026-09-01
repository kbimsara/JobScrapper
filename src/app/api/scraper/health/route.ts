import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = `${process.env.API_BASE_URL || 'https://jobfinder-5af78f88caff.herokuapp.com'}/api/v1/dashboard`;
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Authorization": `Bearer ${process.env.SERVICE_API_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch scraper health: ${res.statusText}`);
    }

    const data = await res.json();
    const scraperHealth = data.data?.scraperHealth || data.scraperHealth || { status: 'unknown' };
    
    return NextResponse.json(scraperHealth);
  } catch (error: any) {
    return NextResponse.json({
      status: "failed",
      error: error.message || "Unknown error"
    }, { status: 500 });
  }
}
