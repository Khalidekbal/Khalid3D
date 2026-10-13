"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Cpu,
  Layers,
} from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password, "STAFF");
    setSubmitting(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(
        result.error ||
          "Access denied. Please check your staff credentials or contact Khalid3D Admin."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-[#e2e8f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" withMotion={true} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f243a] text-cyan-300 border border-[#1b4363] text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00dbc6]" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
            Staff & CAM Engineering
          </h1>
          <p className="text-xs text-[#94a3b8] font-mono">
            Production lab control, material pricing, and 3D quote approval
          </p>
        </div>

        {/* Staff Login Card */}
        <div className="bg-[#0c1526] border border-[#1b2842] rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khalidekbal03@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#1b2b48] bg-[#08101e] text-white placeholder-slate-600 focus:outline-hidden focus:border-[#00dbc6] transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                Staff Access Key / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#1b2b48] bg-[#08101e] text-white placeholder-slate-600 focus:outline-hidden focus:border-[#00dbc6] transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-[#00dbc6] hover:bg-[#00c5b2] active:scale-[0.99] shadow-lg shadow-[#00dbc6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter Staff Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-[#16233a] text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono"
            >
              ← Back to Khalid3D Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
