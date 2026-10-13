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
      customerEmail,
      customerName = "Valued Customer",
      customerPhone,
      phone,
      projectName,
      items,
      subtotal = 0,
      shippingFee = 0,
      tax = 0,
      discount = 0,
      totalAmount = 0,
      customerNotes,
      isEngineeringReview = true,
      shippingAddress,
    } = body;

    const finalPhone = customerPhone || phone || null;
    const resolvedEmail =
      customerEmail ||
      (finalPhone
        ? `${finalPhone.replace(/[^0-9]/g, "")}@khalid3d.com`
        : `review_${Date.now()}@khalid3d.com`);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    }

    // Find or create customer
    let user = customCustomerId
      ? await prisma.user.findUnique({ where: { id: customCustomerId } })
      : await prisma.user.findUnique({ where: { email: resolvedEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: resolvedEmail,
          name: customerName,
          phone: finalPhone,
          role: "CUSTOMER",
        },
      });
    } else if (finalPhone || customerName) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(customerName ? { name: customerName } : {}),
          ...(finalPhone ? { phone: finalPhone } : {}),
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

    // Pre-fetch default technology and materials for safe fallback mapping
    const dbTechs = await prisma.printerTechnology.findMany({ include: { materials: true } });
    const defaultTech = dbTechs[0];
    const defaultMat = defaultTech?.materials[0];

    const resolveTechId = (techId?: string) => {
      const match = dbTechs.find((t) => t.id === techId);
      return match ? match.id : defaultTech?.id;
    };

    const resolveMatId = (matId?: string) => {
      for (const t of dbTechs) {
        const match = t.materials.find((m) => m.id === matId);
        if (match) return match.id;
      }
      return defaultMat?.id;
    };

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
        customerNotes: projectName
          ? `[Project: ${projectName}] ${customerNotes || ""}`.trim()
          : (customerNotes || null),
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
            technologyId?: string;
            materialId?: string;
            infillPercent?: number;
            layerHeightMm?: number;
            finishingOptionId?: string;
            quantity: number;
            unitPrice?: number;
            totalPrice?: number;
            dfmWarnings?: unknown;
          }) => ({
            fileName: item.fileName,
            fileUrl: item.fileUrl || `/models/${item.fileName.toLowerCase().endsWith(".stl") ? "calibration_cube_20mm.stl" : "sensor_enclosure_lid.stl"}`,
            fileFormat: item.fileFormat || (item.fileName.endsWith(".3mf") ? "3MF" : "STL"),
            dimX: item.dimX || 20,
            dimY: item.dimY || 20,
            dimZ: item.dimZ || 20,
            volumeCm3: item.volumeCm3 || 8,
            surfaceAreaCm2: item.surfaceAreaCm2 || 24,
            unitUsed: item.unitUsed || "mm",
            technologyId: resolveTechId(item.technologyId),
            materialId: resolveMatId(item.materialId),
            infillPercent: item.infillPercent || 20,
            layerHeightMm: item.layerHeightMm || 0.2,
            finishingOptionId: item.finishingOptionId || null,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            totalPrice: item.totalPrice || 0,
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
