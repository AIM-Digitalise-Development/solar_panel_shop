"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  FileText,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  Sun,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default function AdminQuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [quoteRequest, setQuoteRequest] = useState<any>(null);
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [notification, setNotification] = useState("");

  // Quotation form fields
  const [items, setItems] = useState<
    Array<{ name: string; quantity: number; unitPrice: number; total: number }>
  >([]);
  const [taxPercent, setTaxPercent] = useState(12); // standard solar GST in India is 12%
  const [terms, setTerms] = useState(
    "Quotation valid for 30 days. Estimated PM Surya Ghar Direct Benefit Transfer subsidy eligibility is ₹78,000. Payment is strictly offline via bank transfer upon technical site inspection and formal contract signing."
  );
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [pdfUrl, setPdfUrl] = useState("");

  const loadData = () => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/quotes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.quoteRequest) {
          setQuoteRequest(data.quoteRequest);

          if (data.quotation) {
            setQuotation(data.quotation);
            setItems(data.quotation.items || []);
            setTerms(data.quotation.terms || "");
            if (data.quotation.validUntil) {
              setValidUntil(new Date(data.quotation.validUntil).toISOString().split("T")[0]);
            }
            if (data.quotation.pdfUrl) setPdfUrl(data.quotation.pdfUrl);
          } else {
            // Seed quotation items from quote request
            const initialItems = (data.quoteRequest.items || []).map((i: any) => ({
              name: i.name,
              quantity: i.quantity || 1,
              unitPrice: i.price || (i.wattage ? i.wattage * 26 : 10000),
              total: (i.quantity || 1) * (i.price || (i.wattage ? i.wattage * 26 : 10000)),
            }));
            setItems(initialItems);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateItem = (
    index: number,
    field: "name" | "quantity" | "unitPrice",
    val: string | number
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    if (field === "quantity" || field === "unitPrice") {
      const q = Number(updated[index].quantity) || 0;
      const u = Number(updated[index].unitPrice) || 0;
      updated[index].total = q * u;
    }
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        name: "Module Mounting Hardware & Discom Liaisoning",
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((acc, i) => acc + (Number(i.total) || 0), 0);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const totalAmount = subtotal + taxAmount;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "solar_shop/quotations");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setPdfUrl(data.url);
      } else {
        alert(data.error || "PDF upload failed. You can paste an external PDF link instead.");
      }
    } catch (err) {
      alert("PDF upload failed. You can paste a PDF link instead.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSaveQuotation = async (status: "Draft" | "Sent" = "Draft") => {
    setSaving(true);
    setNotification("");

    try {
      const payload = {
        quoteRequestId: quoteRequest._id,
        customerName: quoteRequest.customerDetails.name,
        customerEmail: quoteRequest.customerDetails.email,
        customerPhone: quoteRequest.customerDetails.phone,
        customerAddress: quoteRequest.customerDetails.address,
        items,
        subtotal,
        tax: taxAmount,
        totalAmount,
        terms,
        validUntil: new Date(validUntil),
        pdfUrl,
        status,
      };

      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save quotation.");
      }

      setQuotation(data.quotation);
      setNotification("Quotation draft saved successfully.");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to save quotation.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendQuotation = async () => {
    if (!confirm(`Send official quotation email to ${quoteRequest.customerDetails.email}?`)) {
      return;
    }

    setSending(true);
    setNotification("");

    try {
      // First ensure quotation is saved
      let currentQuotationId = quotation?._id;

      const payload = {
        quoteRequestId: quoteRequest._id,
        customerName: quoteRequest.customerDetails.name,
        customerEmail: quoteRequest.customerDetails.email,
        customerPhone: quoteRequest.customerDetails.phone,
        customerAddress: quoteRequest.customerDetails.address,
        items,
        subtotal,
        tax: taxAmount,
        totalAmount,
        terms,
        validUntil: new Date(validUntil),
        pdfUrl,
        status: "Sent",
      };

      const saveRes = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error);
      currentQuotationId = saveData.quotation._id;

      // Now trigger send email API
      const sendRes = await fetch(`/api/quotations/${currentQuotationId}/send`, {
        method: "POST",
      });

      const sendData = await sendRes.json();
      if (!sendRes.ok) throw new Error(sendData.error);

      setNotification("Official quotation sent to customer email successfully!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to send quotation email.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-sm text-slate-500">Loading quote request...</div>;
  }

  if (!quoteRequest) {
    return (
      <div className="p-16 text-center space-y-3">
        <h2 className="text-xl font-bold">Quote Request Not Found</h2>
        <Link href="/admin/quotes" className="text-sky-600 font-semibold text-sm">
          &larr; Back to quotes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      <AdminNav />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quote Requests
          </Link>
          <span className="text-xs font-mono text-slate-400">ID: {quoteRequest._id}</span>
        </div>

        {notification && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {notification}
          </div>
        )}

        {/* Customer & Request Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                Customer Inbound Inquiry
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                Quote Request #{quoteRequest._id.slice(-6).toUpperCase()}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Status: {quoteRequest.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="font-semibold text-slate-400 uppercase text-xs block mb-1">
                Customer Profile
              </span>
              <p className="font-bold text-slate-900 text-base">{quoteRequest.customerDetails?.name}</p>
              <p className="text-slate-600 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {quoteRequest.customerDetails?.email}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {quoteRequest.customerDetails?.phone}
              </p>
              <p className="text-slate-700 flex items-start gap-1.5 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                {quoteRequest.customerDetails?.address}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-400 uppercase text-xs block">
                Customer Requirements &amp; Notes
              </span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 text-xs leading-relaxed">
                {quoteRequest.customerDetails?.message || "No custom instructions provided."}
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Editor Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Official Commercial Quotation Generator
              </h2>
              <p className="text-xs text-slate-500">
                Specify component rates, engineering services, tax, and government subsidy clauses.
              </p>
            </div>

            {quotation?.status === "Sent" && (
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Send className="w-3.5 h-3.5" /> Quotation Dispatched
              </span>
            )}
          </div>

          {/* Line items builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bill of Materials &amp; Installation Services
              </span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs text-sky-600 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      placeholder="Item name / specification"
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      placeholder="Unit ₹"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-right"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right font-bold text-xs text-slate-900">
                    ₹{item.total.toLocaleString("en-IN")}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 max-w-sm ml-auto text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-1.5">
                GST Tax:
                <select
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseInt(e.target.value) || 0)}
                  className="px-1.5 py-0.5 border border-slate-300 rounded-md bg-white text-xs"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12% (Standard Solar)</option>
                  <option value={18}>18%</option>
                </select>
              </span>
              <span className="font-semibold text-slate-900">₹{taxAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
              <span>Total Investment:</span>
              <span className="text-sky-700 text-base">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Quotation Validity & PDF Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quotation Validity Date *
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Attach Quotation PDF (Cloudinary or Link)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  placeholder="https://... PDF URL"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="grow px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer shrink-0 border border-slate-300 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingPdf ? "Uploading..." : "Upload PDF"}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Commercial Terms, Warranties &amp; Subsidy Guidance *
            </label>
            <textarea
              rows={3}
              required
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveQuotation("Draft")}
              className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {saving ? "Saving Draft..." : "Save Quotation Draft"}
            </button>

            <button
              type="button"
              disabled={sending}
              onClick={handleSendQuotation}
              className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending Email..." : "Send Quotation to Customer (Email)"} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
