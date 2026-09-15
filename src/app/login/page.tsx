"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  User,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, isRtl } = useLanguage();

  const [portal, setPortal] = useState<"CUSTOMER" | "STAFF">("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password, portal);
    setSubmitting(false);

    if (result.success) {
      if (portal === "STAFF") {
        router.push("/dashboard");
      } else {
        router.push("/orders");
      }
    } else {
      setError(result.error || "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleQuickFill = (type: "CUSTOMER" | "STAFF") => {
    setError(null);
    setPortal(type);
    if (type === "STAFF") {
      setEmail("staff@khalid3d.com");
      setPassword("Staff@123456");
    } else {
      setEmail("customer@khalid3d.com");
      setPassword("Customer@123456");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" withMotion={true} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 font-mono">
            {portal === "STAFF" ? t.auth.staffTab : t.auth.loginTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {portal === "STAFF" ? t.auth.staffSubtitle : t.auth.loginSubtitle}
          </p>
        </div>

        {/* Dual Portal Tabs (Customer vs Staff) */}
        <div className="p-1 bg-slate-100 rounded-2xl grid grid-cols-2 gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setPortal("CUSTOMER");
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              portal === "CUSTOMER"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.auth.customerTab}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortal("STAFF");
              setError(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              portal === "STAFF"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.auth.staffTab}</span>
          </button>
        </div>

        {/* Staff Notice Badge */}
        {portal === "STAFF" && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{t.auth.staffNotice}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portal === "STAFF" ? "staff@khalid3d.com" : "customer@khalid3d.com"}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50/50"
                />
                <Mail className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? "left-3.5" : "right-3.5"}`} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.auth.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50/50"
                />
                <Lock className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? "left-3.5" : "right-3.5"}`} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                portal === "STAFF"
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              } ${submitting ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.auth.signInBtn}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill helpers */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase text-center">
              Quick Test Credentials
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("CUSTOMER")}
                className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors border border-blue-200 flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("STAFF")}
                className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold transition-colors border border-amber-200 flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Demo Staff</span>
              </button>
            </div>
          </div>
        </div>

        {/* Customer Register Link */}
        {portal === "CUSTOMER" && (
          <div className="text-center text-xs text-slate-600">
            <span>{t.auth.noAccount} </span>
            <Link href="/register" className="font-bold text-blue-600 hover:underline">
              {t.auth.registerBtn}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
