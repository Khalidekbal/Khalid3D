"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import { analyzeMeshBuffer, MeshAnalysisResult } from "@/lib/worker/mesh-analyzer";
import {
  calculatePartQuote,
  estimateShippingFeeEGP,
  QuoteBreakdown,
} from "@/lib/pricing/quote-engine";
import confetti from "canvas-confetti";
import {
  UploadCloud,
  Layers,
  Box,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  DollarSign,
  Truck,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileUp,
  Scale,
  Timer,
} from "lucide-react";

interface MaterialItem {
  id: string;
  technologyId: string;
  name: string;
  color: string;
  colorHex: string;
  density: number;
  costPerCm3: number;
  costPerGram: number;     // EGP
  costPerMinute: number;   // EGP
  minWallThickness: number;
  maxDimX: number;
  maxDimY: number;
  maxDimZ: number;
  setupFee: number;        // EGP
  infillMultiplier: number;
  supportFactor: number;
  technology?: { name: string; description: string };
}

interface TechnologyItem {
  id: string;
  name: string;
  description: string;
  leadTimeDays: number;
  materials: MaterialItem[];
}

interface FinishingOptionItem {
  id: string;
  name: string;
  description: string;
  costType: string;
  costValue: number;
}

export interface ConfiguredPart {
  id: string;
  fileName: string;
  fileBuffer: ArrayBuffer | null;
  fileUrl?: string;
  analysis: MeshAnalysisResult;
  selectedTechId: string;
  selectedMaterialId: string;
  infillPercent: number;
  layerHeightMm: number;
  selectedFinishId: string | null;
  quantity: number;
  unit: "mm" | "inch" | "cm";
  quote: QuoteBreakdown;
  isAnalyzing?: boolean;
}

export default function QuotePage() {
  const router = useRouter();
  const { t, isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [finishingOptions, setFinishingOptions] = useState<FinishingOptionItem[]>([]);
  const [parts, setParts] = useState<ConfiguredPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");

  // Load materials from API
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/materials");
        const data = await res.json();
        if (data.technologies) {
          setTechnologies(data.technologies);
        }
        if (data.finishingOptions) {
          setFinishingOptions(data.finishingOptions);
        }
      } catch (err) {
        console.error("Failed to fetch catalog:", err);
      }
    }
    loadCatalog();
  }, []);

  // Pre-populate with sample part when catalog loads if empty
  useEffect(() => {
    if (technologies.length > 0 && parts.length === 0) {
      loadSamplePart("/models/drone_motor_bracket.stl", "Drone_Motor_Bracket.stl", "PETG");
    }
  }, [technologies]);

  const loadSamplePart = async (url: string, fileName: string, preferredMat = "PETG") => {
    try {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      await processFileBuffer(buffer, fileName, preferredMat);
    } catch (err) {
      console.error("Failed to load sample:", err);
    }
  };

  const getFdmMaterials = (): MaterialItem[] => {
    return technologies[0]?.materials || [];
  };

  const processFileBuffer = async (
    buffer: ArrayBuffer,
    fileName: string,
    preferredMat = "PLA"
  ) => {
    const partId = `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fdmTech = technologies[0];
    const availableMats = fdmTech?.materials || [];

    // Find preferred material (PLA, PETG, TPU)
    let selectedMat = availableMats.find((m) =>
      m.name.toLowerCase().includes(preferredMat.toLowerCase())
    ) || availableMats[0];

    if (!selectedMat) return;

    // Temporary placeholder while worker analyzes
    const tempPart: ConfiguredPart = {
      id: partId,
      fileName,
      fileBuffer: buffer,
      analysis: {
        triangleCount: 0,
        vertexCount: 0,
        dimX: 20,
        dimY: 20,
        dimZ: 20,
        volumeCm3: 8,
        surfaceAreaCm2: 24,
        centerOfMass: { x: 0, y: 0, z: 0 },
        isWatertight: true,
        openEdgesCount: 0,
        overhangRatio: 0.2,
        detectedUnit: "mm",
        unitUsed: "mm",
        dfmWarnings: [],
      },
      selectedTechId: fdmTech.id,
      selectedMaterialId: selectedMat.id,
      infillPercent: 20,
      layerHeightMm: 0.2,
      selectedFinishId: null,
      quantity: 1,
      unit: "mm",
      quote: {
        unitPrice: 50.0,
        totalPrice: 50.0,
        setupFee: 20.0,
        materialCost: 15.0,
        printTimeCost: 15.0,
        supportCost: 0.0,
        finishingCost: 0.0,
        discountPercent: 0,
        discountAmount: 0,
        weightGrams: 12.0,
        printMinutes: 30,
        estimatedHours: 0.5,
        volumetricWeightKg: 0.002,
        chargeableWeightKg: 0.012,
        estimatedLeadDays: 2,
      },
      isAnalyzing: true,
    };

    setParts((prev) => [...prev, tempPart]);
    if (!selectedPartId) setSelectedPartId(partId);

    try {
      const analysis = await analyzeMeshBuffer(buffer, fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: selectedMat,
        unit: "mm",
      });

      const quote = calculatePartQuote({
        volumeCm3: analysis.volumeCm3,
        surfaceAreaCm2: analysis.surfaceAreaCm2,
        dimX: analysis.dimX,
        dimY: analysis.dimY,
        dimZ: analysis.dimZ,
        overhangRatio: analysis.overhangRatio,
        quantity: 1,
        material: selectedMat,
        infillPercent: 20,
        layerHeightMm: 0.2,
        finishingOption: null,
      });

      setParts((prev) =>
        prev.map((p) =>
          p.id === partId
            ? {
                ...p,
                analysis,
                quote,
                unit: (analysis.detectedUnit as "mm" | "inch" | "cm") || "mm",
                isAnalyzing: false,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Analysis failed:", err);
      setParts((prev) =>
        prev.map((p) => (p.id === partId ? { ...p, isAnalyzing: false } : p))
      );
    }
  };

  const updatePartConfig = async (
    id: string,
    updates: Partial<ConfiguredPart>
  ) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };

        const availableMats = getFdmMaterials();
        const mat = availableMats.find((m) => m.id === updated.selectedMaterialId) || availableMats[0];
        const finish = finishingOptions.find((f) => f.id === updated.selectedFinishId) || null;

        if (mat) {
          const newQuote = calculatePartQuote({
            volumeCm3: updated.analysis.volumeCm3,
            surfaceAreaCm2: updated.analysis.surfaceAreaCm2,
            dimX: updated.analysis.dimX,
            dimY: updated.analysis.dimY,
            dimZ: updated.analysis.dimZ,
            overhangRatio: updated.analysis.overhangRatio,
            quantity: updated.quantity,
            material: mat,
            infillPercent: updated.infillPercent,
            layerHeightMm: updated.layerHeightMm,
            finishingOption: finish,
          });
          return { ...updated, quote: newQuote };
        }
        return updated;
      })
    );
  };

  const handleUnitChange = async (part: ConfiguredPart, newUnit: "mm" | "inch" | "cm") => {
    if (!part.fileBuffer) return;
    try {
      const mat = getFdmMaterials().find((m) => m.id === part.selectedMaterialId);
      const reanalyzed = await analyzeMeshBuffer(part.fileBuffer, part.fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: mat,
        unit: newUnit,
      });

      updatePartConfig(part.id, {
        unit: newUnit,
        analysis: reanalyzed,
      });
    } catch (err) {
      console.error("Unit update failed:", err);
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".stl") || file.name.toLowerCase().endsWith(".3mf")) {
        const buffer = await file.arrayBuffer();
        await processFileBuffer(buffer, file.name);
      }
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".stl") || file.name.toLowerCase().endsWith(".3mf")) {
        const buffer = await file.arrayBuffer();
        await processFileBuffer(buffer, file.name);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePart = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPartId === id) {
      const remaining = parts.filter((p) => p.id !== id);
      setSelectedPartId(remaining[0]?.id || null);
    }
  };

  // Calculations in EGP
  const totalSubtotal = parts.reduce((acc, p) => acc + p.quote.totalPrice, 0);
  const totalDiscount = parts.reduce((acc, p) => acc + p.quote.discountAmount, 0);
  const totalChargeableWeight = parts.reduce((acc, p) => acc + p.quote.chargeableWeightKg, 0);
  const estimatedShipping = parts.length > 0 ? estimateShippingFeeEGP(totalChargeableWeight) : 0;
  const finalTotal = totalSubtotal + estimatedShipping;
  const maxLeadDays = Math.max(...parts.map((p) => p.quote.estimatedLeadDays), 2);

  const selectedPart = parts.find((p) => p.id === selectedPartId) || parts[0];
  const selectedMat = getFdmMaterials().find((m) => m.id === selectedPart?.selectedMaterialId);

  const handleProceedToCheckout = async (isReview = false) => {
    if (parts.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        customerEmail: "customer@khalid3d.com",
        customerName: "Ahmed Hassan",
        isEngineeringReview: isReview,
        subtotal: totalSubtotal,
        shippingFee: estimatedShipping,
        tax: 0.0,
        discount: totalDiscount,
        totalAmount: finalTotal,
        customerNotes,
        items: parts.map((p) => ({
          fileName: p.fileName,
          dimX: p.analysis.dimX,
          dimY: p.analysis.dimY,
          dimZ: p.analysis.dimZ,
          volumeCm3: p.analysis.volumeCm3,
          surfaceAreaCm2: p.analysis.surfaceAreaCm2,
          weightGrams: p.quote.weightGrams,
          printMinutes: p.quote.printMinutes,
          unitUsed: p.unit,
          technologyId: p.selectedTechId,
          materialId: p.selectedMaterialId,
          infillPercent: p.infillPercent,
          layerHeightMm: p.layerHeightMm,
          finishingOptionId: p.selectedFinishId,
          quantity: p.quantity,
          unitPrice: p.quote.unitPrice,
          totalPrice: p.quote.totalPrice,
          dfmWarnings: p.analysis.dfmWarnings,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push(`/orders/${data.order.id}?success=true`);
      } else {
        alert("Failed to create order: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting order. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              {t.quote.title}
            </h1>
            <span className="text-[11px] font-mono bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold uppercase">
              EGP Currency
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {t.quote.subtitle}
          </p>
        </div>

        {/* Quick Sample Models Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 font-medium">Quick Test CAD:</span>
          <button
            onClick={() => loadSamplePart("/models/drone_motor_bracket.stl", "Drone_Motor_Bracket.stl", "PETG")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-700 transition-colors shadow-2xs"
          >
            + Drone Bracket (PETG)
          </button>
          <button
            onClick={() => loadSamplePart("/models/calibration_cube_20mm.stl", "Calibration_Cube_20mm.stl", "PLA")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-700 transition-colors shadow-2xs"
          >
            + 20mm Cube (PLA)
          </button>
          <button
            onClick={() => loadSamplePart("/models/sensor_enclosure_lid.stl", "Sensor_Lid.stl", "TPU")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-700 transition-colors shadow-2xs"
          >
            + Flexible Lid (TPU)
          </button>
        </div>
      </div>

      {/* Main Drag-and-Drop Dropzone (White Clean Theme) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? "border-red-500 bg-red-50/50 scale-[1.005]"
            : "border-slate-300 hover:border-red-400 bg-white hover:bg-slate-50/70 shadow-xs"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".stl,.3mf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <p className="text-base font-bold text-slate-900">
            Drag & Drop your 3D CAD files here, or <span className="text-red-600 underline">Browse Files</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Supports .STL (Binary & ASCII) and .3MF • Exclusively FDM (PLA, PETG, TPU)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 font-mono mt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Gram & Minute Slicing Formula
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Signed Tetrahedron Vol.
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant EGP Calculation
          </span>
        </div>
      </div>

      {/* Parts Table & 3D Viewer Layout */}
      {parts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configured Parts (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-red-600" />
                Configured FDM Parts ({parts.length})
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <FileUp className="w-3.5 h-3.5" />
                Add More CAD Files
              </button>
            </div>

            {/* Part Cards */}
            <div className="space-y-4">
              {parts.map((part) => {
                const isSelected = part.id === selectedPartId;
                const mat = getFdmMaterials().find((m) => m.id === part.selectedMaterialId);

                return (
                  <div
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? "border-red-600 ring-2 ring-red-500/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: mat?.colorHex || "#2563eb" }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 truncate max-w-[200px] sm:max-w-[260px]">
                              {part.fileName}
                            </span>
                            <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
                              FDM
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {part.analysis.dimX} × {part.analysis.dimY} × {part.analysis.dimZ} {part.unit} •{" "}
                            <strong className="text-slate-800">{part.quote.weightGrams}g</strong> •{" "}
                            <strong className="text-slate-800">{part.quote.printMinutes} mins</strong>
                          </div>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base font-mono font-bold text-red-600">
                            {part.quote.totalPrice.toFixed(2)} EGP
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {part.quote.unitPrice.toFixed(2)} EGP/ea
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePart(part.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Remove part"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* DFM Warnings Banner */}
                    {part.analysis.dfmWarnings && part.analysis.dfmWarnings.length > 0 && (
                      <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          {part.analysis.dfmWarnings.map((w, idx) => (
                            <p key={idx} className="text-[11px] font-medium leading-tight">
                              {w.message}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Configuration Selectors */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {/* Material (PLA, PETG, TPU) */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-mono text-slate-500 mb-1 font-bold">
                          FDM Material
                        </label>
                        <select
                          value={part.selectedMaterialId}
                          onChange={(e) => updatePartConfig(part.id, { selectedMaterialId: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:border-red-500 outline-none"
                        >
                          {getFdmMaterials().map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Infill */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 mb-1 font-bold">
                          Infill Density
                        </label>
                        <select
                          value={part.infillPercent}
                          onChange={(e) => updatePartConfig(part.id, { infillPercent: parseInt(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:border-red-500 outline-none"
                        >
                          <option value={20}>20% (Standard)</option>
                          <option value={40}>40% (Structural)</option>
                          <option value={80}>80% (Heavy Duty)</option>
                          <option value={100}>100% (Solid)</option>
                        </select>
                      </div>

                      {/* Layer Height */}
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 mb-1 font-bold">
                          Layer Height
                        </label>
                        <select
                          value={part.layerHeightMm}
                          onChange={(e) => updatePartConfig(part.id, { layerHeightMm: parseFloat(e.target.value) })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold focus:border-red-500 outline-none"
                        >
                          <option value={0.12}>0.12mm (Ultra Fine)</option>
                          <option value={0.20}>0.20mm (Standard)</option>
                          <option value={0.28}>0.28mm (Draft Speed)</option>
                        </select>
                      </div>

                      {/* Quantity & Unit Toggle */}
                      <div className="flex items-end gap-1.5">
                        <div className="flex-1">
                          <label className="block text-[10px] font-mono text-slate-500 mb-1 font-bold">Qty</label>
                          <input
                            type="number"
                            min={1}
                            max={1000}
                            value={part.quantity}
                            onChange={(e) =>
                              updatePartConfig(part.id, {
                                quantity: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-mono text-center font-bold focus:border-red-500 outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnitChange(part, part.unit === "mm" ? "inch" : "mm")}
                          className="px-2.5 py-1.5 bg-slate-100 border border-slate-300 hover:border-red-500 text-[11px] font-mono text-slate-700 rounded-lg font-bold"
                          title="Toggle mm / inch unit"
                        >
                          {part.unit}
                        </button>
                      </div>
                    </div>

                    {/* Breakdown details per part */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600">
                      <div className="flex items-center gap-3">
                        <span>
                          Weight: <strong>{part.quote.weightGrams}g</strong> ({part.quote.materialCost} EGP)
                        </span>
                        <span>•</span>
                        <span>
                          Time: <strong>{part.quote.printMinutes} mins</strong> ({part.quote.printTimeCost} EGP)
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Setup: {part.quote.setupFee} EGP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 3D Viewport & Quotation Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 3D WebGL Part Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-red-600 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> 3D CAD INSPECTOR
                </span>
                <span>Orbit • Zoom • Pan</span>
              </div>

              {selectedPart && (
                <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                  <ThreeViewer
                    modelBuffer={selectedPart.fileBuffer}
                    fileName={selectedPart.fileName}
                    materialColor={selectedMat?.colorHex || "#2563eb"}
                    technologyName="FDM"
                    dimX={selectedPart.analysis.dimX}
                    dimY={selectedPart.analysis.dimY}
                    dimZ={selectedPart.analysis.dimZ}
                    unit={selectedPart.unit}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Quotation Summary Card */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-red-600" />
                  Quotation Breakdown (EGP)
                </h3>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-red-600" /> ~{maxLeadDays} Days Lead Time
                </span>
              </div>

              {/* Breakdown lines */}
              <div className="space-y-2 text-xs font-mono text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Parts Subtotal ({parts.length} items):</span>
                  <span className="font-bold">{totalSubtotal.toFixed(2)} EGP</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Bulk Tier Discount:</span>
                    <span>-{totalDiscount.toFixed(2)} EGP</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-red-600" />
                    Express Egypt Delivery ({totalChargeableWeight.toFixed(2)} kg):
                  </span>
                  <span className="font-bold">{estimatedShipping.toFixed(2)} EGP</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900 font-bold">
                  <span className="text-sm">Total Estimate:</span>
                  <span className="text-2xl text-red-600 font-mono font-black">
                    {finalTotal.toFixed(2)} EGP
                  </span>
                </div>
              </div>

              {/* Engineering / Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Notes & Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Critical hole diameter, tapped brass insert requirement, color preference..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  disabled={isSubmitting || parts.length === 0}
                  onClick={() => handleProceedToCheckout(false)}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Order...</span>
                  ) : (
                    <>
                      <span>Submit Order & Proceed</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  disabled={isSubmitting || parts.length === 0}
                  onClick={() => handleProceedToCheckout(true)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>Request Engineering Review (Complex Geometry)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center font-mono">
                ✓ Khalid3D Quality Guarantee • Direct Delivery Across Egypt
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
