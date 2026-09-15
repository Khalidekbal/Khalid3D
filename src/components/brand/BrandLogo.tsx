"use client";

import React from "react";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  withMotion?: boolean;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  className = "",
  withMotion = true,
}: BrandLogoProps) {
  const sizeMap = {
    sm: { img: 36, text: "text-lg", sub: "text-[9px]" },
    md: { img: 44, text: "text-xl", sub: "text-[10px]" },
    lg: { img: 64, text: "text-3xl", sub: "text-xs" },
    xl: { img: 96, text: "text-4xl", sub: "text-sm" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Hexagonal Logo Container with Dynamic Motion */}
      <div className="relative flex items-center justify-center">
        {/* Dynamic Glowing Ambient Aura */}
        {withMotion && (
          <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-md group-hover:bg-red-500/35 transition-all duration-500 scale-95 group-hover:scale-110" />
        )}

        {/* Dynamic Hexagon/Card Wrapper with subtle float & tilt */}
        <div
          className={`relative rounded-xl bg-white border border-red-100 shadow-md shadow-red-500/10 overflow-hidden flex items-center justify-center p-1 transition-all duration-300 ${
            withMotion
              ? "group-hover:-translate-y-1 group-hover:rotate-1 group-hover:shadow-lg group-hover:shadow-red-500/20"
              : ""
          }`}
          style={{ width: currentSize.img + 8, height: currentSize.img + 8 }}
        >
          {/* Subtle animated nozzle scanline beam */}
          {withMotion && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />
          )}

          <img
            src="/images/logo.png"
            alt="Khalid3D Logo"
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-slate-900 font-mono ${currentSize.text}`}
            >
              Khalid<span className="text-red-600">3D</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-red-50 text-red-700 font-bold border border-red-200 rounded">
              EGYPT
            </span>
          </div>
          <span
            className={`text-slate-500 font-medium font-sans tracking-wide -mt-0.5 ${currentSize.sub}`}
          >
            FDM 3D Printing Lab
          </span>
        </div>
      )}
    </div>
  );
}
