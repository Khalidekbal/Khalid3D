import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import BrandLogo from "@/components/brand/BrandLogo";
import Link from "next/link";
import { Phone, Mail, MapPin, Award, CheckCircle2 } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khalid3D | Professional FDM 3D Printing Lab Egypt",
  description:
    "Instant online 3D printing quotes in Egyptian Pounds (EGP). High-precision FDM 3D printing in PLA, PETG, and TPU with transparent pricing per gram and per minute. Fast delivery across Egypt.",
  keywords: [
    "Khalid3D",
    "3D Printing Egypt",
    "FDM 3D Printing Cairo",
    "طباعة ثلاثية الابعاد مصر",
    "PLA Tough",
    "PETG Engineering",
    "TPU Flexible",
    "CAD Quoting EGP",
  ],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Col 1: Brand */}
              <div className="space-y-3 md:col-span-2">
                <BrandLogo size="md" />
                <p className="text-xs text-slate-600 max-w-sm leading-relaxed mt-2">
                  Cairo & Giza's premier rapid manufacturing hub. Specializing in high-precision FDM additive manufacturing with engineering PLA, functional PETG, and elastomeric TPU.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-mono pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent Gram & Minute Rates
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 48-Hour Nationwide Delivery
                  </span>
                </div>
              </div>

              {/* Col 2: Services */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 font-mono uppercase text-[11px] tracking-wider">
                  FDM Materials
                </h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li><Link href="/quote?mat=PLA" className="hover:text-blue-600">PLA Tough Industrial (Prototyping)</Link></li>
                  <li><Link href="/quote?mat=PETG" className="hover:text-blue-600">PETG Engineering Grade (Durable)</Link></li>
                  <li><Link href="/quote?mat=TPU" className="hover:text-blue-600">TPU 95A Flexible (Gaskets & Dampers)</Link></li>
                  <li><Link href="/quote" className="hover:text-blue-600">Multi-Part Instant Quotation</Link></li>
                  <li><Link href="/catalog" className="hover:text-blue-600">Pre-Engineered Parts Catalog</Link></li>
                </ul>
              </div>

              {/* Col 3: Contact */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 font-mono uppercase text-[11px] tracking-wider">
                  Workshop Contact
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Dokki, Giza / Cairo, Egypt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>WhatsApp: +20 100 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>khalid@khalid3d.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} Khalid3D Lab. All rights reserved.</p>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span>All Prices in Egyptian Pounds (EGP)</span>
                <span>•</span>
                <span>Vercel Serverless Ready</span>
              </div>
            </div>
          </footer>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
