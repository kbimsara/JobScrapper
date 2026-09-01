import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
import connectToDatabase from "@/lib/db/mongoose";
import { JobRole } from "@/lib/db/models/JobRole";

export async function GET() {
  try {
    await connectToDatabase();
    
    const roles = await JobRole.find({}).lean();
    
    // Map _id to id for frontend
    const mapped = roles.map(r => ({
      ...r,
      id: r._id.toString(),
      _id: r._id.toString()
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// We disable PUT/POST/DELETE since this web app is read-only
export async function POST() {
  return NextResponse.json({ message: "Read-only application" }, { status: 403 });
}

export async function PUT() {
  return NextResponse.json({ message: "Read-only application" }, { status: 403 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Read-only application" }, { status: 403 });
}
