import React from "react";
import {
  ShoppingBag,
  Store,
  Smartphone,
  Pill,
  Wrench,
  Shirt,
  ShieldCheck,
} from "lucide-react";

export function TrustBanner() {
  const INDUSTRIES = [
    { label: "Supermarkets & Grocery", icon: Store },
    { label: "Apparel & Garments", icon: Shirt },
    { label: "Electronics & Mobile", icon: Smartphone },
    { label: "Pharmacies & Healthcare", icon: Pill },
    { label: "Hardware & Sanitary", icon: Wrench },
    { label: "Wholesale & Distribution", icon: ShoppingBag },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Powering High-Volume Retail &amp; Wholesale Counters Across India
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.label}
                className="flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-700 text-xs font-medium"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span className="truncate">{ind.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
