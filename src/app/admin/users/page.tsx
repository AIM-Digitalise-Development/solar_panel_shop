"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Users, Shield, User, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (user: any) => {
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change role of "${user.name}" to ${newRole.toUpperCase()}?`)) return;

    setUpdatingId(user._id);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          role: newRole,
        }),
      });

      if (res.ok) {
        loadUsers();
      } else {
        alert("Failed to update user role.");
      }
    } catch (err) {
      alert("Error updating user.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Directory &amp; Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered customers, engineering consultants, and administrative privileges.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-sm text-slate-500">Loading user directory...</div>
          ) : users.length === 0 ? (
            <div className="p-16 text-center text-sm text-slate-500">No registered users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{u.phone || "—"}</td>
                      <td className="p-4 text-xs text-slate-600 max-w-xs truncate">
                        {u.address || "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            u.role === "admin"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-sky-100 text-sky-800"
                          }`}
                        >
                          {u.role || "customer"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={updatingId === u._id}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          {u.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
