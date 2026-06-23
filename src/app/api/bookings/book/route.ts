import { NextResponse } from "next/server";
import { tursoDb, toIsoDate, addHours } from "@/lib/db-turso";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { message: "Missing authorization token" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    const body = await request.json();
    const { slot_id, start_time, duration_hours } = body;
    const duration = Number(duration_hours);
    const startIso = toIsoDate(start_time);

    if (!slot_id || !startIso || !Number.isInteger(duration) || duration < 1 || duration > 5) {
      return NextResponse.json(
        { message: "slot_id, valid start_time, and duration_hours between 1 and 5 are required" },
        { status: 400 }
      );
    }

    const endIso = addHours(startIso, duration);

    const overlap = await tursoDb.execute({
      sql: `
        SELECT * FROM bookings
        WHERE slot_id = ?
          AND status = 'active'
          AND start_time < ?
          AND end_time > ?
      `,
      args: [slot_id, endIso, startIso],
    });

    if (overlap.rows.length > 0) {
      return NextResponse.json(
        { message: "Slot is already booked for the selected time" },
        { status: 409 }
      );
    }

    const slot = await tursoDb.execute({
      sql: "SELECT id FROM slots WHERE id = ?",
      args: [slot_id],
    });

    if (!slot.rows[0]) {
      return NextResponse.json(
        { message: "Slot not found" },
        { status: 404 }
      );
    }

    const booking = await tursoDb.execute({
      sql: `
        INSERT INTO bookings (user_id, slot_id, start_time, end_time, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [decoded.id, slot_id, startIso, endIso, endIso],
    });

    return NextResponse.json(
      {
        id: Number(booking.lastInsertRowid),
        user_id: decoded.id,
        slot_id,
        start_time: startIso,
        end_time: endIso,
        status: "active",
      },
      { status: 201 }
    );
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
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}