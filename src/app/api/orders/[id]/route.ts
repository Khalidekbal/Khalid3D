import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        customer: true,
        shippingAddress: true,
        items: {
          include: {
            technology: true,
            material: true,
            finishingOption: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error("Failed to fetch order:", err);
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      status,
      trackingNumber,
      carrier,
      staffNotes,
      additionalFee,
      manualDiscount,
      itemReviews,
    } = body;

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let updatedTotal = existingOrder.totalAmount;
    if (additionalFee !== undefined) {
      updatedTotal += parseFloat(additionalFee);
    }
    if (manualDiscount !== undefined) {
      updatedTotal = Math.max(0, updatedTotal - parseFloat(manualDiscount));
    }

    const updated = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        ...(status && { status }),
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(carrier !== undefined && { carrier }),
        ...(staffNotes !== undefined && { staffNotes }),
        ...(additionalFee !== undefined && { totalAmount: updatedTotal }),
      },
      include: {
        customer: true,
        items: {
          include: { technology: true, material: true, finishingOption: true },
        },
      },
    });

    // Update individual items if staff CAM review changes were submitted
    if (itemReviews && Array.isArray(itemReviews)) {
      for (const rev of itemReviews) {
        if (rev.id && rev.reviewStatus) {
          await prisma.orderItem.update({
            where: { id: rev.id },
            data: { reviewStatus: rev.reviewStatus },
          });
        }
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    console.error("Failed to update order:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
