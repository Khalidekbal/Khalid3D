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
  Sparkles,
} from "lucide-react";

export default function JLC3DPHeroCarousel() {
  const { isRtl } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = 3;

  // Auto-advance every 7s
  useEffect(() => {
    if (isPaused) return;
    autoplayTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isPaused]);

  // Sync video play state
  useEffect(() => {
    if (currentSlide === 1 && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
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
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden select-none border-b border-[#d8e5f2]"
    >
      {/* Slides Container */}
      <div
        className="w-full h-full flex transition-transform duration-700 ease-out"
        style={{
          transform: isRtl
            ? `translateX(${currentSlide * 100}%)`
            : `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {/* ========================================================================= */}
        {/* SLIDE 1: COUPONS & 3D PARTS (banner-2.png - 100% UN-CROPPED & FULL-HEIGHT) */}
        {/* ========================================================================= */}
        <div className="w-full h-full shrink-0 relative bg-[#c0e0fc] flex items-center overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-threads-grid pointer-events-none opacity-20" />

          {/* Full Banner Graphic (object-contain object-right so podium & vouchers are 100% visible) */}
          <div
            className={`absolute inset-y-0 ${
              isRtl ? "left-0" : "right-0"
            } w-full lg:w-[68%] h-full z-0 flex items-center justify-end pointer-events-none`}
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/banners/banner-2.png"
                alt="Unlock 3D Printing Coupons Khalid3D"
                fill
                priority
                className={`object-contain ${isRtl ? "object-left" : "object-right"}`}
                sizes="(max-width: 1024px) 100vw, 68vw"
              />
            </div>
          </div>

          {/* Floating Left Content on matching background */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pointer-events-auto">
            <div className="max-w-lg space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/80 text-[#0066cc] border border-blue-200/80 shadow-2xs backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />
                <span>{isRtl ? "عرض الإطلاق الحصري" : "Exclusive Launch Offer"}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#0f172a] leading-[1.12]">
                {isRtl ? (
                  <>
                    <span>وفر حتى </span>
                    <span className="text-[#0066cc]">300 ج.م </span>
                    <br />
                    <span>على طلبات الطباعة</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Up to </span>
                    <span className="text-[#0066cc]">300 EGP</span>
                    <br />
                    <span>3D Printing Coupons</span>
                  </>
                )}
              </h1>

              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#334155] font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0" />
                  <span>
                    {isRtl
                      ? "خصومات متعددة على أجزاء PLA و PETG و TPU."
                      : "Multiple coupon discounts for PLA, PETG & TPU parts."}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] shrink-0" />
                  <span>
                    {isRtl
                      ? "متاح لجميع العملاء في مصر. تطبيق فوري بعد رفع التصميم."
                      : "Open to all users across Egypt. Instant access after CAD upload."}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] shadow-md shadow-[#0066cc]/25 transition-all hover:scale-102"
                >
                  <span>{isRtl ? "احصل على الخصم واطلب الآن" : "Claim Coupons Now"}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 2: REAL FDM TIMELAPSE VIDEO (100% UN-CROPPED & HD VIEW)             */}
        {/* ========================================================================= */}
        <div className="w-full h-full shrink-0 relative bg-[#0b121e] flex items-center justify-center overflow-hidden">
          {/* Video Player (object-contain so print head, nozzle and bed are 100% in view) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src="/videos/fdm-print-timelapse.mp4"
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="w-full h-full object-contain"
            />

            {/* Video Controls (Top Right) */}
            <div className="absolute top-5 right-6 z-20 flex items-center gap-2">
              <button
                onClick={toggleVideoPlayback}
                className="p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                title={isVideoPlaying ? "Pause Video" : "Play Video"}
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleVideoMute}
                className="p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                title={isVideoMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/85 backdrop-blur-md text-white text-[11px] font-mono font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE WORKSHOP TIMELAPSE
              </span>
            </div>

            {/* Floating Sleek Left Glass Card for Video Information */}
            <div
              className={`absolute bottom-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${
                isRtl ? "right-6 sm:right-12" : "left-6 sm:left-12"
              } z-20 max-w-sm sm:max-w-md p-6 rounded-3xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white space-y-3 shadow-2xl`}
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30">
                <Sparkles className="w-3 h-3" />
                <span>Cairo Calibrated FDM Farm</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isRtl ? "دقة طباعة 0.12 مم بالترسيب الميكانيكي" : "Micro-Layer 0.12mm FDM Precision"}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isRtl
                  ? "تسعير مباشر بناءً على استهلاك الجرامات ودقائق التشغيل."
                  : "Direct formula pricing: Filament grams + Machine run-time minutes."}
              </p>
              <div className="pt-1">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-[#00dbc6] hover:bg-[#00c5b2] transition-all hover:scale-102"
                >
                  <span>{isRtl ? "احسب تكلفة قطعتك الآن" : "Get Instant Quote"}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 3: MATERIAL SPECTRUM (banner-1.png - 100% UN-CROPPED & FULL VIEW)  */}
        {/* ========================================================================= */}
        <div className="w-full h-full shrink-0 relative bg-[#0e1726] flex items-center justify-center overflow-hidden">
          {/* Full Banner (object-contain so all 3 columns PLA, PETG, TPU are completely visible) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/images/banners/banner-1.png"
              alt="PLA, PETG, TPU 3D Printing Materials Spectrum"
              fill
              priority
              className="object-contain object-center"
              sizes="100vw"
            />

            {/* Non-Intrusive Bottom Floating Glass Pill Bar */}
            <div className="absolute bottom-14 inset-x-6 sm:inset-x-12 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:px-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-white max-w-4xl mx-auto shadow-2xl">
              <div className="text-center sm:text-left">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00dbc6]" />
                  <span>
                    {isRtl
                      ? "تشكيلة البوليمرات الهندسية: PLA • PETG • TPU"
                      : "Industrial Polymer Range: PLA • PETG • TPU"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 hidden sm:block mt-0.5">
                  {isRtl
                    ? "دقة أبعاد مضمونة ±0.15 مم مع شحن سريع 24-48 ساعة داخل مصر"
                    : "Guaranteed ±0.15mm tolerance • Fast 24-48h dispatch in Egypt"}
                </div>
              </div>

              <Link
                href="/quote"
                className="shrink-0 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] shadow-md transition-all hover:scale-102 flex items-center gap-1.5"
              >
                <span>{isRtl ? "اطلب خامتك الآن" : "Order Parts Now"}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-[#0066cc] shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-slate-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/85 hover:bg-white text-slate-800 hover:text-[#0066cc] shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-slate-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Horizontal Dash Indicators */}
      <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-2.5 pointer-events-auto">
        {[0, 1, 2].map((idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all rounded-full overflow-hidden ${
                isActive ? "w-14 bg-[#0066cc]" : "w-6 bg-slate-400/60 hover:bg-slate-500"
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
