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
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

interface SlideData {
  id: string;
  badge: { en: string; ar: string };
  titlePrefix: { en: string; ar: string };
  titleHighlight: { en: string; ar: string };
  titleSuffix: { en: string; ar: string };
  bullets: Array<{ en: string; ar: string }>;
  ctaText: { en: string; ar: string };
  ctaHref: string;
  type: "image" | "video";
  mediaSrc: string;
  tagline: { en: string; ar: string };
  bgColor: string;
}

export default function JLC3DPHeroCarousel() {
  const { isRtl } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Minimal, crisp text matching JLC3DP screenshot style
  const slides: SlideData[] = [
    {
      id: "coupons",
      badge: { en: "Limited Offer", ar: "عرض لفترة محدودة" },
      titlePrefix: { en: "Unlock Up to ", ar: "وفر حتى " },
      titleHighlight: { en: "300 EGP ", ar: "300 ج.م " },
      titleSuffix: { en: "3D Printing Coupons", ar: "على طلبات الطباعة" },
      bullets: [
        {
          en: "Discounts for PLA, PETG & TPU printed parts.",
          ar: "خصومات فورية على قطع PLA و PETG و TPU.",
        },
        {
          en: "Open to all users across Egypt. Instant access.",
          ar: "متاح لجميع العملاء في مصر. تطبيق فوري.",
        },
      ],
      ctaText: { en: "Claim Coupons Now", ar: "احصل على الخصم الآن" },
      ctaHref: "/quote",
      type: "image",
      mediaSrc: "/images/banners/banner-2.png",
      tagline: { en: "Khalid3D Precision Vouchers", ar: "قسائم خصم Khalid3D" },
      bgColor: "from-[#e4f0fc] via-[#edf5fd] to-[#f5f9fe]",
    },
    {
      id: "video-timelapse",
      badge: { en: "Live Additive Workshop", ar: "بث مباشر من المعمل" },
      titlePrefix: { en: "Precision ", ar: "دقة طباعة " },
      titleHighlight: { en: "0.12mm ", ar: "0.12 مم " },
      titleSuffix: { en: "FDM Printing In Action", ar: "بالترسيب الميكانيكي" },
      bullets: [
        {
          en: "Filmed live in our Cairo production lab.",
          ar: "مصور مباشرة من معملنا في القاهرة.",
        },
        {
          en: "Transparent pricing: Grams + Machine minutes.",
          ar: "تسعير شفاف: سعر الجرام + دقائق التشغيل.",
        },
      ],
      ctaText: { en: "Get Instant Quote", ar: "احسب السعر الآن" },
      ctaHref: "/quote",
      type: "video",
      mediaSrc: "/videos/fdm-print-timelapse.mp4",
      tagline: { en: "Live FDM Production Timelapse", ar: "تسجيل حي لماكينات الطباعة" },
      bgColor: "from-[#0f172a] via-[#1e293b] to-[#0f172a]",
    },
    {
      id: "materials",
      badge: { en: "Engineering Range", ar: "خامات هندسية" },
      titlePrefix: { en: "Industrial ", ar: "بوليمرات صناعية " },
      titleHighlight: { en: "PLA • PETG • TPU", ar: "PLA • PETG • TPU" },
      titleSuffix: { en: "", ar: "" },
      bullets: [
        {
          en: "Guaranteed ±0.15mm mechanical tolerances.",
          ar: "دقة أبعاد ميكانيكية مضمونة ±0.15 مم.",
        },
        {
          en: "Fast 24-48h dispatch across all governorates.",
          ar: "شحن سريع خلال 24-48 ساعة لجميع المحافظات.",
        },
      ],
      ctaText: { en: "Order Parts Now", ar: "اطلب أجزاءك الآن" },
      ctaHref: "/quote",
      type: "image",
      mediaSrc: "/images/banners/banner-1.png",
      tagline: { en: "Virgin Engineering Polymers", ar: "خامات بوليمر نقية معتمدة" },
      bgColor: "from-[#eef3f9] via-[#f4f7fb] to-[#ffffff]",
    },
  ];

  // Auto-advance every 7s
  useEffect(() => {
    if (isPaused) return;
    autoplayTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused, slides.length]);

  // Sync video play state
  useEffect(() => {
    const active = slides[currentSlide];
    if (active.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  }, [currentSlide]);

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-[#edf5fc] border-b border-[#e2e8f0] select-none"
    >
      {/* Dynamic Slides Viewport */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{
          transform: isRtl
            ? `translateX(${currentSlide * 100}%)`
            : `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {slides.map((slide, idx) => {
          const isDark = slide.type === "video";

          return (
            <div
              key={slide.id}
              className={`w-full h-full shrink-0 relative bg-gradient-to-r ${slide.bgColor} flex items-center overflow-hidden`}
            >
              {/* Soft ambient grid for engineering aesthetic */}
              <div className="absolute inset-0 bg-threads-grid pointer-events-none opacity-25" />

              {/* FULL-SCREEN MEDIA BACKDROP & CONTAINER */}
              {slide.type === "video" ? (
                /* Full-Height Cinematic Video Presentation */
                <div className="absolute inset-0 w-full h-full z-0">
                  <video
                    ref={idx === currentSlide ? videoRef : undefined}
                    src={slide.mediaSrc}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Left-to-Right Dark Gradient for Crisp Text Legibility */}
                  <div
                    className={`absolute inset-0 ${
                      isRtl
                        ? "bg-gradient-to-l from-slate-950/90 via-slate-950/70 to-slate-950/20"
                        : "bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/20"
                    }`}
                  />

                  {/* Video Micro Controls */}
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                    <button
                      onClick={toggleVideoPlayback}
                      className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                      title={isVideoPlaying ? "Pause Video" : "Play Video"}
                    >
                      {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleVideoMute}
                      className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                      title={isVideoMuted ? "Unmute" : "Mute"}
                    >
                      {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE TIMELAPSE
                    </span>
                  </div>
                </div>
              ) : (
                /* Full-Height Widescreen Banner Image (Taking Screen Right & Center) */
                <div
                  className={`absolute inset-y-0 ${
                    isRtl ? "left-0 w-full lg:w-[65%]" : "right-0 w-full lg:w-[65%]"
                  } h-full z-0 flex items-center justify-end pointer-events-none`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.mediaSrc}
                      alt={slide.titlePrefix.en + slide.titleHighlight.en}
                      fill
                      priority={idx === 0}
                      className="object-contain lg:object-cover object-right"
                    />
                    {/* Seamless Blend Gradient to Left Edge */}
                    <div
                      className={`absolute inset-0 ${
                        isRtl
                          ? "bg-gradient-to-r from-transparent via-[#edf5fd]/40 to-[#edf5fd] lg:to-transparent"
                          : "bg-gradient-to-l from-transparent via-[#edf5fd]/40 to-[#edf5fd] lg:to-transparent"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Minimal Text Content (Floating Over Left Half of Full-Screen Banner) */}
              <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pointer-events-auto">
                <div className="max-w-xl space-y-5">
                  {/* Subtle Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md shadow-2xs ${
                      isDark
                        ? "bg-white/10 text-cyan-300 border-white/20"
                        : "bg-white/80 text-[#0066cc] border-blue-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />
                    <span>{isRtl ? slide.badge.ar : slide.badge.en}</span>
                  </div>

                  {/* High-Impact Minimal Headline */}
                  <h1
                    className={`text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12] ${
                      isDark ? "text-white" : "text-[#0f172a]"
                    }`}
                  >
                    {isRtl ? (
                      <>
                        <span>{slide.titlePrefix.ar}</span>
                        <span className="text-[#0066cc]">{slide.titleHighlight.ar}</span>
                        <span>{slide.titleSuffix.ar}</span>
                      </>
                    ) : (
                      <>
                        <span>{slide.titlePrefix.en}</span>
                        <span className="text-[#0066cc]">{slide.titleHighlight.en}</span>
                        <br className="hidden sm:inline" />
                        <span>{slide.titleSuffix.en}</span>
                      </>
                    )}
                  </h1>

                  {/* Just 2 Clean, Short Bullets (Zero Fluff) */}
                  <div className="space-y-2 pt-1">
                    {slide.bullets.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className={`flex items-center gap-2.5 text-xs sm:text-sm ${
                          isDark ? "text-slate-300" : "text-[#334155]"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0" />
                        <span>{isRtl ? b.ar : b.en}</span>
                      </div>
                    ))}
                  </div>

                  {/* JLC3DP-Style Prominent Pill Button */}
                  <div className="pt-2">
                    <Link
                      href={slide.ctaHref}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] shadow-md shadow-[#0066cc]/25 transition-all hover:scale-102"
                    >
                      <span>{isRtl ? slide.ctaText.ar : slide.ctaText.en}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0066cc] shadow-md flex items-center justify-center transition-all hover:scale-105"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#0066cc] shadow-md flex items-center justify-center transition-all hover:scale-105"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* JLC3DP Horizontal Dash Indicator Bars at Bottom Center */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2.5 pointer-events-auto">
        {slides.map((slide, idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all rounded-full overflow-hidden ${
                isActive ? "w-16 bg-[#0066cc]" : "w-7 bg-slate-300/80 hover:bg-slate-400"
              }`}
            >
              {isActive && !isPaused && (
                <span className="block h-full w-full bg-[#00dbc6] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
