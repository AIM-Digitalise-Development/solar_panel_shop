"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, CheckCircle2, FileText, ArrowRight, Sun, Shield } from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

export interface ProductProps {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  category: "Panel" | "Inverter" | "Battery" | "Kit" | "Accessory";
  wattage?: number;
  price?: number;
  images: string[];
  specs?: { key: string; value: string }[];
  inStock?: boolean;
  featured?: boolean;
}

export function ProductCard({ product }: { product: ProductProps }) {
  const { addToQuote } = useQuoteCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQuote(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const defaultImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Image & Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <Link href={`/products/${product.slug}`} className="block relative w-full h-full">
            <Image
              src={defaultImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {product.category}
            </span>
            {product.wattage ? (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <Zap className="w-3 h-3 fill-current" /> {product.wattage}W
              </span>
            ) : null}
          </div>

          {product.featured && (
            <span className="absolute top-3 right-3 bg-sky-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs pointer-events-none">
              Top Rated
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <Link href={`/products/${product.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs snippet */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              {product.specs.slice(0, 2).map((sp) => (
                <div key={sp.key} className="bg-slate-50 p-1.5 rounded-md">
                  <span className="text-slate-400 block truncate">{sp.key}</span>
                  <span className="font-semibold text-slate-700 block truncate">{sp.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-2">
        <div className="flex items-baseline justify-between mb-3.5">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Indicative Price
            </span>
            <span className="text-lg font-black text-slate-900">
              {product.price ? `₹${product.price.toLocaleString("en-IN")}` : "Request Quotation"}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="py-2.5 px-3 text-center text-xs font-semibold text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Details
          </Link>

          <button
            onClick={handleAdd}
            className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-sky-600 hover:bg-sky-700 text-white"
            }`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Added!
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" /> Add to Quote
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
