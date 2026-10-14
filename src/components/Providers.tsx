"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { QuoteCartProvider } from "@/context/QuoteCartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QuoteCartProvider>{children}</QuoteCartProvider>
    </SessionProvider>
  );
}
