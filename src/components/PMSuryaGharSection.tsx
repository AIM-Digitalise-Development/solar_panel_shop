import React from "react";
import Link from "next/link";
import {
  Sun,
  ShieldCheck,
  Zap,
  IndianRupee,
  CheckCircle,
  FileText,
  Building2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function PMSuryaGharSection() {
  const subsidyTiers = [
    {
      capacity: "1 kW System",
      suitableFor: "Small 1-BHK / 150-180 Units Monthly",
      centralSubsidy: "₹30,000",
      estimatedCost: "₹55,000 - ₹65,000",
      effectiveCost: "₹25,000 - ₹35,000",
      roofNeeded: "100 sq. ft.",
    },
    {
      capacity: "2 kW System",
      suitableFor: "2-BHK / 280-320 Units Monthly",
      centralSubsidy: "₹60,000",
      estimatedCost: "₹1,10,000 - ₹1,25,000",
      effectiveCost: "₹50,000 - ₹65,000",
      roofNeeded: "200 sq. ft.",
      highlight: true,
    },
    {
      capacity: "3 kW System (Max Subsidy)",
      suitableFor: "3-BHK / Independent Bungalows",
      centralSubsidy: "₹78,000",
      estimatedCost: "₹1,60,000 - ₹1,80,000",
      effectiveCost: "₹82,000 - ₹1,02,000",
      roofNeeded: "300 sq. ft.",
      popular: true,
    },
    {
      capacity: "Above 3 kW (Up to 10 kW)",
      suitableFor: "High-Load Homes & Villas",
      centralSubsidy: "₹78,000 (Fixed Cap)",
      estimatedCost: "Variable based on kW",
      effectiveCost: "Net of ₹78,000 subsidy",
      roofNeeded: "100 sq. ft. per kW",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Rooftop Feasibility & Quote",
      desc: "Select your solar system on SolarShop and receive a customized engineering quotation with subsidy calculations.",
    },
    {
      step: "02",
      title: "National Portal Registration",
      desc: "Our liaison team assists you in submitting your electricity connection details on the National Portal for Rooftop Solar.",
    },
    {
      step: "03",
      title: "Discom Technical Approval",
      desc: "The local power distribution company inspects your transformer capacity and sanctions technical feasibility.",
    },
    {
      step: "04",
      title: "Installation & Net-Meter Sync",
      desc: "We install ALMM-certified DCR solar modules, commission the inverter, and Discom installs your bi-directional net meter.",
    },
    {
      step: "05",
      title: "Direct Benefit Transfer (DBT)",
      desc: "The central government deposits the subsidy directly into your bank account within 30 days of Discom commissioning.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-linear-to-b from-sky-50/50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <Sun className="w-4 h-4 text-amber-600 fill-amber-500" />
            Government of India Initiative
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            PM Surya Ghar: <span className="text-sky-600">Muft Bijli Yojana</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            The flagship national rooftop solar program designed to light up 1 Crore Indian
            households with free solar electricity up to 300 units every month, backed by direct
            bank subsidies of up to ₹78,000.
          </p>
        </div>

        {/* Subsidy Structure Table Cards */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Government Central Financial Assistance (CFA) Slab Structure
            </h3>
            <span className="text-xs text-slate-500 font-medium">Updated for FY 2025–2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subsidyTiers.map((tier) => (
              <div
                key={tier.capacity}
                className={`relative rounded-2xl p-6 transition-all border ${
                  tier.popular
                    ? "bg-linear-to-b from-sky-900 to-slate-900 text-white border-sky-600 shadow-xl scale-[1.02]"
                    : "bg-white text-slate-900 border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Most Popular Choice
                  </span>
                )}

                <div className="mb-4">
                  <h4 className={`text-lg font-black ${tier.popular ? "text-white" : "text-slate-900"}`}>
                    {tier.capacity}
                  </h4>
                  <p className={`text-xs mt-1 ${tier.popular ? "text-sky-200" : "text-slate-500"}`}>
                    {tier.suitableFor}
                  </p>
                </div>

                <div className="py-3 my-3 border-y border-slate-100/20">
                  <span className={`text-xs uppercase tracking-wider font-semibold ${tier.popular ? "text-sky-300" : "text-slate-400"}`}>
                    Central Subsidy (DBT)
                  </span>
                  <p className={`text-2xl font-black mt-0.5 ${tier.popular ? "text-emerald-400" : "text-emerald-600"}`}>
                    {tier.centralSubsidy}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className={tier.popular ? "text-slate-300" : "text-slate-500"}>Est. Turnkey Price:</span>
                    <span className="font-semibold">{tier.estimatedCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={tier.popular ? "text-slate-300" : "text-slate-500"}>Net Customer Cost:</span>
                    <span className={`font-bold ${tier.popular ? "text-amber-300" : "text-sky-700"}`}>
                      {tier.effectiveCost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={tier.popular ? "text-slate-300" : "text-slate-500"}>Roof Area Needed:</span>
                    <span className="font-semibold">{tier.roofNeeded}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/20">
                  <Link
                    href={`/products?category=Kit`}
                    className={`block w-full py-2.5 text-center text-xs font-bold rounded-xl transition-all ${
                      tier.popular
                        ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                        : "bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700"
                    }`}
                  >
                    Configure {tier.capacity} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility & Application Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Eligibility Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Who is Eligible?</h3>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Residential Homeowners:</strong> Must own an individual residential house, villa, or independent rooftop floor.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Valid Electricity Consumer Connection:</strong> Active domestic electricity meter connection registered under your name.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>Approved Domestic Modules (DCR):</strong> Panels must be manufactured in India using domestic cells (ALMM listed).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>
                  <strong>No Prior Solar Subsidy:</strong> The specific electricity connection should not have claimed central solar grants earlier.
                </span>
              </li>
            </ul>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900">
              <strong>Group Housing Societies (GHS / RWA):</strong> Common facilities (elevators, water pumping, street lights) are eligible for ₹18,000 per kW up to 500 kW capacity!
            </div>
          </div>

          {/* Application Process Roadmap */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-600" /> 5-Step Subsidy Disbursal Process
            </h3>

            <div className="space-y-6">
              {steps.map((st, idx) => (
                <div key={st.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-300 font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {st.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{st.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="rounded-3xl bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready to Claim Your ₹78,000 Subsidy?
            </h3>
            <p className="text-sm sm:text-base text-sky-200 max-w-xl">
              SolarShop handles the entire end-to-end paperwork: technical feasibility, Discom
              coordination, net-meter installation, and portal documentation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/solar-calculator"
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-center"
            >
              Calculate Your Subsidy
            </Link>
            <Link
              href="/quote-cart"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-center"
            >
              Request Free Formal Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
