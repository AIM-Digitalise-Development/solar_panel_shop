"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  ArrowRight,
  Sun,
} from "lucide-react";

export default function AdminQuotesListPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const loadQuotes = (status = statusFilter) => {
    setLoading(true);
    const query = status !== "All" ? `?status=${status}` : "";
    fetch(`/api/quotes${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quotes) setQuotes(data.quotes);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuotes(statusFilter);
  }, [statusFilter]);

  const filteredQuotes = quotes.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.customerDetails?.name?.toLowerCase().includes(term) ||
      q.customerDetails?.email?.toLowerCase().includes(term) ||
      q.customerDetails?.phone?.includes(term) ||
      q._id?.includes(term)
    );
  });

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Pending":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "Quoted":
        return (
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Quoted
          </span>
        );
      case "Accepted":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Rejected
          </span>
        );
      default:
        return <span>{s}</span>;
    }
  };

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customer Quotation Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review inbound inquiries, engineer customized proposals, and dispatch official quotations.
          </p>
        </div>

        {/* Filters and search */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
            {["All", "Pending", "Quoted", "Accepted", "Rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search customer, phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-sm text-slate-500">Loading requests...</div>
          ) : filteredQuotes.length === 0 ? (
            <div className="p-16 text-center text-sm text-slate-500">
              No quote requests match your filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Equipment Inquired</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Received On</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQuotes.map((q) => (
                    <tr key={q._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono font-bold text-slate-900">
                        #{q._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{q.customerDetails?.name}</p>
                        <p className="text-xs text-slate-500">{q.customerDetails?.email}</p>
                        <p className="text-xs text-slate-500">{q.customerDetails?.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800">
                          {q.items?.length || 0} product(s)
                        </span>
                        <p className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                          {q.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(", ")}
                        </p>
                      </td>
                      <td className="p-4">{getStatusBadge(q.status)}</td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(q.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/quotes/${q._id}`}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {q.status === "Pending" ? "Generate Quote" : "Manage Quote"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
