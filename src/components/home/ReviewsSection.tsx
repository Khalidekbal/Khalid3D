"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquareQuote, ShieldCheck, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  partName: string | null;
  materialUsed: string | null;
  createdAt: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/reviews?limit=8");
        const data = await res.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  return (
    <section id="reviews" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700">
              <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2 font-mono tracking-tight">
              CLIENT REVIEWS & PRINT QUALITY
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800 font-mono">4.9 / 5.0 Rating</span>
            <span className="text-xs text-slate-500 font-medium">(100+ Egyptian Engineers & Makers)</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Order
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Part Metadata */}
              <div className="pt-3 border-t border-slate-200/80">
                <div className="font-bold text-xs text-slate-900 font-sans">
                  {rev.customerName}
                </div>
                {rev.partName && (
                  <div className="text-[11px] font-mono text-blue-600 font-medium truncate mt-0.5">
                    Part: {rev.partName}
                  </div>
                )}
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {rev.materialUsed || "PLA Tough Industrial"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                100% Dimensional Accuracy Guarantee
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Every print is sliced with precision profiles and checked with digital calipers. If your part doesn't match specs, we reprint it free.
              </p>
            </div>
          </div>
          <a
            href="/quote"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors whitespace-nowrap"
          >
            Start Your 3D Print Quote
          </a>
        </div>
      </div>
    </section>
  );
}
