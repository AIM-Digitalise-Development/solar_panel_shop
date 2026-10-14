"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  ShieldCheck,
  Home,
  Sun,
  Zap,
  Hammer,
  Scale,
  Wallet,
  Cpu,
  ArrowRight,
  FileCheck,
} from "lucide-react";

interface CheckItem {
  id: string;
  category: string;
  title: string;
  description: string;
  importance: "Critical" | "Important" | "Recommended";
  iconName: string;
}

export function SiteReadinessChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([
    "roof-space",
    "sunlight",
  ]);

  const items: CheckItem[] = [
    {
      id: "roof-space",
      category: "Rooftop Space",
      title: "Shadow-Free Rooftop Area Available",
      description:
        "You possess at least 80–100 sq. ft. of unshaded flat RCC, tin-shed, or pitched roof per 1 kWp of desired solar system capacity.",
      importance: "Critical",
      iconName: "Home",
    },
    {
      id: "sunlight",
      category: "Sun Exposure",
      title: "Optimal South-Facing Sunlight Access",
      description:
        "The roof receives uninterrupted sunlight between 9:00 AM and 4:00 PM without deep shade from adjacent high-rise buildings or dense trees.",
      importance: "Critical",
      iconName: "Sun",
    },
    {
      id: "load",
      category: "Electrical Sanction",
      title: "Sanctioned Load Matches Desired Solar Capacity",
      description:
        "Your state Discom electricity bill shows a sanctioned load equal to or greater than the proposed solar system capacity (or you are prepared to apply for load extension).",
      importance: "Important",
      iconName: "Zap",
    },
    {
      id: "structure",
      category: "Structural Integrity",
      title: "Roof Load-Bearing Strength & Wind Resistance",
      description:
        "The roof slab or truss structure is structurally sound, crack-free, and capable of anchoring galvanized steel or aluminum mounting frames against wind speeds up to 150 km/h.",
      importance: "Critical",
      iconName: "Hammer",
    },
    {
      id: "net-meter",
      category: "Discom Regulations",
      title: "Net Metering & Grid Interconnection Viability",
      description:
        "Your residential distribution grid supports bi-directional net metering so surplus afternoon solar generation can be exported for electricity bill credits.",
      importance: "Important",
      iconName: "Scale",
    },
    {
      id: "budget",
      category: "Financial & Subsidy",
      title: "Capital Budget & PM Surya Ghar Subsidy Readiness",
      description:
        "You have reviewed the net investment requirements and hold a bank account linked with Aadhaar for Direct Benefit Transfer (DBT) subsidy credit.",
      importance: "Recommended",
      iconName: "Wallet",
    },
    {
      id: "inverter",
      category: "System Topology",
      title: "Inverter Topology Selection (On-Grid vs Hybrid)",
      description:
        "You have decided whether you need a grid-tied system for zero bills or a hybrid system with lithium battery storage for power backup during outages.",
      importance: "Recommended",
      iconName: "Cpu",
    },
  ];

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((checkedIds.length / items.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-teal-900 via-sky-900 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Comprehensive Site Survey Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Rooftop Solar Readiness Checklist</h3>
            <p className="text-xs sm:text-sm text-sky-200 mt-1 max-w-xl">
              Ensure your rooftop meets all technical, regulatory, and structural parameters
              before solar installation and Discom net-metering clearance.
            </p>
          </div>

          {/* Progress gauge */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-xl text-center min-w-[140px]">
            <span className="text-xs text-sky-200 font-semibold uppercase">Readiness</span>
            <p className="text-3xl font-black text-emerald-400 mt-0.5">{progressPercent}%</p>
            <p className="text-[11px] text-slate-300">
              {checkedIds.length} of {items.length} Checked
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2.5 mt-6 overflow-hidden">
          <div
            className="bg-linear-to-r from-amber-400 via-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 gap-3.5">
          {items.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked
                    ? "bg-emerald-50/50 border-emerald-300 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                  )}
                </div>

                <div className="grow space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.importance === "Critical"
                          ? "bg-rose-100 text-rose-700"
                          : item.importance === "Important"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-bold ${
                      isChecked ? "text-emerald-950" : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Readiness verdict */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              {progressPercent === 100
                ? "🎉 Your Rooftop is 100% Solar-Ready!"
                : progressPercent >= 60
                ? "⚡ Excellent! Your site has high feasibility for solar."
                : "📋 Preliminary Assessment in Progress"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {progressPercent === 100
                ? "You meet all ideal conditions for PM Surya Ghar rooftop subsidy installation."
                : "Our certified engineers conduct free physical structural & shadow audits prior to installation."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/quote-cart"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-all"
            >
              <FileCheck className="w-4 h-4" /> Request Site Survey &amp; Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
