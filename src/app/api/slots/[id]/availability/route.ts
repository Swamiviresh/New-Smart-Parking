import { NextResponse } from "next/server";
import { tursoDb, toIsoDate, addHours } from "@/lib/db-turso";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { message: "Missing authorization token" },
        { status: 401 }
      );
    }

    verifyToken(token);

    const { id } = await params;
    const slotId = Number(id);
    const { searchParams } = new URL(request.url);
    const duration = Number(searchParams.get("duration_hours"));
    const startTime = searchParams.get("start_time");

    const startIso = toIsoDate(startTime!);

    if (!slotId || !startIso || !Number.isInteger(duration) || duration < 1 || duration > 5) {
      return NextResponse.json(
        { message: "Valid slot id, start_time, and duration_hours between 1 and 5 are required" },
        { status: 400 }
      );
    }

    const endIso = addHours(startIso, duration);

    const overlap = await tursoDb.execute({
      sql: `
        SELECT id FROM bookings
        WHERE slot_id = ?
          AND status = 'active'
          AND start_time < ?
          AND end_time > ?
        LIMIT 1
      `,
      args: [slotId, endIso, startIso],
    });

    return NextResponse.json({
      slot_id: slotId,
      start_time: startIso,
      end_time: endIso,
      available_for_selected_time: overlap.rows.length === 0,
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    console.error("Slot availability error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}