"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  Save,
  X,
  Search,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [statusVal, setStatusVal] = useState("");
  const [trackingLinkVal, setTrackingLinkVal] = useState("");
  const [notesVal, setNotesVal] = useState("");
  const [saving, setSaving] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openEdit = (o: any) => {
    setEditingOrder(o);
    setStatusVal(o.status);
    setTrackingLinkVal(o.trackingLink || "");
    setNotesVal(o.notes || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${editingOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusVal,
          trackingLink: trackingLinkVal,
          notes: notesVal,
        }),
      });

      if (res.ok) {
        setEditingOrder(null);
        loadOrders();
      } else {
        alert("Failed to update order status.");
      }
    } catch (err) {
      alert("Error updating order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Solar Installation Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track confirmed solar contracts, site delivery logistics, and commissioning milestones.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-sm text-slate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-sm text-slate-500">
              No orders found. Orders are created when customers accept formal quotations.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Tracking &amp; Notes</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {o.orderNumber}
                        <p className="text-[11px] text-slate-400 font-sans font-normal">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{o.customerDetails?.name}</p>
                        <p className="text-xs text-slate-500">{o.customerDetails?.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {o.customerDetails?.address}
                        </p>
                      </td>
                      <td className="p-4 font-black text-sky-700">
                        ₹{o.totalAmount?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            o.status === "Processing"
                              ? "bg-sky-100 text-sky-800"
                              : o.status === "Shipped"
                              ? "bg-amber-100 text-amber-800"
                              : o.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-600 max-w-xs">
                        {o.trackingLink && (
                          <a
                            href={o.trackingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:underline flex items-center gap-1 font-semibold mb-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Track Shipment
                          </a>
                        )}
                        <p className="truncate text-slate-500">{o.notes || "No notes"}</p>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEdit(o)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                Update Order #{editingOrder.orderNumber}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Installation / Order Status
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Processing">Processing (Engineering &amp; Sourcing)</option>
                  <option value="Shipped">Shipped (Dispatched to Rooftop Site)</option>
                  <option value="Delivered">Delivered (Installed &amp; Commissioned)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispatch / Logistics Tracking URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={trackingLinkVal}
                  onChange={(e) => setTrackingLinkVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Engineering &amp; Net-Metering Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Discom meter test completed. Transformer capacity sanctioned."
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {saving ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
