"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Star,
  User,
  LogOut,
  Languages,
  LogIn,
  UserPlus,
  Sparkles,
  Search,
  ShoppingCart,
  Layers,
  HelpCircle,
  FileText,
  Info,
  Box,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isStaffOrAdmin } = useAuth();
  const { language, setLanguage, t, isRtl } = useLanguage();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [materialsMenuOpen, setMaterialsMenuOpen] = useState(false);
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const materialsDropdownRef = useRef<HTMLDivElement>(null);
  const supportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        materialsDropdownRef.current &&
        !materialsDropdownRef.current.contains(event.target as Node)
      ) {
        setMaterialsMenuOpen(false);
      }
      if (
        supportDropdownRef.current &&
        !supportDropdownRef.current.contains(event.target as Node)
      ) {
        setSupportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: JLC3DP-style Brand Logo */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" withMotion={true} />
          </Link>

          {/* Desktop Navigation Links matching JLC3DP Upper Bar */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1e293b]">
            {/* Products (with grid icon) */}
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 hover:text-[#0066cc] transition-colors"
            >
              <span className="font-mono text-xs opacity-70">::</span>
              <span>{isRtl ? "المنتجات" : "Products"}</span>
            </Link>

            {/* Materials Dropdown */}
            <div className="relative" ref={materialsDropdownRef}>
              <button
                onClick={() => {
                  setMaterialsMenuOpen(!materialsMenuOpen);
                  setSupportMenuOpen(false);
                }}
                className={`flex items-center gap-1 hover:text-[#0066cc] transition-colors cursor-pointer py-1 ${
                  materialsMenuOpen ? "text-[#0066cc] font-semibold" : ""
                }`}
              >
                <span>{isRtl ? "الخامات الهندسية" : "Materials"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${materialsMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {materialsMenuOpen && (
                <div
                  className={`absolute top-full mt-2 w-72 bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-3 z-50 animate-in fade-in-50 zoom-in-95 duration-150 ${
                    isRtl ? "right-0" : "left-0"
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase font-bold text-[#94a3b8] px-3 py-1.5 border-b border-[#f1f5f9]">
                    {isRtl ? "خامات الطباعة ثلاثية الأبعاد (FDM)" : "FDM 3D Polymers"}
                  </div>
                  
                  <Link
                    href="/#materials"
                    onClick={() => setMaterialsMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors group mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#0066cc]">
                        PLA Tough Industrial
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        {isRtl ? "صلابة ودقة عالية للأبعاد" : "High rigidity & crisp aesthetics"}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/#materials"
                    onClick={() => setMaterialsMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#0066cc]">
                        PETG Industrial Grade
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        {isRtl ? "مقاوم للصدمات والحرارة 78°C" : "Chemical & heat resistant (78°C)"}
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/#materials"
                    onClick={() => setMaterialsMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0 border border-orange-200">
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a] group-hover:text-[#0066cc]">
                        TPU 95A Flexible
                      </div>
                      <div className="text-[11px] text-[#64748b]">
                        {isRtl ? "مرونة مطاطية وامتصاص اهتزاز" : "Rubber-like elastomeric dampening"}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Free 3D Models */}
            <Link
              href="/catalog"
              className="hover:text-[#0066cc] transition-colors flex items-center gap-1.5"
            >
              <span>{isRtl ? "نماذج 3D مجانية" : "Free 3D Models"}</span>
              <span className="text-[9px] font-mono uppercase bg-blue-50 text-[#0066cc] px-1.5 py-0.5 rounded font-bold">
                CAD
              </span>
            </Link>

            {/* Support Dropdown */}
            <div className="relative" ref={supportDropdownRef}>
              <button
                onClick={() => {
                  setSupportMenuOpen(!supportMenuOpen);
                  setMaterialsMenuOpen(false);
                }}
                className={`flex items-center gap-1 hover:text-[#0066cc] transition-colors cursor-pointer py-1 ${
                  supportMenuOpen ? "text-[#0066cc] font-semibold" : ""
                }`}
              >
                <span>{isRtl ? "الدعم والمساعدة" : "Support"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${supportMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {supportMenuOpen && (
                <div
                  className={`absolute top-full mt-2 w-56 bg-white rounded-2xl border border-[#e2e8f0] shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150 ${
                    isRtl ? "right-0" : "left-0"
                  }`}
                >
                  <Link
                    href="/#reviews"
                    onClick={() => setSupportMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f8fafc] text-xs font-semibold text-[#1e293b] hover:text-[#0066cc] transition-colors"
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{t.reviews.badge}</span>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setSupportMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f8fafc] text-xs font-semibold text-[#1e293b] hover:text-[#0066cc] transition-colors"
                  >
                    <ClipboardList className="w-4 h-4 text-[#64748b]" />
                    <span>{t.nav.trackOrder}</span>
                  </Link>
                  <a
                    href="#faq"
                    onClick={() => setSupportMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f8fafc] text-xs font-semibold text-[#1e293b] hover:text-[#0066cc] transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-[#64748b]" />
                    <span>{isRtl ? "الأسئلة الشائعة" : "FAQs & DFM Guide"}</span>
                  </a>
                </div>
              )}
            </div>

            {/* About Us */}
            <a
              href="#overview"
              className="hover:text-[#0066cc] transition-colors"
            >
              {isRtl ? "من نحن" : "About Us"}
            </a>
          </nav>
        </div>

        {/* Right: Search, Cart, Language, Order Now & Sign In */}
        <div className="flex items-center gap-3">
          
          {/* Search Trigger */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Search 3D Models & Products"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className={`absolute top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 flex items-center gap-2 ${
                  isRtl ? "left-0" : "right-0"
                }`}
              >
                <input
                  type="text"
                  placeholder={isRtl ? "ابحث عن مجسم أو قطعة..." : "Search parts, models..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#0066cc]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#0066cc] text-white rounded-xl text-xs font-bold shrink-0 hover:bg-[#0052a3]"
                >
                  {isRtl ? "بحث" : "Go"}
                </button>
              </form>
            )}
          </div>

          {/* Cart / Orders Icon */}
          <Link
            href="/orders"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors relative"
            title="Track Orders / Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#0066cc] absolute top-1 right-1" />
          </Link>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            title="Change language / تغيير اللغة"
          >
            <Languages className="w-3.5 h-3.5 text-[#0066cc]" />
            <span className="font-sans">{language === "en" ? "العربية" : "English"}</span>
          </button>

          {/* JLC3DP "Order Now" Outlined Pill Button */}
          <Link
            href="/quote"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold text-[#0066cc] hover:text-[#0052a3] bg-white border border-[#0066cc] hover:bg-blue-50/60 shadow-2xs transition-all hover:scale-102"
          >
            <span>{isRtl ? "اطلب الآن" : "Order Now"}</span>
          </Link>

          {/* JLC3DP Solid Blue "Sign In" / User Avatar Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 hover:border-[#0066cc] text-xs font-semibold text-slate-900 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#0066cc] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
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
                      className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        user.role === "STAFF" || user.role === "ADMIN"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-blue-100 text-[#0066cc]"
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
                    <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.orders.title}</span>
                  </Link>

                  {(user.role === "STAFF" || user.role === "ADMIN") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.nav.staffPortal}</span>
                    </Link>
                  )}

                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0066cc] hover:bg-[#0052a3] shadow-xs transition-all hover:scale-102 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isRtl ? "تسجيل الدخول" : "Sign In"}</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-[#0066cc] lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/quote"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-[#0066cc] text-center"
          >
            {isRtl ? "اطلب تسعيرك الآن" : "Order Now (Instant Quote)"}
          </Link>

          <Link
            href="/catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ShoppingBag className="w-4 h-4 text-[#0066cc]" />
            <span>{isRtl ? "المنتجات والنماذج المجانية" : "Products & Free 3D Models"}</span>
          </Link>

          <Link
            href="/#materials"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Layers className="w-4 h-4 text-[#0066cc]" />
            <span>{isRtl ? "الخامات الهندسية (PLA • PETG • TPU)" : "Materials (PLA • PETG • TPU)"}</span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ClipboardList className="w-4 h-4 text-[#0066cc]" />
            <span>{t.nav.trackOrder}</span>
          </Link>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="p-2 text-xs font-bold rounded-lg border border-slate-200 text-slate-700"
            >
              {language === "en" ? "تغيير للعربية 🇪🇬" : "Switch to English 🇺🇸"}
            </button>

            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0066cc] text-white"
              >
                {isRtl ? "تسجيل الدخول" : "Sign In"}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
