"use client";

import React from "react";
import {
  ShoppingBag,
  Store,
  Smartphone,
  Pill,
  Wrench,
  Shirt,
  ShieldCheck,
  Star,
  Award,
  CheckCircle,
} from "lucide-react";

export function TrustBanner() {
  const METRICS = [
    { label: "Active Businesses", value: "50,000+", sub: "Across 28 Indian States" },
    { label: "Invoices Generated", value: "₹500 Cr+", sub: "Zero Calculation Errors" },
    { label: "Billing Speed", value: "8 Seconds", sub: "3.5x Faster Than Legacy ERP" },
    { label: "App Store Rating", value: "4.8 / 5.0", sub: "15,000+ Verified Reviews" },
  ];

  const TRUST_PILLARS = [
    { label: "100% GST Compliant", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "CA & Tax Expert Approved", icon: Award, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Offline SQLite Security", icon: CheckCircle, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Top Rated on Google Play", icon: Star, color: "text-amber-600 bg-amber-50 border-amber-200" },
  ];

  return (
    <section className="py-14 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Performance Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-10 border-b border-slate-100">
          {METRICS.map((m, idx) => (
            <div key={idx} className="text-center sm:text-left">
              <div className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">{m.value}</div>
              <div className="text-xs sm:text-sm font-bold text-indigo-600 mt-1">{m.label}</div>
              <div className="text-[11px] text-slate-400 font-medium">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {TRUST_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border ${p.color} text-xs font-bold transition-all hover:shadow-xs`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
