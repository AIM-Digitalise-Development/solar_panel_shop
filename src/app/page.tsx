import { auth } from "@/auth";
import { redirect } from "next/navigation";
﻿import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sun,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  FileText,
  Award,
  Sparkles,
  Users,
  Building,
  Wrench,
  Leaf,
  DollarSign,
  HeartHandshake,
  Star,
  Quote,
} from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { ProductCard } from "@/components/ProductCard";
import { PMSuryaGharSection } from "@/components/PMSuryaGharSection";
import { SolarCalculator } from "@/components/SolarCalculator";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ inStock: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Home getFeaturedProducts error:", error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ preview?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  if (resolvedParams?.preview !== "true") {
    const session = await auth();
    if ((session?.user as any)?.role === "admin") {
      redirect("/admin");
    }
  }
  const featuredProducts = await getFeaturedProducts();

  const benefits = [
    {
      icon: TrendingDown,
      title: "Slash Monthly Bills by up to 90%",
      desc: "Produce your own clean electricity during daylight peak hours and export surplus power to the grid through bi-directional net metering.",
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: Leaf,
      title: "Drastically Cut Your Carbon Footprint",
      desc: "A typical 3kW residential rooftop system offsets more than 75 tonnes of CO2 emissions across its operational lifespan—equivalent to planting 120 trees.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: ShieldCheck,
      title: "25-Year Guaranteed Performance",
      desc: "Engineered with anti-reflective tempered glass and robust anodized aluminum to deliver reliable power output through monsoons, heatwaves, and dust.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Wrench,
      title: "Virtually Zero Maintenance",
      desc: "No moving parts in solar photovoltaic panels. An occasional freshwater rinse keeps your modules performing at maximum energy efficiency.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: DollarSign,
      title: "Attractive Direct Govt Subsidies",
      desc: "Avail up to ₹78,000 direct bank transfer grants under PM Surya Ghar Yojana, slashing your rooftop capital payback to just 3 to 4 years.",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: HeartHandshake,
      title: "Risk-Free Offline Payment Workflow",
      desc: "Zero online checkout risk. Review your detailed engineering quotation, inspect equipment on delivery, and pay offline via bank transfer.",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  const testimonials = [
    {
      name: "Suresh Patil",
      city: "Pune, Maharashtra",
      rating: 5,
      system: "3.2 kW Rooftop Mono PERC",
      text: "Our monthly MSEDCL bill used to hover around ₹3,800. After installing SolarShop's PM Surya Ghar kit, our bill dropped to under ₹250! The subsidy of ₹78,000 arrived in my SBI account in 28 days.",
    },
    {
      name: "Ananya Deshmukh",
      city: "Ahmedabad, Gujarat",
      rating: 5,
      system: "5 kW Dual-Glass Bifacial System",
      text: "The quotation process was completely transparent. The SolarShop advisor came for rooftop shade analysis, sent an itemized quote with GST breakdown, and we handled payment offline via RTGS.",
    },
    {
      name: "Vikas Aggarwal",
      city: "Noida, Uttar Pradesh",
      rating: 5,
      system: "10 kW Commercial Rooftop Setup",
      text: "We installed 10kW for our diagnostic clinic. The string inverters provide cloud app monitoring, and our diesel generator runtime is reduced to almost zero. Excellent engineering team.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 sm:pt-20 sm:pb-32">
        {/* Glow & Backdrop gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-sky-600/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>India&apos;s Trusted Solar Equipment Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Power Your Home with the{" "}
                <span className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Infinite Sun
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Transform unutilized rooftop space into your own clean powerhouse. Browse ALMM
                approved photovoltaic modules, smart inverters, and battery storage. Request
                custom quotations with zero online payment risk.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/quote-cart"
                  className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-black rounded-xl shadow-lg shadow-sky-500/25 transition-all text-center flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Request a Free Quote
                </Link>

                <Link
                  href="/solar-calculator"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5 text-amber-400" /> Calculate Savings
                </Link>
              </div>

              {/* Quick stats pills */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">₹78,000</p>
                  <p className="text-xs text-slate-400 mt-0.5">Max Govt Subsidy</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-sky-400">25 Years</p>
                  <p className="text-xs text-slate-400 mt-0.5">Linear Warranty</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400">300 Units</p>
                  <p className="text-xs text-slate-400 mt-0.5">Free Power / Month</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl p-2">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80"
                    alt="Rooftop Solar Installation in India"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Floating floating card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Sun className="w-4 h-4" /> PM Surya Ghar Scheme
                      </span>
                      <span className="text-emerald-400">Direct Benefit Transfer</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      Zero investment risk: Quotations itemize equipment, civil mounting, Discom
                      net-metering, and subsidy application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Go Solar Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            The Solar Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Why Switch to Solar with SolarShop?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Transitioning to rooftop solar is India&apos;s smartest home improvement investment.
            Enjoy unmatched financial returns, energy independence, and environmental stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-7 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${b.color} text-white flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {b.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="bg-slate-100/70 py-16 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                Tier-1 Equipment Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
                Featured Solar Equipment &amp; Packages
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                All panels and inverters comply with Indian BIS standards and MNRE ALMM listing
                for full government subsidy qualification.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 group"
            >
              View Full Catalog ({featuredProducts.length}+ Products){" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id || product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center border border-slate-200">
              <Sun className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900">Loading Solar Catalog</h3>
              <p className="text-sm text-slate-500 mt-1">
                Database initializing. Click below to explore products.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-xl"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Embedded PM Surya Ghar Yojana Section */}
      <PMSuryaGharSection />

      {/* Embedded Solar Calculator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Interactive Sizing Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Calculate Your Solar Sizing &amp; Payback
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Tell us which appliances run in your house to find the ideal kW capacity, estimated
            rooftop space, and 25-year financial savings.
          </p>
        </div>

        <SolarCalculator />
      </section>

      {/* Site Readiness Checklist Preview Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-teal-900 via-sky-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4" /> Technical Pre-Installation Checklist
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Is Your Rooftop Ready for Solar Panels?
            </h3>
            <p className="text-sky-200 text-sm max-w-2xl leading-relaxed">
              Verify your shadow-free area, civil structural load bearing strength, Discom
              sanctioned load, and net-metering compatibility in 2 minutes.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Link
              href="/readiness-checklist"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-center shadow-lg transition-all"
            >
              Check Site Readiness &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / User Stories */}
      <section className="bg-slate-50 py-16 sm:py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Customer Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Trusted by 10,000+ Indian Rooftops
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Read how homeowners and business proprietors are enjoying clean energy and lower power bills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.city}</p>
                  <span className="inline-block mt-1.5 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    {t.system}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
