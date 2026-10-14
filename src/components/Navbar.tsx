"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useQuoteCart } from "@/context/QuoteCartContext";
import {
  Sun,
  FileText,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  Calculator,
  CheckCircle2,
  PhoneCall,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const { totalItems } = useQuoteCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Products", href: "/products" },
    { name: "PM Surya Ghar", href: "/pm-surya-ghar", badge: "Subsidy" },
    { name: "Solar Calculator", href: "/solar-calculator" },
    { name: "Readiness Checklist", href: "/readiness-checklist" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const role = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> PM Surya Ghar: Muft Bijli Yojana
            </span>
            <span className="hidden md:inline text-sky-200">|</span>
            <span className="hidden md:inline text-sky-100">
              Claim up to ₹78,000 Direct Central Subsidy on Rooftop Solar
            </span>
          </div>
          <div className="flex items-center gap-4 text-sky-200">
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> ALMM & MNRE Certified
            </span>
            <a
              href="tel:18002121786"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" /> 1800-2121-SUN
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                Solar<span className="text-sky-600">Shop</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Renewable Energy Direct
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-sky-700 bg-sky-50 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3">
            {/* Quote Cart Button */}
            <Link
              href="/quote-cart"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-sky-700 bg-slate-100 hover:bg-sky-50 rounded-lg transition-all border border-slate-200"
              title="View Quote Cart"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Quote Cart</span>
              {totalItems > 0 && (
                <span className="bg-sky-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Dropdown or Login */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : session?.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-sky-600 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                      {session.user.name?.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{role || "Customer"}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                        {role === "admin" ? "System Admin" : "Verified Customer"}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        href="/my-quotes"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                      >
                        <FileText className="w-4 h-4 text-slate-400" />
                        My Quote Requests
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        Order History
                      </Link>
                    </div>

                    {role === "admin" && (
                      <div className="py-1 bg-amber-50/50">
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100/50"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          Admin Dashboard
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/solar-calculator"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 rounded-lg shadow-sm shadow-sky-600/20 transition-all hover:shadow-md"
                >
                  <Calculator className="w-4 h-4" /> Calculate Savings
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                pathname === link.href
                  ? "bg-sky-50 text-sky-700 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}

          {!session && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700"
              >
                Customer Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-sky-600 text-white rounded-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
