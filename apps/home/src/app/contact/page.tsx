import type { Metadata } from "next";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { MinimalFooter } from "@/components/MinimalFooter";
import {
  Mail,
  MessageSquare,
  Printer,
  Clock,
  ShieldCheck,
  ArrowRight,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support | SaaSzo Invoice & POS",
  description:
    "Get in touch with the SaaSzo support and engineering team for thermal printer setup, counter billing assistance, or enterprise multi-store queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <ShowcaseNavbar />

      <main className="pt-24 pb-20">
        {/* Header Banner */}
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <Headphones className="w-3.5 h-3.5 text-indigo-600" />
              <span>Merchant Support Desk</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              We are here to keep your cash counters running.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Need assistance pairing a Bluetooth thermal receipt printer, setting up multi-device sync, or configuring GST tax rules? Reach out directly.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Direct Support Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Instant WhatsApp Helpdesk
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Fastest response for counter cashiers, barcode scanning troubleshooting, and printer connection issues.
                </p>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Email Support &amp; Legal Inquiries
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  For formal inquiries, custom multi-branch rollouts, accounting exports, and refund requests under our 7-day policy.
                </p>
                <a
                  href="mailto:saaszo.in@gmail.com"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>saaszo.in@gmail.com</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Support Hours</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monday to Saturday: 9:00 AM &ndash; 8:00 PM IST
                  <br />
                  Sunday: Critical Counter POS Escalations Only
                </p>
              </div>
            </div>

            {/* Right Column: Direct Message Form (7 cols) */}
            <div className="lg:col-span-7 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                Send a Message to Engineering
              </h2>
              <p className="mt-1 text-xs text-slate-500 mb-6">
                Fill in your details below and an engineer or support specialist will review your request.
              </p>

              <form className="space-y-4" action="#" method="GET">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Business Name / Store Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Krishna Supermarket"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Topic
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                      <option>Thermal Printer Setup (Bluetooth/USB)</option>
                      <option>Barcode Scanner Configuration</option>
                      <option>Multi-Terminal Counter Sync</option>
                      <option>GST Rates &amp; Tax Compliance</option>
                      <option>Account or Subscription Question</option>
                      <option>Other Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    How can we assist you?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your query or hardware model..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm text-center"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
