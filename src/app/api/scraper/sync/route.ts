import { NextResponse } from "next/server";

export async function POST() {
  try {
    const url = `${process.env.API_BASE_URL || 'https://jobfinder-5af78f88caff.herokuapp.com'}/api/v1/settings/scraper/run`;
    
    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Authorization": `Bearer ${process.env.SERVICE_API_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to trigger scraper: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to trigger sync" },
      { status: 500 }
    );
  }
}
