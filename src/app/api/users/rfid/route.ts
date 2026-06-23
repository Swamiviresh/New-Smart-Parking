import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function PUT(request: Request) {
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
    const { rfid_tag } = body;

    if (!rfid_tag) {
      return NextResponse.json(
        { message: "RFID tag is required" },
        { status: 400 }
      );
    }

    const trimmedRfid = rfid_tag.trim();

    await tursoDb.execute({
      sql: "UPDATE users SET rfid_tag = ? WHERE id = ?",
      args: [trimmedRfid, decoded.id],
    });

    return NextResponse.json({
      message: "RFID tag updated successfully",
      rfid_tag: trimmedRfid,
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
    console.error("RFID update error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}