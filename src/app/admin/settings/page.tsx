"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Mail,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Validation helpers
  const isMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatch = Boolean(newPassword && newPassword === confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current administrator password.");
      return;
    }

    if (!isMinLength) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg("New password must be different from your current password.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setSuccessMsg(
        data.message ||
          "Password updated successfully! Please use your new password on your next sign-in."
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while changing your password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">
          <Shield className="w-3.5 h-3.5" /> Security &amp; Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Admin Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Manage your administrator authentication credentials and enhance the security of your
          Operations Portal access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Admin Profile Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {session?.user?.name || "Administrator"}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {session?.user?.email || "admin@solarshop.in"}
                </p>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    <ShieldCheck className="w-3 h-3 text-amber-700" /> System Administrator
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Account Role
                </span>
                <span className="font-semibold text-slate-900 capitalize">
                  {(session?.user as any)?.role || "Admin"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Login Email
                </span>
                <span className="font-semibold text-slate-900 truncate max-w-[150px]">
                  {session?.user?.email || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Encryption
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  Bcrypt Salt (10 Rounds)
                </span>
              </div>
            </div>
          </div>

          {/* Security Recommendations Card */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 space-y-4 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" /> Password Best Practices
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Use at least 8 characters with a mix of letters, numbers, and symbols.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Do not reuse passwords across multiple enterprise accounts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>Periodically rotate administrator credentials to protect sensitive quote &amp; client data.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-600" /> Change Administrator Password
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate with your current password to set a new administrator credential.
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Password update failed</p>
                  <p className="text-rose-700 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Password updated successfully</p>
                  <p className="text-emerald-700 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current administrator password"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password (min. 8 characters)"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Real-time Password Strength Criteria */}
              {newPassword && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Password Checklist:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        isMinLength ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isMinLength ? "text-emerald-600" : "text-slate-300"
                        }`}
                      />
                      <span>8+ Characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        hasNumberOrSymbol ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          hasNumberOrSymbol ? "text-emerald-600" : "text-slate-300"
                        }`}
                      />
                      <span>Number or Symbol</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        isMatch ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isMatch ? "text-emerald-600" : "text-slate-300"
                        }`}
                      />
                      <span>Passwords Match</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={submitting || (!currentPassword && !newPassword && !confirmPassword)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={submitting || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    "Updating Password..."
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Update Administrator Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
