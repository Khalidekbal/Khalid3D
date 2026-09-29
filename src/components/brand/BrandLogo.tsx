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
      {/* Logo Container with Dynamic Ambient Glow */}
      <div className="relative flex items-center justify-center">
        {/* Dynamic Glowing Ambient Aura */}
        {withMotion && (
          <div className="absolute inset-0 rounded-2xl bg-[#00dbc6]/25 blur-md group-hover:bg-[#00dbc6]/40 transition-all duration-500 scale-95 group-hover:scale-110" />
        )}

        {/* Dynamic Card Wrapper with subtle float & tilt */}
        <div
          className={`relative rounded-xl bg-white border border-[#d4e3e1] shadow-xs overflow-hidden flex items-center justify-center p-1 transition-all duration-300 ${
            withMotion
              ? "group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#009e8f]"
              : ""
          }`}
          style={{ width: currentSize.img + 8, height: currentSize.img + 8 }}
        >
          {/* Subtle animated scanline shimmer */}
          {withMotion && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00dbc6]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
              className={`font-black tracking-tight text-[#0e2628] font-sans ${currentSize.text}`}
            >
              Khalid<span className="text-[#009e8f]">3D</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#d8faf5] text-[#007065] font-bold border border-[#a8ede4] rounded-md tracking-wider">
              LAB
            </span>
          </div>
          <span
            className={`text-[#53696b] font-medium font-sans tracking-wide -mt-0.5 ${currentSize.sub}`}
          >
            FDM 3D Manufacturing
          </span>
        </div>
      )}
    </div>
  );
}
