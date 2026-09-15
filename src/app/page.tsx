"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import ReviewsSection from "@/components/home/ReviewsSection";
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
} from "lucide-react";

export default function HomePage() {
  const { t, isRtl } = useLanguage();

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
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION & LIVE ESTIMATOR */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden bg-radial from-red-50/50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-mono font-bold text-red-700 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span>{t.hero.badge}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] font-mono">
                {t.hero.titleStart}{" "}
                <span className="text-red-600">{t.hero.titleHighlight}</span>
              </h1>

              {/* Punchy Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/quote"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 flex items-center gap-2.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{t.hero.ctaQuote}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <Link
                  href="/catalog"
                  className="px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>{t.hero.ctaCatalog}</span>
                </Link>
              </div>

              {/* Stat Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg font-mono">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">{t.hero.stat1Value}</div>
                  <div className="text-[11px] text-slate-500">{t.hero.stat1Label}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-red-600">{t.hero.stat2Value}</div>
                  <div className="text-[11px] text-slate-500">{t.hero.stat2Label}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">{t.hero.stat3Value}</div>
                  <div className="text-[11px] text-slate-500">{t.hero.stat3Label}</div>
                </div>
              </div>
            </div>

            {/* Right: Live EGP Cost Estimator Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{t.estimator.title}</h3>
                      <p className="text-[11px] text-slate-500">{t.estimator.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    EGP Rates
                  </span>
                </div>

                {/* Filament Selector Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {t.estimator.materialLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    {(["PLA", "PETG", "TPU"] as const).map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setEstMaterial(mat)}
                        className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                          estMaterial === mat
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gram Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 font-medium">{t.estimator.weightLabel}:</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
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
                    className="w-full accent-red-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>5g</span>
                    <span>{currentRate.gramRate.toFixed(2)} EGP / g</span>
                    <span>500g</span>
                  </div>
                </div>

                {/* Minutes Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 font-medium">{t.estimator.durationLabel}:</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
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
                    className="w-full accent-red-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>15m</span>
                    <span>{currentRate.minRate.toFixed(2)} EGP / min</span>
                    <span>12h</span>
                  </div>
                </div>

                {/* Calculation Breakdown & Total Price */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Material ({estGrams}g × {currentRate.gramRate}):</span>
                    <span>EGP {gramCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Nozzle Runtime ({estMinutes}m × {currentRate.minRate}):</span>
                    <span>EGP {minuteCost.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>{t.estimator.setupFeeLabel}:</span>
                    <span>EGP {currentRate.setup}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-base font-bold text-slate-900">
                    <span>{t.estimator.estimatedTotal}:</span>
                    <span className="text-2xl text-red-600 font-black">
                      EGP {estimatedTotal}
                    </span>
                  </div>
                </div>

                {/* Launch Exact Quote Button */}
                <Link
                  href={`/quote?mat=${estMaterial}`}
                  className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <UploadCloud className="w-4 h-4 text-red-400" />
                  <span>{t.estimator.launchFullQuote}</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY KHALID3D — SERVICE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.features.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {t.features.title}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{t.features.f1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.features.f1Desc}</p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{t.features.f2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.features.f2Desc}</p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-red-300 hover:shadow-md transition-all space-y-4">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">{t.features.f3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.features.f3Desc}</p>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>{t.process.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {t.process.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="text-3xl font-black text-red-600 font-mono">{t.process.s1Number}</div>
            <h3 className="font-bold text-lg text-slate-900">{t.process.s1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.process.s1Desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="text-3xl font-black text-red-600 font-mono">{t.process.s2Number}</div>
            <h3 className="font-bold text-lg text-slate-900">{t.process.s2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.process.s2Desc}</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 relative">
            <div className="text-3xl font-black text-red-600 font-mono">{t.process.s3Number}</div>
            <h3 className="font-bold text-lg text-slate-900">{t.process.s3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.process.s3Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. CALIBRATED FDM MATERIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-mono font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.materials.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
            {t.materials.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PLA */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between hover:border-red-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-mono text-slate-500">1.24 g/cm³</span>
              </div>
              <span className="inline-block text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                Standard Rigid
              </span>
              <h3 className="font-bold text-xl text-slate-900">{t.materials.plaTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.materials.plaDesc}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">1.50 EGP / gram</span>
              <Link href="/quote?mat=PLA" className="font-bold text-red-600 hover:underline">
                {t.materials.selectMaterial} →
              </Link>
            </div>
          </div>

          {/* PETG */}
          <div className="p-8 rounded-3xl bg-white border border-red-200 shadow-md space-y-5 flex flex-col justify-between hover:border-red-400 transition-all relative">
            <span className="absolute -top-3 right-6 text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
              Engineers' Choice
            </span>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-mono text-slate-500">1.27 g/cm³</span>
              </div>
              <span className="inline-block text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg">
                Heat & Impact
              </span>
              <h3 className="font-bold text-xl text-slate-900">{t.materials.petgTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.materials.petgDesc}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">1.95 EGP / gram</span>
              <Link href="/quote?mat=PETG" className="font-bold text-red-600 hover:underline">
                {t.materials.selectMaterial} →
              </Link>
            </div>
          </div>

          {/* TPU */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between hover:border-red-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-mono text-slate-500">1.21 g/cm³</span>
              </div>
              <span className="inline-block text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                Elastomer
              </span>
              <h3 className="font-bold text-xl text-slate-900">{t.materials.tpuTitle}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.materials.tpuDesc}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500">2.80 EGP / gram</span>
              <Link href="/quote?mat=TPU" className="font-bold text-red-600 hover:underline">
                {t.materials.selectMaterial} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROOF-OF-PRECISION STATS BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 text-white px-8 py-10 sm:px-14 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 font-mono text-center sm:text-left">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-white">{t.hero.stat1Value}</div>
              <div className="text-xs text-slate-400 mt-2 tracking-tight">{t.hero.stat1Label}</div>
            </div>
            <div className="sm:border-x sm:border-slate-800 sm:px-6">
              <div className="text-4xl sm:text-5xl font-black text-red-500">{t.hero.stat2Value}</div>
              <div className="text-xs text-slate-400 mt-2 tracking-tight">{t.hero.stat2Label}</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-white">{t.hero.stat3Value}</div>
              <div className="text-xs text-slate-400 mt-2 tracking-tight">{t.hero.stat3Label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED REVIEWS SECTION */}
      <ReviewsSection />

      {/* 7. BOTTOM SERVICE GUARANTEE CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-red-400 text-xs font-mono font-bold">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Calibrated Additive Manufacturing Lab</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-mono">
              Ready to Manufacture Your 3D Parts?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your STL file to test our instant geometry engine. Real-time pricing per gram and per minute with courier delivery anywhere in Egypt.
            </p>
          </div>

          <Link
            href="/quote"
            className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 shadow-lg transition-transform hover:scale-105 shrink-0 flex items-center gap-2 font-mono"
          >
            <UploadCloud className="w-4 h-4 text-red-600" />
            <span>{t.hero.ctaQuote}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
