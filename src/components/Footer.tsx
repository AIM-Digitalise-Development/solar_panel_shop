"use client";

import { usePathname } from "next/navigation";
﻿import React from "react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import {
  Sun,
  ShieldCheck,
  Award,
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">25-Year Linear Warranty</h4>
              <p className="text-xs text-slate-400">Guaranteed 84%+ power output at 25 years</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">MNRE & ALMM Enlisted</h4>
              <p className="text-xs text-slate-400">Eligible for Central & State subsidies</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">PM Surya Ghar Yojana</h4>
              <p className="text-xs text-slate-400">Get up to ₹78,000 Direct DBT subsidy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Zero Risk Quotation</h4>
              <p className="text-xs text-slate-400">Free engineering audit & offline payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block py-1">
              <Logo variant="white" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Aethel Renewables is the clean energy and solar infrastructure brand of <strong className="text-white font-semibold">T &amp; S Infraproject Pvt Ltd</strong>.
              Delivering high-efficiency turnkey rooftop solar, MNRE ALMM equipment, and end-to-end PM Surya Ghar subsidy facilitation across India.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-white font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                T &amp; S Infraproject Pvt Ltd
              </p>
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100/21, New Basudevpur Road, Belghoria, Kolkata 700056</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">GST</span>
                <span className="font-mono font-semibold">19AAJCT6248H1ZV</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 96144 75087</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:tandsinfra@gmail.com" className="hover:text-white transition-colors">tandsinfra@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Solar Equipment
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=Panel" className="hover:text-white transition-colors">
                  Monocrystalline PERC Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=Panel" className="hover:text-white transition-colors">
                  Bifacial Dual-Glass Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=Inverter" className="hover:text-white transition-colors">
                  Grid-Tied String Inverters
                </Link>
              </li>
              <li>
                <Link href="/products?category=Inverter" className="hover:text-white transition-colors">
                  Hybrid MPPT Inverters
                </Link>
              </li>
              <li>
                <Link href="/products?category=Battery" className="hover:text-white transition-colors">
                  LiFePO4 Lithium Batteries
                </Link>
              </li>
              <li>
                <Link href="/products?category=Kit" className="hover:text-white transition-colors">
                  Complete Turnkey Solar Kits
                </Link>
              </li>
            </ul>
          </div>

          {/* Subsidy & Tools */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Tools & Schemes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pm-surya-ghar" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  PM Surya Ghar Scheme <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/solar-calculator" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Load & Savings Calculator <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/readiness-checklist" className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  Rooftop Readiness Checklist <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/quote-cart" className="hover:text-white transition-colors">
                  Request Free Formal Quote
                </Link>
              </li>
              <li>
                <Link href="/my-quotes" className="hover:text-white transition-colors">
                  Track Quote Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Aethel Renewables
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Engineering Consultation
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Dealer & Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} Aethel Renewables. A brand of T &amp; S Infraproject Pvt Ltd (GST: 19AAJCT6248H1ZV). All rights reserved.
            Prices displayed are indicative. Final pricing and government subsidy eligibility are
            confirmed via formal quotation following physical rooftop engineering audit.
          </p>
          <p className="shrink-0 text-slate-400">
            Payment Method: <span className="text-white font-medium">Offline Bank Transfer / RTGS / Cheque</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
