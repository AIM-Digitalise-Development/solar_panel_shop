"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sun, Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
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
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Invalid email address or password. Please verify and retry.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Sun className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Welcome to SolarShop
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sign in to track your quotation requests, review engineering estimates, and manage orders.
        </p>
      </div>

      {/* If No Admin Exists Banner */}
      {isFirstRun && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> First-Time Setup Required
          </div>
          <p className="text-amber-800 leading-relaxed">
            No administrator accounts currently exist in your database. You can initialize the
            primary root administrator account right now.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 font-bold text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            Create Primary Admin Account &rarr;
          </Link>
        </div>
      )}

      {/* Demo Credentials Quick Box (shown when accounts exist) */}
      {!isFirstRun && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs space-y-2.5">
          <p className="font-bold text-amber-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> Demo Accounts for Rapid Evaluation
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@solarshop.in", "Admin@123456")}
              className="py-1.5 px-2.5 bg-white hover:bg-amber-100 text-amber-900 font-semibold border border-amber-300 rounded-lg text-left"
            >
              Fill Admin
              <span className="block text-[10px] text-amber-700 font-normal">admin@solarshop.in</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("customer@example.com", "Customer@123456")}
              className="py-1.5 px-2.5 bg-white hover:bg-amber-100 text-amber-900 font-semibold border border-amber-300 rounded-lg text-left"
            >
              Fill Customer
              <span className="block text-[10px] text-amber-700 font-normal">customer@example.com</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Sign In to Account"} &rarr;
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-bold text-sky-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-center text-sm text-slate-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
