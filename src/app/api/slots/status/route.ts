import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";

export async function POST(request: Request) {
  try {
    const { slot_id, status } = await request.json();

    if (!slot_id || !["available", "occupied"].includes(status)) {
      return NextResponse.json(
        { message: "slot_id and status (available/occupied) are required" },
        { status: 400 }
      );
    }

    await tursoDb.execute({
      sql: "UPDATE slots SET status = ? WHERE id = ?",
      args: [status, slot_id],
    });

    return NextResponse.json({ message: "Slot status updated", slot_id, status });
  } catch (error) {
    console.error("Slot status update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}