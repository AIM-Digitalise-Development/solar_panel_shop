import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  FileText,
  PhoneCall,
  Award,
  Sun,
  Truck,
  Building,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ProductDetailClient } from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  let product = await Product.findOne({ slug }).lean();
  if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(slug).lean();
  }

  if (!product) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(product));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-900">
          Products
        </Link>
        <span>/</span>
        <Link href={`/products?category=${serialized.category}`} className="hover:text-slate-900">
          {serialized.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{serialized.name}</span>
      </nav>

      {/* Main Product Section with interactive client handlers */}
      <ProductDetailClient product={serialized} />
    </div>
  );
}
