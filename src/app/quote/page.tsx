"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import { analyzeMeshBuffer, analyzeMeshDirect, MeshAnalysisResult } from "@/lib/worker/mesh-analyzer";
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
  RefreshCw,
  Plus,
  Loader2,
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

// Default baseline FDM catalog so quoting and uploading NEVER fail even before network fetch
const DEFAULT_FDM_TECHNOLOGY: TechnologyItem = {
  id: "fdm_default",
  name: "FDM",
  description: "Fused Deposition Modeling — High-precision industrial thermoplastic filament extrusion.",
  leadTimeDays: 2,
  materials: [
    {
      id: "mat_pla",
      technologyId: "fdm_default",
      name: "PLA Tough Industrial",
      color: "Matte Black",
      colorHex: "#1e293b",
      density: 1.24,
      costPerCm3: 1.86,
      costPerGram: 1.5,
      costPerMinute: 0.8,
      minWallThickness: 0.8,
      maxDimX: 300,
      maxDimY: 300,
      maxDimZ: 400,
      setupFee: 20,
      infillMultiplier: 1.0,
      supportFactor: 1.1,
    },
    {
      id: "mat_petg",
      technologyId: "fdm_default",
      name: "PETG Engineering Grade",
      color: "Industrial Smoke",
      colorHex: "#009e8f",
      density: 1.27,
      costPerCm3: 2.47,
      costPerGram: 1.95,
      costPerMinute: 0.95,
      minWallThickness: 1.0,
      maxDimX: 300,
      maxDimY: 300,
      maxDimZ: 400,
      setupFee: 25,
      infillMultiplier: 1.0,
      supportFactor: 1.15,
    },
    {
      id: "mat_tpu",
      technologyId: "fdm_default",
      name: "TPU 95A Flexible",
      color: "Signal Orange",
      colorHex: "#f97316",
      density: 1.21,
      costPerCm3: 3.38,
      costPerGram: 2.8,
      costPerMinute: 1.3,
      minWallThickness: 1.2,
      maxDimX: 250,
      maxDimY: 250,
      maxDimZ: 300,
      setupFee: 35,
      infillMultiplier: 1.0,
      supportFactor: 1.3,
    },
  ],
};

export default function QuotePage() {
  const router = useRouter();
  const { t, isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with reliable default FDM technology to prevent empty catalog race conditions
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([DEFAULT_FDM_TECHNOLOGY]);
  const [finishingOptions, setFinishingOptions] = useState<FinishingOptionItem[]>([]);
  const [parts, setParts] = useState<ConfiguredPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");

  // Load materials from API and merge with default catalog
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/materials");
        const data = await res.json();
        if (data.technologies && data.technologies.length > 0) {
          setTechnologies(data.technologies);
        }
        if (data.finishingOptions) {
          setFinishingOptions(data.finishingOptions);
        }
      } catch (err) {
        console.warn("Using offline FDM catalog fallback:", err);
      }
    }
    loadCatalog();
  }, []);

  // Pre-populate with sample part only if parts list is completely empty
  useEffect(() => {
    if (technologies.length > 0 && parts.length === 0) {
      loadSamplePart("/models/drone_motor_bracket.stl", "Drone_Motor_Bracket.stl", "PETG");
    }
  }, [technologies]);

  const loadSamplePart = async (url: string, fileName: string, preferredMat = "PETG") => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Sample file not found");
      const buffer = await res.arrayBuffer();
      await processFileBuffer(buffer, fileName, preferredMat, true);
    } catch (err) {
      console.warn("Could not load sample model, ready for user upload:", err);
    }
  };

  const getFdmMaterials = (): MaterialItem[] => {
    return technologies[0]?.materials || DEFAULT_FDM_TECHNOLOGY.materials;
  };

  /**
   * Main File Processing Pipeline:
   * 1. Direct or Worker mesh analysis
   * 2. Calculation of Weight in Grams, Print Time in Minutes, and Price in EGP
   * 3. Background upload to /api/upload
   * 4. Immediate state insertion with auto-selection
   */
  const processFileBuffer = async (
    buffer: ArrayBuffer,
    fileName: string,
    preferredMat = "PLA",
    isSample = false
  ) => {
    setIsUploading(true);
    setUploadStatusText(`Analyzing ${fileName}...`);

    const partId = `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fdmTech = technologies[0] || DEFAULT_FDM_TECHNOLOGY;
    const availableMats = fdmTech.materials.length > 0 ? fdmTech.materials : DEFAULT_FDM_TECHNOLOGY.materials;

    // Pick best matching material
    let selectedMat =
      availableMats.find((m) => m.name.toLowerCase().includes(preferredMat.toLowerCase())) ||
      availableMats[0];

    // 1. Analyze Mesh (Instant In-Thread or Web Worker)
    let analysis: MeshAnalysisResult;
    try {
      analysis = await analyzeMeshBuffer(buffer, fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: selectedMat,
        unit: "mm",
      });
    } catch (err) {
      console.warn("Worker error, running direct analysis:", err);
      analysis = analyzeMeshDirect(buffer, fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: selectedMat,
        unit: "mm",
      });
    }

    // 2. Compute Accurate Pricing Breakdown in EGP
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

    const newPart: ConfiguredPart = {
      id: partId,
      fileName,
      fileBuffer: buffer,
      analysis,
      selectedTechId: fdmTech.id,
      selectedMaterialId: selectedMat.id,
      infillPercent: 20,
      layerHeightMm: 0.2,
      selectedFinishId: null,
      quantity: 1,
      unit: (analysis.detectedUnit as "mm" | "inch" | "cm") || "mm",
      quote,
      isAnalyzing: false,
    };

    // 3. Update Parts State (if user uploaded a real file and only the sample was present, replace it)
    setParts((prev) => {
      if (!isSample && prev.length === 1 && prev[0].fileName === "Drone_Motor_Bracket.stl") {
        return [newPart];
      }
      return [newPart, ...prev.filter((p) => p.id !== partId)];
    });

    setSelectedPartId(partId);
    setIsUploading(false);
    setUploadStatusText(`✅ ${fileName} ready (${quote.weightGrams}g • ${quote.printMinutes} mins)`);

    // 4. Background Upload to /api/upload to preserve file permanently
    if (!isSample) {
      try {
        const formData = new FormData();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        formData.append("file", blob, fileName);

        fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.fileUrl) {
              setParts((prev) =>
                prev.map((p) => (p.id === partId ? { ...p, fileUrl: res.fileUrl } : p))
              );
            }
          })
          .catch((e) => console.warn("Background file save note:", e));
      } catch (err) {
        console.warn("Background upload error:", err);
      }
    }
  };

  const updatePartConfig = async (
    id: string,
    updates: Partial<ConfiguredPart>
  ) => {
    setParts((prev) =>
      prev.map((part) => {
        if (part.id === id) {
          const updated = { ...part, ...updates };
          const mat =
            getFdmMaterials().find((m) => m.id === updated.selectedMaterialId) ||
            getFdmMaterials()[0];
          const finish = finishingOptions.find((f) => f.id === updated.selectedFinishId) || null;

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
        return part;
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

  /**
   * Universal file selection handler accepting all 3D CAD mesh formats
   */
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    for (const file of files) {
      const name = file.name;
      const ext = name.split(".").pop()?.toLowerCase();

      if (["stl", "3mf", "obj", "step", "stp"].includes(ext || "")) {
        try {
          const buffer = await file.arrayBuffer();
          await processFileBuffer(buffer, name);
        } catch (err) {
          console.error(`Failed to process ${name}:`, err);
          alert(`Could not parse ${name}. Please check file integrity.`);
        }
      } else {
        alert(`Unsupported file format for ${name}. Please upload .STL, .3MF, or .OBJ files.`);
      }
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(e.target.files);
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

  // Calculations in Egyptian Pounds (EGP)
  const totalSubtotal = parts.reduce((acc, p) => acc + p.quote.totalPrice, 0);
  const totalDiscount = parts.reduce((acc, p) => acc + p.quote.discountAmount, 0);
  const totalChargeableWeight = parts.reduce((acc, p) => acc + p.quote.chargeableWeightKg, 0);
  const estimatedShipping = parts.length > 0 ? estimateShippingFeeEGP(totalChargeableWeight) : 0;
  const finalTotal = totalSubtotal + estimatedShipping;

  const selectedPart = parts.find((p) => p.id === selectedPartId) || parts[0];
  const selectedMat = getFdmMaterials().find((m) => m.id === selectedPart?.selectedMaterialId);

  const handleProceedToCheckout = async (isReview = false) => {
    if (parts.length === 0) {
      alert("Please upload at least one 3D model before proceeding.");
      return;
    }
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
          fileUrl: p.fileUrl || `/models/${p.fileName}`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#fafefd] text-[#243a3c]">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4e3e1] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0e2628] font-sans">
              {t.quote.title}
            </h1>
            <span className="text-[11px] font-mono bg-[#d8faf5] text-[#007065] border border-[#a8ede4] px-2.5 py-0.5 rounded-full font-bold uppercase">
              EGP Currency
            </span>
          </div>
          <p className="text-sm text-[#53696b] mt-1">
            {t.quote.subtitle}
          </p>
        </div>

        {/* Quick Sample Models Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#81989a] font-medium">
            {isRtl ? "نماذج اختبارية سريعة:" : "Test Sample CAD:"}
          </span>
          <button
            onClick={() => loadSamplePart("/models/drone_motor_bracket.stl", "Drone_Motor_Bracket.stl", "PETG")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#d4e3e1] hover:border-[#009e8f] hover:text-[#009e8f] text-[#243a3c] transition-colors shadow-2xs cursor-pointer"
          >
            + Drone Bracket (PETG)
          </button>
          <button
            onClick={() => loadSamplePart("/models/calibration_cube_20mm.stl", "Calibration_Cube_20mm.stl", "PLA")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#d4e3e1] hover:border-[#009e8f] hover:text-[#009e8f] text-[#243a3c] transition-colors shadow-2xs cursor-pointer"
          >
            + 20mm Cube (PLA)
          </button>
          <button
            onClick={() => loadSamplePart("/models/sensor_enclosure_lid.stl", "Sensor_Lid.stl", "TPU")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#d4e3e1] hover:border-[#009e8f] hover:text-[#009e8f] text-[#243a3c] transition-colors shadow-2xs cursor-pointer"
          >
            + Flexible Lid (TPU)
          </button>
        </div>
      </div>

      {/* Main Drag-and-Drop Dropzone with Direct Input Overlay */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 transition-all text-center flex flex-col items-center justify-center gap-3 overflow-hidden ${
          isDragOver
            ? "border-[#00dbc6] bg-[#d8faf5]/40 scale-[1.005]"
            : "border-[#d4e3e1] hover:border-[#009e8f] bg-white hover:bg-[#fafefd] shadow-2xs"
        }`}
      >
        {/* Full container transparent input ensures 100% reliable clicks and native drag-drops */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".stl,.3mf,.obj,.step,.stp,model/stl,application/sla,application/octet-stream"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Click to browse 3D CAD files or drop files here"
        />

        <div className="w-16 h-16 rounded-2xl bg-[#d8faf5] border border-[#a8ede4] flex items-center justify-center text-[#007065] shadow-xs">
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-[#009e8f]" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-base sm:text-lg font-bold text-[#0e2628]">
            {isRtl ? (
              <>
                اسحب وأفلت ملفات 3D CAD هنا، أو{" "}
                <span className="text-[#009e8f] underline underline-offset-4">تصفح ملفاتك</span>
              </>
            ) : (
              <>
                Drag & Drop your 3D CAD files here, or{" "}
                <span className="text-[#009e8f] underline underline-offset-4">Browse Files</span>
              </>
            )}
          </p>
          <p className="text-xs text-[#53696b] mt-1 font-mono">
            Supports .STL (Binary & ASCII), .3MF, and .OBJ • Industrial FDM (PLA, PETG, TPU)
          </p>
        </div>

        {uploadStatusText && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eef7f6] text-[#007065] text-xs font-mono font-medium border border-[#a8ede4]">
            {uploadStatusText}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#53696b] font-mono mt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#009e8f]" /> Gram & Minute Slicing Formula
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#009e8f]" /> Signed Tetrahedron Vol.
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#009e8f]" /> Instant EGP Calculation
          </span>
        </div>
      </div>

      {/* Parts Table & 3D Viewer Layout */}
      {parts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Configured Parts (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#0e2628] flex items-center gap-2">
                <Box className="w-4 h-4 text-[#009e8f]" />
                {isRtl ? `الأجزاء المجهزة (${parts.length})` : `Configured FDM Parts (${parts.length})`}
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#009e8f] hover:text-[#007065] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d8faf5] hover:bg-[#c9f6f0] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? "إضافة ملف آخر" : "Add More CAD Files"}</span>
              </button>
            </div>

            {/* Part Cards */}
            <div className="space-y-4">
              {parts.map((part) => {
                const isSelected = part.id === selectedPartId;
                const mat = getFdmMaterials().find((m) => m.id === part.selectedMaterialId) || getFdmMaterials()[0];

                return (
                  <div
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? "border-[#009e8f] ring-2 ring-[#00dbc6]/30 shadow-md"
                        : "border-[#d4e3e1] hover:border-[#b8ccc9] shadow-2xs"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-[#d4e3e1] shrink-0"
                          style={{ backgroundColor: mat?.colorHex || "#1e293b" }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#0e2628] truncate max-w-[200px] sm:max-w-[260px]">
                              {part.fileName}
                            </span>
                            <span className="text-[10px] font-mono uppercase bg-[#d8faf5] text-[#007065] px-2 py-0.5 rounded-md font-bold border border-[#a8ede4]">
                              FDM
                            </span>
                          </div>
                          <div className="text-xs text-[#53696b] font-mono mt-0.5">
                            {part.analysis.dimX} × {part.analysis.dimY} × {part.analysis.dimZ} {part.unit} •{" "}
                            <strong className="text-[#0e2628]">{part.quote.weightGrams}g</strong> •{" "}
                            <strong className="text-[#0e2628]">{part.quote.printMinutes} mins</strong>
                          </div>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base font-mono font-bold text-[#0e2628]">
                            {part.quote.totalPrice.toFixed(2)} EGP
                          </div>
                          <div className="text-[11px] text-[#81989a] font-mono">
                            {part.quote.unitPrice.toFixed(2)} EGP/ea
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePart(part.id);
                          }}
                          className="p-1.5 text-[#81989a] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove part"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* DFM Warnings Banner */}
                    {part.analysis.dfmWarnings && part.analysis.dfmWarnings.length > 0 && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-amber-900">
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
                    <div className="mt-4 pt-3 border-t border-[#f2faf9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      {/* Material (PLA, PETG, TPU) */}
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-mono text-[#81989a] mb-1 font-bold">
                          FDM Material
                        </label>
                        <select
                          value={part.selectedMaterialId}
                          onChange={(e) =>
                            updatePartConfig(part.id, { selectedMaterialId: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#d4e3e1] bg-[#fafefd] text-xs font-semibold text-[#0e2628] focus:border-[#009e8f] focus:outline-hidden"
                        >
                          {getFdmMaterials().map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({m.costPerGram.toFixed(2)} EGP/g)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Infill Density */}
                      <div>
                        <label className="block text-[10px] font-mono text-[#81989a] mb-1 font-bold">
                          Infill Density
                        </label>
                        <select
                          value={part.infillPercent}
                          onChange={(e) =>
                            updatePartConfig(part.id, { infillPercent: Number(e.target.value) })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#d4e3e1] bg-[#fafefd] text-xs font-semibold text-[#0e2628] focus:border-[#009e8f] focus:outline-hidden"
                        >
                          <option value={15}>15% (Visual Mockup)</option>
                          <option value={20}>20% (Standard FDM)</option>
                          <option value={40}>40% (Semi-Structural)</option>
                          <option value={60}>60% (Heavy Duty)</option>
                          <option value={100}>100% (Solid Mechanical)</option>
                        </select>
                      </div>

                      {/* Layer Height */}
                      <div>
                        <label className="block text-[10px] font-mono text-[#81989a] mb-1 font-bold">
                          Layer Height
                        </label>
                        <select
                          value={part.layerHeightMm}
                          onChange={(e) =>
                            updatePartConfig(part.id, { layerHeightMm: Number(e.target.value) })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#d4e3e1] bg-[#fafefd] text-xs font-semibold text-[#0e2628] focus:border-[#009e8f] focus:outline-hidden"
                        >
                          <option value={0.12}>0.12mm (Ultra Fine)</option>
                          <option value={0.16}>0.16mm (Fine Detail)</option>
                          <option value={0.20}>0.20mm (Standard)</option>
                          <option value={0.28}>0.28mm (Rapid Draft)</option>
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-[10px] font-mono text-[#81989a] mb-1 font-bold">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={part.quantity}
                          onChange={(e) =>
                            updatePartConfig(part.id, {
                              quantity: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-[#d4e3e1] bg-[#fafefd] text-xs font-semibold text-[#0e2628] focus:border-[#009e8f] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Unit Switcher */}
                    <div className="mt-3 flex items-center justify-between text-xs text-[#53696b] pt-2 border-t border-[#f4faf9]">
                      <span className="text-[11px] font-mono">
                        Volume: {part.analysis.volumeCm3.toFixed(2)} cm³
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-[#81989a]">CAD Unit:</span>
                        {(["mm", "inch", "cm"] as const).map((u) => (
                          <button
                            key={u}
                            onClick={() => handleUnitChange(part, u)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                              part.unit === u
                                ? "bg-[#00dbc6] text-[#0e2628]"
                                : "bg-[#f2faf9] text-[#53696b] hover:text-[#0e2628]"
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Three.js Interactive Viewer & Live Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive 3D Canvas */}
            <div className="rounded-3xl border border-[#d4e3e1] bg-white overflow-hidden shadow-xs">
              <div className="p-3.5 border-b border-[#f2faf9] flex items-center justify-between bg-[#fafefd]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00dbc6] animate-pulse" />
                  <span className="text-xs font-bold text-[#0e2628] truncate max-w-[200px]">
                    {selectedPart?.fileName || "3D Viewer"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#81989a]">
                  Orbit: Drag • Zoom: Wheel
                </span>
              </div>

              <div className="h-[360px] w-full bg-[#f4faf9] relative">
                {selectedPart?.fileBuffer ? (
                  <ThreeViewer
                    modelBuffer={selectedPart.fileBuffer}
                    fileName={selectedPart.fileName}
                    materialColor={selectedMat?.colorHex || "#009e8f"}
                    technologyName="FDM"
                    dimX={selectedPart.analysis.dimX}
                    dimY={selectedPart.analysis.dimY}
                    dimZ={selectedPart.analysis.dimZ}
                    unit={selectedPart.unit}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#81989a]">
                    Select a part to view in 3D
                  </div>
                )}
              </div>
            </div>

            {/* EGP Live Order Summary Card */}
            <div className="rounded-3xl border border-[#d4e3e1] bg-white p-6 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-[#0e2628]">
                {isRtl ? "ملخص عرض السعر الفوري (EGP)" : "Instant Quote Summary (EGP)"}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#53696b]">
                  <span>{isRtl ? "الأجزاء المجهزة:" : "Configured Parts:"}</span>
                  <span className="font-mono font-bold text-[#0e2628]">{parts.length} files</span>
                </div>
                <div className="flex justify-between text-[#53696b]">
                  <span>{isRtl ? "إجمالي وزن الخامات:" : "Total Polymer Weight:"}</span>
                  <span className="font-mono font-bold text-[#0e2628]">
                    {parts.reduce((sum, p) => sum + p.quote.weightGrams * p.quantity, 0).toFixed(1)} Grams
                  </span>
                </div>
                <div className="flex justify-between text-[#53696b]">
                  <span>{isRtl ? "زمن تشغيل الماكينة التقديري:" : "Estimated Machine Run Time:"}</span>
                  <span className="font-mono font-bold text-[#0e2628]">
                    {parts.reduce((sum, p) => sum + p.quote.printMinutes * p.quantity, 0)} Mins
                  </span>
                </div>
                <div className="flex justify-between text-[#53696b]">
                  <span>{isRtl ? "المجموع الفرعي للأجزاء:" : "Fabrication Subtotal:"}</span>
                  <span className="font-mono font-bold text-[#0e2628]">{totalSubtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-[#53696b]">
                  <span>{isRtl ? "شحن لجميع المحافظات:" : "Egyptian Courier Shipping:"}</span>
                  <span className="font-mono font-bold text-[#0e2628]">{estimatedShipping.toFixed(2)} EGP</span>
                </div>

                <div className="pt-3 border-t border-[#f2faf9] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#0e2628]">{isRtl ? "الإجمالي بالجنيه:" : "Total (EGP):"}</span>
                  <span className="text-2xl font-black text-[#009e8f] font-mono">
                    {finalTotal.toFixed(2)} EGP
                  </span>
                </div>
              </div>

              {/* Special Instructions / Notes */}
              <div>
                <label className="block text-[10px] font-mono text-[#81989a] mb-1 font-bold">
                  {isRtl ? "ملاحظات إضافية للمهندسين:" : "Engineering Notes / Instructions:"}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Needs M3 threaded heat-set inserts, smooth critical mating surfaces, etc."
                  className="w-full px-3 py-2 rounded-xl border border-[#d4e3e1] text-xs text-[#0e2628] placeholder-[#81989a] focus:border-[#009e8f] focus:outline-hidden"
                />
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleProceedToCheckout(false)}
                  disabled={isSubmitting || parts.length === 0}
                  className="w-full py-3.5 px-4 rounded-full text-xs font-bold text-[#0e2628] bg-[#00dbc6] hover:bg-[#00c5b2] shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? "Processing..." : isRtl ? "تأكيد الطلب الفوري" : "Place Instant Order"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleProceedToCheckout(true)}
                  disabled={isSubmitting || parts.length === 0}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-semibold text-[#009e8f] bg-white border border-[#a8ede4] hover:bg-[#d8faf5] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isRtl ? "طلب مراجعة هندسية مجانية" : "Request Free Engineering DFM Review"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
