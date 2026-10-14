import React from "react";
import { SolarCalculator } from "@/components/SolarCalculator";

export const metadata = {
  title: "Solar Sizing & Load Calculator | SolarShop India",
  description:
    "Interactive rooftop solar load calculator. Determine the exact kW solar system size, required roof area, and 25-year financial savings for your home.",
};

export default function SolarCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
          Intelligent Engineering Tool
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-3 tracking-tight">
          Know Your Solar Energy Needs
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Input your everyday domestic appliances to simulate daily unit requirements, recommended
          photovoltaic kilowatt rating, and the applicable PM Surya Ghar subsidy grant.
        </p>
      </div>

      <SolarCalculator />
    </div>
  );
}
