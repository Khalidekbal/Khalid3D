/**
 * Comprehensive System Test Automation Suite for Khalid3D Manufacturing Platform
 * Tests:
 * 1. Customer registration & authentication
 * 2. Dedicated staff login (khalidekbal03@gmail.com / 102030)
 * 3. Security role isolation (customer blocked from staff portal)
 * 4. 3D print review request submission with WhatsApp phone
 * 5. Staff order retrieval & CAM review workflow
 * 6. Materials catalog verification
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  ✅ [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({
      name,
      passed: false,
      details: err?.message || String(err),
      durationMs: Date.now() - start,
    });
    console.error(`  ❌ [FAIL] ${name}: ${err?.message || err}`);
  }
}

async function main() {
  console.log("==========================================================");
  console.log("🚀 STARTING KHALID3D END-TO-END AUTOMATED TEST SUITE");
  console.log("==========================================================\n");

  const timestamp = Date.now();
  const testCustomerEmail = `customer_${timestamp}@test.com`;
  const testCustomerPass = "CustomerPassword123";
  let createdOrderId = "";

  // 1. Test Staff Account in Database
  await runTest("Database: Verify Staff User (khalidekbal03@gmail.com)", async () => {
    const staff = await prisma.user.findUnique({
      where: { email: "khalidekbal03@gmail.com" },
    });
    if (!staff) throw new Error("Staff user khalidekbal03@gmail.com not found in database");
    if (staff.role !== "STAFF" && staff.role !== "ADMIN") {
      throw new Error(`Expected role STAFF or ADMIN, found ${staff.role}`);
    }
    if (!staff.passwordHash || !verifyPassword("102030", staff.passwordHash)) {
      throw new Error("Password verification failed for staff account with '102030'");
    }
  });

  // 2. Test Staff Login API
  await runTest("API: Staff Login with khalidekbal03@gmail.com & 102030", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "khalidekbal03@gmail.com",
        password: "102030",
        portal: "STAFF",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Login failed with HTTP ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.success || data.user.role !== "STAFF") {
      throw new Error(`Unexpected staff login response: ${JSON.stringify(data)}`);
    }
  });

  // 3. Test Customer Registration API
  await runTest("API: New Customer Sign-Up (/api/auth/register)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mostafa Mahmoud",
        email: testCustomerEmail,
        password: testCustomerPass,
        phone: "+201099887766",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Registration failed with HTTP ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.success || data.user.email !== testCustomerEmail) {
      throw new Error(`Registration response invalid: ${JSON.stringify(data)}`);
    }
  });

  // 4. Test Customer Login API
  await runTest("API: Customer Login (/api/auth/login)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomerEmail,
        password: testCustomerPass,
        portal: "CUSTOMER",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Customer login failed: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.success || data.user.role !== "CUSTOMER") {
      throw new Error(`Unexpected customer login response: ${JSON.stringify(data)}`);
    }
  });

  // 5. Test Role Security: Customer cannot log in via Staff Portal
  await runTest("Security: Customer Blocked from Staff Portal (/staff/login)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testCustomerEmail,
        password: testCustomerPass,
        portal: "STAFF",
      }),
    });

    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for non-staff user, got HTTP ${res.status}`);
    }
  });

  // 6. Test Materials Catalog API
  await runTest("API: Materials & FDM Technologies (/api/materials)", async () => {
    const res = await fetch(`${BASE_URL}/api/materials`);
    if (!res.ok) throw new Error(`Materials fetch failed with HTTP ${res.status}`);
    const data = await res.json();
    if (!data.technologies || data.technologies.length === 0) {
      throw new Error("No technologies returned");
    }
    const fdm = data.technologies[0];
    if (!fdm.materials || fdm.materials.length === 0) {
      throw new Error("No FDM materials returned");
    }
  });

  // 7. Test 3D Model Review Request Submission (New Workflow)
  await runTest("API: Submit 3D Model Review Request (/api/orders)", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Khalid Ekbal",
        customerPhone: "01012345678",
        projectName: "Automated Robotic Joint V2",
        isEngineeringReview: true,
        customerNotes: "Urgent: Needs 100% infill around motor mounting holes.",
        subtotal: 0,
        shippingFee: 0,
        totalAmount: 0,
        items: [
          {
            fileName: "robotic_arm_bracket.stl",
            dimX: 65.4,
            dimY: 42.1,
            dimZ: 28.5,
            volumeCm3: 18.4,
            surfaceAreaCm2: 45.2,
            unitUsed: "mm",
            technologyId: "fdm_default",
            materialId: "mat_petg",
            infillPercent: 30,
            layerHeightMm: 0.2,
            quantity: 3,
            unitPrice: 0,
            totalPrice: 0,
          },
          {
            fileName: "sensor_mount_lid.stl",
            dimX: 30.0,
            dimY: 30.0,
            dimZ: 12.0,
            volumeCm3: 5.2,
            surfaceAreaCm2: 18.0,
            unitUsed: "mm",
            technologyId: "fdm_default",
            materialId: "mat_tpu",
            infillPercent: 40,
            layerHeightMm: 0.16,
            quantity: 1,
            unitPrice: 0,
            totalPrice: 0,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Order creation failed with HTTP ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (!data.success || !data.order) {
      throw new Error(`Invalid order response: ${JSON.stringify(data)}`);
    }

    createdOrderId = data.order.id;

    if (data.order.status !== "PENDING_REVIEW") {
      throw new Error(`Expected status PENDING_REVIEW, got ${data.order.status}`);
    }
    if (!data.order.customerNotes.includes("Automated Robotic Joint V2")) {
      throw new Error("Project name not found in customer notes");
    }
  });

  // 8. Test Staff Order Inspection & Retrieval
  await runTest("API: Staff Retrieve Orders List (/api/orders)", async () => {
    const res = await fetch(`${BASE_URL}/api/orders`);
    if (!res.ok) throw new Error(`Orders fetch failed with HTTP ${res.status}`);
    const data = await res.json();
    if (!data.orders || !Array.isArray(data.orders)) {
      throw new Error("Invalid orders array in response");
    }

    const found = data.orders.find((o: any) => o.id === createdOrderId);
    if (!found) {
      throw new Error(`Newly created order ${createdOrderId} was not found in orders list`);
    }
    if (found.items.length !== 2) {
      throw new Error(`Expected 2 items, found ${found.items.length}`);
    }
  });

  // 9. Test Order Status Update / Staff Review Confirmation
  await runTest("API: Staff Review & Quote Update (/api/orders/[id])", async () => {
    const res = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "QUOTED",
        subtotal: 185.5,
        shippingFee: 45.0,
        staffNotes: "Geometry verified. Approved for 0.12mm FDM printing. WhatsApp notified.",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Order update failed with HTTP ${res.status}: ${JSON.stringify(err)}`);
    }

    const data = await res.json();
    if (data.order.status !== "QUOTED") {
      throw new Error(`Expected updated status QUOTED, got ${data.order.status}`);
    }
  });

  // Print Summary Table
  console.log("\n==========================================================");
  console.log("📊 TEST EXECUTION SUMMARY");
  console.log("==========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`Total Tests Run: ${total}`);
  console.log(`Passed:         ${passed} ✅`);
  console.log(`Failed:         ${failed} ${failed === 0 ? "" : "❌"}`);
  console.log("==========================================================");

  if (failed > 0) {
    console.error("Some tests failed. See details above.");
    process.exit(1);
  } else {
    console.log("🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!");
  }
}

main()
  .catch((e) => {
    console.error("Fatal test runner error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
