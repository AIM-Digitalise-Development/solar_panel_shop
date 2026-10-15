import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aethel Renewables | Premier Rooftop Solar & Clean Energy Solutions",
  description:
    "Aethel Renewables by T & S Infraproject Pvt Ltd. High-efficiency Monocrystalline PERC solar panels, hybrid inverters, and turnkey rooftop installations under PM Surya Ghar Yojana.",
  keywords: [
    "Aethel",
    "Aethel Renewables",
    "T & S Infraproject Pvt Ltd",
    "Solar Panels",
    "PM Surya Ghar Muft Bijli Yojana",
    "Solar Inverter",
    "Rooftop Solar Subsidy",
    "Monocrystalline PERC",
    "Bifacial Solar Panels",
    "Solar Calculator India",
  ],
  authors: [{ name: "Aethel Renewables (T & S Infraproject Pvt Ltd)" }],
  openGraph: {
    title: "Aethel Renewables | Turnkey Rooftop Solar by T & S Infraproject Pvt Ltd",
    description:
      "Get itemized commercial & residential solar quotations with zero online payment risk. ALMM and MNRE approved solar equipment direct to your rooftop.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
