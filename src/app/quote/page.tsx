"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import { analyzeMeshBuffer, analyzeMeshDirect, MeshAnalysisResult } from "@/lib/worker/mesh-analyzer";
import confetti from "canvas-confetti";
import {
  UploadCloud,
  Box,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  Plus,
  Loader2,
  Phone,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  Settings2,
  Eye,
  X,
  ExternalLink,
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
  setupFee: number;
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
  quantity: number;
  unit: "mm" | "inch" | "cm";
  isAnalyzing?: boolean;
}

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
  const { isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [technologies, setTechnologies] = useState<TechnologyItem[]>([DEFAULT_FDM_TECHNOLOGY]);
  const [parts, setParts] = useState<ConfiguredPart[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Contact State (Required per screenshot & requirements)
  const [pickupName, setPickupName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectName, setProjectName] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [showNotesAccordion, setShowNotesAccordion] = useState(false);

  // Validation errors
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  // Modal / Drawer state for "Edit specifications" and 3D preview
  const [editingSpecPartId, setEditingSpecPartId] = useState<string | null>(null);
  const [viewing3DPart, setViewing3DPart] = useState<ConfiguredPart | null>(null);

  // Success dialog state
  const [submittedOrder, setSubmittedOrder] = useState<{
    id: string;
    orderNumber: string;
    modelCount: number;
    totalCopies: number;
    pickupName: string;
    phone: string;
  } | null>(null);

  // Load materials from API
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/materials");
        const data = await res.json();
        if (data.technologies && data.technologies.length > 0) {
          setTechnologies(data.technologies);
        }
      } catch (err) {
        console.warn("Using offline FDM catalog fallback:", err);
      }
    }
    loadCatalog();
  }, []);

  const getFdmMaterials = (): MaterialItem[] => {
    return technologies[0]?.materials || DEFAULT_FDM_TECHNOLOGY.materials;
  };

  /**
   * Process 3D CAD mesh file into configured part state
   */
  const processFileBuffer = async (
    buffer: ArrayBuffer,
    fileName: string,
    preferredMat = "PLA",
    isSample = false
  ) => {
    if (parts.length >= 8) {
      alert("Maximum limit of 8 models reached per submission request.");
      return;
    }

    setIsUploading(true);
    setUploadStatusText(`Analyzing ${fileName}...`);

    const partId = `part_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const fdmTech = technologies[0] || DEFAULT_FDM_TECHNOLOGY;
    const availableMats = fdmTech.materials.length > 0 ? fdmTech.materials : DEFAULT_FDM_TECHNOLOGY.materials;

    let selectedMat =
      availableMats.find((m) => m.name.toLowerCase().includes(preferredMat.toLowerCase())) ||
      availableMats[0];

    let analysis: MeshAnalysisResult;
    try {
      analysis = await analyzeMeshBuffer(buffer, fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: selectedMat,
        unit: "mm",
      });
    } catch (err) {
      console.warn("Worker error, fallback to direct analysis:", err);
      analysis = analyzeMeshDirect(buffer, fileName, {
        selectedTechnology: "FDM",
        selectedMaterial: selectedMat,
        unit: "mm",
      });
    }

    const newPart: ConfiguredPart = {
      id: partId,
      fileName,
      fileBuffer: buffer,
      analysis,
      selectedTechId: fdmTech.id,
      selectedMaterialId: selectedMat.id,
      infillPercent: 30, // 30% default matching screenshot "30% Grid"
      layerHeightMm: 0.2,
      quantity: 1,
      unit: (analysis.detectedUnit as "mm" | "inch" | "cm") || "mm",
      isAnalyzing: false,
    };

    setParts((prev) => [...prev, newPart]);
    setIsUploading(false);
    setUploadStatusText(null);

    // Background upload to persist CAD file
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

  const loadSamplePart = async (url: string, fileName: string, preferredMat = "PLA") => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Sample file not found");
      const buffer = await res.arrayBuffer();
      await processFileBuffer(buffer, fileName, preferredMat, true);
    } catch (err) {
      console.warn("Could not load sample model:", err);
    }
  };

  const updatePartConfig = (id: string, updates: Partial<ConfiguredPart>) => {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, ...updates } : part))
    );
  };

  const removePart = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    if (editingSpecPartId === id) setEditingSpecPartId(null);
    if (viewing3DPart?.id === id) setViewing3DPart(null);
  };

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

  // Calculation: Total Copies across all models
  const totalCopies = parts.reduce((sum, p) => sum + p.quantity, 0);

  // Validate form before submission
  const validateForm = () => {
    const errors: { name?: string; phone?: string } = {};

    if (!pickupName.trim()) {
      errors.name = isRtl ? "يرجى إدخال الاسم بالكامل" : "Pickup name is required";
    }

    const cleanPhone = phone.trim().replace(/[\s\-()]/g, "");
    if (!cleanPhone) {
      errors.phone = isRtl ? "رقم الهاتف مطلوب لتلقي التسعير عبر واتساب" : "Phone number with WhatsApp is required";
    } else if (cleanPhone.length < 8) {
      errors.phone = isRtl ? "رقم الهاتف غير صحيح" : "Please enter a valid phone number (at least 8 digits)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Request for Review
  const handleSubmitReviewRequest = async () => {
    if (parts.length === 0) {
      alert(isRtl ? "يرجى رفع ملف 3D واحد على الأقل قبل المتابعة." : "Please upload at least one 3D model.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: pickupName.trim(),
        customerPhone: phone.trim(),
        phone: phone.trim(),
        projectName: projectName.trim(),
        isEngineeringReview: true,
        customerNotes: customerNotes.trim(),
        subtotal: 0,
        shippingFee: 0,
        tax: 0,
        totalAmount: 0,
        items: parts.map((p) => {
          const mat = getFdmMaterials().find((m) => m.id === p.selectedMaterialId);
          return {
            fileName: p.fileName,
            fileUrl: p.fileUrl || `/models/${p.fileName}`,
            dimX: p.analysis.dimX,
            dimY: p.analysis.dimY,
            dimZ: p.analysis.dimZ,
            volumeCm3: p.analysis.volumeCm3,
            surfaceAreaCm2: p.analysis.surfaceAreaCm2,
            unitUsed: p.unit,
            technologyId: p.selectedTechId,
            materialId: p.selectedMaterialId,
            infillPercent: p.infillPercent,
            layerHeightMm: p.layerHeightMm,
            quantity: p.quantity,
            unitPrice: 0,
            totalPrice: 0,
            dfmWarnings: p.analysis.dfmWarnings,
            colorName: mat?.color || "To confirm",
          };
        }),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });

        setSubmittedOrder({
          id: data.order.id,
          orderNumber: data.order.orderNumber,
          modelCount: parts.length,
          totalCopies,
          pickupName: pickupName.trim(),
          phone: phone.trim(),
        });
      } else {
        alert("Failed to submit request: " + (data.error || "Unknown server error"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting request. Please verify internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Pre-filled message generator
  const getWhatsAppMessageUrl = (orderNumber: string) => {
    const message = `Hello Khalid3D! 🚀\nI just submitted a 3D printing review request on your platform.\n\n*Reference:* ${orderNumber}\n*Name:* ${pickupName}\n*Phone:* ${phone}\n*Models:* ${parts.length} files (${totalCopies} copies)\n${projectName ? `*Project:* ${projectName}\n` : ""}\nPlease review the mesh files and send the confirmed quote in EGP.`;
    return `https://wa.me/201000000000?text=${encodeURIComponent(message)}`;
  };

  // Active part for spec editing modal
  const editingPart = parts.find((p) => p.id === editingSpecPartId);
  const editingMat = getFdmMaterials().find((m) => m.id === editingPart?.selectedMaterialId);

  return (
    <div className="min-h-screen bg-[#070d18] text-[#e2e8f0] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Top Heading */}
        <div className="border-b border-[#1b2842] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00dbc6] animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                {isRtl ? "طلب مراجعة وتسعير النماذج 3D" : "3D Print Request & Model Review"}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1 font-mono">
              {isRtl
                ? "ارفع ملفاتك، وحدد الكمية، وسيتم تأكيد السعر الرسمي بالجنيه المصري ومراجعة الموديل عبر الواتساب."
                : "Upload your CAD files and set quantities. Final price in EGP and DFM check will be sent via WhatsApp."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f243a] text-cyan-300 border border-[#1b4363] text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00dbc6]" />
              {isRtl ? "مراجعة هندسية مجانية" : "Free DFM Review"}
            </span>
          </div>
        </div>

        {/* Main Grid: Left Models List + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ========================================================================= */}
          {/* LEFT COLUMN: Your models (Matching User Reference Screenshot)            */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Main Models Card */}
            <div className="bg-[#0c1526] border border-[#1b2842] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              
              {/* Card Header: "Your models X/8" */}
              <div className="flex items-center justify-between border-b border-[#16233a] pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {isRtl ? `نماذجك (${parts.length}/8)` : `Your models`}
                  </h2>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                    {parts.length}/8
                  </span>
                </div>

                {/* Direct Upload Trigger */}
                {parts.length < 8 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00dbc6] hover:text-white bg-[#0e273c] hover:bg-[#133754] border border-[#1d4c6d] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? "رفع ملف آخر" : "Upload model"}</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone (Visible if 0 parts, or compact below) */}
              {parts.length === 0 ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3 transition-all ${
                    isDragOver
                      ? "border-[#00dbc6] bg-cyan-950/20 scale-[1.01]"
                      : "border-[#1e2f4c] hover:border-[#00dbc6]/50 bg-[#08101e]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".stl,.3mf,.obj,.step,.stp,model/stl,application/sla"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Click or drop 3D files"
                  />

                  <div className="w-16 h-16 rounded-2xl bg-[#0e223b] border border-[#1b4363] flex items-center justify-center text-[#00dbc6] shadow-md">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <UploadCloud className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <p className="text-base font-bold text-white">
                      {isRtl ? "اسحب وأفلت ملفات 3D هنا أو تصفح جهازك" : "Drop your 3D CAD models here or browse files"}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1 font-mono">
                      Supports .STL, .3MF, .OBJ, .STEP • Max 100MB per file
                    </p>
                  </div>

                  {/* Sample models shortcut */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2 z-20">
                    <span className="text-xs text-[#64748b]">Try test sample:</span>
                    <button
                      onClick={() => loadSamplePart("/models/drone_motor_bracket.stl", "xbloom+tower+v1+.stl", "PETG")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#14233c] hover:bg-[#1a3154] text-cyan-300 border border-[#23426b] transition-colors cursor-pointer"
                    >
                      + xbloom+tower+v1+.stl
                    </button>
                    <button
                      onClick={() => loadSamplePart("/models/calibration_cube_20mm.stl", "calibration_cube.stl", "PLA")}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#14233c] hover:bg-[#1a3154] text-cyan-300 border border-[#23426b] transition-colors cursor-pointer"
                    >
                      + calibration_cube.stl
                    </button>
                  </div>
                </div>
              ) : (
                /* Hidden input for adding more files */
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".stl,.3mf,.obj,.step,.stp,model/stl,application/sla"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              )}

              {/* Upload Status Alert */}
              {uploadStatusText && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{uploadStatusText}</span>
                </div>
              )}

              {/* Uploaded Model Cards List (Screenshot Design) */}
              <div className="space-y-4">
                {parts.map((part) => {
                  const mat = getFdmMaterials().find((m) => m.id === part.selectedMaterialId) || getFdmMaterials()[0];

                  return (
                    <div
                      key={part.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#08101e] border border-[#1b2b48] hover:border-[#28426d] transition-all space-y-3.5"
                    >
                      {/* Top Row: Thumbnail + Filename/Specs + Delete Icon */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          
                          {/* 3D Preview Thumbnail Box (Matching Screenshot "Preview unavailable" / 3D Icon) */}
                          <div
                            onClick={() => setViewing3DPart(part)}
                            className="w-16 h-16 rounded-xl bg-[#0e1b30] border border-[#1f3558] hover:border-cyan-500/60 flex flex-col items-center justify-center text-center p-1 shrink-0 cursor-pointer group transition-all"
                            title="Click to view in 3D"
                          >
                            <Box className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform mb-0.5" />
                            <span className="text-[9px] font-mono text-[#94a3b8] leading-tight group-hover:text-cyan-300">
                              3D View
                            </span>
                          </div>

                          {/* Filename & Spec Subtitle */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                                {part.fileName}
                              </h3>
                            </div>
                            <p className="text-xs text-[#94a3b8] font-mono mt-0.5">
                              Colour to confirm • {part.infillPercent}% Grid ({mat.name.split(" ")[0]})
                            </p>
                            <p className="text-[11px] text-[#64748b] font-mono mt-0.5">
                              {part.analysis.dimX} × {part.analysis.dimY} × {part.analysis.dimZ} {part.unit} • Vol: {part.analysis.volumeCm3.toFixed(1)} cm³
                            </p>
                          </div>
                        </div>

                        {/* Delete Trash Button (Right corner) */}
                        <button
                          onClick={() => removePart(part.id)}
                          className="p-2 text-[#64748b] hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Remove model"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Review Status Banner (Exact text from reference screenshot) */}
                      <div className="text-xs text-[#93c5fd] bg-[#0c1c33]/70 border border-[#193b68] rounded-xl px-3.5 py-2 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                        <span>The model or print configuration changed. The team will review it.</span>
                      </div>

                      {/* Bottom Row: Quantity Input + Edit Specifications Button */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#122038]">
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2.5">
                          <label className="text-xs font-bold text-slate-300">
                            Quantity
                          </label>
                          <div className="flex items-center border border-[#1e3456] rounded-xl bg-[#0a1526] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updatePartConfig(part.id, { quantity: Math.max(1, part.quantity - 1) })}
                              className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-bold"
                            >
                              -
                            </button>
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
                              className="w-12 text-center bg-transparent text-xs font-bold text-white focus:outline-hidden py-1"
                            />
                            <button
                              type="button"
                              onClick={() => updatePartConfig(part.id, { quantity: part.quantity + 1 })}
                              className="px-2.5 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* "Edit specifications" button (Matching screenshot) */}
                        <button
                          onClick={() => setEditingSpecPartId(editingSpecPartId === part.id ? null : part.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-[#0e1e36] hover:bg-[#132a4c] border border-[#1d3862] transition-colors cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5 text-[#00dbc6]" />
                          <span>Edit specifications</span>
                        </button>
                      </div>

                      {/* Expandable Specifications Drawer */}
                      {editingSpecPartId === part.id && (
                        <div className="mt-3 p-4 rounded-xl bg-[#0b182d] border border-cyan-900/60 space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between pb-2 border-b border-[#182a47]">
                            <span className="text-xs font-bold text-cyan-300 font-mono">
                              Custom Specifications for {part.fileName}
                            </span>
                            <button
                              onClick={() => setEditingSpecPartId(null)}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Done
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            {/* Material */}
                            <div>
                              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                                Material
                              </label>
                              <select
                                value={part.selectedMaterialId}
                                onChange={(e) => updatePartConfig(part.id, { selectedMaterialId: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#1f3559] bg-[#071120] text-white focus:border-cyan-400 focus:outline-hidden text-xs"
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
                              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                                Infill Density
                              </label>
                              <select
                                value={part.infillPercent}
                                onChange={(e) => updatePartConfig(part.id, { infillPercent: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#1f3559] bg-[#071120] text-white focus:border-cyan-400 focus:outline-hidden text-xs"
                              >
                                <option value={15}>15% (Visual Mockup)</option>
                                <option value={20}>20% (Standard FDM)</option>
                                <option value={30}>30% (Standard Grid)</option>
                                <option value={40}>40% (Structural Prototype)</option>
                                <option value={100}>100% (Solid Mechanical)</option>
                              </select>
                            </div>

                            {/* Layer Height */}
                            <div>
                              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                                Layer Height
                              </label>
                              <select
                                value={part.layerHeightMm}
                                onChange={(e) => updatePartConfig(part.id, { layerHeightMm: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#1f3559] bg-[#071120] text-white focus:border-cyan-400 focus:outline-hidden text-xs"
                              >
                                <option value={0.12}>0.12mm (Ultra Fine)</option>
                                <option value={0.16}>0.16mm (Fine Detail)</option>
                                <option value={0.20}>0.20mm (Standard)</option>
                                <option value={0.28}>0.28mm (Draft)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Models Footer (Matching Screenshot Notice) */}
              <div className="pt-3 border-t border-[#16233a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#64748b]">
                <p>
                  Estimated prices include each model&apos;s copies. Final quote follows review.
                </p>

                {parts.length > 0 && parts.length < 8 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline underline-offset-2 shrink-0"
                  >
                    + Add more models
                  </button>
                )}
              </div>

            </div>

            {/* ========================================================================= */}
            {/* BOTTOM CARD: Pickup Name & Phone (with WhatsApp) (Screenshot Design)      */}
            {/* ========================================================================= */}
            <div className="bg-[#0c1526] border border-[#1b2842] rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {/* Pickup Name * */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span>{isRtl ? "الاسم بالكامل *" : "Pickup name *"}</span>
                    {formErrors.name && (
                      <span className="text-[10px] text-rose-400 font-normal">{formErrors.name}</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupName}
                      onChange={(e) => {
                        setPickupName(e.target.value);
                        if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                      }}
                      placeholder="e.g. Khalid Ekbal"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#08101e] text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden transition-colors ${
                        formErrors.name
                          ? "border-rose-500 focus:border-rose-400"
                          : "border-[#1b2b48] focus:border-[#00dbc6]"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone * (Must have WhatsApp per user request) */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>{isRtl ? "رقم الهاتف (واتساب) *" : "Phone *"}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold">
                        WhatsApp Active
                      </span>
                    </span>
                    {formErrors.phone && (
                      <span className="text-[10px] text-rose-400 font-normal">{formErrors.phone}</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      placeholder="e.g. 01012345678 or +20..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#08101e] text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden transition-colors ${
                        formErrors.phone
                          ? "border-rose-500 focus:border-rose-400"
                          : "border-[#1b2b48] focus:border-[#00dbc6]"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-[#64748b] mt-1 font-mono">
                    Must have WhatsApp. Your quote & verification will be sent here.
                  </p>
                </div>

              </div>

              {/* Collapsible Accordion: "▼ Project, course or notes (optional)" */}
              <div className="pt-2 border-t border-[#16233a]">
                <button
                  type="button"
                  onClick={() => setShowNotesAccordion(!showNotesAccordion)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer py-1"
                >
                  {showNotesAccordion ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
                  <span>{isRtl ? "تفاصيل المشروع أو ملاحظات هندسية (اختياري)" : "Project, course or notes (optional)"}</span>
                </button>

                {showNotesAccordion && (
                  <div className="mt-3 space-y-3 pt-2 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Project name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. Graduation Robotics Arm, Quadcopter Enclosure"
                        className="w-full px-3 py-2 rounded-xl border border-[#1b2b48] bg-[#08101e] text-white placeholder-slate-500 text-xs focus:border-[#00dbc6] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Engineering notes or critical tolerances
                      </label>
                      <textarea
                        rows={2}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="e.g. M3 heat-set brass threaded inserts required, smooth mating face on top side, etc."
                        className="w-full px-3 py-2 rounded-xl border border-[#1b2b48] bg-[#08101e] text-white placeholder-slate-500 text-xs focus:border-[#00dbc6] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Request Summary (Screenshot Design)                         */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-[#0c1526] border border-[#1b2842] rounded-3xl p-6 shadow-xl space-y-5 sticky top-24">
              
              {/* Header */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Request summary
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {parts.length} models • {totalCopies} copies
                </p>
              </div>

              {/* Status Section: "Awaiting review" (Exact text from screenshot) */}
              <div className="p-4 rounded-2xl bg-[#08101e] border border-[#162744] space-y-1.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#00dbc6] animate-pulse" />
                  <span>Awaiting review</span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  We&apos;ll confirm your price in EGP. No payment until you accept your quote.
                </p>
              </div>

              {/* Reassurance points */}
              <div className="space-y-2 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>±0.15mm Calibrated FDM Tolerance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp Quote Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Payment Before Approval</span>
                </div>
              </div>

              {/* Action Buttons (Matching Screenshot) */}
              <div className="space-y-3 pt-2">
                
                {/* Primary Button: "Review request" */}
                <button
                  onClick={handleSubmitReviewRequest}
                  disabled={isSubmitting || parts.length === 0}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-[#00dbc6] hover:bg-[#00c5b2] active:scale-[0.99] shadow-lg shadow-[#00dbc6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Submitting request...</span>
                    </>
                  ) : (
                    <>
                      <span>Review request</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>

                {/* Secondary Button: "Save draft" */}
                <button
                  type="button"
                  onClick={() => {
                    if (parts.length === 0) {
                      alert("Please upload at least one model to save as draft.");
                    } else {
                      alert("Draft models saved in your browser session.");
                    }
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                >
                  Save draft
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3D VIEWER MODAL DIALOG                                                    */}
      {/* ========================================================================= */}
      {viewing3DPart && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1424] border border-[#1b2b48] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-3 p-5">
            <div className="flex items-center justify-between border-b border-[#182844] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-cyan-400" />
                  <span>{viewing3DPart.fileName}</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Dimensions: {viewing3DPart.analysis.dimX} × {viewing3DPart.analysis.dimY} × {viewing3DPart.analysis.dimZ} {viewing3DPart.unit}
                </p>
              </div>
              <button
                onClick={() => setViewing3DPart(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 w-full bg-[#060c18] rounded-2xl overflow-hidden relative border border-[#16253e]">
              {viewing3DPart.fileBuffer ? (
                <ThreeViewer
                  modelBuffer={viewing3DPart.fileBuffer}
                  fileName={viewing3DPart.fileName}
                  materialColor="#00dbc6"
                  technologyName="FDM"
                  dimX={viewing3DPart.analysis.dimX}
                  dimY={viewing3DPart.analysis.dimY}
                  dimZ={viewing3DPart.analysis.dimZ}
                  unit={viewing3DPart.unit}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Preview unavailable for this format
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setViewing3DPart(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#00dbc6] hover:bg-[#00c5b2]"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION MODAL (WITH WHATSAPP CONNECTION)                     */}
      {/* ========================================================================= */}
      {submittedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1526] border border-[#1f3558] rounded-3xl w-full max-w-lg p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center mx-auto text-[#00dbc6] shadow-lg shadow-cyan-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Review Request Received
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Request #{submittedOrder.orderNumber}
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                Thank you, <strong className="text-white">{submittedOrder.pickupName}</strong>! Our engineering team has received your <strong className="text-white">{submittedOrder.modelCount} models ({submittedOrder.totalCopies} copies)</strong>.
              </p>
            </div>

            {/* WhatsApp notification highlight card */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Notification Active</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                We will contact you at <strong className="text-white">{submittedOrder.phone}</strong> with your final verified price in EGP and print time. No payment is required until you approve.
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <a
                href={getWhatsAppMessageUrl(submittedOrder.orderNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Khalid3D on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  setParts([]);
                  setPickupName("");
                  setPhone("");
                  setProjectName("");
                  setCustomerNotes("");
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Submit another model request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
