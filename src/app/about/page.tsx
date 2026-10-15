import React from "react";
import Link from "next/link";
import { Sun, ShieldCheck, Award, Users, Leaf, ArrowRight, Building2, MapPin, Phone, Mail, FileCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "About Aethel Renewables | T & S Infraproject Pvt Ltd",
  description: "Learn about Aethel Renewables, the clean solar energy brand of T & S Infraproject Pvt Ltd, delivering turnkey rooftop solar installations across India.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero */}
      <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl space-y-6 border border-emerald-900/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Logo variant="white" className="h-12 w-auto" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/60 border border-emerald-700/50 px-3.5 py-1.5 rounded-full">
            A Brand of T &amp; S Infraproject Pvt Ltd
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Engineering India&apos;s Clean Solar Future
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          <strong className="text-white">Aethel Renewables</strong> is the dedicated solar and sustainable energy
          infrastructure brand owned and operated by <strong className="text-white">T &amp; S Infraproject Pvt Ltd</strong>.
          We bridge the gap between world-class photovoltaic engineering and everyday homeowners by providing Tier-1 ALMM equipment,
          transparent offline milestone contracts, and complete PM Surya Ghar Muft Bijli Yojana subsidy liaisoning.
        </p>
      </div>

      {/* Parent Company Corporate Credentials Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Corporate &amp; Legal Entity Information
            </h2>
            <p className="text-xs text-slate-500">
              Aethel Renewables is a registered brand of T &amp; S Infraproject Pvt Ltd
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Building2 className="w-4 h-4 text-emerald-600" /> Parent Company
            </div>
            <p className="text-base font-bold text-slate-900">
              T &amp; S Infraproject Pvt Ltd
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <MapPin className="w-4 h-4 text-emerald-600" /> Registered Office
            </div>
            <p className="text-sm font-semibold text-slate-800">
              100/21, New Basudevpur Road, Belghoria, Kolkata 700056
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <FileCheck className="w-4 h-4 text-emerald-600" /> GST Identification
            </div>
            <p className="text-base font-mono font-bold text-emerald-700">
              19AAJCT6248H1ZV
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Phone className="w-4 h-4 text-emerald-600" /> Direct Contact
            </div>
            <p className="text-sm font-bold text-slate-900">
              +91 96144 75087
            </p>
            <p className="text-xs text-sky-600 truncate">
              tandsinfra@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Highest Efficiency Modules</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Aethel exclusively supplies Tier-1 Monocrystalline PERC and Dual-Glass TOPCon modules
            with 21%+ efficiency ratings and 25-year performance warranties.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Zero Online Payment Risk</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our customers never pay online upfront. All contracts are finalized strictly via bank
            transfer/RTGS only after an on-site engineering audit and formal bill-of-materials sign-off.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">End-to-End PM Surya Ghar Subsidy</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            From National Portal application to DISCOM net-meter commissioning, our engineers
            handle every administrative requirement until your subsidy is credited.
          </p>
        </div>
      </div>
    </div>
  );
}
