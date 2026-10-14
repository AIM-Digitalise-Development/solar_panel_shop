"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  Users,
  Sun,
  Shield,
  ArrowLeft,
} from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Quote Requests", href: "/admin/quotes", icon: FileText },
    { name: "Products Catalog", href: "/admin/products", icon: Package },
    { name: "Orders & Installations", href: "/admin/orders", icon: ShoppingBag },
    { name: "User Directory", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                SolarShop <span className="text-amber-400 font-bold text-xs uppercase px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">Admin Center</span>
              </h2>
              <p className="text-[11px] text-slate-400">Engineering &amp; Operations Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
            </Link>
          </div>
        </div>

        {/* Tab links */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? "bg-slate-800 text-amber-400 border-amber-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50 border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
