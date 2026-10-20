import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import { Job } from "@/lib/db/models/Job";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // Filters
    const query: any = {};
    const platform = searchParams.get("platform");
    if (platform) {
      query.$or = [
        { platform: platform },
        { source: platform }
      ];
    }
    
    // Default sort
    const sortParams: any = { postedAt: -1, collectedAt: -1 };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortParams)
      .skip(skip)
      .limit(limit)
      .lean();

    // Map _id to id for frontend compatibility
    const items = jobs.map(j => ({
      ...j,
      id: j._id.toString(),
      _id: j._id.toString(),
      platform: j.source || j.platform,
      scrapedAt: j.collectedAt || j.createdAt || j.scrapedAt
    }));

    return NextResponse.json({
      items,
      total,
      page,
      limit
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
