import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "SolarShop | India's Premier Rooftop Solar Panels & Inverters E-Commerce",
  description:
    "Power your home and business with high-efficiency Monocrystalline PERC solar panels, hybrid inverters, and lithium energy storage. Request free quotations and claim up to ₹78,000 subsidy under PM Surya Ghar Yojana.",
  keywords: [
    "Solar Panels",
    "PM Surya Ghar Muft Bijli Yojana",
    "Solar Inverter",
    "Rooftop Solar Subsidy",
    "Monocrystalline PERC",
    "Bifacial Solar Panels",
    "Solar Calculator",
    "Solar Quotation India",
  ],
  authors: [{ name: "SolarShop Engineering Team" }],
  openGraph: {
    title: "SolarShop | Turnkey Rooftop Solar & Clean Energy Solutions",
    description:
      "Get itemized commercial & residential solar quotations with zero online payment risk. ALMM and MNRE approved solar equipment direct to your rooftop.",
    type: "website",
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
