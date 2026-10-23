import React from "react";
import Link from "next/link";
import { PMSuryaGharSection } from "@/components/PMSuryaGharSection";
import { Sun } from "lucide-react";

export const metadata = {
  title: "PM Surya Ghar: Muft Bijli Yojana Guide & Subsidies | SolarShop",
  description:
    "Comprehensive guide to the PM Surya Ghar Muft Bijli Yojana rooftop solar scheme. Learn how to claim up to ₹78,000 direct bank transfer subsidy for your home.",
};

export default function PMSuryaGharPage() {
  return (
    <div className="space-y-16 py-10">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Sun className="w-4 h-4" /> Official Scheme Breakdown
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              PM Surya Ghar: <br className="hidden sm:inline" />
              <span className="text-amber-300">Muft Bijli Yojana</span>
            </h1>
            <p className="text-sky-200 text-sm sm:text-base leading-relaxed">
              Everything Indian homeowners need to know about the Prime Minister&apos;s rooftop
              solar initiative: subsidy slabs, bank account DBT disbursal, Discom net metering,
              and qualifying technical criteria.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/solar-calculator"
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-all"
              >
                Estimate Your Subsidy
              </Link>
              <Link
                href="/products?category=Kit"
                className="px-6 py-3.5 bg-white/15 hover:bg-white/20 text-white font-bold rounded-xl text-sm border border-white/20 transition-all"
              >
                Browse Subsidy Solar Kits &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Component */}
      <PMSuryaGharSection />
    </div>
  );
}
