import { NextResponse } from "next/server";

export async function PUT() {
  return NextResponse.json({ message: "Read-only application" }, { status: 403 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Read-only application" }, { status: 403 });
}
