import { NextResponse } from "next/server";
import { tursoDb, nowIso } from "@/lib/db-turso";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { message: "Missing authorization token" },
        { status: 401 }
      );
    }

    verifyToken(token);

    const now = nowIso();
    const result = await tursoDb.execute({
      sql: `
        SELECT
          s.id,
          s.slot_number,
          s.status,
          CASE
            WHEN EXISTS (
              SELECT 1 FROM bookings b
              WHERE b.slot_id = s.id
                AND b.status = 'active'
                AND b.start_time <= ?
                AND b.end_time > ?
            ) THEN 'booked'
            ELSE 'not_booked'
          END AS booking_status
        FROM slots s
        ORDER BY s.slot_number ASC
      `,
      args: [now, now],
    });

    return NextResponse.json(result.rows);
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
    console.error("Slots error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}