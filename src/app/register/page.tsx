"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Sun,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
    // Check if system is in first-time setup mode
    fetch("/api/setup-admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.isFirstRun) {
          setIsFirstRun(true);
        }
      })
      .catch((err) => console.error("Error checking first-run status:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      // Auto sign in after register
      const loginRes = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (data.isFirstAdmin) {
        // If first administrator, redirect directly to admin dashboard!
        router.push("/admin");
      } else {
        router.push("/profile");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block py-1">
            <Logo variant="dark" className="h-14 w-auto mx-auto" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isFirstRun ? "Initialize Aethel Administrator" : "Create Your Aethel Account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isFirstRun
                ? "First-time setup detected. Register the primary root administrator for Aethel Renewables."
                : "Aethel Renewables by T & S Infraproject Pvt Ltd &bull; Track quotations and subsidies."}
            </p>
          </div>
        </div>

        {/* First-Time Setup Banner */}
        {isFirstRun && (
          <div className="p-4 bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl text-xs space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>First-Time Setup: Primary Administrator Grant</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              The users directory is currently empty or has no active administrators.
              <strong> This account will automatically be created with full Administrator permissions</strong>,
              granting immediate access to the operations dashboard, product catalog management, and quotation issuing.
            </p>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isFirstRun ? "Administrator Full Name *" : "Full Name *"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isFirstRun ? "e.g. System Administrator" : "e.g. Ramesh Patel"}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Login ID) *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourcompany.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password (min 6 chars) *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isFirstRun ? "Office / Headquarters Address" : "Installation Address / City"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Solar Business Park, BKC, Mumbai"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isFirstRun
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20"
              }`}
            >
              {loading
                ? "Creating Account..."
                : isFirstRun
                ? "Create Administrator Account & Open Dashboard"
                : "Create Free Account"}{" "}
              &rarr;
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-sky-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
