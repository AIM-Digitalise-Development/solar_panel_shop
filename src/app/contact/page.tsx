"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Sun } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: "General Engineering & Technical Solar Consultation",
              quantity: 1,
              notes: message,
            },
          ],
          customerDetails: {
            name,
            email,
            phone,
            address: "Submitted via Contact Consultation Page",
            message,
          },
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-2 tracking-tight">
          Contact Our Solar Engineering Team
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Have queries regarding sanctioned loads, PM Surya Ghar subsidy disbursement, or customized
          commercial setups? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Direct Phone & WhatsApp Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">Mon–Sat from 9:00 AM to 7:00 PM IST</p>
              <p className="text-sm font-black text-sky-700 mt-1">+91 96144 75087</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Official Quotation Desk</h4>
              <p className="text-xs text-slate-500 mt-0.5">Direct responses within 4 hours</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">tandsinfra@gmail.com</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Corporate Headquarters</h4>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">T &amp; S Infraproject Pvt Ltd</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                100/21, New Basudevpur Road, Belghoria, Kolkata 700056, West Bengal
              </p>
              <p className="text-xs font-mono font-bold text-emerald-700 mt-1.5">
                GST: 19AAJCT6248H1ZV
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                Our certified solar engineering consultant will reach out to your contact details shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Send an Engineering Inquiry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Rooftop Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your rooftop area, monthly electricity bill, or question..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Submit Consultation Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
