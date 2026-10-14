import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { QuoteRequest, Product, Order, User } from "@/lib/models";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  FileText,
  Package,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sun,
  Sparkles,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDB();

  // If no admin accounts exist in the database, redirect directly to registration wizard
  const adminCountCheck = await User.countDocuments({ role: "admin" });
  if (adminCountCheck === 0) {
    redirect("/register");
  }

  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  const [totalQuotes, pendingQuotes, totalProducts, totalOrders, totalUsers, recentQuotes] =
    await Promise.all([
      QuoteRequest.countDocuments(),
      QuoteRequest.countDocuments({ status: "Pending" }),
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);

  const recentSerialized = JSON.parse(JSON.stringify(recentQuotes));

  return (
    <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Solar Operations Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time monitoring of quote inquiries, technical assessments, and equipment inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + Add New Product
            </Link>
            <Link
              href="/admin/quotes"
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Review All Quotes ({pendingQuotes} Pending)
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quote Requests
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalQuotes}</p>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                {pendingQuotes} awaiting quotation
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Solar Catalog
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalProducts}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Active equipment SKUs</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Installation Orders
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalOrders}</p>
              <p className="text-xs text-sky-600 font-semibold mt-1">In progress / commissioned</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Users
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalUsers}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Registered customers &amp; staff</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recent Quotes Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Quotation Inquiries</h3>
              <p className="text-xs text-slate-500">Inbound customer quote requests awaiting action</p>
            </div>
            <Link
              href="/admin/quotes"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View Full Quote List &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Requested</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSerialized.map((q: any) => (
                  <tr key={q._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{q.customerDetails?.name}</p>
                      <p className="text-xs text-slate-400">{q.customerDetails?.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-700">
                        {q.items?.length || 0} items
                      </span>
                      <p className="text-xs text-slate-400 truncate max-w-xs">
                        {q.items?.[0]?.name}
                      </p>
                    </td>
                    <td className="p-4 text-xs text-slate-600 max-w-xs truncate">
                      {q.customerDetails?.address}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          q.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : q.status === "Quoted"
                            ? "bg-sky-100 text-sky-800"
                            : q.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/quotes/${q._id}`}
                        className="inline-block px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        {q.status === "Pending" ? "Prepare Quote" : "View / Edit"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
