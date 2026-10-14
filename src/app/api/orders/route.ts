import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Quotation } from "@/lib/models/Quotation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Please sign in to view orders." }, { status: 401 });
    }

    await connectDB();
    const role = (session.user as any)?.role;

    let query: any = {};
    if (role !== "admin") {
      query = {
        $or: [
          { userId: session.user.id },
          { "customerDetails.email": session.user.email?.toLowerCase().trim() },
        ],
      };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { quotationId, status, trackingLink, notes } = body;

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      quotationId: quotation._id,
      quoteRequestId: quotation.quoteRequestId,
      userId: quotation.userId || session.user.id,
      orderNumber,
      items: quotation.items,
      customerDetails: {
        name: quotation.customerName,
        email: quotation.customerEmail,
        phone: quotation.customerPhone || "",
        address: quotation.customerAddress || "",
      },
      totalAmount: quotation.totalAmount,
      status: status || "Processing",
      trackingLink: trackingLink || "",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
