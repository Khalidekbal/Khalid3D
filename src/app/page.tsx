import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import ReviewsSection from "@/components/home/ReviewsSection";
import {
  UploadCloud,
  Box,
  Layers,
  ShieldCheck,
  Zap,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Sparkles,
  Scale,
  Timer,
} from "lucide-react";

export default function HomePage() {
  const fdmMaterials = [
    {
      name: "PLA Tough Industrial",
      tagline: "High-Resolution Standard Prototyping",
      density: "1.24 g/cm³",
      rateGram: "1.25 EGP / g",
      rateMinute: "0.40 EGP / min",
      description:
        "The gold standard for rapid prototyping, architectural models, visual masters, and everyday fixtures. Crisp detail and minimal warping.",
      features: ["Fine 0.12 - 0.28mm layers", "High tensile rigidity", "Eco-friendly bio-polymer"],
      color: "from-blue-50 to-indigo-50/40",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      accentBorder: "border-blue-200 hover:border-blue-400",
    },
    {
      name: "PETG Engineering Grade",
      tagline: "Chemical, UV & Impact Resistant",
      density: "1.27 g/cm³",
      rateGram: "1.60 EGP / g",
      rateMinute: "0.50 EGP / min",
      description:
        "Superior layer-to-layer adhesion, high thermal resistance (up to 75°C), and water impermeability. Ideal for mechanical brackets and outdoor drone components.",
      features: ["Ductile & impact tough", "Weather & water resistant", "Excellent functional strength"],
      color: "from-orange-50 to-amber-50/40",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      accentBorder: "border-orange-200 hover:border-orange-400",
    },
    {
      name: "TPU 95A Flexible",
      tagline: "Elastomeric Gaskets, Dampers & Seals",
      density: "1.21 g/cm³",
      rateGram: "2.40 EGP / g",
      rateMinute: "0.70 EGP / min",
      description:
        "High-elasticity rubber-like filament capable of repeated flex cycles without tearing. Perfect for custom O-rings, robotics tires, phone cases, and shock absorbers.",
      features: ["Shore 95A flexible hardness", "Abrasion & oil resistant", "High damping absorption"],
      color: "from-emerald-50 to-teal-50/40",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accentBorder: "border-emerald-200 hover:border-emerald-400",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-white bg-grid-pattern">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Dynamic Animated Logo Badge */}
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-slate-200 shadow-sm animate-logo-float mb-2">
              <BrandLogo size="lg" showText={false} withMotion={true} />
            </div>

            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Egypt's Premier FDM 3D Printing Service</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 font-mono leading-tight">
              PRECISION FDM 3D PRINTING <br />
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                IN EGYPTIAN POUNDS (EGP)
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your 3D CAD files for instant real-time quotes calculated directly from <strong>part weight (grams)</strong> and <strong>print machine time (minutes)</strong>. Fast 48-hour delivery across Cairo, Giza, and all Egyptian governorates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/quote"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload STL & Instant Quote (EGP)</span>
              </Link>
              <Link
                href="/catalog"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Box className="w-4 h-4 text-blue-600" />
                <span>Explore In-Stock Parts</span>
              </Link>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-100 text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Scale className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">Weight Rate</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">From 1.25 EGP</div>
                <div className="text-xs text-slate-500">Per gram of filament</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Timer className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">Machine Rate</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">From 0.40 EGP</div>
                <div className="text-xs text-slate-500">Per print minute</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">Lead Time</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">48 Hours</div>
                <div className="text-xs text-slate-500">Fast Cairo/Giza dispatch</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-[11px] font-mono font-bold uppercase">FDM Precision</span>
                </div>
                <div className="text-xl font-bold font-mono text-slate-900">±0.10 mm</div>
                <div className="text-xs text-slate-500">Bambu Lab & Voron fleet</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FDM Materials Showcase */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase text-blue-600 tracking-wider font-bold">
                Specialized Additive Materials
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1 font-mono">
                OUR FDM CAPABILITIES
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              We focus 100% on high-quality FDM thermoplastic manufacturing. Choose between rigid prototyping PLA, weather-resistant PETG, or elastomeric TPU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fdmMaterials.map((mat) => (
              <div
                key={mat.name}
                className={`rounded-2xl border ${mat.accentBorder} bg-gradient-to-b ${mat.color} p-6 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm hover:shadow-md bg-white`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${mat.badgeColor}`}>
                      {mat.name}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {mat.density}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{mat.tagline}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{mat.description}</p>
                  </div>

                  {/* Pricing Formula Box */}
                  <div className="p-3 rounded-xl bg-white/90 border border-slate-200 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-700">
                      <span>Filament Gram Rate:</span>
                      <span className="font-bold text-blue-600">{mat.rateGram}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Machine Time Rate:</span>
                      <span className="font-bold text-blue-600">{mat.rateMinute}</span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pt-2">
                    {mat.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/quote?mat=${mat.name.split(" ")[0]}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Instant Quote with {mat.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <ReviewsSection />

      {/* DFM & Slicing Technical Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Client-Side Geometry Processing</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-mono leading-tight">
                TRANSPARENT GRAMS & MINUTES. <br />
                ZERO HIDDEN FEES.
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                When you drag and drop your STL into Khalid3D, our client-side Web Worker immediately runs the signed tetrahedron algorithm to measure closed mesh volume, computes part weight in grams, and estimates nozzle print minutes in real time.
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Gram Computation:</span> Exact volume scaled by filament density (PLA 1.24, PETG 1.27, TPU 1.21 g/cm³) and your chosen infill percentage (20%, 40%, 80%, 100%).
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Minute Slicing Formula:</span> Exact layer count (Z height / layer resolution) and perimeter toolpath travel time.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Local Egyptian Delivery:</span> Shipped safely in bubble wrap via Bosta or Aramex directly to your doorstep.
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Formula Card */}
            <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-blue-600 font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Khalid3D_Pricing_Formula.egp
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <div className="text-sm font-bold text-blue-700">
                  Total Price (EGP) = (Grams × Cost/Gram) + (Minutes × Cost/Minute) + SetupFee
                </div>
                <div className="text-slate-500 pt-1 text-[11px]">
                  Where Cost/Gram and Cost/Minute are calibrated by staff for optimal factory efficiency.
                </div>
              </div>

              <div className="space-y-2 text-slate-700 text-[11px]">
                <div className="flex justify-between">
                  <span>Example: 45g Bracket in PETG:</span>
                  <span className="font-bold">45g × 1.60 = 72.00 EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Time: 90 Minutes:</span>
                  <span className="font-bold">90m × 0.50 = 45.00 EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Job Setup Fee:</span>
                  <span className="font-bold">25.00 EGP</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Unit Price:</span>
                  <span className="text-blue-600">142.00 EGP</span>
                </div>
              </div>

              <Link
                href="/quote"
                className="block text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm"
              >
                Launch Multi-Part Instant Configurator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
