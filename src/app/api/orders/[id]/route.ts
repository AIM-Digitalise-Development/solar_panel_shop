import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id).populate("quotationId");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const role = (session?.user as any)?.role;
    const isOwner =
      session?.user?.id === order.userId?.toString() ||
      session?.user?.email?.toLowerCase().trim() === order.customerDetails?.email?.toLowerCase().trim();

    if (role !== "admin" && !isOwner && session) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
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

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
