"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  PhoneCall,
  Award,
  Sun,
  Truck,
  RotateCcw,
  Sparkles,
  Send,
} from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

export function ProductDetailClient({ product }: { product: any }) {
  const { addToQuote } = useQuoteCart();
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0] ||
      "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Callback form state
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackAddress, setCallbackAddress] = useState("");
  const [callbackSending, setCallbackSending] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);

  const handleAddToQuote = () => {
    addToQuote(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName || !callbackPhone) return;

    setCallbackSending(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: product._id,
              name: product.name,
              quantity,
              wattage: product.wattage,
              price: product.price,
              notes: "Direct callback request from product detail page.",
            },
          ],
          customerDetails: {
            name: callbackName,
            email: `${callbackPhone.replace(/[^0-9]/g, "")}@callback.solarshop.in`,
            phone: callbackPhone,
            address: callbackAddress || "Not specified (Requested Callback)",
            message: `Customer requested a priority phone callback regarding ${product.name} (Qty: ${quantity}).`,
          },
        }),
      });

      if (res.ok) {
        setCallbackSuccess(true);
        setCallbackName("");
        setCallbackPhone("");
        setCallbackAddress("");
      }
    } catch (err) {
      console.error("Callback submit error:", err);
    } finally {
      setCallbackSending(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-slate-900/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
              {product.wattage ? (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" /> {product.wattage} Watts
                </span>
              ) : null}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-sky-600 ring-2 ring-sky-500/30 scale-105"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust badges row */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">Made in India</p>
              <p className="text-[10px] text-slate-500">ALMM &amp; DCR Listed</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <ShieldCheck className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">25-Yr Warranty</p>
              <p className="text-[10px] text-slate-500">Linear Power Yield</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <Sun className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-800">MNRE Approved</p>
              <p className="text-[10px] text-slate-500">Subsidy Eligible</p>
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              {product.category} Equipment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
                  Indicative Unit Price
                </span>
                <span className="text-3xl font-black text-slate-900">
                  {product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Request Official Quote"}
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready for Quotation
              </span>
            </div>
            <p className="text-xs text-slate-500">
              *All pricing is formalized via offline quotation following rooftop feasibility audit.
              Payment is made strictly offline via official bank wire transfer/cheque.
            </p>
          </div>

          {/* Quantity & Add to Quote */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-slate-900 text-sm min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToQuote}
                className={`grow py-4 px-6 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-sky-600 hover:bg-sky-700 text-white"
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Added to Quote Cart!
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" /> Add to Quote Cart
                  </>
                )}
              </button>

              <Link
                href="/quote-cart"
                className="py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl text-center transition-colors"
              >
                View Quote Cart
              </Link>
            </div>
          </div>

          {/* Request Callback Mini Form */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm">Need Engineering Guidance? Request a Callback</h4>
            </div>
            <p className="text-xs text-amber-800">
              Leave your contact details and our certified solar consultant will call you within 2
              business hours with complete feasibility advice.
            </p>

            {callbackSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Callback request received! An advisor will call your number shortly.
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (10 digits)"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="City / State (e.g. Pune, MH)"
                  value={callbackAddress}
                  onChange={(e) => setCallbackAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  disabled={callbackSending}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {callbackSending ? "Submitting..." : "Request Immediate Callback"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      {product.specs && product.specs.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-slate-900">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <h3 className="text-xl font-bold">Technical Specifications &amp; Engineering Data</h3>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {product.specs.map((sp: { key: string; value: string }, idx: number) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-3 p-4 text-sm hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-600">{sp.key}</span>
                <span className="sm:col-span-2 text-slate-900 font-medium">{sp.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
