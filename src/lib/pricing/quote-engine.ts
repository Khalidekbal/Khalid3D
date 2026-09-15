export interface PricingParameters {
  volumeCm3: number;
  surfaceAreaCm2: number;
  dimX: number;
  dimY: number;
  dimZ: number;
  overhangRatio?: number;
  quantity: number;
  material: {
    name: string;
    density: number;
    costPerGram: number;     // EGP per gram
    costPerMinute: number;   // EGP per print minute
    setupFee: number;        // EGP base setup fee
    infillMultiplier?: number;
    supportFactor?: number;
  };
  infillPercent: number;     // e.g. 20, 50, 100
  layerHeightMm: number;     // e.g. 0.20, 0.15, 0.28
  finishingOption?: {
    costType: "FLAT" | "PER_CM2" | "PER_GRAM" | string;
    costValue: number;       // EGP
  } | null;
}

export interface QuoteBreakdown {
  unitPrice: number;         // EGP
  totalPrice: number;        // EGP
  setupFee: number;          // EGP
  materialCost: number;      // EGP (Grams * Cost/Gram)
  printTimeCost: number;     // EGP (Minutes * Cost/Minute)
  supportCost: number;       // EGP
  finishingCost: number;     // EGP
  discountPercent: number;
  discountAmount: number;    // EGP
  weightGrams: number;       // Exact computed grams
  printMinutes: number;      // Exact computed minutes
  estimatedHours: number;    // Hours for display
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  estimatedLeadDays: number;
}

// Material speed multiplier (TPU prints slower than PLA/PETG)
const MATERIAL_SPEED_FACTORS: Record<string, number> = {
  "PLA Tough Industrial": 1.0,
  "PETG Engineering Grade": 1.15,
  "TPU 95A Flexible": 1.75, // Flexible filaments require slower extrusion speed
};

export function calculatePartQuote(params: PricingParameters): QuoteBreakdown {
  const {
    volumeCm3,
    surfaceAreaCm2,
    dimX,
    dimY,
    dimZ,
    overhangRatio = 0.2,
    quantity = 1,
    material,
    infillPercent = 20,
    layerHeightMm = 0.2,
    finishingOption,
  } = params;

  // 1. Part Weight in Grams
  // Infill affects core volume (shell ~25%, internal core ~75%)
  const infillRatio = Math.max(0.1, Math.min(1.0, infillPercent / 100));
  const effectiveInfill = 0.25 + 0.75 * infillRatio;
  const rawGrams = volumeCm3 * material.density * effectiveInfill * (material.infillMultiplier || 1.0);
  const weightGrams = Number(Math.max(1.0, rawGrams).toFixed(1));

  // 2. Print Time in Minutes
  // Layers count: height / layerHeight
  const layerCount = Math.max(10, dimZ / Math.max(0.05, layerHeightMm));
  const speedFactor = MATERIAL_SPEED_FACTORS[material.name] || 1.1;

  // Estimated slicing travel time:
  // Base 12 mins warmup/calibration + layers deposit + perimeter sweeps
  const rawMinutes =
    12 +
    (layerCount * 0.45 + surfaceAreaCm2 * 0.035 + volumeCm3 * 0.02) * speedFactor;
  const printMinutes = Math.max(15, Math.round(rawMinutes));
  const estimatedHours = Number((printMinutes / 60.0).toFixed(1));

  // 3. Material Cost in EGP: Grams * EGP per Gram
  const materialCost = Number((weightGrams * material.costPerGram).toFixed(2));

  // 4. Print Time Cost in EGP: Minutes * EGP per Minute
  const printTimeCost = Number((printMinutes * material.costPerMinute).toFixed(2));

  // 5. Support Material Estimate in EGP
  let supportCost = 0;
  if (overhangRatio > 0.15) {
    const supportGrams = weightGrams * Math.min(0.5, overhangRatio) * (material.supportFactor ?? 0.35);
    supportCost = Number((supportGrams * material.costPerGram * 0.8).toFixed(2));
  }

  // 6. Finishing Cost in EGP
  let finishingCost = 0;
  if (finishingOption) {
    if (finishingOption.costType === "PER_CM2") {
      finishingCost = Number((surfaceAreaCm2 * finishingOption.costValue).toFixed(2));
    } else if (finishingOption.costType === "PER_GRAM") {
      finishingCost = Number((weightGrams * finishingOption.costValue).toFixed(2));
    } else {
      finishingCost = Number(finishingOption.costValue.toFixed(2));
    }
  }

  // 7. Base Setup Fee amortized across quantity
  const setupFeePerUnit = Number((material.setupFee / Math.max(1, quantity)).toFixed(2));

  // 8. Base Unit Price
  const baseUnitPrice = setupFeePerUnit + materialCost + printTimeCost + supportCost + finishingCost;

  // 9. Volume Discount Tiers
  let discountPercent = 0;
  if (quantity >= 50) {
    discountPercent = 20;
  } else if (quantity >= 20) {
    discountPercent = 12;
  } else if (quantity >= 5) {
    discountPercent = 5;
  }

  const discountMultiplier = 1.0 - discountPercent / 100.0;
  const unitPrice = Number(Math.max(15.0, baseUnitPrice * discountMultiplier).toFixed(2));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));
  const undiscountedTotal = baseUnitPrice * quantity;
  const discountAmount = Number(Math.max(0, undiscountedTotal - totalPrice).toFixed(2));

  // 10. Volumetric Weight Calculation (cm / 5000)
  const dimX_cm = dimX / 10.0;
  const dimY_cm = dimY / 10.0;
  const dimZ_cm = dimZ / 10.0;
  const volumetricWeightKg = Number(((dimX_cm * dimY_cm * dimZ_cm) / 5000.0).toFixed(3));
  const actualWeightKg = Number(((weightGrams * quantity) / 1000.0).toFixed(3));
  const chargeableWeightKg = Number(Math.max(actualWeightKg, volumetricWeightKg * quantity).toFixed(3));

  // 11. Lead Time (FDM standard 2 days)
  let leadDays = 2;
  if (quantity > 10) leadDays += 1;
  if (quantity > 50) leadDays += 2;

  return {
    unitPrice,
    totalPrice,
    setupFee: setupFeePerUnit,
    materialCost,
    printTimeCost,
    supportCost,
    finishingCost,
    discountPercent,
    discountAmount,
    weightGrams,
    printMinutes,
    estimatedHours,
    volumetricWeightKg,
    chargeableWeightKg,
    estimatedLeadDays: leadDays,
  };
}

export function estimateShippingFeeEGP(chargeableWeightKg: number): number {
  // Base express shipping in Egypt: 55 EGP up to 1kg, + 15 EGP per extra kg
  const fee = 55.0 + Math.max(0, Math.ceil(chargeableWeightKg - 1.0)) * 15.0;
  return Number(fee.toFixed(2));
}
