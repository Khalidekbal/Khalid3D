"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import ReviewsSection from "@/components/home/ReviewsSection";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import JLC3DPMaterialShowcase from "@/components/home/JLC3DPMaterialShowcase";
import {
  UploadCloud,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Zap,
  Sparkles,
  Cpu,
  Calculator,
  Rotate3d,
  X,
  Award,
  Maximize2,
  Sliders,
  Check,
  PackageCheck,
  Gauge,
  Compass,
  ChevronDown,
  Box,
  FileCheck,
  Wrench,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { t, isRtl, language } = useLanguage();

  // State for interactive 3D modal
  const [show3DModal, setShow3DModal] = useState(false);

  // Material Rail state
  const [activeMaterial, setActiveMaterial] = useState<"PLA" | "PETG" | "TPU">("PLA");

  // Live Cost Estimator state
  const [estGrams, setEstGrams] = useState(55);
  const [estMinutes, setEstMinutes] = useState(150);
  const [estMaterial, setEstMaterial] = useState<"PLA" | "PETG" | "TPU">("PLA");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const materialSpecs = {
    PLA: {
      name: "PLA Tough",
      badge: "High Precision & Rigidity",
      description:
        "High-modulus bio-polymer optimized for crisp aesthetic models, architectural mockups, and dimensional fit checks.",
      tensile: "52 MPa",
      temp: "58°C",
      density: "1.24 g/cm³",
      tolerance: "±0.15 mm",
      gramRate: 1.5,
      minRate: 0.8,
      setup: 20,
      color: "bg-emerald-500",
      accentBg: "bg-[#d8faf5] text-[#007065]",
      applications: ["Rapid Functional Prototyping", "Architectural Scale Models", "Custom Jigs & Enclosures"],
    },
    PETG: {
      name: "PETG Industrial",
      badge: "Chemical & Heat Resistant",
      description:
        "Durable glycol-modified polymer with outstanding impact resistance, chemical neutrality, and higher glass transition temperature.",
      tensile: "48 MPa",
      temp: "78°C",
      density: "1.27 g/cm³",
      tolerance: "±0.18 mm",
      gramRate: 1.95,
      minRate: 0.95,
      setup: 25,
      color: "bg-teal-500",
      accentBg: "bg-teal-50 text-teal-800",
      applications: ["Water-Resistant Housings", "Automotive Engine-Bay Brackets", "Heavy-Duty Snap Fits"],
    },
    TPU: {
      name: "TPU 95A Flexible",
      badge: "Elastomeric & Vibration Damping",
      description:
        "Industrial thermoplastic polyurethane providing high elastic memory, wear resistance, and shock absorption under dynamic stress.",
      tensile: "36 MPa",
      temp: "82°C",
      density: "1.21 g/cm³",
      tolerance: "±0.25 mm",
      gramRate: 2.8,
      minRate: 1.3,
      setup: 35,
      color: "bg-cyan-500",
      accentBg: "bg-cyan-50 text-cyan-800",
      applications: ["Gaskets & O-Rings", "Impact Bumpers & Protective Cases", "Vibration Dampeners"],
    },
  };

  const currentRate = materialSpecs[estMaterial];
  const gramCost = estGrams * currentRate.gramRate;
  const minuteCost = estMinutes * currentRate.minRate;
  const estimatedTotal = Math.round(gramCost + minuteCost + currentRate.setup);

  const faqs = [
    {
      q: isRtl ? "ما هي صيغ ملفات 3D CAD التي تقبلونها؟" : "What 3D CAD file formats do you accept?",
      a: isRtl
        ? "نقبل صيغ STL و STEP و OBJ و 3MF. يُفضل استخدام ملفات STEP للأجزاء الهندسية الميكانيكية للحصول على أفضل دقة أبعاد ممكنة."
        : "We accept STL, STEP, OBJ, and 3MF files. We strongly recommend STEP format for mechanical components to ensure the highest dimensional fidelity.",
    },
    {
      q: isRtl ? "كيف يتم حساب تكلفة الطلب بالجنيه المصري؟" : "How is pricing calculated in Egyptian Pounds (EGP)?",
      a: isRtl
        ? "تعتمد تسعيرتنا على معادلة هندسية شفافة 100%: (وزن الجزء بالجرام × سعر الخامة) + (زمن الطباعة بالدقائق × سعر تشغيل الماكينة) + رسوم تجهيز الماكينة. بدون أي تكاليف خفية."
        : "Our pricing uses a 100% transparent formula: (Part weight in grams × material rate) + (Machine run-time in minutes × minute rate) + calibrated machine setup fee. No hidden markups.",
    },
    {
      q: isRtl ? "ما هي دقة الأبعاد المضمونة للأجزاء المطبوعة؟" : "What is the guaranteed dimensional tolerance?",
      a: isRtl
        ? "نضمن دقة أبعاد ±0.15 مم لخامتي PLA و PETG على الطابعات الصناعية المعايرة، وهي مثالية للتروس والتجاويف وتجميع القطع الميكانيكية."
        : "We guarantee a dimensional tolerance of ±0.15 mm on calibrated FDM platforms for PLA and PETG, ideal for precision gear trains, press-fits, and mechanical housings.",
    },
    {
      q: isRtl ? "كم يستغرق تجهيز الطلب والشحن في مصر؟" : "What is the turnaround and delivery time across Egypt?",
      a: isRtl
        ? "تُشحن النماذج الأولية خلال 24 إلى 48 ساعة داخل القاهرة والجيزة، وخلال 48 إلى 72 ساعة لجميع محافظات مصر مع تغليف محكم ضد الرطوبة."
        : "Prototypes ship within 24 to 48 hours within Cairo & Giza, and 48 to 72 hours across all Egyptian governorates, vacuum-sealed with desiccant protection.",
    },
    {
      q: isRtl ? "هل يمكنني طلب نسبة ملء مخصصة (Infill) أو جدران سميكة؟" : "Can I customize the infill percentage and shell wall thickness?",
      a: isRtl
        ? "نعم بالكامل! يمكنك تحديد نسبة الملء (من 15% للنماذج الشكلية حتى 100% للأجزاء الميكانيكية المعرضة للإجهاد) وتحديد عدد الطبقات الخارجية أثناء طلب عرض السعر."
        : "Yes, completely! You can dial in the exact infill density (from 15% for visual mockups to 100% solid for structural load-bearing parts) and shell walls in the quote tool.",
    },
  ];

  return (
    <div className="bg-[#fafefd] overflow-hidden text-[#243a3c]">
      {/* ========================================================= */}
      {/* 1. THREADS3D-STYLE HERO SECTION (Eye-Comfort Minimalist) */}
      {/* ========================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 bg-gradient-to-b from-[#fafefd] via-[#f4faf9] to-[#fafefd] border-b border-[#d4e3e1]/60">
        {/* Soft engineering background grid */}
        <div className="absolute inset-0 bg-threads-grid pointer-events-none opacity-80" />
        
        {/* Gentle ambient teal glow behind hero visual */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#00dbc6]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content (Text & Strategic Value Proposition) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Eye-Comfort Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d8faf5] border border-[#a8ede4] text-xs font-semibold text-[#007065] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#00dbc6] animate-pulse" />
                <span className="tracking-wide">
                  {isRtl
                    ? "مختبر تصنيع ثلاثي الأبعاد مصري • القاهرة"
                    : "Egyptian Precision FDM Manufacturing • Cairo Lab"}
                </span>
              </div>

              {/* Master Headline (Threads3D Grotesk Style) */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0e2628] leading-[1.12]">
                {isRtl ? (
                  <>
                    <span>دقة هندسية في </span>
                    <span className="text-[#009e8f] underline decoration-[#00dbc6] decoration-4 underline-offset-8">
                      كل طبقة.
                    </span>
                  </>
                ) : (
                  <>
                    <span>Precision In </span>
                    <span className="text-[#009e8f] underline decoration-[#00dbc6] decoration-4 underline-offset-8">
                      Every Layer.
                    </span>
                  </>
                )}
              </h1>

              {/* Soothing High-Comfort Subtitle */}
              <p className="text-base sm:text-lg text-[#53696b] font-normal leading-relaxed max-w-xl">
                {isRtl
                  ? "حوّل ملفات CAD إلى قطع ميكانيكية وظيفية بدقة ±0.15 مم. تسعير شفاف وفوري بالجنيه المصري بناءً على الوزن بالجرام ودقائق الطباعة، مع شحن موثوق لجميع المحافظات."
                  : "Turn CAD models into structural end-use components and verified prototypes with ±0.15mm tolerance. Instant EGP pricing computed directly from grams and machine run-time."}
              </p>

              {/* Polymer pills overview */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-medium text-[#81989a]">
                  {isRtl ? "خامات هندسية:" : "Available Polymers:"}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eef7f6] text-[#0e2628] border border-[#d4e3e1]">
                  PLA Tough
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eef7f6] text-[#0e2628] border border-[#d4e3e1]">
                  PETG Industrial
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eef7f6] text-[#0e2628] border border-[#d4e3e1]">
                  TPU 95A Flexible
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/quote"
                  className="px-7 py-3.5 rounded-full text-sm font-bold text-[#0e2628] bg-[#00dbc6] hover:bg-[#00c5b2] shadow-sm hover:shadow-md hover:shadow-[#00dbc6]/25 transition-all hover:scale-102 flex items-center gap-2.5 tracking-wide"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isRtl ? "ارفع ملف 3D واحصل على عرض سعر" : "Upload CAD & Get Instant Quote"}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <a
                  href="#materials"
                  className="px-6 py-3.5 rounded-full text-sm font-semibold text-[#0e2628] bg-white border border-[#d4e3e1] hover:border-[#009e8f] hover:bg-[#f2faf9] transition-all shadow-2xs"
                >
                  {isRtl ? "مقارنة الخامات والمواصفات" : "Compare Engineering Materials"}
                </a>
              </div>

              {/* Instant Trust Micro-Bar */}
              <div className="pt-4 border-t border-[#d4e3e1]/70 flex items-center gap-6 text-xs text-[#53696b]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#009e8f]" />
                  <span>{isRtl ? "فحص أبعاد بالميكروميتر" : "Micrometer Inspected"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#009e8f]" />
                  <span>{isRtl ? "شحن 24-48 ساعة" : "24-48h Fast Dispatch"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#009e8f]" />
                  <span>{isRtl ? "دفع بالجنيه المصري" : "EGP Transparent Rates"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Anchor (Floating 3D Printed Gimbal) */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
                
                {/* Backplate ambient aura */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#00dbc6]/20 via-[#d8faf5]/30 to-transparent blur-2xl" />

                {/* Main Card with the 3D Printed Engineering Model */}
                <div className="relative w-full h-full rounded-3xl bg-white border border-[#d4e3e1] p-3 shadow-md overflow-hidden group">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#f4faf9] flex items-center justify-center">
                    <Image
                      src="/images/models/hero-gimbal-model.jpg"
                      alt="Khalid3D Precision 3D Printed Mechanical Gimbal"
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle Engineering Overlay Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#d4e3e1] text-[11px] font-mono font-bold text-[#0e2628] shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00dbc6]" />
                      <span>FDM Assembly • 0.16mm Layer</span>
                    </div>

                    {/* Interactive 3D Viewer trigger button */}
                    <button
                      onClick={() => setShow3DModal(true)}
                      className="absolute bottom-4 right-4 z-10 px-4 py-2 rounded-full bg-[#0e2628]/90 hover:bg-[#0e2628] text-white text-xs font-semibold backdrop-blur-md border border-[#1a383b] shadow-md flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Rotate3d className="w-4 h-4 text-[#00dbc6]" />
                      <span>{isRtl ? "معاينة ثلاثية الأبعاد تفاعلية" : "Interactive 3D Preview"}</span>
                    </button>
                  </div>
                </div>

                {/* Floating Spec Tag (Top Right) */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white border border-[#d4e3e1] rounded-2xl p-3 shadow-md items-center gap-3 animate-float-slow">
                  <div className="w-9 h-9 rounded-xl bg-[#d8faf5] flex items-center justify-center text-[#007065]">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-mono uppercase text-[#81989a]">Tolerance</div>
                    <div className="text-xs font-bold text-[#0e2628]">±0.15 mm Fit</div>
                  </div>
                </div>

                {/* Floating Spec Tag (Bottom Left) */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white border border-[#d4e3e1] rounded-2xl p-3 shadow-md items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eef7f6] flex items-center justify-center text-[#0e2628]">
                    <Layers className="w-5 h-5 text-[#009e8f]" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-mono uppercase text-[#81989a]">FDM Resolution</div>
                    <div className="text-xs font-bold text-[#0e2628]">0.12 - 0.28 mm</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Metrics Banner (4 Core Strategic Pillars) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#0e2628] font-sans">±0.15<span className="text-sm font-medium text-[#53696b]">mm</span></div>
              <div className="text-xs font-semibold text-[#53696b] mt-0.5">
                {isRtl ? "دقة الأبعاد المضمونة" : "Guaranteed Tolerance"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#0e2628] font-sans">24–48<span className="text-sm font-medium text-[#53696b]">h</span></div>
              <div className="text-xs font-semibold text-[#53696b] mt-0.5">
                {isRtl ? "زمن الشحن في مصر" : "Cairo Fast Turnaround"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#009e8f] font-sans">100%</div>
              <div className="text-xs font-semibold text-[#53696b] mt-0.5">
                {isRtl ? "تسعير شفاف بالجرام والدقيقة" : "Weight & Time Pricing"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#0e2628] font-sans">3 <span className="text-sm font-medium text-[#53696b]">Polymers</span></div>
              <div className="text-xs font-semibold text-[#53696b] mt-0.5">
                {isRtl ? "خامات صناعية نقية" : "Virgin Certified Filaments"}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE THREADS3D CENTERPIECE CALLOUTS HUB (Signature Section) */}
      {/* ========================================================= */}
      <section id="overview" className="py-20 sm:py-28 bg-[#fafefd] relative border-b border-[#d4e3e1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef7f6] border border-[#d4e3e1] text-xs font-mono font-semibold text-[#007065]">
              <Sparkles className="w-3.5 h-3.5 text-[#009e8f]" />
              <span>{isRtl ? "الهندسة من الداخل إلى الخارج" : "ENGINEERED FROM THE CORE OUT"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0e2628] tracking-tight">
              {isRtl ? "مواصفات تضمن نجاح تجميع أجزائك" : "Precision Architecture in Every Part"}
            </h2>
            <p className="text-sm sm:text-base text-[#53696b]">
              {isRtl
                ? "نظام تصنيع FDM مصمم خصيصاً للمهندسين والمصممين الذين يحتاجون إلى أجزاء وظيفية متوافقة مع متطلبات التجميع الحقيقية."
                : "A purposeful additive workflow designed for engineers, makers, and product designers who require true functional fidelity."}
            </p>
          </div>

          {/* Central 3D Centerpiece with 4 Floating Callouts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 2 Callouts */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Callout 01 */}
              <div className="p-5 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs hover:border-[#009e8f] transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#007065] px-2 py-0.5 rounded bg-[#d8faf5]">
                    01 • SURFACE
                  </span>
                  <Layers className="w-4 h-4 text-[#009e8f]" />
                </div>
                <h3 className="text-base font-bold text-[#0e2628] mb-1">
                  {isRtl ? "رص طبقات فائق النعومة" : "Dynamic Layer Stacking"}
                </h3>
                <p className="text-xs text-[#53696b] leading-relaxed">
                  {isRtl
                    ? "ارتفاع طبقات يبدأ من 0.12 مم يضمن اختفاء خطوط الترسيب تقريباً وتفاصيل واضحة للخطوط والنقوش."
                    : "Layer heights down to 0.12mm eliminate harsh contour stepping, delivering crisp threads and smooth surfaces."}
                </p>
              </div>

              {/* Callout 02 */}
              <div className="p-5 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs hover:border-[#009e8f] transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#007065] px-2 py-0.5 rounded bg-[#d8faf5]">
                    02 • TOLERANCE
                  </span>
                  <Gauge className="w-4 h-4 text-[#009e8f]" />
                </div>
                <h3 className="text-base font-bold text-[#0e2628] mb-1">
                  {isRtl ? "تفاوت أبعاد ±0.15 مم" : "Mechanical Tolerance Fit"}
                </h3>
                <p className="text-xs text-[#53696b] leading-relaxed">
                  {isRtl
                    ? "معايرة دقيقة لمحاور الحركة وحجم البثق تضمن تركيب رولمانات البلي والمسامير بدون الحاجة لتعديل يدوي."
                    : "Calibrated axis compensation ensures precision press-fits for standard 608 bearings, M3/M4 heat-inserts, and gears."}
                </p>
              </div>

            </div>

            {/* Centerpiece Visual (Planetary Gearbox Assembly) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-white border border-[#d4e3e1] p-4 shadow-sm overflow-hidden group">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#eef7f6] flex items-center justify-center">
                  <Image
                    src="/images/models/planetary-gearbox-center.jpg"
                    alt="Khalid3D 3D Printed Planetary Gearbox Centerpiece"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Ambient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2628]/40 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom caption */}
                  <div className="absolute bottom-4 inset-x-4 text-center">
                    <span className="px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-mono font-bold text-[#0e2628] border border-[#d4e3e1] shadow-xs">
                      Khalid3D Core Assembly • Functional FDM Gearbox
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Callouts */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Callout 03 */}
              <div className="p-5 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs hover:border-[#009e8f] transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#007065] px-2 py-0.5 rounded bg-[#d8faf5]">
                    03 • POLYMERS
                  </span>
                  <Cpu className="w-4 h-4 text-[#009e8f]" />
                </div>
                <h3 className="text-base font-bold text-[#0e2628] mb-1">
                  {isRtl ? "بوليمرات هندسية معتمدة" : "Certified Engineering Polymers"}
                </h3>
                <p className="text-xs text-[#53696b] leading-relaxed">
                  {isRtl
                    ? "تخزين الخامات داخل صناديق تجفيف مخصصة لمنع الرطوبة وضمان قوة الالتصاق بين الطبقات بنسبة 100%."
                    : "Continuous desiccated drybox storage prevents polymer hydrolysis, guaranteeing pristine inter-layer adhesion."}
                </p>
              </div>

              {/* Callout 04 */}
              <div className="p-5 rounded-2xl bg-white border border-[#d4e3e1] shadow-2xs hover:border-[#009e8f] transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#007065] px-2 py-0.5 rounded bg-[#d8faf5]">
                    04 • TRANSPARENCY
                  </span>
                  <Calculator className="w-4 h-4 text-[#009e8f]" />
                </div>
                <h3 className="text-base font-bold text-[#0e2628] mb-1">
                  {isRtl ? "تسعير رياضي بالجرام والدقيقة" : "Direct Gram & Minute Formula"}
                </h3>
                <p className="text-xs text-[#53696b] leading-relaxed">
                  {isRtl
                    ? "السعر يعكس استهلاك المادة الخام وساعات تشغيل الطابعة بدقة متناهية بالجنيه المصري، دون تقديرات جزافية."
                    : "Zero guesswork. Slicer data determines the exact grams and nozzle run-time for real-time fair cost estimation."}
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. JLC3DP-STYLE 3D PRINTING ON DEMAND MATERIAL SHOWCASE   */}
      {/* ========================================================= */}
      <section id="materials" className="py-20 sm:py-28 bg-[#f4faf9] relative border-b border-[#d4e3e1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JLC3DPMaterialShowcase />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. WORKSHOP & MANUFACTURING PROCESS (Authentic Lab Photos) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#fafefd] relative border-b border-[#d4e3e1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Grid of Production Lab Photos */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-[#d4e3e1] shadow-2xs group">
                <Image
                  src="/images/models/fdm-printer-workshop.jpg"
                  alt="Khalid3D Calibrated FDM Printer Farm"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e2628]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-mono font-medium">
                  {isRtl ? "مزرعة طابعات FDM مجهزة" : "Calibrated Production Farm"}
                </div>
              </div>

              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-[#d4e3e1] shadow-2xs group mt-6">
                <Image
                  src="/images/models/package-3d-parts.jpg"
                  alt="Khalid3D Carefully Packaged 3D Printed Parts"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e2628]/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-mono font-medium">
                  {isRtl ? "تغليف محكم وعازل للرطوبة" : "Desiccant Sealed Packaging"}
                </div>
              </div>
            </div>

            {/* Step-by-Step Flow */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef7f6] border border-[#d4e3e1] text-xs font-mono font-semibold text-[#007065]">
                <Wrench className="w-3.5 h-3.5 text-[#009e8f]" />
                <span>{isRtl ? "دورة التصنيع" : "PRODUCTION PIPELINE"}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0e2628] tracking-tight">
                {isRtl ? "من النموذج الرقمي إلى يديك خلال ساعات" : "From CAD Geometry to Delivery"}
              </h2>

              <p className="text-sm text-[#53696b] leading-relaxed">
                {isRtl
                  ? "قمنا بأتمتة عملية التصنيع لتقليل زمن الانتظار وضمان فحص جودة صارم قبل شحن كل قطعة."
                  : "Every order undergoes our standardized 4-stage engineering pipeline to guarantee zero thermal warping, crisp layer adhesion, and exact fit."}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00dbc6] text-[#0e2628] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2628]">
                      {isRtl ? "رفع الملف وتحليله تلقائياً" : "Client-Side Slicing Analysis"}
                    </h4>
                    <p className="text-xs text-[#53696b] mt-0.5">
                      {isRtl
                        ? "يقوم المتصفح بحساب الحجم والمساحة وتقدير الوزن والدقائق فوراً دون تأخير."
                        : "Instant geometric mesh breakdown and volume computation directly in your browser."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#d8faf5] text-[#007065] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#a8ede4]">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2628]">
                      {isRtl ? "تجهيز ملف الـ G-Code ومعايرة الطابعة" : "Toolpath Generation & Bed Leveling"}
                    </h4>
                    <p className="text-xs text-[#53696b] mt-0.5">
                      {isRtl
                        ? "تحديد اتجاه الطباعة الأمثل لأقصى متانة ميكانيكية وضبط درجة حرارة الفوهة بدقة."
                        : "Optimal print orientation selection for maximum tensile strength along critical stress vectors."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#d8faf5] text-[#007065] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#a8ede4]">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2628]">
                      {isRtl ? "الطباعة الصناعية والمراقبة الحرارية" : "Precision FDM Execution"}
                    </h4>
                    <p className="text-xs text-[#53696b] mt-0.5">
                      {isRtl
                        ? "طباعة تحت تحكم حراري كامل لمنع الانكماش أو انفصال الطبقات مع خيوط مجففة."
                        : "Continuous thermal chamber management preventing warping on large engineering enclosures."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#d8faf5] text-[#007065] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#a8ede4]">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0e2628]">
                      {isRtl ? "الفحص بالميكروميتر والتغليف الآمن" : "Quality Inspection & Courier Dispatch"}
                    </h4>
                    <p className="text-xs text-[#53696b] mt-0.5">
                      {isRtl
                        ? "فحص الأبعاد الحرجة بواسطة مهندسينا ثم تغليف كل جزء بأكياس عازلة للرطوبة."
                        : "Caliper verification of critical bearing seats before vacuum-packaging with desiccant."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. LIVE EGP COST ESTIMATOR (Transparent Weight & Time) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f4faf9] relative border-b border-[#d4e3e1]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8faf5] border border-[#a8ede4] text-xs font-mono font-semibold text-[#007065]">
              <Calculator className="w-3.5 h-3.5 text-[#009e8f]" />
              <span>{isRtl ? "حاسبة التكلفة الفورية" : "INSTANT COST ESTIMATOR"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0e2628] tracking-tight">
              {isRtl ? "احسب تكلفتك بالجنيه المصري مسبقاً" : "Transparent Formula Pricing"}
            </h2>
            <p className="text-sm text-[#53696b]">
              {isRtl
                ? "حرك مؤشرات الوزن وزمن الطباعة لمعرفة السعر التقديري الفوري قبل رفع الملف."
                : "Adjust grams and machine duration to preview accurate fabrication costs in Egyptian Pounds."}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#d4e3e1] p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Sliders Area */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Material Switcher */}
                <div>
                  <label className="text-xs font-bold text-[#0e2628] block mb-2">
                    {isRtl ? "الخامة المختارة:" : "Select Filament Material:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["PLA", "PETG", "TPU"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEstMaterial(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          estMaterial === m
                            ? "bg-[#00dbc6] text-[#0e2628] border-[#00dbc6]"
                            : "bg-[#fafefd] border-[#d4e3e1] text-[#53696b] hover:border-[#009e8f]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grams Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0e2628] mb-2">
                    <span>{isRtl ? "وزن الجزء المتوقع:" : "Estimated Part Weight:"}</span>
                    <span className="font-mono text-[#009e8f]">{estGrams} Grams</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={estGrams}
                    onChange={(e) => setEstGrams(Number(e.target.value))}
                    className="w-full accent-[#009e8f] bg-[#eef7f6] rounded-lg h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#81989a] mt-1">
                    <span>10g</span>
                    <span>250g</span>
                    <span>500g</span>
                  </div>
                </div>

                {/* Machine Minutes Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#0e2628] mb-2">
                    <span>{isRtl ? "مدة تشغيل الطابعة:" : "Estimated Machine Run Time:"}</span>
                    <span className="font-mono text-[#009e8f]">
                      {estMinutes} Min ({Math.floor(estMinutes / 60)}h {estMinutes % 60}m)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="600"
                    step="15"
                    value={estMinutes}
                    onChange={(e) => setEstMinutes(Number(e.target.value))}
                    className="w-full accent-[#009e8f] bg-[#eef7f6] rounded-lg h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-[#81989a] mt-1">
                    <span>30m</span>
                    <span>5 Hours</span>
                    <span>10 Hours</span>
                  </div>
                </div>

              </div>

              {/* Price Calculation Output Box */}
              <div className="md:col-span-5 bg-[#fafefd] border border-[#d4e3e1] rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase font-bold text-[#81989a]">
                    {isRtl ? "تفصيل التكلفة" : "Formula Breakdown"}
                  </span>

                  <div className="space-y-2 mt-3 text-xs">
                    <div className="flex justify-between text-[#53696b]">
                      <span>{isRtl ? "تكلفة الخامة:" : "Material:"}</span>
                      <span className="font-mono font-medium">{gramCost.toFixed(1)} EGP</span>
                    </div>
                    <div className="flex justify-between text-[#53696b]">
                      <span>{isRtl ? "ساعات التشغيل:" : "Machine Time:"}</span>
                      <span className="font-mono font-medium">{minuteCost.toFixed(1)} EGP</span>
                    </div>
                    <div className="flex justify-between text-[#53696b]">
                      <span>{isRtl ? "تجهيز ومعايرة:" : "Setup:"}</span>
                      <span className="font-mono font-medium">{currentRate.setup} EGP</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d4e3e1]">
                  <div className="text-[10px] font-mono text-[#81989a] uppercase">
                    {isRtl ? "السعر التقديري الإجمالي" : "Estimated Total"}
                  </div>
                  <div className="text-3xl font-black text-[#0e2628] font-sans">
                    {estimatedTotal} <span className="text-sm font-medium text-[#53696b]">EGP</span>
                  </div>
                </div>

                <Link
                  href="/quote"
                  className="w-full py-3 rounded-full text-xs font-bold text-[#0e2628] bg-[#00dbc6] hover:bg-[#00c5b2] shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isRtl ? "ارفع ملفك لحساب السعر الفعلي" : "Upload File For Exact Quote"}</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. VERIFIED REVIEWS SECTION */}
      {/* ========================================================= */}
      <section id="reviews" className="py-20 sm:py-28 bg-[#fafefd] border-b border-[#d4e3e1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewsSection />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. ENGINEERING FAQ ACCORDION (Threads3D Clean Card Style) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-[#f4faf9] border-b border-[#d4e3e1]/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8faf5] border border-[#a8ede4] text-xs font-mono font-semibold text-[#007065]">
              <HelpCircle className="w-3.5 h-3.5 text-[#009e8f]" />
              <span>{isRtl ? "الأسئلة الشائعة" : "FREQUENTLY ASKED QUESTIONS"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0e2628] tracking-tight">
              {isRtl ? "كل ما تود معرفته عن الخدمة" : "Clarity on Tolerances & Turnaround"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#d4e3e1] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-[#fafefd] transition-colors"
                  >
                    <span className="text-sm font-bold text-[#0e2628] pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#009e8f] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#53696b] leading-relaxed border-t border-[#f4faf9]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. THREADS3D LUXURY INK CONTRAST FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-[#0b1c1d] text-white pt-16 pb-12 relative overflow-hidden">
        {/* Soft radial teal background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#00dbc6]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1a383b]">
            
            {/* Column 1: Brand philosophy */}
            <div className="md:col-span-5 space-y-4">
              <BrandLogo size="md" withMotion={false} />
              <p className="text-xs text-[#81989a] leading-relaxed max-w-sm">
                {isRtl
                  ? "مختبر تصنيع رقمي مصري متخصص في تقنية FDM الصناعية. نلتزم بأعلى معايير الدقة والشفافية الهندسية لمساعدة المبتكرين والشركات على الإنتاج السريع."
                  : "Dedicated Egyptian additive lab engineered for high-precision FDM manufacturing. Delivering functional mechanical components, calibrated jigs, and verified prototypes across Egypt."}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#00dbc6] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00dbc6] animate-pulse" />
                <span>Cairo Workshop Active • 24/7 Production</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {isRtl ? "الخدمات والنظام" : "Quick Links"}
              </h5>
              <ul className="space-y-2 text-xs text-[#81989a]">
                <li>
                  <Link href="/quote" className="hover:text-[#00dbc6] transition-colors">
                    {t.nav.instantQuote}
                  </Link>
                </li>
                <li>
                  <Link href="/catalog" className="hover:text-[#00dbc6] transition-colors">
                    {t.nav.store}
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="hover:text-[#00dbc6] transition-colors">
                    {t.nav.trackOrder}
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#00dbc6] transition-colors">
                    {isRtl ? "دخول طاقم العمل والعملاء" : "Staff & Customer Portal"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Standards */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {isRtl ? "الموقع والاتصال" : "Location & Dispatch"}
              </h5>
              <div className="text-xs text-[#81989a] space-y-1.5">
                <p>📍 Cairo / Giza Industrial Corridor, Egypt</p>
                <p>📧 engineering@khalid3d.com</p>
                <p>⚡ High-Speed Delivery across all 27 Egyptian Governorates</p>
              </div>

              <div className="pt-2">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#0e2628] bg-[#00dbc6] hover:bg-[#00c5b2] transition-all"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{isRtl ? "ابدأ طلبك الآن" : "Start Your Order"}</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#53696b] gap-4">
            <p>© {new Date().getFullYear()} Khalid3D Lab. All rights reserved.</p>
            <p className="font-mono text-[11px]">
              Engineered with Precision & Eye-Comfort Brand Architecture.
            </p>
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 9. INTERACTIVE 3D VIEWER MODAL */}
      {/* ========================================================= */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0e2628]/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#d4e3e1]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4e3e1] bg-[#fafefd]">
              <div className="flex items-center gap-2">
                <Rotate3d className="w-5 h-5 text-[#009e8f]" />
                <span className="font-bold text-sm text-[#0e2628]">
                  {isRtl ? "معاينة النموذج التفاعلي (3D CAD)" : "Interactive 3D Engineering Inspection"}
                </span>
              </div>
              <button
                onClick={() => setShow3DModal(false)}
                className="p-1.5 rounded-full hover:bg-[#eef7f6] text-[#53696b] hover:text-[#0e2628] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-[480px] w-full bg-[#f4faf9] relative">
              <ThreeViewer modelUrl="/models/sample-part.stl" materialColor="#00dbc6" />
            </div>

            <div className="p-4 bg-[#fafefd] border-t border-[#d4e3e1] flex items-center justify-between">
              <span className="text-xs text-[#53696b]">
                {isRtl ? "تدوير بالسحب، وتكبير بعجلة الماوس" : "Drag to orbit, scroll wheel to zoom."}
              </span>
              <Link
                href="/quote"
                className="px-5 py-2 rounded-full text-xs font-bold text-[#0e2628] bg-[#00dbc6] hover:bg-[#00c5b2] transition-all"
              >
                {isRtl ? "طلب تسعير لهذا الجزء" : "Quote This Part"}
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
