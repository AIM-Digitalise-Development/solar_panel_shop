import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User, QuoteRequest } from "@/lib/models";
import { AdminPortalShell } from "@/components/admin/AdminPortalShell";

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  // If no admin accounts exist in the database, redirect directly to registration wizard
  const adminCountCheck = await User.countDocuments({ role: "admin" });
  if (adminCountCheck === 0) {
    redirect("/register");
  }

  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  const pendingQuotesCount = await QuoteRequest.countDocuments({ status: "Pending" });

  return (
    <AdminPortalShell
      user={session.user || {}}
      pendingQuotesCount={pendingQuotesCount}
    >
      {children}
    </AdminPortalShell>
  );
}
