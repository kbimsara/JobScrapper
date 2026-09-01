import { NextResponse } from "next/server";
import { getRoles, createRole } from "@/lib/api/roles";

export async function GET() {
  try {
    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch roles" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = await createRole(body);
    return NextResponse.json(role);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create role" },
      { status: error.status || 500 }
    );
  }
}
