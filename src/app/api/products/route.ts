import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const technology = searchParams.get("technology");
    const material = searchParams.get("material");

    const where: Record<string, unknown> = { isPublished: true };
    if (technology && technology !== "ALL") {
      where.technology = technology;
    }
    if (material && material !== "ALL") {
      where.material = { contains: material };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (err: unknown) {
    console.error("Failed to fetch products:", err);
    return NextResponse.json({ error: "Failed to load product catalog" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, technology, material, price, stock, images } = body;

    if (!title || price === undefined) {
      return NextResponse.json({ error: "Title and price are required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || "",
        technology: technology || "FDM",
        material: material || "PLA Tough",
        price: parseFloat(price),
        stock: parseInt(stock || 50),
        images: JSON.stringify(images || ["/images/products/rpi5-din.svg"]),
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err: unknown) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
