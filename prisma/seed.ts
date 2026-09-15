import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Khalid3D Manufacturing Platform database seeding...");

  // Clean old records
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.material.deleteMany();
  await prisma.finishingOption.deleteMany();
  await prisma.printerTechnology.deleteMany();
  await prisma.product.deleteMany();

  const customerPass = hashPassword("Customer@123456");
  const staffPass = hashPassword("Staff@123456");
  const adminPass = hashPassword("Admin@123456");

  // 1. Create Users
  const customer = await prisma.user.create({
    data: {
      email: "customer@khalid3d.com",
      passwordHash: customerPass,
      name: "Ahmed Hassan",
      role: "CUSTOMER",
      phone: "+20 100 123 4567",
      addresses: {
        create: {
          type: "SHIPPING",
          street: "15 El-Tahrir Street, Dokki",
          city: "Giza",
          state: "Giza",
          postalCode: "12311",
          country: "Egypt",
        },
      },
    },
    include: { addresses: true },
  });

  const staff = await prisma.user.create({
    data: {
      email: "staff@khalid3d.com",
      passwordHash: staffPass,
      name: "Khalid Ekbal (Master 3D Engineer)",
      role: "STAFF",
      phone: "+20 101 234 5678",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@khalid3d.com",
      passwordHash: adminPass,
      name: "Khalid3D Operations Admin",
      role: "ADMIN",
      phone: "+20 102 345 6789",
    },
  });

  console.log("✓ Seeded Users: Ahmed Hassan (Customer), Khalid Ekbal (Staff: staff@khalid3d.com), Admin");

  // 2. Printer Technology: FDM Only
  const fdm = await prisma.printerTechnology.create({
    data: {
      name: "FDM",
      description: "Fused Deposition Modeling — High-precision industrial thermoplastic filament extrusion. Accurate layer adhesion for mechanical brackets, housings, and functional prototypes.",
      leadTimeDays: 2,
    },
  });

  console.log("✓ Seeded Technology: FDM");

  // 3. Materials: PLA, PETG, TPU with EGP pricing per gram and per minute
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        technologyId: fdm.id,
        name: "PLA Tough Industrial",
        color: "Signal Black",
        colorHex: "#1e293b",
        density: 1.24,
        costPerCm3: 1.55,
        costPerGram: 1.25,      // 1.25 EGP per gram
        costPerMinute: 0.40,    // 0.40 EGP per minute (~24 EGP/hour machine time)
        minWallThickness: 0.8,
        maxDimX: 300,
        maxDimY: 300,
        maxDimZ: 400,
        setupFee: 20.0,         // 20 EGP setup fee
        infillMultiplier: 1.0,
        supportFactor: 0.35,
        sortOrder: 1,
      },
    }),
    prisma.material.create({
      data: {
        technologyId: fdm.id,
        name: "PETG Engineering Grade",
        color: "Signal Orange",
        colorHex: "#f97316",
        density: 1.27,
        costPerCm3: 1.95,
        costPerGram: 1.60,      // 1.60 EGP per gram
        costPerMinute: 0.50,    // 0.50 EGP per minute (~30 EGP/hour machine time)
        minWallThickness: 1.0,
        maxDimX: 300,
        maxDimY: 300,
        maxDimZ: 400,
        setupFee: 25.0,         // 25 EGP setup fee
        infillMultiplier: 1.0,
        supportFactor: 0.40,
        sortOrder: 2,
      },
    }),
    prisma.material.create({
      data: {
        technologyId: fdm.id,
        name: "TPU 95A Flexible",
        color: "Electric Blue",
        colorHex: "#2563eb",
        density: 1.21,
        costPerCm3: 2.80,
        costPerGram: 2.40,      // 2.40 EGP per gram
        costPerMinute: 0.70,    // 0.70 EGP per minute (slower extrusion rate)
        minWallThickness: 1.2,
        maxDimX: 250,
        maxDimY: 250,
        maxDimZ: 300,
        setupFee: 35.0,         // 35 EGP setup fee
        infillMultiplier: 1.15,
        supportFactor: 0.50,
        sortOrder: 3,
      },
    }),
  ]);

  console.log("✓ Seeded Materials: PLA Tough, PETG Engineering, TPU 95A (with EGP per gram & per minute)");

  // 4. Finishing Options in EGP
  const finishOptions = await Promise.all([
    prisma.finishingOption.create({
      data: {
        name: "Standard Cleaned As-Printed",
        description: "Supports carefully removed, deburred edges, clean layer line texture.",
        costType: "FLAT",
        costValue: 0.0,
      },
    }),
    prisma.finishingOption.create({
      data: {
        name: "Brass Heat-Set Thread Inserts (Set of 4)",
        description: "Thermally embedded M3 or M4 brass threaded inserts for reusable mechanical bolting.",
        costType: "FLAT",
        costValue: 45.0, // 45 EGP
      },
    }),
    prisma.finishingOption.create({
      data: {
        name: "Surface Smoothing & Sanding",
        description: "Fine grit dry & wet sanding for smooth touch feel and reduced layer line visibility.",
        costType: "FLAT",
        costValue: 35.0, // 35 EGP
      },
    }),
  ]);

  console.log("✓ Seeded Finishing Options in EGP");

  // 5. Customer Reviews for Khalid3D
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        customerName: "Eng. Omar Farouk",
        rating: 5,
        comment: "Exceptional print quality on my custom quadcopter arm in PETG! The dimensional tolerances were spot on and it survived rigorous flight testing without flex.",
        partName: "Quadcopter Motor Arm V2",
        materialUsed: "PETG Engineering Grade",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        customerName: "Tarek Mahmoud",
        rating: 5,
        comment: "The TPU 95A flexible gaskets and dampers arrived within 48 hours in Cairo. Outstanding elastic recovery and zero stringing.",
        partName: "Vibration Isolator Damper",
        materialUsed: "TPU 95A Flexible",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        customerName: "Dr. Nour El-Din",
        rating: 5,
        comment: "Khalid3D is hands down the best on-demand 3D printing workshop in Egypt. The transparent pricing per gram and per minute gives us exact budget forecasts.",
        partName: "Lab Centrifuge Tube Carrier",
        materialUsed: "PLA Tough Industrial",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        customerName: "Youssef Mansour",
        rating: 5,
        comment: "Clean website, accurate 3D CAD preview, and responsive WhatsApp communication from Khalid himself. Highly recommended for engineering projects!",
        partName: "Custom Mechanical Keyboard Top Case",
        materialUsed: "PETG Engineering Grade",
        isApproved: true,
      },
    }),
  ]);

  console.log(`✓ Seeded ${reviews.length} Verified Customer Reviews`);

  // 6. Pre-made Hardware Products in EGP
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: "Raspberry Pi 5 Snap-Fit Enclosure",
        slug: "rpi5-snap-fit-enclosure",
        description: "Snap-together vented chassis with active cooling chimney, heat-sink clearance, and GPIO ribbon slot.",
        images: JSON.stringify(["/images/products/rpi5-din.svg"]),
        technology: "FDM",
        material: "PETG Engineering Grade",
        price: 180.0, // 180 EGP
        stock: 50,
        isPublished: true,
      },
    }),
    prisma.product.create({
      data: {
        title: "Planetary Gearbox 4:1 (NEMA 17)",
        slug: "planetary-gearbox-nema17",
        description: "High-torque reduction gearbox for 3D printers and robotics actuators with low backlash teeth.",
        images: JSON.stringify(["/images/products/gearbox-nema17.svg"]),
        technology: "FDM",
        material: "PLA Tough Industrial",
        price: 260.0, // 260 EGP
        stock: 35,
        isPublished: true,
      },
    }),
    prisma.product.create({
      data: {
        title: "Anti-Vibration TPU Feet Set (4 pcs)",
        slug: "tpu-vibration-feet-set",
        description: "High-damping flexible TPU 95A feet for 3D printers, CNC routers, and heavy lab instruments.",
        images: JSON.stringify(["/images/products/gimbal-bracket.svg"]),
        technology: "FDM",
        material: "TPU 95A Flexible",
        price: 120.0, // 120 EGP
        stock: 80,
        isPublished: true,
      },
    }),
  ]);

  console.log(`✓ Seeded ${products.length} Products in EGP`);

  // 7. Sample Orders in EGP
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: "K3D-2026-1042",
      customerId: customer.id,
      status: "SHIPPED",
      subtotal: 320.0,
      shippingFee: 55.0,
      tax: 0.0,
      discount: 25.0,
      totalAmount: 350.0,
      shippingAddressId: customer.addresses[0]?.id,
      trackingNumber: "BOSTA-9912401-EG",
      carrier: "Bosta Express",
      staffNotes: "Printed on Bambu Lab X1-Carbon with 0.20mm layer height. Inspected and verified.",
      customerNotes: "Please package carefully with bubble wrap.",
      items: {
        create: [
          {
            fileName: "Drone_Motor_Bracket.stl",
            fileFormat: "STL",
            dimX: 80.0,
            dimY: 30.0,
            dimZ: 45.0,
            volumeCm3: 28.5,
            surfaceAreaCm2: 84.0,
            weightGrams: 36.2,
            printMinutes: 85,
            unitUsed: "mm",
            technologyId: fdm.id,
            materialId: materials[1].id, // PETG
            infillPercent: 40,
            layerHeightMm: 0.2,
            finishingOptionId: finishOptions[0].id,
            quantity: 2,
            unitPrice: 160.0,
            totalPrice: 320.0,
            reviewStatus: "APPROVED",
            dfmWarnings: JSON.stringify([]),
          },
        ],
      },
    },
  });

  console.log(`✓ Seeded Sample Order K3D-2026-1042`);
  console.log("🚀 Khalid3D platform database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
