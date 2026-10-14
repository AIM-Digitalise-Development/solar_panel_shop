import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Quotation } from "@/lib/models/Quotation";
import { QuoteRequest } from "@/lib/models/QuoteRequest";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const {
      quoteRequestId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      tax,
      totalAmount,
      terms,
      validUntil,
      pdfUrl,
      status,
    } = body;

    if (!quoteRequestId || !items || !items.length || !totalAmount) {
      return NextResponse.json(
        { error: "quoteRequestId, items, and totalAmount are required." },
        { status: 400 }
      );
    }

    const quoteRequest = await QuoteRequest.findById(quoteRequestId);
    if (!quoteRequest) {
      return NextResponse.json({ error: "Associated quote request not found." }, { status: 404 });
    }

    const quotation = await Quotation.create({
      quoteRequestId,
      userId: quoteRequest.userId,
      customerName: customerName || quoteRequest.customerDetails.name,
      customerEmail: customerEmail || quoteRequest.customerDetails.email,
      customerPhone: customerPhone || quoteRequest.customerDetails.phone,
      customerAddress: customerAddress || quoteRequest.customerDetails.address,
      items,
      subtotal: Number(subtotal) || Number(totalAmount),
      tax: Number(tax) || 0,
      totalAmount: Number(totalAmount),
      terms:
        terms ||
        "Quotation valid for 30 days. Payment is offline via official RTGS/NEFT/Cheque after quotation acceptance. Includes standard 25-year solar module performance warranty and 5-year comprehensive inverter warranty.",
      validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      pdfUrl: pdfUrl || "",
      status: status || "Draft",
    });

    // Update QuoteRequest reference & status
    quoteRequest.quotationId = quotation._id;
    if (status === "Sent") {
      quoteRequest.status = "Quoted";
    }
    await quoteRequest.save();

    return NextResponse.json({ success: true, quotation }, { status: 201 });
  } catch (error: any) {
    console.error("Quotation POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create quotation" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Please log in to view quotations." }, { status: 401 });
    }

    await connectDB();
    const role = (session.user as any)?.role;

    let query: any = {};
    if (role !== "admin") {
      query = {
        $or: [
          { userId: session.user.id },
          { customerEmail: session.user.email?.toLowerCase().trim() },
        ],
      };
    }

    const quotations = await Quotation.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: quotations.length, quotations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch quotations" }, { status: 500 });
  }
}
