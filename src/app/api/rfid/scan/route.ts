import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rfid_tag } = body;

    if (!rfid_tag) {
      return NextResponse.json(
        { message: "RFID tag is required" },
        { status: 400 }
      );
    }

    const userResult = await tursoDb.execute({
      sql: "SELECT id, name, email, rfid_tag FROM users WHERE rfid_tag = ?",
      args: [rfid_tag.trim()],
    });
    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "RFID tag is not registered" },
        { status: 404 }
      );
    }

    const slotResult = await tursoDb.execute({
      sql: "SELECT * FROM slots WHERE status = 'available' ORDER BY slot_number ASC LIMIT 1",
      args: [],
    });
    const slot = slotResult.rows[0];

    if (!slot) {
      return NextResponse.json(
        { message: "No available parking slots" },
        { status: 409 }
      );
    }

    await tursoDb.execute({
      sql: "UPDATE slots SET status = 'occupied' WHERE id = ?",
      args: [slot.id],
    });

    return NextResponse.json({
      message: "Entry allowed",
      user: { id: user.id, name: user.name, email: user.email },
      slot: { ...slot, status: "occupied" },
    });
  } catch (error) {
    console.error("RFID scan error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}