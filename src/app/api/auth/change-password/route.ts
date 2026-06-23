import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";
import { compare, hash } from "bcryptjs";
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    const result = await tursoDb.execute({
      sql: "SELECT password FROM users WHERE id = ?",
      args: [decoded.id],
    });
    const user = result.rows[0];

    if (!user || !(await compare(currentPassword, user.password as string))) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);
    await tursoDb.execute({
      sql: "UPDATE users SET password = ? WHERE id = ?",
      args: [hashedPassword, decoded.id],
    });

    return NextResponse.json({ message: "Password changed successfully" });
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
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}