import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") where.status = status;
    if (customerId) where.customerId = customerId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { email: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        shippingAddress: true,
        items: {
          include: {
            technology: true,
            material: true,
            finishingOption: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: unknown) {
    console.error("Failed to fetch orders:", err);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerId: customCustomerId,
      customerEmail = "customer@demo.com",
      customerName = "Alex Chen",
      items,
      subtotal,
      shippingFee,
      tax,
      discount = 0,
      totalAmount,
      customerNotes,
      isEngineeringReview = false,
      shippingAddress,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }

    // Find or create customer
    let user = customCustomerId
      ? await prisma.user.findUnique({ where: { id: customCustomerId } })
      : await prisma.user.findUnique({ where: { email: customerEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: customerEmail,
          name: customerName,
          role: "CUSTOMER",
        },
      });
    }

    // Create address if provided
    let addressId: string | undefined;
    if (shippingAddress) {
      const addr = await prisma.address.create({
        data: {
          userId: user.id,
          street: shippingAddress.street || "742 Evergreen Terrace",
          city: shippingAddress.city || "San Jose",
          state: shippingAddress.state || "CA",
          postalCode: shippingAddress.postalCode || "95134",
          country: shippingAddress.country || "United States",
        },
      });
      addressId = addr.id;
    }

    // Generate unique order number: JLC-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `JLC-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: user.id,
        status: isEngineeringReview ? "PENDING_REVIEW" : "QUOTED",
        isEngineeringReview,
        subtotal: parseFloat(String(subtotal || 0)),
        shippingFee: parseFloat(String(shippingFee || 0)),
        tax: parseFloat(String(tax || 0)),
        discount: parseFloat(String(discount || 0)),
        totalAmount: parseFloat(String(totalAmount || 0)),
        customerNotes,
        shippingAddressId: addressId,
        items: {
          create: items.map((item: {
            fileName: string;
            fileUrl?: string;
            fileFormat?: string;
            dimX: number;
            dimY: number;
            dimZ: number;
            volumeCm3: number;
            surfaceAreaCm2: number;
            unitUsed?: string;
            technologyId: string;
            materialId: string;
            infillPercent?: number;
            layerHeightMm?: number;
            finishingOptionId?: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            dfmWarnings?: unknown;
          }) => ({
            fileName: item.fileName,
            fileUrl: item.fileUrl || `/models/${item.fileName.toLowerCase().endsWith(".stl") ? "calibration_cube_20mm.stl" : "sensor_enclosure_lid.stl"}`,
            fileFormat: item.fileFormat || (item.fileName.endsWith(".3mf") ? "3MF" : "STL"),
            dimX: item.dimX,
            dimY: item.dimY,
            dimZ: item.dimZ,
            volumeCm3: item.volumeCm3,
            surfaceAreaCm2: item.surfaceAreaCm2,
            unitUsed: item.unitUsed || "mm",
            technologyId: item.technologyId,
            materialId: item.materialId,
            infillPercent: item.infillPercent || 20,
            layerHeightMm: item.layerHeightMm || 0.2,
            finishingOptionId: item.finishingOptionId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            reviewStatus: isEngineeringReview ? "REQUIRES_MODIFICATION" : "APPROVED",
            dfmWarnings: JSON.stringify(item.dfmWarnings || []),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    console.error("Failed to create order:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
