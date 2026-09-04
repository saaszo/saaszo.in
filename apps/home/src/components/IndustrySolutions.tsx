"use client";

import React, { useState } from "react";
import {
  Store,
  Truck,
  Pill,
  Smartphone,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface IndustryItem {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  benefits: string[];
  metrics: { label: string; value: string }[];
  illustrationBg: string;
  accentColor: string;
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "retail",
    name: "Retail & Supermarket",
    badge: "High-Speed Counter POS",
    icon: Store,
    headline: "Fast Touch Billing with Barcode Scanning & Instant Thermal Print",
    description:
      "Handle peak rush hours without customer queues. Scan items with USB or camera barcode scanners, auto-apply discounts, and print 2-inch or 3-inch thermal bills in under 5 seconds.",
    benefits: [
      "Fast barcode scanning with zero item search delay",
      "Bluetooth & USB thermal printer auto-cutter support",
      "Day-end cash drawer closure & cashier tally reconciliation",
      "Customer loyalty points and purchase history tracking",
    ],
    metrics: [
      { label: "Checkout Speed", value: "3.5x Faster" },
      { label: "Queue Drop", value: "85% Less" },
    ],
    illustrationBg: "bg-indigo-50 border-indigo-200",
    accentColor: "text-indigo-600 bg-indigo-500",
  },
  {
    id: "wholesale",
    name: "Wholesale & Distribution",
    badge: "B2B Credit & Godown",
    icon: Truck,
    headline: "Party Khata / Credit Ledger with Multi-Godown Stock Control",
    description:
      "Manage large B2B orders with party-wise rate lists, automatic credit limits, outstanding ledger tracking, and multi-godown stock transfer slips in real time.",
    benefits: [
      "Customer-wise custom pricing and volume discount slabs",
      "Automated payment reminders via WhatsApp with UPI link",
      "Multi-godown & branch inventory transfer with challans",
      "E-Way Bill & E-Invoice generation in a single click",
    ],
    metrics: [
      { label: "Payment Recovery", value: "92% on Time" },
      { label: "Stock Accuracy", value: "99.8%" },
    ],
    illustrationBg: "bg-emerald-50 border-emerald-200",
    accentColor: "text-emerald-600 bg-emerald-500",
  },
  {
    id: "pharmacy",
    name: "Pharmacy & Chemist",
    badge: "Batch & Expiry Safe",
    icon: Pill,
    headline: "Batch Number & Expiry Date Management with Salt Search",
    description:
      "Never sell expired medicines. Get automated alerts 30-90 days before stock expiry, search medicines by salt composition, and maintain Schedule H/H1 compliance registers effortlessly.",
    benefits: [
      "Batch-wise pricing, MRP, and automated expiry date warnings",
      "Salt / generic medicine substitute lookup for patients",
      "Doctor-wise prescription billing and patient history",
      "Schedule H & narcotic drug sales compliance reports",
    ],
    metrics: [
      { label: "Expired Stock Loss", value: "Zero Waste" },
      { label: "Audit Readiness", value: "100% Ready" },
    ],
    illustrationBg: "bg-amber-50 border-amber-200",
    accentColor: "text-amber-600 bg-amber-500",
  },
  {
    id: "electronics",
    name: "Electronics & Hardware",
    badge: "Serial & IMEI Tracking",
    icon: Smartphone,
    headline: "Serial / IMEI Number Tracking & Digital Warranty Billing",
    description:
      "Track every smartphone, laptop, and appliance by unique serial/IMEI number from purchase to sale. Print professional warranty terms and manage repair tickets smoothly.",
    benefits: [
      "Individual serial/IMEI scanning on purchase and sale invoices",
      "Automated brand warranty period print on invoice footer",
      "Service & repair intake tracking with customer SMS status",
      "Multiple tax slabs (18%, 28%) with accurate GST input credit",
    ],
    metrics: [
      { label: "Warranty Disputes", value: "90% Reduced" },
      { label: "IMEI Traceability", value: "100% Precise" },
    ],
    illustrationBg: "bg-purple-50 border-purple-200",
    accentColor: "text-purple-600 bg-purple-500",
  },
  {
    id: "services",
    name: "Services & Agencies",
    badge: "Estimates to Invoices",
    icon: Briefcase,
    headline: "Professional Quotations, Recurring Subscriptions & Tax Filing",
    description:
      "Create clean, branded estimates that convert to GST invoices in 1 click upon client approval. Track milestone retainers and recurring monthly service billing with ease.",
    benefits: [
      "Convert quotations to invoices without retyping line items",
      "Multi-currency support for international overseas clients",
      "Automated recurring monthly/quarterly invoice dispatch",
      "Direct GSTR-1 and GSTR-3B tax export for your chartered accountant",
    ],
    metrics: [
      { label: "Time per Invoice", value: "30 Seconds" },
      { label: "Client Approval", value: "2x Faster" },
    ],
    illustrationBg: "bg-blue-50 border-blue-200",
    accentColor: "text-blue-600 bg-blue-500",
  },
];

export function IndustrySolutions() {
  const [activeTab, setActiveTab] = useState<string>("retail");
  const current = INDUSTRIES.find((i) => i.id === activeTab) || INDUSTRIES[0];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 md:py-28 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tailored for Every Business Model</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Built for India’s Top Retailers, Wholesalers &amp; Distributors
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you run a busy supermarket counter, a pharmacy, or a multi-godown wholesale trading business, SaaSzo adapts to your workflow.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="mt-10 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            const isActive = industry.id === activeTab;
            return (
              <button
                key={industry.id}
                onClick={() => setActiveTab(industry.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md scale-[1.02]"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                <span>{industry.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>{current.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                {current.headline}
              </h3>

              <p className="text-slate-600 text-base leading-relaxed">
                {current.description}
              </p>

              {/* Benefit Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {current.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700 leading-snug">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Link & Metrics */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {current.metrics.map((m, idx) => (
                    <div key={idx} className="border-l-2 border-indigo-500 pl-3">
                      <div className="text-xl sm:text-2xl font-black text-slate-950">{m.value}</div>
                      <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>

                <a
                  href="#downloads"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
                >
                  <span>Explore {current.name} Features</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Right Interactive Mockup / Vector Graphic Card */}
            <div className="lg:col-span-5">
              <div className={`rounded-2xl p-6 sm:p-8 border ${current.illustrationBg} relative overflow-hidden shadow-inner`}>
                {/* Decorative header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-slate-600 ml-2">SaaSzo Pro • {current.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    LIVE POS
                  </span>
                </div>

                {/* Simulated Invoice / POS Slip card inside illustration */}
                <div className="mt-5 bg-white rounded-xl p-4 shadow-md border border-slate-200/80 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-100">
                    <span>INV #SAAS-2026-089</span>
                    <span className="text-emerald-600 font-bold">PAID (UPI)</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-700">
                    <div className="flex justify-between font-sans">
                      <span className="font-semibold text-slate-900">1. Premium Cotton Shirts (Size L)</span>
                      <span>₹1,499.00</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>HSN: 6205 • GST 5% (₹71.38)</span>
                      <span>Qty: 1</span>
                    </div>

                    <div className="flex justify-between font-sans pt-1">
                      <span className="font-semibold text-slate-900">2. Leather Belt Formal</span>
                      <span>₹799.00</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>HSN: 4203 • GST 18% (₹121.88)</span>
                      <span>Qty: 1</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-200 space-y-1 text-slate-600">
                    <div className="flex justify-between text-[11px]">
                      <span>Subtotal</span>
                      <span>₹2,298.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-indigo-600 font-medium">
                      <span>Total Tax (CGST + SGST)</span>
                      <span>₹193.26</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span className="text-emerald-600">₹2,298.00</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 font-sans">
                    Scan UPI QR on receipt to verify • Powered by SaaSzo
                  </div>
                </div>

                {/* Floating Fast Tag */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-600 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200/80">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Billed in 4.8 seconds
                  </span>
                  <span className="font-mono text-emerald-600 font-bold text-xs">✓ Auto-Printed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
