"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThreeViewer from "@/components/viewer/ThreeViewer";
import {
  ShieldAlert,
  ClipboardList,
  Sliders,
  PackagePlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Truck,
  DollarSign,
  Box,
  Eye,
  Edit,
  Save,
  Scale,
  Timer,
  Star,
  Trash2,
} from "lucide-react";

interface OrderItem {
  id: string;
  fileName: string;
  fileUrl: string | null;
  dimX: number;
  dimY: number;
  dimZ: number;
  volumeCm3: number;
  weightGrams?: number;
  printMinutes?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reviewStatus: string;
  dfmWarnings: string | null;
  technology?: { name: string };
  material?: { name: string; colorHex: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  trackingNumber: string | null;
  carrier: string | null;
  staffNotes: string | null;
  customerNotes: string | null;
  isEngineeringReview: boolean;
  createdAt: string;
  customer?: { name: string; email: string; phone: string | null };
  items: OrderItem[];
}

interface Material {
  id: string;
  technologyId: string;
  name: string;
  color: string;
  colorHex: string;
  density: number;
  costPerCm3: number;
  costPerGram: number;     // EGP per gram
  costPerMinute: number;   // EGP per minute
  minWallThickness: number;
  maxDimX: number;
  maxDimY: number;
  maxDimZ: number;
  setupFee: number;        // EGP
  isAvailable: boolean;
  technology?: { name: string };
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  partName: string | null;
  materialUsed: string | null;
  createdAt: string;
  isApproved: boolean;
}

export default function StaffDashboardPage() {
  const { user, isStaffOrAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRICING" | "REVIEWS" | "CATALOG">("ORDERS");
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // CAM Review Drawer
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newTracking, setNewTracking] = useState("");
  const [newCarrier, setNewCarrier] = useState("Bosta Express");
  const [newStaffNotes, setNewStaffNotes] = useState("");
  const [additionalFee, setAdditionalFee] = useState("");
  const [manualDiscount, setManualDiscount] = useState("");
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Material Editing
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);

  // New Product Modal
  const [newProductTitle, setNewProductTitle] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductMaterial, setNewProductMaterial] = useState("PLA Tough Industrial");
  const [newProductDesc, setNewProductDesc] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchMaterials();
    fetchReviews();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = selectedStatus === "ALL" ? "/api/orders" : `/api/orders?status=${selectedStatus}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();
      if (data.technologies) {
        const flatMats: Material[] = [];
        data.technologies.forEach((t: { id: string; name: string; materials: Material[] }) => {
          t.materials.forEach((m: Material) => {
            flatMats.push({ ...m, technology: { name: t.name } });
          });
        });
        setMaterials(flatMats);
      }
    } catch (err) {
      console.error("Failed to load materials:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews?limit=50");
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const openOrderInspection = (order: Order) => {
    setInspectingOrder(order);
    setNewStatus(order.status);
    setNewTracking(order.trackingNumber || "");
    setNewCarrier(order.carrier || "Bosta Express");
    setNewStaffNotes(order.staffNotes || "");
    setAdditionalFee("");
    setManualDiscount("");
  };

  const handleUpdateOrder = async () => {
    if (!inspectingOrder) return;
    setIsUpdatingOrder(true);
    try {
      const res = await fetch(`/api/orders/${inspectingOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: newTracking,
          carrier: newCarrier,
          staffNotes: newStaffNotes,
          additionalFee: additionalFee ? parseFloat(additionalFee) : undefined,
          manualDiscount: manualDiscount ? parseFloat(manualDiscount) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setInspectingOrder(data.order);
        fetchOrders();
        alert("Order status & CAM parameters updated in EGP!");
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleSaveMaterial = async () => {
    if (!editingMaterial) return;
    setIsSavingMaterial(true);
    try {
      const res = await fetch("/api/materials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMaterial),
      });
      const data = await res.json();
      if (data.success) {
        fetchMaterials();
        setEditingMaterial(null);
        alert("Khalid3D material rates (EGP per gram & minute) updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update material:", err);
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductTitle || !newProductPrice) return;
    setIsAddingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProductTitle,
          price: parseFloat(newProductPrice),
          technology: "FDM",
          material: newProductMaterial,
          description: newProductDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewProductTitle("");
        setNewProductPrice("");
        setNewProductDesc("");
        alert("Product added to catalog in EGP!");
      }
    } catch (err) {
      console.error("Failed to add product:", err);
    } finally {
      setIsAddingProduct(false);
    }
  };

  if (!isStaffOrAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 font-mono">STAFF ACCESS RESTRICTED</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This workspace is restricted to authorized Khalid3D CAM engineers and technicians. Please log in with your staff email and password to adjust EGP pricing rates and manage orders.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-md shadow-amber-500/20"
          >
            Staff Sign In (Email & Password)
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Portal Header (White Theme) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
              KHALID3D <span className="text-blue-600">STAFF OPS HUB</span>
            </h1>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
              Role: {user?.role || "STAFF"}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Logged in as {user?.name || "Khalid Ekbal"}. CAM dispatch, EGP pricing configuration (Grams & Minutes), and review moderation.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "ORDERS"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("PRICING")}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "PRICING"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pricing Matrix (EGP)</span>
          </button>

          <button
            onClick={() => setActiveTab("REVIEWS")}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "REVIEWS"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("CATALOG")}
            className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "CATALOG"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDER DISPATCH & REVIEW QUEUE */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 outline-none shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-white rounded-xl border border-slate-200">
              {[
                "ALL",
                "PENDING_REVIEW",
                "QUOTED",
                "IN_PRODUCTION",
                "POST_PROCESSING",
                "QC_PASSED",
                "SHIPPED",
              ].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-colors whitespace-nowrap ${
                    selectedStatus === st
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {st.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount (EGP)</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                      No orders found in this view.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {o.orderNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-sans font-bold text-slate-800">{o.customer?.name}</div>
                        <div className="text-[11px] text-slate-400">{o.customer?.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-blue-600">
                          {o.items[0]?.material?.name || "PLA Tough"}
                        </span>
                        <span className="text-slate-400 ml-1">({o.items.length} parts)</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-800">
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {o.totalAmount.toFixed(2)} EGP
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openOrderInspection(o)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect CAM</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING MATRIX ENGINE (EGP PER GRAM & MINUTE) */}
      {activeTab === "PRICING" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center gap-3">
            <Scale className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Khalid3D Dynamic Pricing Formula</span>
              Price (EGP) = (Weight in Grams × <strong>Cost/Gram</strong>) + (Machine Print Minutes × <strong>Cost/Minute</strong>) + <strong>Setup Fee</strong>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Material Name</th>
                  <th className="px-4 py-3">Density (g/cm³)</th>
                  <th className="px-4 py-3 text-blue-700 font-bold">Cost / Gram (EGP)</th>
                  <th className="px-4 py-3 text-blue-700 font-bold">Cost / Minute (EGP)</th>
                  <th className="px-4 py-3">Setup Fee (EGP)</th>
                  <th className="px-4 py-3">Chamber (X×Y×Z mm)</th>
                  <th className="px-4 py-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: m.colorHex }}
                        />
                        <span className="font-bold text-slate-900">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{m.density}</td>
                    <td className="px-4 py-3.5 text-blue-600 font-bold text-sm">
                      {m.costPerGram.toFixed(2)} EGP
                    </td>
                    <td className="px-4 py-3.5 text-blue-600 font-bold text-sm">
                      {m.costPerMinute.toFixed(2)} EGP
                    </td>
                    <td className="px-4 py-3.5 font-semibold">{m.setupFee.toFixed(2)} EGP</td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {m.maxDimX} × {m.maxDimY} × {m.maxDimZ}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setEditingMaterial(m)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS MODERATION */}
      {activeTab === "REVIEWS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-mono">
              Customer Reviews ({reviews.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Reviews submitted on orders are displayed on the public homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    {rev.partName && (
                      <span className="text-slate-500 font-mono text-[11px] block">
                        Part: {rev.partName} ({rev.materialUsed})
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CATALOG MANAGER */}
      {activeTab === "CATALOG" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-mono flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-blue-600" />
              Publish New Hardware Part (EGP)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Product Title</label>
                <input
                  type="text"
                  value={newProductTitle}
                  onChange={(e) => setNewProductTitle(e.target.value)}
                  placeholder="e.g. Quadcopter Arm V3 Set"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Material</label>
                  <select
                    value={newProductMaterial}
                    onChange={(e) => setNewProductMaterial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none"
                  >
                    <option value="PLA Tough Industrial">PLA Tough</option>
                    <option value="PETG Engineering Grade">PETG Engineering</option>
                    <option value="TPU 95A Flexible">TPU Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Price (EGP)</label>
                  <input
                    type="number"
                    step="5"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="150.00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Description</label>
                <textarea
                  rows={3}
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Infill percentage, mounting specifications..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleCreateProduct}
                disabled={isAddingProduct || !newProductTitle || !newProductPrice}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish to Public Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT CAM MODAL */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">
                  CAM INSPECTION: {inspectingOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Customer: {inspectingOrder.customer?.name} ({inspectingOrder.customer?.email})
                </p>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-3 py-1 bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 3D Model Viewer */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-blue-600 font-bold">
                    {inspectingOrder.items[0]?.fileName}
                  </span>
                  {inspectingOrder.items[0]?.fileUrl && (
                    <a
                      href={inspectingOrder.items[0].fileUrl}
                      download={inspectingOrder.items[0].fileName}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> Download STL
                    </a>
                  )}
                </div>

                <div className="h-[360px] rounded-xl overflow-hidden border border-slate-200">
                  <ThreeViewer
                    modelUrl={inspectingOrder.items[0]?.fileUrl || "/models/drone_motor_bracket.stl"}
                    fileName={inspectingOrder.items[0]?.fileName}
                    technologyName="FDM"
                    dimX={inspectingOrder.items[0]?.dimX}
                    dimY={inspectingOrder.items[0]?.dimY}
                    dimZ={inspectingOrder.items[0]?.dimZ}
                    unit="mm"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Status and EGP Re-Quote Controls */}
              <div className="lg:col-span-5 space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Update Manufacturing Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-bold"
                  >
                    <option value="PENDING_REVIEW">PENDING_REVIEW (CAM Check)</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option>
                    <option value="IN_PRODUCTION">IN_PRODUCTION (On Bed)</option>
                    <option value="POST_PROCESSING">POST_PROCESSING</option>
                    <option value="QC_PASSED">QC_PASSED (Tolerances OK)</option>
                    <option value="SHIPPED">SHIPPED (Delivered)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Egyptian Courier</label>
                    <select
                      value={newCarrier}
                      onChange={(e) => setNewCarrier(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                    >
                      <option value="Bosta Express">Bosta Express</option>
                      <option value="Aramex Egypt">Aramex Egypt</option>
                      <option value="Egypt Post">Egypt Post</option>
                      <option value="Cairo Hand Delivery">Cairo Hand Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">Tracking #</label>
                    <input
                      type="text"
                      value={newTracking}
                      onChange={(e) => setNewTracking(e.target.value)}
                      placeholder="BOSTA-9912401-EG"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">+ Surcharge (EGP)</label>
                    <input
                      type="number"
                      step="5"
                      value={additionalFee}
                      onChange={(e) => setAdditionalFee(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-bold">- Discount (EGP)</label>
                    <input
                      type="number"
                      step="5"
                      value={manualDiscount}
                      onChange={(e) => setManualDiscount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Staff Slicing & QC Notes</label>
                  <textarea
                    rows={3}
                    value={newStaffNotes}
                    onChange={(e) => setNewStaffNotes(e.target.value)}
                    placeholder="e.g. Sliced at 0.20mm with 4 walls on Bambu X1-C..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 resize-none font-sans"
                  />
                </div>

                <button
                  onClick={handleUpdateOrder}
                  disabled={isUpdatingOrder}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Commit CAM Updates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MATERIAL PRICING (EGP GRAMS + MINUTES) MODAL */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 text-xs font-mono shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 font-mono">
                Configure Pricing: {editingMaterial.name}
              </h3>
              <button
                onClick={() => setEditingMaterial(null)}
                className="text-slate-400 hover:text-slate-800 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <label className="block text-blue-900 mb-1 font-bold">Cost / Gram (EGP)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingMaterial.costPerGram}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, costPerGram: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-white border border-blue-300 rounded-lg p-2 text-blue-900 font-bold"
                  />
                </div>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <label className="block text-blue-900 mb-1 font-bold">Cost / Minute (EGP)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingMaterial.costPerMinute}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, costPerMinute: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-white border border-blue-300 rounded-lg p-2 text-blue-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Setup Fee (EGP)</label>
                  <input
                    type="number"
                    step="5"
                    value={editingMaterial.setupFee}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, setupFee: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Density (g/cm³)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingMaterial.density}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, density: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Build Chamber (X × Y × Z mm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={editingMaterial.maxDimX}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, maxDimX: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                  <input
                    type="number"
                    value={editingMaterial.maxDimY}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, maxDimY: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                  <input
                    type="number"
                    value={editingMaterial.maxDimZ}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, maxDimZ: parseFloat(e.target.value) || 0 })
                    }
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMaterial}
                  disabled={isSavingMaterial}
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm"
                >
                  Save Rates (EGP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
