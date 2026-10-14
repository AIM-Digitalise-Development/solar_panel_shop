"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, CheckCircle2, Clock, ExternalLink, Sun, FileText } from "lucide-react";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/my-orders");
      return;
    }
    if (session?.user) {
      if ((session.user as any).role === "admin") {
        router.replace("/admin/orders");
        return;
      }
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Loading order history...
      </div>
    );
  }

  const getOrderStatusBadge = (s: string) => {
    switch (s) {
      case "Processing":
        return (
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Engineering &amp; Procurement
          </span>
        );
      case "Shipped":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Dispatched to Site
          </span>
        );
      case "Delivered":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Commissioned &amp; Net-Metered
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
            Cancelled
          </span>
        );
      default:
        return <span>{s}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            My Solar Installation Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Confirmed solar projects undergoing rooftop structural delivery, wiring, and Discom net metering.
          </p>
        </div>

        <Link
          href="/my-quotes"
          className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
        >
          View Pending Quotes &rarr;
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No active orders yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Once you accept an official quotation, your installation order will be generated and
            tracked here.
          </p>
          <Link
            href="/my-quotes"
            className="inline-block px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
          >
            Review Quotations &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      &bull; Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rooftop Address: {order.customerDetails?.address}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getOrderStatusBadge(order.status)}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  System Components:
                </h4>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {item.name} &times; {item.quantity}
                      </span>
                      <span className="font-bold text-slate-900">
                        ₹{item.total?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Tracking */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">Total Investment Value:</span>
                  <p className="text-xl font-black text-sky-700">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {order.trackingLink && (
                    <a
                      href={order.trackingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Dispatch Tracking
                    </a>
                  )}
                  {order.notes && (
                    <span className="text-xs text-slate-500 italic max-w-xs">{order.notes}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
