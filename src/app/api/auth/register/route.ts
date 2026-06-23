import { NextResponse } from "next/server";
import { tursoDb } from "@/lib/db-turso";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    try {
      const result = await tursoDb.execute({
        sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        args: [name.trim(), email.trim().toLowerCase(), hashedPassword],
      });

      return NextResponse.json(
        {
          message: "User registered successfully",
          user: { id: Number(result.lastInsertRowid), name, email },
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      if (String((error as Error).message).includes("UNIQUE")) {
        return NextResponse.json(
          { message: "Email is already registered" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}