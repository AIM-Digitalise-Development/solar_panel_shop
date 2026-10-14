import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { QuoteRequest, IQuoteRequest } from "@/lib/models/QuoteRequest";
import { User } from "@/lib/models/User";
import { auth } from "@/auth";
import {
  sendQuoteRequestToAdmin,
  sendQuoteRequestConfirmationToCustomer,
} from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, customerDetails } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Quote request must contain at least one product item." },
        { status: 400 }
      );
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return NextResponse.json(
        { error: "Customer name, email, and phone number are required." },
        { status: 400 }
      );
    }

    await connectDB();

    let userId: any = undefined;
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      const existingUser = await User.findOne({
        email: customerDetails.email.toLowerCase().trim(),
      });
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    const docPayload: any = {
      items,
      customerDetails: {
        name: customerDetails.name.trim(),
        email: customerDetails.email.toLowerCase().trim(),
        phone: customerDetails.phone.trim(),
        address: customerDetails.address?.trim() || "",
        message: customerDetails.message?.trim() || "",
      },
      status: "Pending",
    };

    if (userId) {
      docPayload.userId = userId;
    }

    const quoteRequest = (await QuoteRequest.create(docPayload)) as any;

    // Send emails asynchronously
    sendQuoteRequestToAdmin({
      quoteRequestId: quoteRequest._id.toString(),
      customerDetails: quoteRequest.customerDetails,
      items: quoteRequest.items,
    }).catch((err) => console.error("Admin mail error:", err));

    sendQuoteRequestConfirmationToCustomer({
      customerEmail: quoteRequest.customerDetails.email,
      customerName: quoteRequest.customerDetails.name,
      quoteRequestId: quoteRequest._id.toString(),
      items: quoteRequest.items,
    }).catch((err) => console.error("Customer confirmation mail error:", err));

    return NextResponse.json(
      {
        success: true,
        message:
          "Your quotation request has been submitted successfully. A solar advisor will contact you within 24 hours.",
        quoteRequestId: quoteRequest._id.toString(),
        quoteRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Quotes POST error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit quotation request." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Please log in to view quotes." }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const role = (session.user as any)?.role;

    const query: any = {};

    if (role === "admin") {
      if (status && status !== "All") {
        query.status = status;
      }
    } else {
      query.$or = [
        { userId: session.user.id },
        { "customerDetails.email": session.user.email?.toLowerCase().trim() },
      ];
      if (status && status !== "All") {
        query.status = status;
      }
    }

    const quotes = await QuoteRequest.find(query)
      .populate("quotationId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: quotes.length, quotes });
  } catch (error: any) {
    console.error("Quotes GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch quotes" }, { status: 500 });
  }
}
