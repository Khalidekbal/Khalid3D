import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const { email, password, portal } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password if passwordHash exists
    let isValid = false;
    if (user.passwordHash) {
      isValid = verifyPassword(password, user.passwordHash);
    } else {
      // Fallback check for initial demo accounts
      if (password === "Staff@123456" || password === "Customer@123456") {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Role check if logging in through staff workspace
    if (portal === "STAFF" && user.role !== "STAFF" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. This account does not have staff permissions." },
        { status: 403 }
      );
    }

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const res = NextResponse.json({
      success: true,
      user: responseUser,
    });

    // Set cookie for session
    res.cookies.set("khalid3d_session", JSON.stringify(responseUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal authentication error" },
      { status: 500 }
    );
  }
}
