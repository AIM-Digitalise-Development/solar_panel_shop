"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Sun,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Download,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function QuoteDetailCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const id = params?.id as string;

  const [quoteRequest, setQuoteRequest] = useState<any>(null);
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/quotes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quoteRequest) setQuoteRequest(data.quoteRequest);
        if (data.quotation) setQuotation(data.quotation);
      })
      .catch((err) => console.error("Error loading quote details:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/my-quotes/${id}`);
      return;
    }
    if (id) {
      loadData();
    }
  }, [id, authStatus, router]);

  const handleAction = async (action: "accept" | "reject") => {
    if (
      !confirm(
        action === "accept"
          ? "Are you sure you want to accept this quotation? An official order will be created and our engineers will initiate site scheduling."
          : "Are you sure you want to decline this quotation?"
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        loadData();
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (err: any) {
      alert(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || authStatus === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Loading quotation details...
      </div>
    );
  }

  if (!quoteRequest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Quotation Request Not Found</h2>
        <Link href="/my-quotes" className="text-sky-600 text-sm font-semibold hover:underline">
          &larr; Back to My Quotes
        </Link>
      </div>
    );
  }

  const isAccepted = quoteRequest.status === "Accepted";
  const isRejected = quoteRequest.status === "Rejected";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link
          href="/my-quotes"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          &larr; Back to My Quote Requests
        </Link>
        <span className="text-xs font-mono text-slate-400">ID: #{quoteRequest._id}</span>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Status Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
            Quote Request Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Request #{quoteRequest._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submitted on{" "}
            {new Date(quoteRequest.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          {isAccepted ? (
            <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Quotation Accepted
            </span>
          ) : isRejected ? (
            <span className="bg-rose-100 text-rose-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-rose-200">
              <XCircle className="w-4 h-4 text-rose-600" /> Quotation Declined
            </span>
          ) : quotation ? (
            <span className="bg-sky-100 text-sky-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-sky-200">
              <Sun className="w-4 h-4 text-sky-600" /> Formal Quotation Ready
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" /> Under Engineering Review
            </span>
          )}
        </div>
      </div>

      {/* Formal Quotation Card (if issued by admin) */}
      {quotation ? (
        <div className="bg-white rounded-3xl border-2 border-sky-600 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Sun className="w-4 h-4 fill-amber-300" /> Official SolarShop Commercial Quotation
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Quotation #{quotation._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-sky-200 mt-1">
                Issued for {quotation.customerName} &bull; Valid until{" "}
                {new Date(quotation.validUntil).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {quotation.pdfUrl && (
              <a
                href={quotation.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-colors self-start md:self-center"
              >
                <Download className="w-4 h-4 text-sky-600" /> Download PDF Quotation
              </a>
            )}
          </div>

          {/* Quotation Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Items Table */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Itemized Bill of Materials
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3 sm:p-4">Item / Description</th>
                      <th className="p-3 sm:p-4 text-center">Qty</th>
                      <th className="p-3 sm:p-4 text-right">Unit Rate</th>
                      <th className="p-3 sm:p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotation.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 sm:p-4 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-3 sm:p-4 text-center">{item.quantity}</td>
                        <td className="p-3 sm:p-4 text-right font-medium text-slate-600">
                          ₹{item.unitPrice.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 sm:p-4 text-right font-bold text-slate-900">
                          ₹{item.total.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50/80 border-t border-slate-200 text-sm">
                    <tr>
                      <td colSpan={3} className="p-3 sm:p-4 text-right font-semibold text-slate-600">
                        Subtotal:
                      </td>
                      <td className="p-3 sm:p-4 text-right font-bold text-slate-900">
                        ₹{quotation.subtotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    {quotation.tax > 0 && (
                      <tr>
                        <td colSpan={3} className="p-2 sm:p-3 text-right text-xs text-slate-500">
                          GST / Statutory Taxes:
                        </td>
                        <td className="p-2 sm:p-3 text-right text-xs text-slate-500 font-semibold">
                          ₹{quotation.tax.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-slate-900 text-base">
                      <td colSpan={3} className="p-3 sm:p-4 text-right font-black text-slate-900">
                        Total Turnkey Investment:
                      </td>
                      <td className="p-3 sm:p-4 text-right font-black text-sky-700 text-lg">
                        ₹{quotation.totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Terms and Subsidy notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
                <Sun className="w-4 h-4 text-amber-600" /> Commercial Terms &amp; Subsidy Note
              </h4>
              <p className="leading-relaxed text-amber-900">{quotation.terms}</p>
              <p className="text-[11px] text-amber-800 pt-1 border-t border-amber-200">
                *Payment is completed offline directly to SolarShop India&apos;s verified bank
                account following technical rooftop audit.
              </p>
            </div>

            {/* Accept / Decline CTA Buttons (only if not already accepted/rejected) */}
            {!isAccepted && !isRejected && (
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("reject")}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                >
                  Decline Quotation
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("accept")}
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {actionLoading ? "Processing..." : "Accept Quotation & Proceed"} &rarr;
                </button>
              </div>
            )}

            {isAccepted && (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-4">
                <div className="text-xs text-emerald-800 space-y-1">
                  <p className="font-bold text-sm text-emerald-950">
                    You accepted this quotation on{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    Your installation order is being processed. An engineer has been allocated to
                    schedule site verification.
                  </p>
                </div>
                <Link
                  href="/my-orders"
                  className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                >
                  View in Order History &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-sky-50 border border-sky-200 rounded-3xl p-8 text-center space-y-3">
          <Sun className="w-12 h-12 text-sky-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Engineering Proposal in Preparation</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Our solar engineers are analyzing your site details and compiling the final bill of
            materials. You will receive an email as soon as the quotation is finalized.
          </p>
        </div>
      )}

      {/* Customer & Requested Equipment Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Original Request Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div>
            <span className="font-semibold text-slate-500 block mb-1">Customer Information:</span>
            <p className="font-bold text-slate-900">{quoteRequest.customerDetails?.name}</p>
            <p className="text-slate-600">{quoteRequest.customerDetails?.email}</p>
            <p className="text-slate-600">{quoteRequest.customerDetails?.phone}</p>
            <p className="text-slate-700 mt-2 font-medium">{quoteRequest.customerDetails?.address}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-500 block mb-1">Requested Items:</span>
            <ul className="space-y-1.5 text-slate-700">
              {quoteRequest.items?.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between border-b border-slate-100 pb-1">
                  <span>
                    {item.name} {item.wattage ? `(${item.wattage}W)` : ""}
                  </span>
                  <span className="font-bold">&times; {item.quantity}</span>
                </li>
              ))}
            </ul>

            {quoteRequest.customerDetails?.message && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                <span className="font-bold text-slate-700 block mb-0.5">Notes from Customer:</span>
                {quoteRequest.customerDetails.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
