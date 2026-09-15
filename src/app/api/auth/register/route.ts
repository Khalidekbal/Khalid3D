import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        passwordHash,
        phone: phone || null,
        role: "CUSTOMER",
      },
    });

    const responseUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    };

    const res = NextResponse.json({
      success: true,
      user: responseUser,
    });

    res.cookies.set("khalid3d_session", JSON.stringify(responseUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err: unknown) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Failed to register account" },
      { status: 500 }
    );
  }
}
