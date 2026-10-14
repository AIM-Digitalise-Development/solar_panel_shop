import React from "react";
import Link from "next/link";
import { Sun, ShieldCheck, Award, Users, Leaf, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | SolarShop India",
  description: "Learn about SolarShop's mission to accelerate clean solar energy adoption across Indian homes and enterprises.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="bg-linear-to-r from-sky-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full">
          Powering India&apos;s Clean Energy Transition
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          About SolarShop
        </h1>
        <p className="text-sky-200 text-sm sm:text-base max-w-3xl leading-relaxed">
          SolarShop was founded with a singular purpose: to democratize high-efficiency rooftop
          solar for millions of Indian homeowners. We eliminate middleman markups and confusing
          paperwork by pairing Tier-1 ALMM equipment with transparent offline quotations and full
          PM Surya Ghar government subsidy liaisoning.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Highest Efficiency Modules</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We exclusively supply Tier-1 Monocrystalline PERC and Dual-Glass Bifacial solar modules
            with 21%+ efficiency and 25-year performance warranties.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Online Payment Risk</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our customers never pay online upfront. All contracts are finalized only after a physical
            rooftop audit and formal bill-of-materials sign-off.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Full Subsidy Assistance</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            From the National Portal registration to Discom transformer feasibility and net-meter
            installation, our engineers manage every administrative step.
          </p>
        </div>
      </div>
    </div>
  );
}
