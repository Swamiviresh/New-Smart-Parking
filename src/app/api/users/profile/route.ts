import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";
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

    const decoded = verifyToken(token);

    const result = await tursoDb.execute({
      sql: "SELECT id, name, email, role, rfid_tag FROM users WHERE id = ?",
      args: [decoded.id],
    });

    if (!result.rows[0]) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
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
    console.error("Profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}