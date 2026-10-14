import React from "react";
import { SiteReadinessChecklist } from "@/components/SiteReadinessChecklist";

export const metadata = {
  title: "Rooftop Site Readiness Checklist | SolarShop India",
  description:
    "Evaluate rooftop shadow analysis, civil load bearing capacity, Discom net metering, and electrical parameters before installing rooftop solar.",
};

export default function ReadinessChecklistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
          Pre-Installation Technical Audit
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-3 tracking-tight">
          Is Your Site Solar Ready?
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Review the essential physical, legal, and electrical checkpoints to ensure seamless
          installation and rapid Discom net-metering approvals.
        </p>
      </div>

      <SiteReadinessChecklist />
    </div>
  );
}
