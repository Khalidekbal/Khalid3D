"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Box,
  Clock,
  CheckCircle2,
  ChevronRight,
  Truck,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface OrderItem {
  id: string;
  fileName: string;
  dimX: number;
  dimY: number;
  dimZ: number;
  volumeCm3: number;
  quantity: number;
  totalPrice: number;
  technology?: { name: string };
  material?: { name: string; colorHex: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  trackingNumber: string | null;
  carrier: string | null;
  isEngineeringReview: boolean;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; step: number }> = {
  PENDING_REVIEW: { label: "CAM Engineering Review", color: "text-amber-400 bg-amber-950/60 border-amber-800/60", step: 1 },
  QUOTED: { label: "Quoted / Awaiting Payment", color: "text-red-400 bg-red-950/60 border-red-800/60", step: 1 },
  PAYMENT_RECEIVED: { label: "Payment Confirmed", color: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60", step: 2 },
  IN_PRODUCTION: { label: "Printing on Bed", color: "text-indigo-400 bg-indigo-950/60 border-indigo-800/60", step: 3 },
  POST_PROCESSING: { label: "Depowdering / Curing", color: "text-purple-400 bg-purple-950/60 border-purple-800/60", step: 4 },
  QC_PASSED: { label: "Quality Inspection Passed", color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60", step: 5 },
  SHIPPED: { label: "Shipped & Dispatched", color: "text-emerald-400 bg-emerald-950/80 border-emerald-700", step: 6 },
  CANCELLED: { label: "Cancelled", color: "text-rose-400 bg-rose-950/60 border-rose-800/60", step: 0 },
};

export default function OrdersListPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              MANUFACTURING <span className="text-cyan-400">ORDERS</span>
            </h1>
            <span className="text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 px-2 py-0.5 rounded uppercase font-semibold">
              Live Production Queue
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track real-time build progress from CAM pre-flight review to laser sintering, QC micrometer inspection, and courier dispatch.
          </p>
        </div>

        <Link
          href="/quote"
          className="px-4 py-2 text-xs font-bold rounded-xl text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Box className="w-4 h-4" />
          <span>Submit New 3D Print</span>
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-cyan-400">Loading Orders Queue...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 p-12">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No active orders yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Upload your first CAD model to receive an instant price quotation and launch production.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            Go to Instant Quote
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status] || {
              label: order.status,
              color: "text-slate-300 bg-slate-900 border-slate-700",
              step: 1,
            };

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/60 hover:bg-slate-900/90 transition-all shadow-xl group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Order Details & Parts */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      {order.isEngineeringReview && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> CAM Review Req.
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length}{" "}
                      {order.items.length === 1 ? "part" : "parts"}
                    </div>

                    {/* Part Thumbnails summary */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-700"
                            style={{ backgroundColor: item.material?.colorHex || "#38bdf8" }}
                          />
                          <span className="truncate max-w-[150px]">{item.fileName}</span>
                          <span className="text-slate-500 text-[11px]">×{item.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Price & Tracking Status */}
                  <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-mono">Total Paid</div>
                      <div className="text-xl font-bold font-mono text-cyan-400">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>

                    {order.trackingNumber ? (
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 mt-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.carrier || "Courier"}: {order.trackingNumber}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-1 group-hover:text-cyan-300">
                        <span>View Status Stepper</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
