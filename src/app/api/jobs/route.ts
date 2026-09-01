import { NextResponse } from "next/server";
import { getJobs, GetJobsParams } from "@/lib/api/jobs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: GetJobsParams = {};
    
    if (searchParams.has("page")) params.page = Number(searchParams.get("page"));
    if (searchParams.has("limit")) params.limit = Number(searchParams.get("limit"));
    if (searchParams.has("q")) params.q = searchParams.get("q") as string;
    if (searchParams.has("type")) params.type = searchParams.get("type") as string;
    if (searchParams.has("startDate")) params.startDate = searchParams.get("startDate") as string;
    if (searchParams.has("endDate")) params.endDate = searchParams.get("endDate") as string;
    if (searchParams.has("sort")) params.sort = searchParams.get("sort") as string;
    if (searchParams.has("platform")) params.platform = searchParams.get("platform") as string;
    if (searchParams.has("role")) params.role = searchParams.get("role") as string;

    const data = await getJobs(params);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch jobs" },
      { status: error.code || 500 }
    );
  }
}
