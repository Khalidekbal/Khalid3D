"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Rotate3d,
} from "lucide-react";

interface MaterialItem {
  id: string;
  tabLabel: string;
  tabLabelAr: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  features: string[];
  featuresAr: string[];
  startingPrice: string;
  startingPriceAr: string;
  buildTime: string;
  buildTimeAr: string;
  quoteHref: string;
  colorTag: string;
}

export default function JLC3DPMaterialShowcase() {
  const { isRtl } = useLanguage();

  const materialsData: MaterialItem[] = [
    {
      id: "pla",
      tabLabel: "PLA Tough (Standard)",
      tabLabelAr: "PLA Tough (القياسي)",
      title: "PLA Tough (FDM Plastic)",
      titleAr: "خامة PLA Tough (بلاستيك FDM)",
      subtitle: "High Rigidity & Dimensional Accuracy",
      subtitleAr: "صلابة عالية ودقة أبعاد متناهية",
      image: "/images/materials/jlc-pla-part.jpg",
      features: [
        "High dimensional stiffness, crisp layer resolution, and low shrinkage.",
        "Available in Matte Black, Signal White, Olive Green, and Slate Grey.",
        "Tolerance down to ±0.15mm with calibrated axis backlash compensation.",
        "Best suited for electronic enclosures, snap-fit casings, and visual prototypes.",
      ],
      featuresAr: [
        "صلابة هيكلية عالية، دقة طبقات فائقة النعومة، وانكماش حراري شبه منعدم.",
        "متوفر بالألوان: أسود مط، أبيض ناصع، رمادي صناعي، وأخضر زيتوني.",
        "دقة أبعاد تصل إلى ±0.15 مم بفضل المعايرة الدقيقة لمحاور الحركة.",
        "الأفضل لتغليف الإلكترونيات، التجاويف ذات التجميع المحكم، والنماذج الهندسية.",
      ],
      startingPrice: "From 1.50 EGP/g",
      startingPriceAr: "يبدأ من 1.50 ج.م/جرام",
      buildTime: "Build Time: 24h - 48h",
      buildTimeAr: "مدة التنفيذ: 24 - 48 ساعة",
      quoteHref: "/quote?material=PLA",
      colorTag: "Matte PLA Finish",
    },
    {
      id: "petg",
      tabLabel: "PETG Industrial (Durable)",
      tabLabelAr: "PETG Industrial (مقاوم)",
      title: "PETG Industrial (Impact & Heat)",
      titleAr: "خامة PETG الصناعية (مقاومة للصدمات والحرارة)",
      subtitle: "Chemical Resistant & Weatherproof",
      subtitleAr: "مقاومة كيميائية ومقاومة للعوامل الجوية",
      image: "/images/materials/jlc-petg-part.jpg",
      features: [
        "Superior impact strength and chemical resistance against oils and solvents.",
        "Heat deflection temperature up to 78°C without mechanical deformation.",
        "Tolerance down to ±0.18mm with exceptional interlayer fusion strength.",
        "Ideal for automotive ducting, drone motor mounts, and outdoor enclosures.",
      ],
      featuresAr: [
        "مقاومة صدمات فائقة وثبات كيميائي ممتاز ضد الزيوت والمذيبات العضوية.",
        "مقاومة حرارية حتى 78 درجة مئوية بدون أي تشوه ميكانيكي.",
        "دقة أبعاد تصل إلى ±0.18 مم مع قوة التصاق طبقات استثنائية.",
        "مثالي لأذرع الدرون، مجاري الهواء، والقطع المعرضة لأشعة الشمس والحرارة.",
      ],
      startingPrice: "From 1.95 EGP/g",
      startingPriceAr: "يبدأ من 1.95 ج.م/جرام",
      buildTime: "Build Time: 24h - 48h",
      buildTimeAr: "مدة التنفيذ: 24 - 48 ساعة",
      quoteHref: "/quote?material=PETG",
      colorTag: "Semi-Gloss Industrial",
    },
    {
      id: "tpu",
      tabLabel: "TPU 95A (Flexible)",
      tabLabelAr: "TPU 95A (مرن ومطاطي)",
      title: "TPU 95A Elastomer (Rubber-Like)",
      titleAr: "خامة TPU 95A المرنة (شبيه المطاط)",
      subtitle: "High Elastic Memory & Vibration Damping",
      subtitleAr: "مرونة مرتدة عالية وامتصاص للاهتزازات",
      image: "/images/materials/jlc-tpu-part.jpg",
      features: [
        "Elastomeric shore 95A hardness with outstanding tear and abrasion resistance.",
        "Absorbs heavy shock impacts, drops, and dynamic mechanical vibrations.",
        "Dimensional tolerance ±0.25mm tailored for tight compression seals.",
        "Ideal for O-rings, airtight gaskets, phone protective boots, and shock feet.",
      ],
      featuresAr: [
        "صلادة مطاطية Shore 95A مع مقاومة فائقة للتآكل والتمزق المتكرر.",
        "يمتص الصدمات العنيفة، السقوط، والاهتزازات الميكانيكية المستمرة.",
        "دقة أبعاد ±0.25 مم مصممة لجوانات منع التسرب والموانع الهيدروليكية.",
        "مثالي للأختام الحلقية O-Rings، جوانات العزل، وأرجل امتصاص الاهتزاز.",
      ],
      startingPrice: "From 2.80 EGP/g",
      startingPriceAr: "يبدأ من 2.80 ج.م/جرام",
      buildTime: "Build Time: 48h",
      buildTimeAr: "مدة التنفيذ: 48 ساعة",
      quoteHref: "/quote?material=TPU",
      colorTag: "Flexible Elastomer",
    },
    {
      id: "assemblies",
      tabLabel: "Mechanical Assemblies (FDM)",
      tabLabelAr: "تجميعات ميكانيكية (FDM)",
      title: "Multi-Part Mechanical Assemblies",
      titleAr: "تجميعات ميكانيكية متعددة الأجزاء",
      subtitle: "Print-in-Place & Press-Fit Tolerances",
      subtitleAr: "تروس وتجميعات مباشرة بدقة التوافق",
      image: "/images/models/planetary-gearbox-center.jpg",
      features: [
        "Engineered for planetary gearboxes, hinges, and sliding linkages.",
        "Pre-compensated clearances down to 0.35mm for print-in-place moving parts.",
        "Reinforced load paths and multi-axis shell wall configurations.",
        "Includes hardware fitting checks for M3/M4 threaded heat-set inserts.",
      ],
      featuresAr: [
        "مصممة للتروس الكوكبية، المفصلات، والوصلات الحركية المنزلقة.",
        "خلوصات حركية مدروسة حتى 0.35 مم للطباعة المباشرة للأجزاء المتحركة.",
        "تعزيز مسارات الإجهاد وتكثيف الجدران الخارجية لتحمل عزم الدوران.",
        "فحص دقيق لمقاعد السنون النحاسية الملولبة M3 و M4.",
      ],
      startingPrice: "From 1.80 EGP/g",
      startingPriceAr: "يبدأ من 1.80 ج.م/جرام",
      buildTime: "Build Time: 24h - 72h",
      buildTimeAr: "مدة التنفيذ: 24 - 72 ساعة",
      quoteHref: "/quote",
      colorTag: "Functional Assembly",
    },
    {
      id: "precision",
      tabLabel: "High-Precision Tooling (0.12mm)",
      tabLabelAr: "تشغيل عالي الدقة (0.12 مم)",
      title: "Micro-Layer Precision Tooling",
      titleAr: "تشغيل دقيق للطبقات المجهرية 0.12 مم",
      subtitle: "Ultra-Fine Surface & Low Layer Visibility",
      subtitleAr: "سطح ناعم جداً بدون خطوط ترسيب مرئية",
      image: "/images/models/hero-gimbal-model.jpg",
      features: [
        "0.12mm micro-stepping delivering injection-molding appearance.",
        "Crisp overhang reproduction and fine text engravings.",
        "Calibrated flow-rate calibration ensuring zero surface blobs or stringing.",
        "Recommended for scale architectural models and investor showpieces.",
      ],
      featuresAr: [
        "طبقات فائقة الدقة 0.12 مم تمنح مظهر القولبة بالحقن الصناعي.",
        "إبراز أدق التفاصيل والنقوش والزوايا الحادة دون ترهل الخيوط.",
        "معايرة تدفق دقيقة تمنع أي تكتلات أو خيوط على الأسطح الخارجية.",
        "مثالي للمجسمات المعمارية الدقيقة ونماذج العرض للمستثمرين.",
      ],
      startingPrice: "From 2.20 EGP/g",
      startingPriceAr: "يبدأ من 2.20 ج.م/جرام",
      buildTime: "Build Time: 48h",
      buildTimeAr: "مدة التنفيذ: 48 ساعة",
      quoteHref: "/quote",
      colorTag: "0.12mm Ultra Fine",
    },
  ];

  const [activeTabId, setActiveTabId] = useState<string>("pla");
  const currentMaterial = materialsData.find((m) => m.id === activeTabId) || materialsData[0];

  return (
    <div className="w-full">
      {/* JLC3DP Inspired Interactive Three-Column Showcase */}
      <div className="bg-white rounded-3xl border border-[#d4e3e1] p-6 sm:p-10 shadow-xs">
        
        {/* Master Heading from JLC3DP */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d8faf5] border border-[#a8ede4] text-xs font-mono font-semibold text-[#007065] mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00dbc6]" />
            <span>{isRtl ? "خدمة حسب الطلب" : "ON DEMAND ADDITIVE FABRICATION"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0e2628] tracking-tight">
            {isRtl ? "طباعة ثلاثية الأبعاد حسب الطلب" : "3D Printing on Demand"}
          </h2>
          <p className="text-sm text-[#53696b] mt-1 max-w-xl">
            {isRtl
              ? "اختر الخامة أو التكنولوجيا المناسبة لمعاينة القطع المطبوعة وتفاصيل الأسعار والمواصفات الميكانيكية."
              : "Select a polymer technology to preview real printed mechanical parts, dimensional tolerances, and instant unit rates."}
          </p>
        </div>

        {/* 3-Column Layout exactly like JLC3DP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Vertical Tabs Navigation (Left) */}
          <div className="lg:col-span-3 space-y-1">
            <div className="text-[11px] font-mono uppercase font-bold text-[#81989a] mb-2 px-3">
              {isRtl ? "الخامات والتقنيات" : "Materials & Tech"}
            </div>
            
            <div className="flex flex-col space-y-1">
              {materialsData.map((item) => {
                const isActive = activeTabId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTabId(item.id)}
                    className={`group text-left px-4 py-3 rounded-xl transition-all relative flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "text-[#0e2628] font-bold bg-[#f2faf9]"
                        : "text-[#53696b] hover:text-[#0e2628] hover:bg-[#fafefd]"
                    }`}
                  >
                    {/* Active Indicator Underline / Side Bar */}
                    {isActive && (
                      <span
                        className={`absolute inset-y-2 w-1 bg-[#009e8f] rounded-full transition-all ${
                          isRtl ? "right-1" : "left-1"
                        }`}
                      />
                    )}

                    <span className="text-xs sm:text-sm pl-2">
                      {isRtl ? item.tabLabelAr : item.tabLabel}
                    </span>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? "text-[#009e8f] translate-x-0.5"
                          : "text-transparent group-hover:text-[#81989a]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Link to Quoting */}
            <div className="pt-6 border-t border-[#d4e3e1]/60 mt-4 px-3">
              <Link
                href="/quote"
                className="text-xs font-semibold text-[#009e8f] hover:text-[#007065] flex items-center gap-1.5 transition-colors"
              >
                <span>{isRtl ? "حاسبة التسعير السريعة" : "Custom File Slicer & Quote"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>

          {/* Column 2: Large Showcase Image (Center) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full aspect-4/3 sm:aspect-square max-w-md rounded-2xl overflow-hidden bg-[#fafefd] border border-[#d4e3e1]/80 shadow-2xs group flex items-center justify-center p-4">
              
              {/* Soft background radial ambient light */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00dbc6]/10 via-[#d8faf5]/15 to-transparent pointer-events-none" />

              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  key={currentMaterial.id}
                  src={currentMaterial.image}
                  alt={currentMaterial.title}
                  fill
                  className="object-contain transition-all duration-500 transform group-hover:scale-105"
                  priority
                />
              </div>

              {/* Material Pill Tag */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#d4e3e1] text-[11px] font-mono font-bold text-[#0e2628] shadow-xs">
                {currentMaterial.colorTag}
              </div>

              {/* Dimension / Visual Guide Pill */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-[#0e2628]/85 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5 shadow-sm">
                <Rotate3d className="w-3.5 h-3.5 text-[#00dbc6]" />
                <span>100% Real FDM Sample</span>
              </div>
            </div>
          </div>

          {/* Column 3: Specs & CTA Card (Right) */}
          <div className="lg:col-span-4">
            <div className="bg-[#fafefd] border border-[#d4e3e1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Tech Title */}
              <div>
                <h3 className="text-xl font-black text-[#0e2628]">
                  {isRtl ? currentMaterial.titleAr : currentMaterial.title}
                </h3>
                <p className="text-xs text-[#53696b] font-medium mt-0.5">
                  {isRtl ? currentMaterial.subtitleAr : currentMaterial.subtitle}
                </p>
              </div>

              {/* Bullet Points Container (JLC3DP Gray-Tinted Box) */}
              <div className="bg-white rounded-xl p-4 border border-[#e5efee] space-y-2.5">
                {(isRtl ? currentMaterial.featuresAr : currentMaterial.features).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#243a3c] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009e8f] shrink-0 mt-1.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Pricing & Build Time Row (From $0.30 Build Time: 2 days style) */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#81989a] block">
                    {isRtl ? "سعر البداية" : "Starting Rate"}
                  </span>
                  <span className="text-base font-black text-[#ea580c] font-sans">
                    {isRtl ? currentMaterial.startingPriceAr : currentMaterial.startingPrice}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#81989a] block">
                    {isRtl ? "زمن التنفيذ" : "Turnaround"}
                  </span>
                  <span className="text-xs font-bold text-[#0e2628]">
                    {isRtl ? currentMaterial.buildTimeAr : currentMaterial.buildTime}
                  </span>
                </div>
              </div>

              {/* Action Buttons (JLC3DP Solid Blue/Teal + Outline) */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href={currentMaterial.quoteHref}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-101 text-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>{isRtl ? "اطلب تسعيرك الآن" : "Quote Now"}</span>
                </Link>

                <Link
                  href="/quote"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#0066cc] hover:text-[#0052a3] bg-white border border-[#0066cc]/30 hover:border-[#0066cc] flex items-center justify-center gap-2 transition-all text-center"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {isRtl
                      ? `المواصفات الهندسية لـ ${currentMaterial.tabLabelAr.split(" ")[0]}`
                      : `${currentMaterial.tabLabel.split(" ")[0]} Technical Guide`}
                  </span>
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
