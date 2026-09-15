import fs from "fs";
import path from "path";

function createTechnicalSvg(title: string, subtitle: string, color: string, techBadge: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e293b" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${color}" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="0.8" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#bgGrad)"/>
    <rect width="600" height="400" fill="url(#grid)"/>

    <!-- Technical ISO Cube Graphic -->
    <g transform="translate(300, 190)">
      <!-- Base Shadow -->
      <polygon points="0,95 105,45 0,-5 -105,45" fill="#020617" opacity="0.6"/>
      <!-- Top Face -->
      <polygon points="0,-70 90,-25 0,20 -90,-25" fill="${color}" opacity="0.85" stroke="#f8fafc" stroke-width="1.5"/>
      <!-- Left Face -->
      <polygon points="-90,-25 0,20 0,90 -90,45" fill="${color}" opacity="0.6" stroke="#f8fafc" stroke-width="1.5"/>
      <!-- Right Face -->
      <polygon points="0,20 90,-25 90,45 0,90" fill="${color}" opacity="0.4" stroke="#f8fafc" stroke-width="1.5"/>

      <!-- Measurement callout lines -->
      <line x1="-120" y1="-25" x2="-120" y2="45" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="-120" cy="-25" r="3" fill="#38bdf8"/>
      <circle cx="-120" cy="45" r="3" fill="#38bdf8"/>
      <text x="-135" y="15" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold" text-anchor="end">Z: 70mm</text>

      <line x1="0" y1="110" x2="90" y2="65" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="0" cy="110" r="3" fill="#f59e0b"/>
      <circle cx="90" cy="65" r="3" fill="#f59e0b"/>
      <text x="50" y="105" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">X: 90mm</text>
    </g>

    <!-- Top Badge -->
    <rect x="30" y="30" width="110" height="28" rx="6" fill="#1e293b" stroke="${color}" stroke-width="1.5"/>
    <text x="85" y="49" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${techBadge}</text>

    <rect x="150" y="30" width="130" height="28" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1"/>
    <text x="215" y="48" fill="#94a3b8" font-family="monospace" font-size="11" text-anchor="middle">TOL: ±0.08mm</text>

    <!-- Title & Specs -->
    <text x="30" y="340" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="20" font-weight="700">${title}</text>
    <text x="30" y="365" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">${subtitle}</text>
  </svg>`;
}

const dir = path.join(process.cwd(), "public", "images", "products");

const svgs = [
  {
    name: "rpi5-din.svg",
    title: "DIN-Rail RPi 5 Enclosure",
    subtitle: "SLS Nylon PA12 • Snap-Together Assembly",
    color: "#06b6d4",
    badge: "SLS NYLON",
  },
  {
    name: "rpi5-din-open.svg",
    title: "RPi 5 Internal Carrier Tray",
    subtitle: "Conformal Cooling Chimney & Standoffs",
    color: "#3b82f6",
    badge: "SLS NYLON",
  },
  {
    name: "keyboard-case.svg",
    title: "Ergonomic 65% Mechanical Case",
    subtitle: "High-Resolution 8K SLA • 7° Typing Incline",
    color: "#8b5cf6",
    badge: "SLA RESIN",
  },
  {
    name: "gearbox-nema17.svg",
    title: "Planetary Gearbox 4:1 (NEMA 17)",
    subtitle: "FDM Carbon Fiber PA-CF • Low Backlash",
    color: "#f59e0b",
    badge: "FDM PA-CF",
  },
  {
    name: "gimbal-bracket.svg",
    title: "Dual Axis Gimbal Yoke",
    subtitle: "Glass-Filled Nylon PA12-GF • Topology Optimized",
    color: "#10b981",
    badge: "SLS PA12-GF",
  },
  {
    name: "metal-manifold.svg",
    title: "Hydraulic Manifold Splitter",
    subtitle: "SLM 316L Stainless Steel • 150 PSI Rated",
    color: "#e2e8f0",
    badge: "SLM METAL",
  },
];

for (const s of svgs) {
  fs.writeFileSync(path.join(dir, s.name), createTechnicalSvg(s.title, s.subtitle, s.color, s.badge));
}

console.log("✓ Generated crisp technical product preview SVGs");
