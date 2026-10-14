import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const minWattage = searchParams.get("minWattage");
    const maxWattage = searchParams.get("maxWattage");

    const query: any = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minWattage || maxWattage) {
      query.wattage = {};
      if (minWattage) query.wattage.$gte = Number(minWattage);
      if (maxWattage) query.wattage.$lte = Number(maxWattage);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const { name, slug, description, category, wattage, price, images, specs, inStock, featured } = body;

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Product name, description, and category are required." },
        { status: 400 }
      );
    }

    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const existing = await Product.findOne({ slug: productSlug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this URL slug already exists." },
        { status: 409 }
      );
    }

    const product = await Product.create({
      name: name.trim(),
      slug: productSlug,
      description,
      category,
      wattage: Number(wattage) || 0,
      price: Number(price) || 0,
      images: Array.isArray(images) ? images : images ? [images] : [],
      specs: Array.isArray(specs) ? specs : [],
      inStock: inStock !== undefined ? inStock : true,
      featured: featured !== undefined ? featured : false,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
