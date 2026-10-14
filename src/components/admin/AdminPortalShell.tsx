"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingBag,
  Users,
  Calculator,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sun,
  Shield,
  Bell,
  Search,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Activity,
  Layers,
} from "lucide-react";

interface AdminPortalShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  pendingQuotesCount: number;
}

export function AdminPortalShell({
  children,
  user,
  pendingQuotesCount,
}: AdminPortalShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainNav = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Quotation Requests",
      href: "/admin/quotes",
      icon: FileText,
      badge: pendingQuotesCount > 0 ? pendingQuotesCount : null,
      badgeColor: "bg-amber-500 text-slate-950 font-black",
    },
    {
      name: "Products & Inventory",
      href: "/admin/products",
      icon: Package,
      badge: null,
    },
    {
      name: "Orders & Execution",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: null,
    },
    {
      name: "User Directory",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
  ];

  const toolsNav = [
    {
      name: "Solar Sizing Calculator",
      href: "/solar-calculator",
      icon: Calculator,
    },
    {
      name: "PM Surya Ghar Guide",
      href: "/pm-surya-ghar",
      icon: Sparkles,
    },
    {
      name: "Site Readiness Checklist",
      href: "/readiness-checklist",
      icon: CheckCircle2,
    },
  ];

  const getPageTitle = () => {
    if (pathname === "/admin") return "Operations Dashboard";
    if (pathname.startsWith("/admin/quotes")) return "Quotation Engineering Hub";
    if (pathname.startsWith("/admin/products")) return "Product Catalog & Stock";
    if (pathname.startsWith("/admin/orders")) return "Orders & Project Execution";
    if (pathname.startsWith("/admin/users")) return "User & Role Directory";
    return "Administration Portal";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20 shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white tracking-tight text-base">SolarShop</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 border border-amber-400/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Operations & Engineering Hub</p>
          </div>
        </div>

        {/* Live System Health Pill */}
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-medium">System Online</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">DB Ready</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Operations Group */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Operations Management
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-slate-950" : "text-amber-400/80"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? "bg-slate-950 text-amber-400"
                        : item.badgeColor || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Tools & Guides */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Engineering & Reference
          </div>
          {toolsNav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{item.name}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            );
          })}
        </div>

        {/* Storefront Switch */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
            Public Website
          </div>
          <Link
            href="/?preview=true"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Customer Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </Link>
        </div>
      </div>

      {/* Admin User Profile & Sign Out Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black text-xs shrink-0">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name || "Administrator"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email || "admin@solarshop.in"}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out of Admin Portal"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900 antialiased font-sans">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-xs flex-1 flex flex-col h-full z-10 shadow-2xl">
            <SidebarContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Wrapper (offset by desktop sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-64 xl:pl-72 min-w-0 min-h-screen">
        {/* Top Operational Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <span>Admin Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 font-semibold">{getPageTitle()}</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/admin/quotes"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Quotes</span>
              {pendingQuotesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
                  {pendingQuotesCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>

            <Link
              href="/?preview=true"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {user.name ? user.name[0].toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Dedicated Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
