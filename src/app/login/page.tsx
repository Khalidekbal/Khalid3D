"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  UserPlus,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { isRtl } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await login(email, password, "CUSTOMER");
    setSubmitting(false);

    if (result.success) {
      router.push("/orders");
    } else {
      setError(result.error || "Invalid credentials. Please verify your email and password.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fafefd]">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" withMotion={true} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
            {isRtl ? "تسجيل الدخول إلى حسابك" : "Sign in to Khalid3D"}
          </h2>
          <p className="text-xs text-slate-500">
            {isRtl
              ? "متابعة طلبات الطباعة ثلاثية الأبعاد وعروض الأسعار"
              : "Manage your 3D printing orders, files, and verified quotes"}
          </p>
        </div>

        {/* Customer Login Form */}
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
                {isRtl ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all bg-slate-50/50"
                />
                <Mail className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? "left-3.5" : "right-3.5"}`} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isRtl ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all bg-slate-50/50"
                />
                <Lock className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? "left-3.5" : "right-3.5"}`} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                submitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRtl ? "تسجيل الدخول" : "Sign In"}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* New Customer Sign Up Link */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              {isRtl ? "ليس لديك حساب بعد؟" : "Don't have an account yet?"}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0066cc] bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRtl ? "إنشاء حساب جديد مجاناً" : "Create New Customer Account"}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
