"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Filter,
  CheckCircle2,
  Box,
  Truck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string;
  technology: string;
  material: string;
  price: number;
  stock: number;
}

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const url = selectedMaterial === "ALL" ? "/api/products" : `/api/products?material=${selectedMaterial}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedMaterial]);

  const materials = ["ALL", "PLA", "PETG", "TPU"];

  const handleBuyNow = (product: Product) => {
    // Direct link to custom quote page with pre-populated material
    router.push(`/quote?material=${product.material}&ref=${product.slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              PRE-MADE <span className="text-red-600">HARDWARE & KITS</span>
            </h1>
            <span className="text-[11px] font-mono bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded uppercase font-semibold">
              FDM In-Stock
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Precision 3D printed mechanical enclosures, brackets, and engineering kits in PLA, PETG, and TPU.
          </p>
        </div>

        {/* Material Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
          {materials.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                selectedMaterial === mat
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-red-600">Loading Pre-Made Hardware...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            let imgList: string[] = [];
            try {
              imgList = JSON.parse(p.images);
            } catch {
              imgList = ["/images/products/rpi5-din.svg"];
            }
            const thumbnail = imgList[0] || "/images/products/rpi5-din.svg";

            return (
              <div
                key={p.id}
                className="group rounded-2xl border border-slate-200 bg-white hover:border-red-300 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Visual Technical Diagram */}
                  <div className="relative w-full aspect-[3/2] bg-slate-50 border-b border-slate-200 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/90 text-red-700 border border-red-200 shadow-sm">
                        {p.technology}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/90 text-slate-700 border border-slate-200 shadow-sm">
                        {p.material}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shadow-sm">
                      {p.stock} In Stock
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-100">
                      <span>Dispatch: 24h</span>
                      <span>Tolerance: ±0.15mm</span>
                    </div>
                  </div>
                </div>

                {/* Footer / Buy Action */}
                <div className="p-5 pt-0 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">Unit Price</span>
                    <span className="text-xl font-bold font-mono text-red-600">
                      EGP {p.price.toFixed(0)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyNow(p)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-sm shadow-red-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
