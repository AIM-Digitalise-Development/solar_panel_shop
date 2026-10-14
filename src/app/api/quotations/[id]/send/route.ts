import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Quotation } from "@/lib/models/Quotation";
import { QuoteRequest } from "@/lib/models/QuoteRequest";
import { auth } from "@/auth";
import { sendQuotationToCustomer } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    quotation.status = "Sent";
    quotation.sentAt = new Date();
    await quotation.save();

    if (quotation.quoteRequestId) {
      await QuoteRequest.findByIdAndUpdate(quotation.quoteRequestId, {
        status: "Quoted",
        quotationId: quotation._id,
      });
    }

    // Send email to customer
    const emailResult = await sendQuotationToCustomer({
      customerEmail: quotation.customerEmail,
      customerName: quotation.customerName,
      quotationId: quotation._id.toString(),
      quoteRequestId: quotation.quoteRequestId.toString(),
      subtotal: quotation.subtotal,
      tax: quotation.tax || 0,
      totalAmount: quotation.totalAmount,
      validUntil: quotation.validUntil,
      pdfUrl: quotation.pdfUrl,
      items: quotation.items,
      terms: quotation.terms,
    });

    return NextResponse.json({
      success: true,
      message: "Quotation sent successfully to customer email.",
      emailDelivered: emailResult.success,
      quotation,
    });
  } catch (error: any) {
    console.error("Send quotation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send quotation." },
      { status: 500 }
    );
  }
}
