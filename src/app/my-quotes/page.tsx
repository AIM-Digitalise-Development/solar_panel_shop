"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, Sun, ShieldAlert } from "lucide-react";

export default function MyQuotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/my-quotes");
      return;
    }

    if (session?.user) {
      if ((session.user as any).role === "admin") {
        router.replace("/admin/quotes");
        return;
      }
      fetch("/api/quotes")
        .then((res) => res.json())
        .then((data) => {
          if (data.quotes) setQuotes(data.quotes);
        })
        .catch((err) => console.error("Error loading quotes:", err))
        .finally(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
        Loading quotation requests...
      </div>
    );
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Pending":
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case "Quoted":
        return (
          <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Quotation Ready
          </span>
        );
      case "Accepted":
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Declined
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
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            My Solar Quotation Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track status, review formal engineering proposals, and confirm installation contracts.
          </p>
        </div>

        <Link
          href="/products"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm self-start sm:self-auto"
        >
          + Request New Quote
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No quotation requests found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You haven&apos;t requested any solar quotes yet. Browse our solar modules or kits to get
            started.
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
          >
            Browse Products &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Quote Request #{quote._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Submitted on {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(quote.status)}
                  <Link
                    href={`/my-quotes/${quote._id}`}
                    className="px-4 py-2 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>

              {/* Items summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Equipment Requested:</span>
                  <ul className="space-y-1">
                    {quote.items?.map((item: any, idx: number) => (
                      <li key={idx} className="truncate">
                        &bull; {item.name} &times; <span className="font-bold">{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Site Address:</span>
                  <p className="truncate text-slate-500">{quote.customerDetails?.address || "Address provided"}</p>
                  {quote.quotationId && (
                    <p className="mt-2 text-emerald-700 font-semibold flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5" /> Formal quotation has been issued! Click View Details to review pricing.
                    </p>
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
