"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import ReviewsSection from "@/components/home/ReviewsSection";
import OrganicDivider from "@/components/ui/OrganicDivider";
import ThreeViewer from "@/components/viewer/ThreeViewer";
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
  Flame,
  Activity,
  HeartPulse,
  Brain,
  Shield,
  Gauge,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const { t, isRtl } = useLanguage();

  // State for interactive 3D modal
  const [show3DModal, setShow3DModal] = useState(false);

  // Live Cost Estimator state
  const [estGrams, setEstGrams] = useState(45);
  const [estMinutes, setEstMinutes] = useState(120);
  const [estMaterial, setEstMaterial] = useState<"PLA" | "PETG" | "TPU">("PLA");

  const materialRates = {
    PLA: { gramRate: 1.5, minRate: 0.8, setup: 20, name: "PLA Tough" },
    PETG: { gramRate: 1.95, minRate: 0.95, setup: 25, name: "PETG Industrial" },
    TPU: { gramRate: 2.8, minRate: 1.3, setup: 35, name: "TPU 95A Flexible" },
  };

  const currentRate = materialRates[estMaterial];
  const gramCost = estGrams * currentRate.gramRate;
  const minuteCost = estMinutes * currentRate.minRate;
  const estimatedTotal = Math.round(gramCost + minuteCost + currentRate.setup);

  return (
    <div className="bg-white overflow-hidden text-slate-800">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Deep Emerald Forest Green Landing Style) */}
      {/* ========================================================= */}
      <section className="relative bg-gradient-to-b from-[#082e17] via-[#0d4624] to-[#0a351b] text-white pt-10 sm:pt-16 pb-0 overflow-hidden">
        {/* Subtle decorative floating filament / leaf particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-emerald-400/40 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 rounded-full border border-emerald-300/30 blur-sm" />
          <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-emerald-400/10 blur-xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-12 sm:pb-20">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/50 text-xs font-mono font-semibold text-emerald-300 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#72bf25] animate-ping" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Title with serif styling from reference image */}
              <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-white leading-[1.15]">
                {isRtl ? (
                  <>
                    <span>طباعة ثلاثية الأبعاد </span>
                    <span className="italic text-[#8fe23d] font-sans font-black">
                      Khalid3D
                    </span>
                  </>
                ) : (
                  <>
                    <span>Precision </span>
                    <span className="italic font-normal text-[#8fe23d]">FDM 3D Printing</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl font-medium text-emerald-100/90 leading-relaxed font-sans">
                {t.hero.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-emerald-200/70 font-mono">
                {isRtl
                  ? "خامات صناعية: PLA Tough • PETG مقاوم للحرارة • TPU مرن | شحن لجميع محافظات مصر"
                  : "Essential Additive Manufacturing: PLA Tough • PETG Industrial • Flexible TPU"}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/quote"
                  className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-950 bg-[#72bf25] hover:bg-[#63a81f] shadow-lg shadow-[#72bf25]/30 transition-all hover:scale-105 flex items-center gap-2 uppercase tracking-wide"
                >
                  <span>{isRtl ? "اطلب تسعيرك الآن >" : "ORDER NOW >"}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShow3DModal(true)}
                  className="px-6 py-3.5 rounded-full text-xs font-bold text-white bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/50 shadow-sm transition-all flex items-center gap-2"
                >
                  <Rotate3d className="w-4 h-4 text-[#8fe23d]" />
                  <span>{isRtl ? "معاينة ثلاثية الأبعاد 3D" : "Interactive 3D Orbit"}</span>
                </button>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60 max-w-md font-mono text-center">
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-800/40">
                  <div className="text-lg font-black text-white">{t.hero.stat1Value}</div>
                  <div className="text-[10px] text-emerald-300/80">{t.hero.stat1Label}</div>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-800/40">
                  <div className="text-lg font-black text-[#8fe23d]">{t.hero.stat2Value}</div>
                  <div className="text-[10px] text-emerald-300/80">{t.hero.stat2Label}</div>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-800/40">
                  <div className="text-lg font-black text-white">{t.hero.stat3Value}</div>
                  <div className="text-[10px] text-emerald-300/80">{t.hero.stat3Label}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Centerpiece 3D Model with Seal Badge */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
                {/* Backlight Glow */}
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl scale-95 pointer-events-none" />

                {/* 3D Printed Hero Gimbal Image */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-600/30 group">
                  <img
                    src="/images/models/hero-gimbal-model.jpg"
                    alt="Khalid3D Precision 3D Printed Robotic Gimbal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#8fe23d]" />
                    <span>FDM Drone Assembly REV 4.2</span>
                  </div>

                  {/* Quality Seal Badge in Bottom Right Corner (like the reference image) */}
                  <div className="absolute bottom-4 right-4 bg-gradient-to-br from-[#0c401f] to-[#062110] border-2 border-[#8fe23d] text-white p-3.5 rounded-full shadow-2xl flex flex-col items-center justify-center w-24 h-24 text-center ring-4 ring-emerald-900/60 animate-pulse">
                    <Award className="w-6 h-6 text-[#8fe23d] mb-0.5" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-tight leading-none text-[#8fe23d]">
                      100% QUALITY
                    </span>
                    <span className="text-[8px] font-mono text-emerald-200 uppercase leading-none mt-0.5">
                      CALIPER TESTED
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Organic Torn Paper / Brush Wave Divider at Bottom */}
        <OrganicDivider position="bottom" fill="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* 2. ABOUT SECTION ("About Khalid3D" - White Background)    */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Centered Serif Section Title */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#4d8616]">
              <span className="w-8 h-[2px] bg-[#72bf25]" />
              <span>{t.about.badge}</span>
              <span className="w-8 h-[2px] bg-[#72bf25]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight">
              {t.about.title}
            </h2>
            <p className="text-sm text-slate-500 font-sans">{t.about.subtitle}</p>
          </div>

          {/* 2-Column Content: Workshop Photo & Structured Points */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Real Industrial 3D Printer Workshop Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
                <img
                  src="/images/models/fdm-printer-workshop.jpg"
                  alt="Industrial FDM 3D Printer Active Workshop"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 aspect-4/3"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5 text-[#4d8616]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Direct Twin-Gear Extrusion</div>
                      <div className="text-[11px] text-slate-500 font-mono">Heated PEI Bed • 0.4mm Brass Nozzle</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#4d8616] bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Cairo Lab
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Narrative & Highlights */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl font-serif text-slate-900 leading-snug">
                {isRtl
                  ? "دقة متناهية من الفكرة الرقمية إلى القطعة الحقيقية"
                  : "Precision Engineering In Every Layer"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {t.about.p1}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                {t.about.p2}
              </p>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-xl font-black text-[#4d8616]">{t.about.stat1}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{t.about.stat1Label}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-xl font-black text-[#4d8616]">{t.about.stat2}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{t.about.stat2Label}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <div className="text-xl font-black text-[#4d8616]">{t.about.stat3}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{t.about.stat3Label}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. CORE BENEFITS (3 Pillars matching reference layout)     */}
      {/* ========================================================= */}
      <section className="py-12 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Centered Serif Section Title */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">
              {isRtl ? "مزايا معمل Khalid3D" : "Benefits of Khalid3D"}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {isRtl ? "تصنيع إضافي احترافي بأعلى معايير الدقة الهندسية" : "Engineered Standards for Dependable Production"}
            </p>
          </div>

          {/* 3 Benefit Pillar Cards with soft circular icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-18 h-18 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#4d8616]">
                <Shield className="w-8 h-8 text-[#5fae20]" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">
                {isRtl ? "دقة الأبعاد ±0.15 مم" : "±0.15mm Tolerance"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {isRtl
                  ? "معايرة دورية لكل محور ومراجعة رقمية لضمان تطابق الأبعاد وتركيب المسامير والخوابير بدقة."
                  : "Tight dimensional repeatability for snap-fits, bearings, M3/M4 bolt holes, and mechanical enclosures."}
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-18 h-18 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#4d8616]">
                <Layers className="w-8 h-8 text-[#5fae20]" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">
                {isRtl ? "خامات هندسية أصلية" : "Engineered Filaments"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {isRtl
                  ? "خامات PLA Tough المقواة، و PETG المقاوم للحرارة حتى 75 درجة، ومطاط TPU 95A المرن للجوانات."
                  : "Genuine virgin polymers: Rigid PLA, chemical-resistant PETG (up to 75°C), and Shore 95A flexible TPU."}
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all text-center space-y-4">
              <div className="w-18 h-18 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-[#4d8616]">
                <Truck className="w-8 h-8 text-[#5fae20]" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-serif">
                {isRtl ? "شحن سريع لكافة المحافظات" : "Fast Egypt-Wide Delivery"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {isRtl
                  ? "شحن مؤمن ومغلف بعناية فائقة لباب بيتك أو ورشتك في القاهرة، الجيزة، الإسكندرية وجميع محافظات مصر."
                  : "Insured courier dispatch to your doorstep anywhere in Egypt with live tracking and protective packaging."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. THE CENTERPIECE SECTION ("Why Choose Khalid3D")        */}
      {/* ========================================================= */}
      <section className="relative bg-gradient-to-b from-[#082b16] via-[#0d4222] to-[#072513] text-white pt-10 pb-10 overflow-hidden">
        {/* Top Organic Divider */}
        <OrganicDivider position="top" fill="#ffffff" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-12">
          
          {/* Centered Serif Section Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
              {t.whyCenter.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/80 font-sans">
              {t.whyCenter.subtitle}
            </p>
          </div>

          {/* 3-Column Centerpiece Layout: 4 badges left + 3D Product Center + 4 badges right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column (4 Badges) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.l1}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.l2}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.l3}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.l4}</div>
              </div>
            </div>

            {/* Center Column: The Photorealistic 3D Printed Planetary Gearbox */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Radiant Ambient Aura */}
                <div className="absolute inset-0 rounded-full bg-[#72bf25]/20 blur-3xl scale-110 pointer-events-none" />

                {/* 3D Model Image */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/40 bg-white/5 backdrop-blur-sm flex items-center justify-center p-2 group">
                  <img
                    src="/images/models/planetary-gearbox-center.jpg"
                    alt="Khalid3D Precision 3D Printed Planetary Gearbox"
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 backdrop-blur-md py-1.5 px-3 rounded-xl border border-emerald-500/40 text-center font-mono text-[11px] text-[#8fe23d]">
                    PLANETARY GEARBOX • FDM v1.0
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 Badges) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.r1}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.r2}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.r3}</div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 backdrop-blur-sm">
                <div className="w-11 h-11 rounded-full bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">{t.whyCenter.r4}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Organic Divider */}
        <OrganicDivider position="bottom" fill="#ffffff" />
      </section>

      {/* ========================================================= */}
      {/* 5. PRICING PACKAGES (Cards with Discount Badges)          */}
      {/* ========================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Centered Serif Section Title */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#4d8616]">
              <span className="w-8 h-[2px] bg-[#72bf25]" />
              <span>{t.packages.badge}</span>
              <span className="w-8 h-[2px] bg-[#72bf25]" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 tracking-tight">
              {t.packages.title}
            </h2>
            <p className="text-xs text-slate-500 font-sans">{t.packages.subtitle}</p>
          </div>

          {/* 3 Package Cards matching reference design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Package 1: Single Prototype */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xl transition-all relative">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-slate-900">{t.packages.p1Title}</h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{t.packages.p1Sub}</p>
                </div>

                {/* 3D Model Visual */}
                <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden p-3 border border-slate-100 flex items-center justify-center">
                  <img
                    src="/images/models/package-3d-parts.jpg"
                    alt="Single Prototype 3D Print Part"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Feature List */}
                <ul className="space-y-2 text-xs text-slate-600 font-sans pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p1F1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p1F2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p1F3}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
                    {t.packages.p1Price}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Based on Grams & Machine Minutes
                  </div>
                </div>

                <Link
                  href="/quote?pkg=single"
                  className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#72bf25] hover:bg-[#61a81e] shadow-md shadow-[#72bf25]/30 transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <span>{t.packages.p1Cta}</span>
                </Link>
              </div>
            </div>

            {/* Package 2: Engineering Assembly (10% OFF Ribbon) */}
            <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 sm:p-8 flex flex-col justify-between shadow-xl relative ring-4 ring-emerald-50">
              {/* Discount Badge Ribbon */}
              <div className="absolute -top-3 right-6 bg-[#72bf25] text-slate-950 font-black font-mono text-xs px-3 py-1 rounded-full shadow-md uppercase">
                {t.packages.p2Badge}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-slate-900">{t.packages.p2Title}</h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{t.packages.p2Sub}</p>
                </div>

                {/* 3D Model Visual */}
                <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden p-3 border border-slate-100 flex items-center justify-center">
                  <img
                    src="/images/models/hero-gimbal-model.jpg"
                    alt="Multi Part Robotics 3D Print Assembly"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Feature List */}
                <ul className="space-y-2 text-xs text-slate-600 font-sans pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p2F1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p2F2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p2F3}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#4d8616]">
                    {t.packages.p2Price}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Multi-part engineering discount applied
                  </div>
                </div>

                <Link
                  href="/quote?pkg=assembly"
                  className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#72bf25] hover:bg-[#61a81e] shadow-md shadow-[#72bf25]/30 transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <span>{t.packages.p2Cta}</span>
                </Link>
              </div>
            </div>

            {/* Package 3: Production Run (20% OFF Ribbon) */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xl transition-all relative">
              {/* Discount Badge Ribbon */}
              <div className="absolute -top-3 right-6 bg-[#72bf25] text-slate-950 font-black font-mono text-xs px-3 py-1 rounded-full shadow-md uppercase">
                {t.packages.p3Badge}
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-serif text-xl font-bold text-slate-900">{t.packages.p3Title}</h3>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">{t.packages.p3Sub}</p>
                </div>

                {/* 3D Model Visual */}
                <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden p-3 border border-slate-100 flex items-center justify-center">
                  <img
                    src="/images/models/planetary-gearbox-center.jpg"
                    alt="Batch Production 3D Print Parts"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Feature List */}
                <ul className="space-y-2 text-xs text-slate-600 font-sans pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p3F1}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p3F2}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#5fae20] shrink-0" />
                    <span>{t.packages.p3F3}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
                    {t.packages.p3Price}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Highest tier gram & minute volume discount
                  </div>
                </div>

                <Link
                  href="/quote?pkg=batch"
                  className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#72bf25] hover:bg-[#61a81e] shadow-md shadow-[#72bf25]/30 transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <span>{t.packages.p3Cta}</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Quick Real-Time Cost Calculator Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#72bf25] text-slate-950 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 font-serif">
                    {t.estimator.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">
                    {t.estimator.subtitle}
                  </p>
                </div>
              </div>

              {/* Material Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">Filament:</span>
                <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200">
                  {(["PLA", "PETG", "TPU"] as const).map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => setEstMaterial(mat)}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors ${
                        estMaterial === mat
                          ? "bg-[#72bf25] text-slate-950 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Gram Slider */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t.estimator.weightLabel}:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {estGrams} {t.estimator.gramsUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={estGrams}
                  onChange={(e) => setEstGrams(Number(e.target.value))}
                  className="w-full accent-[#72bf25] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Minutes Slider */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">{t.estimator.durationLabel}:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {estMinutes} {t.estimator.minutesUnit} ({Math.floor(estMinutes / 60)}h {estMinutes % 60}m)
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={720}
                  step={15}
                  value={estMinutes}
                  onChange={(e) => setEstMinutes(Number(e.target.value))}
                  className="w-full accent-[#72bf25] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Live Output & Action */}
              <div className="flex items-center justify-between md:justify-end gap-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    {t.estimator.estimatedTotal}
                  </span>
                  <span className="text-2xl font-black font-mono text-[#4d8616]">
                    EGP {estimatedTotal}
                  </span>
                </div>
                <Link
                  href={`/quote?mat=${estMaterial}`}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors uppercase font-mono"
                >
                  Upload STL →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. VERIFIED REVIEWS SECTION                               */}
      {/* ========================================================= */}
      <ReviewsSection />

      {/* ========================================================= */}
      {/* 7. BOTTOM CTA & GUARANTEE FOOTER FRAME                     */}
      {/* ========================================================= */}
      <section className="relative bg-gradient-to-b from-[#082e17] to-[#041a0d] text-white pt-8 pb-16 overflow-hidden">
        {/* Top Organic Divider */}
        <OrganicDivider position="top" fill="#ffffff" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <BrandLogo size="lg" withMotion={true} />
          </div>

          <h3 className="text-2xl sm:text-4xl font-serif text-white max-w-xl mx-auto">
            {isRtl ? "جاهز لطباعة مشروعك القادم؟" : "Ready to Manufacture Your 3D Designs?"}
          </h3>

          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-lg mx-auto font-sans leading-relaxed">
            {isRtl
              ? "ارفع ملف STL وسيقوم محرك التشريح بحساب السعر الدقيق بالجرامات والدقائق بالجنيه المصري فوراً مع توصيل سريع لباب بيتك."
              : "Upload your CAD or STL file. Our client-side Web Worker computes exact weight in grams and nozzle minutes for instantaneous quotation."}
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/quote"
              className="px-10 py-4 rounded-full text-sm font-bold text-slate-950 bg-[#72bf25] hover:bg-[#62a61e] shadow-xl shadow-[#72bf25]/30 transition-all hover:scale-105 uppercase tracking-wider"
            >
              <span>{isRtl ? "ابدأ التسعير الفوري الآن >" : "GET INSTANT QUOTE NOW >"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE 3D ORBIT VIEWER MODAL                      */}
      {/* ========================================================= */}
      {show3DModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Rotate3d className="w-4 h-4 text-[#4d8616]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-mono">
                    Interactive 3D WebGL Orbit Model
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Click & drag to rotate • Scroll to zoom • Calibration Cube 20mm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShow3DModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[420px] sm:h-[480px] w-full bg-slate-50 relative">
              <ThreeViewer
                modelUrl="/models/calibration_cube_20mm.stl"
                materialColor="#5fae20"
                showDimensions={true}
              />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500 font-mono">
                Model: 20x20x20mm FDM Calibration Cube • Sliced in Web Worker
              </div>
              <Link
                href="/quote"
                onClick={() => setShow3DModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#72bf25] hover:bg-[#62a61e] shadow-sm uppercase font-mono"
              >
                Upload Your Own STL →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
