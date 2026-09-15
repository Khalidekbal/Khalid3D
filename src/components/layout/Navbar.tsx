"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  UploadCloud,
  ShoppingBag,
  ClipboardList,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Star,
  User,
  LogOut,
  Languages,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isStaffOrAdmin } = useAuth();
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/quote", label: t.nav.instantQuote, icon: UploadCloud, highlight: true },
    { href: "/#reviews", label: t.reviews.badge, icon: Star },
    { href: "/catalog", label: t.nav.store, icon: ShoppingBag },
    { href: "/orders", label: t.nav.trackOrder, icon: ClipboardList },
    ...(isStaffOrAdmin
      ? [{ href: "/dashboard", label: t.nav.staffPortal, icon: ShieldAlert, staffOnly: true }]
      : []),
  ];

  const handleSignOut = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Khalid3D Brand Logo */}
        <Link href="/" className="flex items-center">
          <BrandLogo size="md" withMotion={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 shadow-sm shadow-red-500/20 transition-all hover:shadow-md hover:shadow-red-500/30 mx-1"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <span className="w-2 h-2 rounded-full bg-red-200 animate-ping absolute -top-0.5 -right-0.5" />
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  isActive
                    ? "text-red-600 bg-red-50/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    link.staffOnly
                      ? "text-amber-600"
                      : link.label === t.reviews.badge
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-500"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Language Switcher & Authentication */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            title="Change language / تغيير اللغة"
          >
            <Languages className="w-3.5 h-3.5 text-red-600" />
            <span className="font-mono">{language === "en" ? "العربية 🇪🇬" : "English 🇺🇸"}</span>
          </button>

          {/* User Logged In vs Logged Out */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block max-w-[120px] truncate">
                  <div className="font-bold text-xs leading-tight truncate">{user.name}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">{user.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 ${
                    isRtl ? "left-0" : "right-0"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        user.role === "STAFF" || user.role === "ADMIN"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.role === "STAFF" || user.role === "ADMIN" ? "Staff Member" : "Customer"}
                    </span>
                  </div>

                  <Link
                    href="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.orders.title}</span>
                  </Link>

                  {(user.role === "STAFF" || user.role === "ADMIN") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.nav.staffPortal}</span>
                    </Link>
                  )}

                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.nav.signIn}</span>
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.nav.register}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="p-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-700"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-red-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Icon className="w-4 h-4 text-red-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-600 font-medium px-2">
                  Signed in as <span className="font-bold text-slate-900">{user.name}</span> ({user.role})
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-rose-600 bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.signOut}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
