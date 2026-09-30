"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Tag,
  Layers,
  Video,
} from "lucide-react";

interface SlideData {
  id: string;
  badge: { en: string; ar: string };
  badgeColor: string;
  titlePrefix: { en: string; ar: string };
  titleHighlight: { en: string; ar: string };
  titleSuffix: { en: string; ar: string };
  bullets: Array<{ en: string; ar: string }>;
  ctaText: { en: string; ar: string };
  ctaHref: string;
  secondaryText: { en: string; ar: string };
  secondaryHref: string;
  type: "image" | "video";
  mediaSrc: string;
  tagline: { en: string; ar: string };
}

export default function JLC3DPHeroCarousel() {
  const { isRtl } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: SlideData[] = [
    {
      id: "promotional-coupons",
      badge: { en: "Exclusive Launch Offer", ar: "عرض الإطلاق الحصري" },
      badgeColor: "bg-blue-100 text-[#0066cc] border-blue-200",
      titlePrefix: { en: "Unlock Up to ", ar: "وفر حتى " },
      titleHighlight: { en: "300 EGP ", ar: "300 ج.م " },
      titleSuffix: { en: "3D Printing Discounts", ar: "على طلبات الطباعة ثلاثية الأبعاد" },
      bullets: [
        {
          en: "Multiple coupon discounts for PLA, PETG, and TPU 3D printed components.",
          ar: "خصومات متعددة على أجزاء PLA و PETG و TPU المطبوعة بالكامل.",
        },
        {
          en: "Open to all engineers, startups, student teams, and creators across Egypt.",
          ar: "متاح لجميع المهندسين، الشركات الناشئة، ومشاريع التخرج في مصر.",
        },
        {
          en: "Instant access after uploading CAD geometry. Verified 24-48h dispatch.",
          ar: "خصم فوري مطبق تلقائياً عند رفع ملف التصميم. شحن سريع خلال 24-48 ساعة.",
        },
      ],
      ctaText: { en: "Claim Coupons & Quote Now", ar: "احصل على الخصم واطلب الآن" },
      ctaHref: "/quote",
      secondaryText: { en: "Explore Polymers", ar: "استكشف الخامات" },
      secondaryHref: "#materials",
      type: "image",
      mediaSrc: "/images/banners/banner-2.png",
      tagline: { en: "Khalid3D Verified Precision", ar: "دقة وجودة معتمدة من Khalid3D" },
    },
    {
      id: "video-timelapse",
      badge: { en: "Live Additive Workshop", ar: "بث من ورشة التصنيع" },
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      titlePrefix: { en: "Watch Micro-Layer ", ar: "شاهد دقة الترسيب " },
      titleHighlight: { en: "0.12mm ", ar: "0.12 مم " },
      titleSuffix: { en: "Execution in Real Time", ar: "في الوقت الفعلي لطابعاتنا" },
      bullets: [
        {
          en: "Real-time FDM toolpathing filmed inside our calibrated Cairo workshop.",
          ar: "مسار حركة رؤوس الطباعة مصور مباشرة من معملنا الصناعي في القاهرة.",
        },
        {
          en: "Continuous thermal chamber management preventing warping and layer separation.",
          ar: "تحكم حراري مستمر يمنع انكماش القطع أو انفصال الطبقات الميكانيكية.",
        },
        {
          en: "Direct pricing formula: Filament grams + Machine minutes with zero hidden fees.",
          ar: "معادلة تسعير مباشرة بالجرام ودقائق التشغيل بدون أي تكاليف خفية.",
        },
      ],
      ctaText: { en: "Upload 3D CAD & Get Quote", ar: "ارفع ملف 3D واحصل على السعر" },
      ctaHref: "/quote",
      secondaryText: { en: "See Calibration Specs", ar: "مواصفات المعايرة" },
      secondaryHref: "#overview",
      type: "video",
      mediaSrc: "/videos/fdm-print-timelapse.mp4",
      tagline: { en: "Live FDM Production Timelapse", ar: "تسجيل حي للطباعة الصناعية" },
    },
    {
      id: "materials-lineup",
      badge: { en: "Industrial Material Range", ar: "تشكيلة البوليمرات الهندسية" },
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      titlePrefix: { en: "High-Performance ", ar: "بوليمرات عالية الأداء " },
      titleHighlight: { en: "PLA • PETG • TPU ", ar: "PLA • PETG • TPU " },
      titleSuffix: { en: "For Every Application", ar: "لكافة الاستخدامات" },
      bullets: [
        {
          en: "PLA Tough: High stiffness for architectural mockups and snap-fit enclosures.",
          ar: "PLA Tough: صلابة عالية للنماذج المعمارية وهياكل التجميع المحكم.",
        },
        {
          en: "PETG Industrial: 78°C heat resistance & chemical durability for outdoor brackets.",
          ar: "PETG Industrial: مقاومة حرارية 78°C ومقاومة كيميائية لأجزاء السيارات.",
        },
        {
          en: "TPU 95A: Rubber-like elastomeric bumpers, gaskets, and vibration dampeners.",
          ar: "TPU 95A: مرونة مطاطية فائقة لامتصاص الصدمات والاهتزازات والجوانات.",
        },
      ],
      ctaText: { en: "Compare Specs & Order", ar: "قارن المواصفات واطلب" },
      ctaHref: "/quote",
      secondaryText: { en: "Download 3D Models", ar: "تصفح النماذج المجانية" },
      secondaryHref: "/catalog",
      type: "image",
      mediaSrc: "/images/banners/banner-1.png",
      tagline: { en: "3 Specialized Polymer Classes", ar: "ثلاث فئات بوليمرات معتمدة" },
    },
  ];

  // Auto-advance carousel every 7 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    autoplayTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, slides.length]);

  // Sync video play/pause when sliding to/from video slide
  useEffect(() => {
    const active = slides[currentSlide];
    if (active.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  }, [currentSlide]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isVideoMuted;
    setIsVideoMuted(!isVideoMuted);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-gradient-to-r from-[#eef5fc] via-[#f1f7fd] to-[#f8fbfe] border-b border-[#e2e8f0]"
    >
      {/* Soft Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-threads-grid pointer-events-none opacity-40" />

      {/* Main Slide Presentation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Headlines & Bullet Points */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold shadow-2xs backdrop-blur-sm transition-all animate-in fade-in duration-300">
              <span className={`w-2 h-2 rounded-full ${active.badgeColor.split(" ")[0]} animate-pulse`} />
              <span className={active.badgeColor.split(" ")[1]}>
                {isRtl ? active.badge.ar : active.badge.en}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0f172a] leading-[1.12]">
              {isRtl ? (
                <>
                  <span>{active.titlePrefix.ar}</span>
                  <span className="text-[#0066cc] underline decoration-[#00dbc6] decoration-4 underline-offset-8">
                    {active.titleHighlight.ar}
                  </span>
                  <span>{active.titleSuffix.ar}</span>
                </>
              ) : (
                <>
                  <span>{active.titlePrefix.en}</span>
                  <span className="text-[#0066cc] underline decoration-[#00dbc6] decoration-4 underline-offset-8">
                    {active.titleHighlight.en}
                  </span>
                  <br className="hidden sm:inline" />
                  <span>{active.titleSuffix.en}</span>
                </>
              )}
            </h1>

            {/* Bullets List (JLC3DP Style) */}
            <div className="space-y-2.5 pt-1">
              {active.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0 mt-2" />
                  <span>{isRtl ? bullet.ar : bullet.en}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href={active.ctaHref}
                className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] shadow-md shadow-[#0066cc]/25 transition-all hover:scale-102 flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{isRtl ? active.ctaText.ar : active.ctaText.en}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <Link
                href={active.secondaryHref}
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-[#0066cc] bg-white border border-[#0066cc]/30 hover:border-[#0066cc] hover:bg-blue-50/50 transition-all shadow-2xs"
              >
                <span>{isRtl ? active.secondaryText.ar : active.secondaryText.en}</span>
              </Link>
            </div>

            {/* Trust Micro-Row */}
            <div className="pt-2 flex items-center gap-6 text-[11px] text-[#64748b] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>±0.15mm Tolerance</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>24-48h Egyptian Dispatch</span>
              </span>
            </div>

          </div>

          {/* Right Column: Dynamic Media (Banners or Video) */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-3xl overflow-hidden shadow-xl border border-white/80 bg-white group">
              
              {active.type === "video" ? (
                /* Dynamic Looping Video Player */
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={active.mediaSrc}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4 opacity-90 transition-opacity">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleVideoPlayback}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                        title={isVideoPlaying ? "Pause Video" : "Play Video"}
                      >
                        {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={toggleVideoMute}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
                        title={isVideoMuted ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="text-[11px] font-mono font-bold text-white px-2.5 py-0.5 rounded-full bg-emerald-500/80 backdrop-blur-md">
                        LIVE FDM TIMELAPSE
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-300">
                      Cairo Lab • 0.12mm Micro-Step
                    </span>
                  </div>
                </div>
              ) : (
                /* High-Resolution Dynamic Banner Image */
                <div className="relative w-full h-full">
                  <Image
                    key={active.id}
                    src={active.mediaSrc}
                    alt={active.titleSuffix.en}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  
                  {/* Subtle top tag */}
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-mono font-bold text-slate-900 shadow-xs">
                    {isRtl ? active.tagline.ar : active.tagline.en}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Carousel Bottom Indicator Progress Bars (JLC3DP Signature Style) */}
        <div className="mt-8 pt-4 flex items-center justify-between">
          
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-[#0066cc] border border-slate-200 shadow-2xs transition-all hover:scale-105"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dynamic Horizontal Dash Progress Indicators */}
          <div className="flex items-center gap-2.5">
            {slides.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`group relative h-2 transition-all rounded-full overflow-hidden ${
                    isActive ? "w-16 bg-[#0066cc]" : "w-8 bg-slate-300 hover:bg-slate-400"
                  }`}
                  title={`Jump to slide ${idx + 1}`}
                >
                  {/* Animated filling bar on active slide */}
                  {isActive && !isPaused && (
                    <span className="absolute inset-0 bg-[#00dbc6] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-[#0066cc] border border-slate-200 shadow-2xs transition-all hover:scale-105"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>
    </div>
  );
}
