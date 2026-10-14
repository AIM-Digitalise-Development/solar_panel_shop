"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuoteCart } from "@/context/QuoteCartContext";
import {
  FileText,
  Trash2,
  Send,
  CheckCircle2,
  Sun,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Info,
} from "lucide-react";

export default function QuoteCartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, updateQuantity, removeFromQuote, clearQuote, totalItems, totalEstimated } =
    useQuoteCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill from session if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !name) setName(session.user.name);
      if (session.user.email && !email) setEmail(session.user.email);
      if ((session.user as any).phone && !phone) setPhone((session.user as any).phone);
      if ((session.user as any).address && !address) setAddress((session.user as any).address);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (items.length === 0) {
      setErrorMsg("Your quote cart is empty. Add products before requesting a quote.");
      return;
    }

    if (!name || !email || !phone || !address) {
      setErrorMsg("Please fill in your name, email, phone number, and address.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId.startsWith("calc-") ? null : i.productId,
          name: i.name,
          quantity: i.quantity,
          wattage: i.wattage,
          price: i.price,
          notes: i.notes || "",
        })),
        customerDetails: {
          name,
          email,
          phone,
          address,
          message,
        },
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      setSubmittedQuote(data);
      clearQuote();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedQuote) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Quotation Request Submitted Successfully
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Thank You, {name}!
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
            Your quotation request has been recorded under Reference ID:
          </p>
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl font-mono text-sm font-bold text-sky-800 border border-slate-200">
            #{submittedQuote.quoteRequestId}
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-left space-y-4 max-w-xl mx-auto">
          <h3 className="font-bold text-slate-900 text-base">Next Steps in Your Solar Journey:</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>
                <strong>Confirmation Sent:</strong> We have dispatched an email summary to <strong>{email}</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>
                <strong>Engineering Review:</strong> Our solar design engineer will calculate your rooftop azimuth, shadow profile, and PM Surya Ghar subsidy eligibility.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>
                <strong>Itemized Formal Quotation:</strong> Within 24–48 hours, you will receive an official quotation with payment terms via email and on your customer portal.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/my-quotes"
            className="w-full sm:w-auto px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            Track Quote on Customer Portal &rarr;
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all text-sm"
          >
            Browse More Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
          Quotation Review
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
          Request Quotation Cart
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Review your selected solar equipment and submit a formal request. No payment is required
          online. You will receive an engineering estimate and offline bank transfer terms.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Your Quote Cart is Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Browse our solar panels, smart inverters, and complete turnkey kits to add them to your
            quotation.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
          >
            Explore Solar Catalog &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-sm font-bold text-slate-700">
                Selected Products ({totalItems} items)
              </span>
              <button
                onClick={clearQuote}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <Sun className="w-8 h-8 text-amber-500 m-auto" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Category: {item.category} {item.wattage ? `| ${item.wattage}W` : ""}
                      </p>
                      {item.price ? (
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          Indicative: ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50 text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 font-bold text-slate-900 bg-white min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromQuote(item.productId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Offline workflow reminder card */}
            <div className="bg-sky-50/70 rounded-2xl p-5 border border-sky-200 text-xs text-sky-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-950">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                100% Risk-Free Offline Quotation System
              </div>
              <p>
                In compliance with solar industry standards, official payment occurs only after
                site inspection, final bill of materials approval, and formal contract signing.
                Payment is made directly via bank NEFT/RTGS or account-payee cheque.
              </p>
            </div>
          </div>

          {/* Right: Request Quotation Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Customer &amp; Site Details</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your contact info so our engineering team can prepare your official quotation.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rooftop / Installation Site Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House No., Street, City, State, PIN Code"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions / Electricity Connection Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Sanctioned load 5kW, 3-phase connection, interested in PM Surya Ghar ₹78,000 subsidy."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Estimated Summary */}
              {totalEstimated > 0 && (
                <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                  <span className="text-slate-600">Indicative Equipment Total:</span>
                  <span className="font-bold text-slate-900">
                    ₹{totalEstimated.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-black text-sm rounded-xl shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Submitting Request..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Quotation Request &rarr;
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                By submitting, you agree to receive official quotation communications from certified
                SolarShop engineers. No spam guaranteed.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
