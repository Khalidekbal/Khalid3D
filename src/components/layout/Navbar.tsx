"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import BrandLogo from "@/components/brand/BrandLogo";
import {
  UploadCloud,
  ShoppingBag,
  ClipboardList,
  ShieldAlert,
  ChevronDown,
  CheckCircle2,
  Menu,
  X,
  Star,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, switchRole, isStaffOrAdmin } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/quote", label: "Instant 3D Quote", icon: UploadCloud, highlight: true },
    { href: "/#reviews", label: "Reviews", icon: Star },
    { href: "/catalog", label: "Hardware Parts", icon: ShoppingBag },
    { href: "/orders", label: "Track Orders", icon: ClipboardList },
    ...(isStaffOrAdmin
      ? [{ href: "/dashboard", label: "Staff Portal", icon: ShieldAlert, staffOnly: true }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Khalid3D Brand Logo with Dynamic Motion */}
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
                  className="relative px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:shadow-blue-500/30 mr-1"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <span className="w-2 h-2 rounded-full bg-blue-200 animate-ping absolute -top-0.5 -right-0.5" />
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    link.staffOnly
                      ? "text-amber-600"
                      : link.label === "Reviews"
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-500"
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Role Switcher & Staff Link */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-mono text-slate-700 transition-colors"
            >
              <span className="text-slate-400">Actor:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  role === "CUSTOMER"
                    ? "bg-blue-100 text-blue-800"
                    : role === "STAFF"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {(["CUSTOMER", "STAFF", "ADMIN"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{r}</div>
                      <div className="text-[11px] text-slate-500">
                        {r === "CUSTOMER"
                          ? "Public 3D quote & reviews"
                          : r === "STAFF"
                          ? "CAM review & EGP pricing settings"
                          : "Full platform admin"}
                      </div>
                    </div>
                    {role === r && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Staff Dashboard Shortcut */}
          {isStaffOrAdmin && pathname !== "/dashboard" && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff Hub</span>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600"
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
                <Icon className="w-4 h-4 text-blue-600" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Switch Role:</span>
            <div className="flex gap-1.5">
              {(["CUSTOMER", "STAFF", "ADMIN"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono ${
                    role === r
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
