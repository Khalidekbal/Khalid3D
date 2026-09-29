import React from "react";

interface OrganicDividerProps {
  position?: "top" | "bottom";
  className?: string;
  fill?: string;
  invert?: boolean;
}

export default function OrganicDivider({
  position = "bottom",
  className = "",
  fill = "#ffffff",
  invert = false,
}: OrganicDividerProps) {
  const isTop = position === "top";

  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
        isTop ? "rotate-180 -mt-1" : "-mb-1"
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`w-full h-8 sm:h-12 md:h-16 block ${invert ? "scale-x-[-1]" : ""}`}
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Subtle translucent backdrop feather */}
        <path
          d="M0,32 C120,48 240,18 360,35 C480,52 600,28 720,42 C840,56 960,20 1080,38 C1200,56 1320,24 1440,40 L1440,90 L0,90 Z"
          fill={fill}
          fillOpacity="0.4"
        />
        {/* Layer 2: Main organic torn-paper / brush stroke border */}
        <path
          d="M0,45 C90,38 180,55 270,42 C360,29 450,58 540,46 C630,34 720,62 810,48 C900,34 990,60 1080,44 C1170,28 1260,56 1350,45 C1395,39 1420,48 1440,42 L1440,90 L0,90 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
