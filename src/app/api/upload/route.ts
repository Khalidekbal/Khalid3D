import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueFileName = `${Date.now()}-${safeName}`;

    // Target directory: public/uploads/cad-models
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cad-models");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/cad-models/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: unknown) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: "Failed to store uploaded CAD file", details: String(err) },
      { status: 500 }
    );
  }
}
