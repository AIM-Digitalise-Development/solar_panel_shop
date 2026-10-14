import React from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { ProductCard } from "@/components/ProductCard";
import { Filter, Search, SlidersHorizontal, Sun, Zap, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    wattage?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const searchKeyword = params.search || "";
  const activeWattage = params.wattage || "All";

  await connectDB();

  const query: any = { inStock: true };

  if (activeCategory !== "All") {
    query.category = activeCategory;
  }

  if (searchKeyword) {
    query.$or = [
      { name: { $regex: searchKeyword, $options: "i" } },
      { description: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  if (activeWattage === "sub400") {
    query.wattage = { $gt: 0, $lt: 400 };
  } else if (activeWattage === "400to600") {
    query.wattage = { $gte: 400, $lte: 600 };
  } else if (activeWattage === "above1000") {
    query.wattage = { $gte: 1000 };
  }

  let products = await Product.find(query).sort({ featured: -1, createdAt: -1 }).lean();
  products = JSON.parse(JSON.stringify(products));

  const categories = [
    { label: "All Products", value: "All" },
    { label: "Solar Panels", value: "Panel" },
    { label: "Solar Inverters", value: "Inverter" },
    { label: "Battery Storage", value: "Battery" },
    { label: "Complete Kits", value: "Kit" },
    { label: "Accessories", value: "Accessory" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="bg-linear-to-r from-sky-900 via-blue-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> High-Efficiency Solar Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Solar Equipment &amp; Packages
          </h1>
          <p className="text-sky-200 text-sm sm:text-base leading-relaxed">
            Browse MNRE &amp; ALMM listed Monocrystalline PERC modules, dual-glass bifacial panels,
            smart string inverters, and lithium energy storage systems. Click &ldquo;Add to Quote&rdquo;
            to receive an itemized proposal.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 pointer-events-none hidden md:block">
          <Sun className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}${
                  searchKeyword ? `&search=${searchKeyword}` : ""
                }${activeWattage !== "All" ? `&wattage=${activeWattage}` : ""}`}
                className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Search & Secondary Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <form method="GET" action="/products" className="w-full md:max-w-md relative">
            <input type="hidden" name="category" value={activeCategory} />
            <input type="hidden" name="wattage" value={activeWattage} />
            <input
              type="text"
              name="search"
              defaultValue={searchKeyword}
              placeholder="Search solar panels, inverters, kW..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Wattage Filters */}
          <div className="flex items-center gap-2 self-start md:self-center text-xs font-medium text-slate-600">
            <span className="font-semibold text-slate-800">Wattage:</span>
            <Link
              href={`/products?category=${activeCategory}${searchKeyword ? `&search=${searchKeyword}` : ""}&wattage=All`}
              className={`px-2.5 py-1 rounded-md ${
                activeWattage === "All" ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`}
            >
              All
            </Link>
            <Link
              href={`/products?category=${activeCategory}${searchKeyword ? `&search=${searchKeyword}` : ""}&wattage=400to600`}
              className={`px-2.5 py-1 rounded-md ${
                activeWattage === "400to600" ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`}
            >
              400W – 600W
            </Link>
            <Link
              href={`/products?category=${activeCategory}${searchKeyword ? `&search=${searchKeyword}` : ""}&wattage=above1000`}
              className={`px-2.5 py-1 rounded-md ${
                activeWattage === "above1000" ? "bg-slate-900 text-white" : "hover:bg-slate-100"
              }`}
            >
              1kW+ Systems
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-semibold text-slate-500">
              Showing <span className="text-slate-900">{products.length}</span> solar products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product: any) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
          <Sun className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No solar equipment found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different equipment category.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-xl text-sm"
          >
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
