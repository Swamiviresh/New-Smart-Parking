import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";
import { compare } from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await tursoDb.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email.trim().toLowerCase()],
    });
    const user = result.rows[0];

    if (!user || !(await compare(password, user.password as string))) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user.id as number,
      email: user.email as string,
      role: (user.role as string) || "user",
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rfid_tag: user.rfid_tag,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}