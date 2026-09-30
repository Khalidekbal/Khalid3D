"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  MessageSquare,
  X,
  HelpCircle,
  Cpu,
  Layers,
  Calculator,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  Send,
  Minimize2,
  Maximize2,
  ChevronRight,
  Bot,
  UploadCloud,
} from "lucide-react";

export default function ClientAssistant() {
  const { isRtl, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"advisor" | "pricing" | "dfm" | "contact">("advisor");

  // Material Advisor state
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  // Mini calculator state
  const [calcGrams, setCalcGrams] = useState(40);
  const [calcMins, setCalcMins] = useState(90);
  const [calcMat, setCalcMat] = useState<"PLA" | "PETG" | "TPU">("PLA");

  const matRates = {
    PLA: { name: "PLA Tough", gram: 1.5, min: 0.8, setup: 20 },
    PETG: { name: "PETG Industrial", gram: 1.95, min: 0.95, setup: 25 },
    TPU: { name: "TPU 95A Flexible", gram: 2.8, min: 1.3, setup: 35 },
  };

  const currentCalc = matRates[calcMat];
  const estTotal = Math.round(calcGrams * currentCalc.gram + calcMins * currentCalc.min + currentCalc.setup);

  const applicationOptions = [
    {
      id: "visual",
      titleEn: "Architectural / Visual Prototype",
      titleAr: "مجسم معماري / نموذج أولي شكلي",
      descEn: "Needs crisp surface finish, fine detail, and high rigidity.",
      descAr: "يحتاج سطح ناعم جداً، تفاصيل دقيقة، وصلابة عالية.",
      recommended: "PLA Tough",
      colorTag: "bg-emerald-100 text-emerald-800",
      quoteHref: "/quote?material=PLA",
    },
    {
      id: "functional",
      titleEn: "Mechanical Part / Heat & Outdoor",
      titleAr: "جزء ميكانيكي / مقاوم للحرارة والشمس",
      descEn: "Exposed to sun, car engines, chemicals, or drops up to 78°C.",
      descAr: "معرض لحرارة حتى 78 درجة، زيوت، شمس، أو إجهاد ميكانيكي.",
      recommended: "PETG Industrial",
      colorTag: "bg-teal-100 text-teal-800",
      quoteHref: "/quote?material=PETG",
    },
    {
      id: "flexible",
      titleEn: "Gasket / Bumper / Flexible Cover",
      titleAr: "جوان مانع تسريب / مصد صدمات مرن",
      descEn: "Rubber-like elastic elongation, shock absorption, bending.",
      descAr: "مرونة مطاطية عالية، امتصاص اهتزازات، ومقاومة للصدمات.",
      recommended: "TPU 95A Flexible",
      colorTag: "bg-purple-100 text-purple-800",
      quoteHref: "/quote?material=TPU",
    },
  ];

  return (
    <>
      {/* Floating Assistant Trigger Avatar (Bottom Right) */}
      <div className={`fixed bottom-6 z-50 flex items-center gap-3 ${isRtl ? "left-6" : "right-6"}`}>
        
        {/* Subtle Welcome Bubble (when closed) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 text-slate-800 border border-slate-200 shadow-lg text-xs font-semibold backdrop-blur-md hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
            <span>{isRtl ? "مساعد خالد 3D الهندسي" : "Need help? Ask Khalid3D"}</span>
          </button>
        )}

        {/* Circular Avatar Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#0066cc] to-[#00dbc6] p-0.5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer group"
          title="Khalid3D Engineering Assistant"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute inset-0 rounded-full bg-[#00dbc6] animate-ping opacity-25 pointer-events-none" />

          {/* Active online green dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10" />

          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {isOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Bot className="w-7 h-7 text-[#0066cc]" />
            )}
          </div>
        </button>
      </div>

      {/* Assistant Modal / Interactive Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-24 z-50 w-[92vw] sm:w-[420px] max-h-[82vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 ${
            isRtl ? "left-4 sm:left-6" : "right-4 sm:right-6"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0066cc] to-[#009e8f] text-white p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">
                  {isRtl ? "مساعد خالد 3D الهندسي" : "Khalid3D Engineering Assistant"}
                </h3>
                <p className="text-[11px] text-cyan-100 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isRtl ? "متصل لمساعدتك في طلبك" : "Online • Ready to guide your order"}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab("advisor")}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                activeTab === "advisor"
                  ? "text-[#0066cc] border-b-2 border-[#0066cc] bg-white font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              {isRtl ? "اختيار الخامة" : "Material"}
            </button>
            <button
              onClick={() => setActiveTab("pricing")}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                activeTab === "pricing"
                  ? "text-[#0066cc] border-b-2 border-[#0066cc] bg-white font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              {isRtl ? "حساب السعر" : "Estimator"}
            </button>
            <button
              onClick={() => setActiveTab("dfm")}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                activeTab === "dfm"
                  ? "text-[#0066cc] border-b-2 border-[#0066cc] bg-white font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              {isRtl ? "نصائح CAD" : "CAD Tips"}
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                activeTab === "contact"
                  ? "text-[#0066cc] border-b-2 border-[#0066cc] bg-white font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              {isRtl ? "مهندس مختص" : "Engineer"}
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4.5 overflow-y-auto space-y-4 max-h-[480px]">
            
            {/* 1. Material Advisor Quiz */}
            {activeTab === "advisor" && (
              <div className="space-y-3.5">
                <div className="text-xs text-slate-600">
                  {isRtl
                    ? "اختر نوع الاستخدام وسيرشح لك المساعد الخامة الهندسية الأنسب لتطبيقك:"
                    : "Select your project requirement and we will recommend the optimal engineering filament:"}
                </div>

                <div className="space-y-2">
                  {applicationOptions.map((opt) => {
                    const isSelected = selectedApplication === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedApplication(opt.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#0066cc] bg-blue-50/50 ring-1 ring-[#0066cc]"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">
                            {isRtl ? opt.titleAr : opt.titleEn}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${opt.colorTag}`}>
                            {opt.recommended}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {isRtl ? opt.descAr : opt.descEn}
                        </p>

                        {isSelected && (
                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#0066cc]">
                              {isRtl ? "الخامة الموصى بها:" : "Recommended:"} {opt.recommended}
                            </span>
                            <Link
                              href={opt.quoteHref}
                              onClick={() => setIsOpen(false)}
                              className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#0066cc] text-white hover:bg-[#0052a3] flex items-center gap-1 transition-all"
                            >
                              <span>{isRtl ? "اطلب تسعير بها" : "Quote This"}</span>
                              {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Price Estimator Guide */}
            {activeTab === "pricing" && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900">
                    {isRtl ? "معادلة التسعير الشفافة (EGP):" : "Transparent Slicing Formula (EGP):"}
                  </div>
                  <p className="text-[11px]">
                    (Grams × Material Rate) + (Machine Minutes × Rate) + Base Setup = Total EGP
                  </p>
                </div>

                {/* Material Switcher */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {isRtl ? "الخامة:" : "Material:"}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["PLA", "PETG", "TPU"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setCalcMat(m)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          calcMat === m
                            ? "bg-[#0066cc] text-white border-[#0066cc]"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grams Input */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span>{isRtl ? "الوزن التقديري:" : "Weight (Grams):"}</span>
                    <span className="font-mono text-[#0066cc]">{calcGrams}g</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={calcGrams}
                    onChange={(e) => setCalcGrams(Number(e.target.value))}
                    className="w-full accent-[#0066cc] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Minutes Input */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span>{isRtl ? "مدة الطباعة:" : "Print Duration:"}</span>
                    <span className="font-mono text-[#0066cc]">{calcMins} mins</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="480"
                    step="10"
                    value={calcMins}
                    onChange={(e) => setCalcMins(Number(e.target.value))}
                    className="w-full accent-[#0066cc] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Estimated Price Box */}
                <div className="p-3.5 rounded-2xl bg-[#0066cc]/10 border border-[#0066cc]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">
                      {isRtl ? "السعر التقديري الفوري" : "Estimated Total"}
                    </span>
                    <span className="text-xl font-black text-[#0066cc] font-mono">
                      ~{estTotal} EGP
                    </span>
                  </div>
                  <Link
                    href={`/quote?material=${calcMat}`}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0066cc] text-white hover:bg-[#0052a3] transition-colors"
                  >
                    {isRtl ? "ارفع ملفك الآن" : "Upload File"}
                  </Link>
                </div>
              </div>
            )}

            {/* 3. CAD Design & Slicing Tips */}
            {activeTab === "dfm" && (
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? "صيغ الملفات المدعومة" : "Supported Formats"}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isRtl
                      ? "نقبل صيغ STL و STEP و OBJ و 3MF. يُفضل استخدام STEP للتجميعات الميكانيكية."
                      : "We accept .STL, .STEP, .3MF, and .OBJ. STEP format is recommended for high-tolerance mechanical fits."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? "الحد الأدنى لسماكة الجدار" : "Minimum Wall Thickness"}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isRtl
                      ? "يجب ألا تقل سماكة الجدران عن 0.8 مم لـ PLA/PETG، و 1.2 مم لـ TPU لضمان المتانة ومنع الانحناء."
                      : "Minimum recommended wall thickness is 0.8mm for PLA/PETG, and 1.2mm for flexible TPU."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? "دقة الأبعاد والتفاوتات" : "Tolerances & Clearances"}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isRtl
                      ? "نضمن دقة أبعاد ±0.15 مم. للأجزاء المتحركة (Print-in-Place)، يرجى ترك خلوص 0.35 مم."
                      : "Guaranteed dimensional tolerance of ±0.15mm. For moving print-in-place hinges, maintain a 0.35mm clearance."}
                  </p>
                </div>
              </div>
            )}

            {/* 4. Contact Human Engineer */}
            {activeTab === "contact" && (
              <div className="space-y-3.5 text-xs text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <PhoneCall className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {isRtl ? "تحدث مع مهندس التصنيع مباشرة" : "Speak with an Additive Engineer"}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    {isRtl
                      ? "هل لديك استفسار عن مشروع تخرج، إنتاج كميات، أو تركيب سنون نحاسية؟ فريقنا في معمل القاهرة جاهز لمساعدتك."
                      : "Have questions regarding bulk batches, graduation projects, or threaded brass inserts? Our Cairo engineering team is ready to assist."}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href="https://wa.me/201000000000?text=Hello%20Khalid3D,%20I%20need%20assistance%20with%20a%203D%20printing%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    <span>{isRtl ? "محادثة فورية عبر واتساب" : "Chat on WhatsApp"}</span>
                  </a>

                  <Link
                    href="/quote"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#0066cc] bg-blue-50 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isRtl ? "الانتقال لصفحة التسعير" : "Go to Quoting Tool"}</span>
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Footer quick action */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cairo Additive Lab • 24/7 Support</span>
            <Link
              href="/quote"
              onClick={() => setIsOpen(false)}
              className="font-bold text-[#0066cc] hover:underline"
            >
              {isRtl ? "طلب تسعير >" : "Order Now >"}
            </Link>
          </div>

        </div>
      )}
    </>
  );
}
