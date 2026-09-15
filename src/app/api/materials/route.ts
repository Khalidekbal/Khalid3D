import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const technologies = await prisma.printerTechnology.findMany({
      include: {
        materials: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    const finishingOptions = await prisma.finishingOption.findMany({
      orderBy: { costValue: "asc" },
    });

    return NextResponse.json({
      technologies,
      finishingOptions,
    });
  } catch (err: unknown) {
    console.error("Failed to fetch materials:", err);
    return NextResponse.json({ error: "Failed to load materials catalog" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // Staff/Admin configuration updates for materials
    const { id, costPerCm3, costPerGram, costPerMinute, density, setupFee, maxDimX, maxDimY, maxDimZ, isAvailable } = body;

    if (!id) {
      return NextResponse.json({ error: "Material ID is required" }, { status: 400 });
    }

    const updated = await prisma.material.update({
      where: { id },
      data: {
        ...(costPerCm3 !== undefined && { costPerCm3: parseFloat(costPerCm3) }),
        ...(costPerGram !== undefined && { costPerGram: parseFloat(costPerGram) }),
        ...(costPerMinute !== undefined && { costPerMinute: parseFloat(costPerMinute) }),
        ...(density !== undefined && { density: parseFloat(density) }),
        ...(setupFee !== undefined && { setupFee: parseFloat(setupFee) }),
        ...(maxDimX !== undefined && { maxDimX: parseFloat(maxDimX) }),
        ...(maxDimY !== undefined && { maxDimY: parseFloat(maxDimY) }),
        ...(maxDimZ !== undefined && { maxDimZ: parseFloat(maxDimZ) }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
      },
    });

    return NextResponse.json({ success: true, material: updated });
  } catch (err: unknown) {
    console.error("Failed to update material:", err);
    return NextResponse.json({ error: "Failed to update material parameters" }, { status: 500 });
  }
}
