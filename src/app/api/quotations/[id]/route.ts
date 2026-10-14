import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Quotation } from "@/lib/models/Quotation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    await connectDB();

    const quotation = await Quotation.findById(id).populate("quoteRequestId");
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const role = (session?.user as any)?.role;
    const isOwner =
      session?.user?.id === quotation.userId?.toString() ||
      session?.user?.email?.toLowerCase().trim() === quotation.customerEmail?.toLowerCase().trim();

    if (role !== "admin" && !isOwner && session) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch quotation" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const quotation = await Quotation.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update quotation" }, { status: 500 });
  }
}
