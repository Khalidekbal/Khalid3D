"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import confetti from "canvas-confetti";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Truck,
  Box,
  ShieldCheck,
  Download,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Star,
  MessageSquarePlus,
  Scale,
  Timer,
} from "lucide-react";

interface OrderItem {
  id: string;
  fileName: string;
  fileUrl: string | null;
  dimX: number;
  dimY: number;
  dimZ: number;
  volumeCm3: number;
  surfaceAreaCm2: number;
  weightGrams: number;
  printMinutes: number;
  unitUsed: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  infillPercent: number;
  layerHeightMm: number;
  reviewStatus: string;
  dfmWarnings: string | null;
  technology?: { name: string };
  material?: { name: string; colorHex: string };
  finishingOption?: { name: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  trackingNumber: string | null;
  carrier: string | null;
  staffNotes: string | null;
  customerNotes: string | null;
  isEngineeringReview: boolean;
  createdAt: string;
  customer?: { name: string; email: string; phone: string | null };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
}

const MANUFACTURING_STEPS = [
  { key: "QUOTED", title: "Order Placed", desc: "CAD received and payment confirmed in EGP" },
  { key: "PENDING_REVIEW", title: "CAM Slicing", desc: "Layer verification & toolpath preparation" },
  { key: "IN_PRODUCTION", title: "Active Printing", desc: "Nozzle extruding on heated build plate" },
  { key: "POST_PROCESSING", title: "Post-Processing", desc: "Support removal, deburring & finish" },
  { key: "QC_PASSED", title: "Quality Check", desc: "Caliper inspection within ±0.10mm" },
  { key: "SHIPPED", title: "Courier Dispatched", desc: "Handed to Bosta/Aramex for delivery" },
];

function getStepProgressIndex(status: string): number {
  switch (status) {
    case "QUOTED":
    case "PAYMENT_RECEIVED":
      return 1;
    case "PENDING_REVIEW":
      return 2;
    case "IN_PRODUCTION":
      return 3;
    case "POST_PROCESSING":
      return 4;
    case "QC_PASSED":
      return 5;
    case "SHIPPED":
      return 6;
    default:
      return 1;
  }
}

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customer?.name || "Verified Customer",
          rating: reviewRating,
          comment: reviewComment,
          partName: order.items[0]?.fileName || "Custom 3D Print",
          materialUsed: order.items[0]?.material?.name || "FDM Engineering",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono font-semibold text-red-600">Loading Order Telemetry...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Order not found</h2>
        <Link href="/orders" className="text-xs text-red-600 hover:underline mt-2 inline-block font-semibold">
          Return to orders list
        </Link>
      </div>
    );
  }

  const currentStep = getStepProgressIndex(order.status);
  const activeItem = order.items[selectedItemIndex] || order.items[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 font-mono font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              ORDER <span className="text-red-600">{order.orderNumber}</span>
            </h1>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Submitted on {new Date(order.createdAt).toLocaleString()} • Customer: {order.customer?.name} ({order.customer?.email})
          </p>
        </div>

        {isSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Order Authorized & Queued for Slicing!</span>
          </div>
        )}
      </div>

      {/* Manufacturing Progression Stepper (Clean White Card) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            Khalid3D Manufacturing Timeline
          </h2>
          {order.trackingNumber && (
            <div className="flex items-center gap-2 text-xs font-mono bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-700 font-bold">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{order.carrier || "Bosta"}: {order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* 6-Step Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {MANUFACTURING_STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={step.key}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? "bg-slate-50 border-red-200 text-slate-800"
                    : isCurrent
                    ? "bg-red-50 border-red-500 ring-2 ring-red-500/20 text-red-950 shadow-xs"
                    : "bg-slate-50/40 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                      Step 0{stepNum}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold font-mono">{step.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CUSTOMER REVIEW PROMPT BANNER & FORM */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 via-white to-indigo-50 border border-red-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                How did your 3D print turn out? Leave a Review!
              </h3>
              <p className="text-xs text-slate-500">
                Your feedback will be featured directly on the Khalid3D homepage.
              </p>
            </div>
          </div>
        </div>

        {reviewSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-xs">Thank you for your review!</div>
              <div className="text-[11px] text-emerald-700">
                Your feedback has been approved and published to the Khalid3D home showcase.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-3 text-xs font-sans">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 font-mono">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-300 hover:text-amber-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-amber-600">{reviewRating} of 5 Stars</span>
            </div>

            <div>
              <textarea
                rows={2}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your thoughts on surface quality, tolerances, delivery speed, and durability..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-red-500 outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>{isSubmittingReview ? "Submitting..." : "Submit Review for Homepage"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Split Grid: 3D Part Viewport & Order Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 3D WebGL Part Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Box className="w-4 h-4 text-red-600" />
              CAD Inspection View ({selectedItemIndex + 1} of {order.items.length})
            </h3>
            {activeItem?.fileUrl && (
              <a
                href={activeItem.fileUrl}
                download={activeItem.fileName}
                className="text-xs font-mono text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {activeItem.fileName}</span>
              </a>
            )}
          </div>

          {/* 3D Viewer */}
          <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <ThreeViewer
              modelUrl={activeItem?.fileUrl || "/models/drone_motor_bracket.stl"}
              fileName={activeItem?.fileName}
              materialColor={activeItem?.material?.colorHex || "#2563eb"}
              technologyName="FDM"
              dimX={activeItem?.dimX}
              dimY={activeItem?.dimY}
              dimZ={activeItem?.dimZ}
              unit={activeItem?.unitUsed || "mm"}
              className="w-full h-full"
            />
          </div>

          {/* Multi-part tabs if more than 1 item */}
          {order.items.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-1 bg-white rounded-xl border border-slate-200">
              {order.items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
                    selectedItemIndex === idx
                      ? "bg-red-600 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.fileName}
                </button>
              ))}
            </div>
          )}

          {/* Part Specifications Matrix */}
          {activeItem && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono shadow-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Technology</span>
                <span className="font-bold text-slate-800">FDM</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Material</span>
                <span className="font-bold text-slate-800">{activeItem.material?.name || "PLA"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Weight / Minutes</span>
                <span className="font-bold text-slate-800">
                  {activeItem.weightGrams || 35}g • {activeItem.printMinutes || 60}m
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Infill / Layer</span>
                <span className="font-bold text-slate-800">
                  {activeItem.infillPercent}% • {activeItem.layerHeightMm}mm
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: CAM Feedback & Invoice Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CAM Engineering Feedback */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              CAM & Engineering Notes
            </h3>

            {order.staffNotes ? (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-mono text-red-900">
                {order.staffNotes}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono">
                CAD pre-flight check passed. Ready on Bambu Lab / Voron fleet.
              </p>
            )}

            {order.customerNotes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400 block">Customer Note:</span>
                <p className="text-xs text-slate-700 italic mt-0.5">{order.customerNotes}</p>
              </div>
            )}
          </div>

          {/* Delivery Destination */}
          {order.shippingAddress && (
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-600" />
                Delivery Address (Egypt)
              </h3>
              <div className="text-xs font-mono text-slate-600 leading-relaxed">
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>
          )}

          {/* Price Invoice Breakdown (EGP) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 font-mono text-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 font-sans">
              <Scale className="w-4 h-4 text-emerald-600" />
              Invoice Summary (EGP)
            </h3>

            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Parts Subtotal:</span>
                <span>{order.subtotal.toFixed(2)} EGP</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Bulk Discount:</span>
                  <span>-{order.discount.toFixed(2)} EGP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Express Delivery (Egypt):</span>
                <span>{order.shippingFee.toFixed(2)} EGP</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline font-bold text-slate-900 text-base">
                <span>Total Amount:</span>
                <span className="text-xl text-red-600 font-black">{order.totalAmount.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
