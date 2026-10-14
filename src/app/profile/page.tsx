"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Mail, Shield, CheckCircle2, FileText, ShoppingBag } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    } else if (session?.user) {
      setName(session.user.name || "");
      setPhone((session.user as any).phone || "");
      setAddress((session.user as any).address || "");
    }
  }, [session, status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          name,
          phone,
          address,
        }),
      });

      if (res.ok) {
        setSaved(true);
        if (update) {
          await update({
            ...session,
            user: { ...session?.user, name, phone, address },
          });
        }
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="p-16 text-center text-slate-500 text-sm">Loading your profile...</div>;
  }

  const role = (session?.user as any)?.role || "Customer";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
            Customer Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            My Account &amp; Site Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your personal contact details for solar site audits and Discom documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase px-3 py-1.5 rounded-xl bg-slate-900 text-amber-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            {role === "admin" ? "System Admin" : "Verified Customer"}
          </span>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Profile details updated successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registered Email (Login ID)
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || ""}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Rooftop / Installation Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, PIN"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              {loading ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Quick navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/my-quotes"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
              My Quote Requests &rarr;
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Review received quotations and accept/reject estimates
            </p>
          </div>
        </a>

        <a
          href="/my-orders"
          className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
              Order History &rarr;
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Track installation progress &amp; net-metering status
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
