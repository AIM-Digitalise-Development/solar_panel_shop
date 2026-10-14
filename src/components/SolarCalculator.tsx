"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Sun,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Calculator,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

interface Appliance {
  id: string;
  name: string;
  defaultWatts: number;
  qty: number;
  hours: number;
}

export function SolarCalculator() {
  const { addToQuote } = useQuoteCart();
  const [addedMessage, setAddedMessage] = useState(false);

  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: "fan", name: "Ceiling Fans", defaultWatts: 75, qty: 3, hours: 10 },
    { id: "light", name: "LED Lights / Bulbs", defaultWatts: 15, qty: 6, hours: 6 },
    { id: "fridge", name: "Refrigerator (Double Door)", defaultWatts: 250, qty: 1, hours: 24 },
    { id: "ac", name: "Inverter AC (1.5 Ton)", defaultWatts: 1400, qty: 1, hours: 6 },
    { id: "tv", name: "Smart TV & Wi-Fi", defaultWatts: 120, qty: 1, hours: 5 },
    { id: "pump", name: "Water Pump (1 HP)", defaultWatts: 750, qty: 1, hours: 1 },
    { id: "geyser", name: "Water Heater / Geyser", defaultWatts: 2000, qty: 1, hours: 1 },
  ]);

  const updateAppliance = (id: string, field: "qty" | "hours", value: number) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: Math.max(0, value) } : app))
    );
  };

  // Calculations
  const dailyWattHours = appliances.reduce(
    (acc, item) => acc + item.defaultWatts * item.qty * item.hours,
    0
  );
  const dailyUnits = dailyWattHours / 1000;
  const monthlyUnits = Math.round(dailyUnits * 30);
  const averageRatePerUnit = 8; // Indian average residential tariff
  const estimatedMonthlyBill = monthlyUnits * averageRatePerUnit;

  // Recommended Solar System size in kW:
  // In India, 1 kW solar generates ~4 units (kWh) per sunny day
  const recommendedKW = Math.max(1, Math.ceil((dailyUnits / 4) * 10) / 10);
  const roundedKW = Math.round(recommendedKW);

  // Roof space needed: ~90-100 sq ft per kW
  const requiredRoofSpace = Math.round(recommendedKW * 95);

  // Estimated gross price: ~₹55,000 per kW
  const estimatedGrossCost = Math.round(recommendedKW * 55000);

  // PM Surya Ghar Subsidy:
  // 1 kW: ₹30,000
  // 2 kW: ₹60,000
  // 3 kW and above: ₹78,000
  let estimatedSubsidy = 0;
  if (recommendedKW >= 3) {
    estimatedSubsidy = 78000;
  } else if (recommendedKW >= 2) {
    estimatedSubsidy = 60000;
  } else if (recommendedKW >= 1) {
    estimatedSubsidy = 30000;
  }

  const netEffectiveCost = Math.max(0, estimatedGrossCost - estimatedSubsidy);
  const annualSavings = Math.round(monthlyUnits * averageRatePerUnit * 12);
  const paybackPeriodYears = (netEffectiveCost / annualSavings).toFixed(1);
  const lifetimeSavings25Yrs = Math.round(annualSavings * 25 - netEffectiveCost);

  const handleAddRecommendedToQuote = () => {
    addToQuote(
      {
        id: `calc-recommended-${roundedKW}kw`,
        name: `Custom Recommended ${recommendedKW}kW Rooftop Solar Solution`,
        slug: "pm-surya-ghar-3kw-complete-home-solar-kit",
        category: "Kit",
        wattage: Math.round(recommendedKW * 1000),
        price: estimatedGrossCost,
        images: [
          "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
        ],
      },
      1,
      `Calculated load: ${dailyUnits.toFixed(1)} kWh/day (${monthlyUnits} units/month). Recommended capacity: ${recommendedKW}kW. Required roof: ~${requiredRoofSpace} sq ft.`
    );
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 text-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black">Know Your Solar Energy Needs</h3>
            <p className="text-xs sm:text-sm text-sky-200">
              Interactive Appliance Load Calculator &amp; PM Surya Ghar Subsidy Estimator
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Appliance Input Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">
              Select Your Daily Home Appliances
            </h4>
            <span className="text-xs font-semibold text-slate-500">
              Adjust counts &amp; usage hours
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {appliances.map((app) => (
              <div
                key={app.id}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{app.name}</p>
                  <p className="text-xs text-slate-400">Rating: ~{app.defaultWatts}W each</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Qty:</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={app.qty}
                      onChange={(e) => updateAppliance(app.id, "qty", parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-center text-sm font-semibold border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium">Hrs/day:</span>
                    <input
                      type="number"
                      min={0}
                      max={24}
                      value={app.hours}
                      onChange={(e) => updateAppliance(app.id, "hours", parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-1 text-center text-sm font-semibold border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 text-xs text-sky-800 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
            <p>
              Calculations assume standard Indian rooftop irradiance of 4–4.5 peak sun hours per day.
              Actual generation may vary by tilt angle, azimuth, and local weather conditions.
            </p>
          </div>
        </div>

        {/* Right: Results Card */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Solar Assessment Summary
            </span>

            {/* Consumption overview */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Daily Energy Need</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  {dailyUnits.toFixed(1)} <span className="text-xs font-normal">kWh/day</span>
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Monthly Power Bill</span>
                <p className="text-lg font-black text-slate-900 mt-0.5">
                  ₹{estimatedMonthlyBill.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Recommended System Size Banner */}
            <div className="bg-linear-to-br from-sky-600 to-teal-700 text-white rounded-xl p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-sky-100 uppercase tracking-wider font-semibold">
                    Recommended System
                  </p>
                  <p className="text-3xl font-black mt-1">{recommendedKW} kWp</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sky-100">Roof Area Required</p>
                  <p className="text-lg font-bold mt-1">~{requiredRoofSpace} sq. ft.</p>
                </div>
              </div>
            </div>

            {/* Subsidy breakdown */}
            <div className="mt-6 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Turnkey Cost:</span>
                <span className="font-semibold text-slate-900">
                  ₹{estimatedGrossCost.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-emerald-600" /> PM Surya Ghar Subsidy:
                </span>
                <span>- ₹{estimatedSubsidy.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-base pt-2 border-t border-slate-200">
                <span>Net Effective Cost:</span>
                <span className="text-sky-600">₹{netEffectiveCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Estimated Payback Period:</span>
                <span className="font-semibold text-slate-700">{paybackPeriodYears} Years</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>25-Year Estimated Savings:</span>
                <span>₹{lifetimeSavings25Yrs.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <button
              onClick={handleAddRecommendedToQuote}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> Add Recommended System to Quote
            </button>

            {addedMessage && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Added to Quote Cart! Review anytime.
              </div>
            )}

            <Link
              href="/pm-surya-ghar"
              className="block text-center text-xs font-semibold text-sky-700 hover:underline"
            >
              Learn more about PM Surya Ghar Subsidy guidelines &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
