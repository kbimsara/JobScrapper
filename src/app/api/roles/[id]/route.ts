import { NextResponse } from "next/server";
import { updateRole, deleteRole } from "@/lib/api/roles";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const role = await updateRole(id, body);
    return NextResponse.json(role);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update role" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRole(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete role" },
      { status: error.status || 500 }
    );
  }
}
