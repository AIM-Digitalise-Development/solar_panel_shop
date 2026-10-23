"use client";

import React, { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
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
  ArrowRight,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

export function Navbar() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;
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

  // Admin cannot stay on storefront while logged in as admin - redirect to admin portal
  useEffect(() => {
    if (role === "admin" && pathname && !pathname.startsWith("/admin") && pathname !== "/login") {
      window.location.href = "/admin";
    }
  }, [role, pathname]);

  const navLinks: NavItem[] = [
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Subsidy", href: "/pm-surya-ghar" },
    { name: "Readiness Checklist", href: "/readiness-checklist" },
    { name: "Contact", href: "/contact" },
  ];

  // IMPORTANT: All React hooks above MUST run unconditionally.
  // Do not render storefront navbar when viewing dedicated admin portal routes.
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Aethel Renewables &bull; T &amp; S Infraproject
            </span>
            <span className="hidden md:inline text-sky-200">|</span>
            <span className="hidden md:inline text-sky-100">
              Avail up to &#8377;78,000 Direct Central Subsidy on 3kW+ Rooftop Systems
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-sky-200">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>ALMM &amp; MNRE Approved</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-sky-300" />
              <span>+91 96144 75087</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 py-1 group">
            <Logo variant="dark" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-700 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700">
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

            {/* Calculate Savings Button */}
            <Link
              href="/solar-calculator"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 rounded-lg shadow-sm shadow-sky-600/20 transition-all hover:shadow-md"
            >
              <Calculator className="w-4 h-4" /> Calculate Savings
            </Link>

            {/* Auth Dropdown or Login */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : session?.user ? (
              role === "admin" ? null : (
                /* Verified Customer Dropdown */
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

                  {/* Profile Dropdown Menu for Customers */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 divide-y divide-slate-100">
                      <div className="px-4 py-2.5">
                        <p className="text-sm font-semibold text-slate-900">{session.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                          Verified Customer
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
              )
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
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

          {!session ? (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/solar-calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-linear-to-r from-sky-600 to-teal-600 rounded-lg"
              >
                <Calculator className="w-4 h-4" /> Calculate Savings
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Customer Sign In</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-sky-600 text-white rounded-lg"
              >
                Create Account
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}
