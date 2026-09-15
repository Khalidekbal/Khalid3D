import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    console.error("Failed to fetch reviews:", err);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, customerName, rating, comment, partName, materialUsed } = body;

    if (!customerName || !comment || !rating) {
      return NextResponse.json(
        { error: "Customer name, rating, and comment are required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        orderId: orderId || null,
        customerName: customerName.trim(),
        rating: Math.max(1, Math.min(5, parseInt(rating))),
        comment: comment.trim(),
        partName: partName ? partName.trim() : null,
        materialUsed: materialUsed ? materialUsed.trim() : "PLA Tough Industrial",
        isApproved: true, // Auto-approve verified client reviews
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: unknown) {
    console.error("Failed to post review:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
