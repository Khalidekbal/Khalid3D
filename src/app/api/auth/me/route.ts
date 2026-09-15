import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("khalid3d_session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }

    try {
      const parsed = JSON.parse(sessionCookie.value);
      if (!parsed?.id) {
        return NextResponse.json({ user: null });
      }

      const user = await prisma.user.findUnique({
        where: { id: parsed.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
        },
      });

      return NextResponse.json({ user: user || null });
    } catch {
      return NextResponse.json({ user: null });
    }
  } catch (err: unknown) {
    console.error("Auth check error:", err);
    return NextResponse.json({ user: null });
  }
}
