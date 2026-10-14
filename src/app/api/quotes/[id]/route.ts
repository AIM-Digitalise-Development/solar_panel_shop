import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuoteRequest } from "@/lib/models/QuoteRequest";
import { Quotation } from "@/lib/models/Quotation";
import { Order } from "@/lib/models/Order";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    await connectDB();

    const quoteRequest = await QuoteRequest.findById(id).populate("quotationId");

    if (!quoteRequest) {
      return NextResponse.json({ error: "Quotation request not found" }, { status: 404 });
    }

    const role = (session?.user as any)?.role;
    const isOwner =
      session?.user?.id === quoteRequest.userId?.toString() ||
      session?.user?.email?.toLowerCase().trim() === quoteRequest.customerDetails?.email?.toLowerCase().trim();

    if (role !== "admin" && !isOwner) {
      // In quotation requests, also allow guest lookup if no session but phone or email verified if needed
      // but if user is logged in and not owner, restrict
      if (session) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
    }

    let quotation = null;
    if (quoteRequest.quotationId) {
      quotation = await Quotation.findById(quoteRequest.quotationId);
    }

    return NextResponse.json({ success: true, quoteRequest, quotation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch quote request" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await req.json();
    const { status, action } = body;

    await connectDB();
    const quoteRequest = await QuoteRequest.findById(id);

    if (!quoteRequest) {
      return NextResponse.json({ error: "Quotation request not found" }, { status: 404 });
    }

    const role = (session?.user as any)?.role;
    const isOwner =
      session?.user?.id === quoteRequest.userId?.toString() ||
      session?.user?.email?.toLowerCase().trim() === quoteRequest.customerDetails?.email?.toLowerCase().trim();

    if (role !== "admin" && !isOwner) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    // Customer can accept or reject an active quotation
    if (action === "accept" || status === "Accepted") {
      quoteRequest.status = "Accepted";
      await quoteRequest.save();

      // Also update linked quotation if exists
      if (quoteRequest.quotationId) {
        const quotation = await Quotation.findById(quoteRequest.quotationId);
        if (quotation) {
          quotation.status = "Accepted";
          await quotation.save();

          // Check if an Order already exists for this quotation
          const existingOrder = await Order.findOne({ quotationId: quotation._id });
          if (!existingOrder) {
            const orderNum = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            await Order.create({
              quotationId: quotation._id,
              quoteRequestId: quoteRequest._id,
              userId: quotation.userId || quoteRequest.userId,
              orderNumber: orderNum,
              items: quotation.items,
              customerDetails: {
                name: quotation.customerName,
                email: quotation.customerEmail,
                phone: quotation.customerPhone || quoteRequest.customerDetails.phone,
                address: quotation.customerAddress || quoteRequest.customerDetails.address,
              },
              totalAmount: quotation.totalAmount,
              status: "Processing",
              notes: "Created automatically following customer quotation acceptance.",
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Quotation accepted! Your order is now in processing. An installation engineer will contact you for site verification.",
        quoteRequest,
      });
    }

    if (action === "reject" || status === "Rejected") {
      quoteRequest.status = "Rejected";
      await quoteRequest.save();

      if (quoteRequest.quotationId) {
        await Quotation.findByIdAndUpdate(quoteRequest.quotationId, { status: "Rejected" });
      }

      return NextResponse.json({
        success: true,
        message: "Quotation request marked as rejected.",
        quoteRequest,
      });
    }

    if (status && role === "admin") {
      quoteRequest.status = status;
      await quoteRequest.save();
    }

    return NextResponse.json({ success: true, quoteRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update quote request" }, { status: 500 });
  }
}
