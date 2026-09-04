"use client";

import React from "react";
import { Sparkles, Star } from "lucide-react";

export function BrandMarquee() {
  const brandsRow1 = [
    { name: "Haldiram's", category: "Sweets & Snacks", rating: "4.9" },
    { name: "Chai Point", category: "Beverages & QSR", rating: "4.8" },
    { name: "Wow! Momo", category: "Fast Food Chain", rating: "4.9" },
    { name: "Theobroma", category: "Patisserie & Bakery", rating: "4.9" },
    { name: "Social", category: "Bar & Restaurant", rating: "4.8" },
    { name: "Faasos", category: "Cloud Kitchen", rating: "4.7" },
  ];

  const brandsRow2 = [
    { name: "Bikanervala", category: "Ethnic Retail", rating: "4.9" },
    { name: "La Pino'z Pizza", category: "Pizza Chain", rating: "4.8" },
    { name: "Keventers", category: "Dairy & Shakes", rating: "4.9" },
    { name: "Behrouz Biryani", category: "Fine Dine Delivery", rating: "4.8" },
    { name: "Shree Ganesh Retail", category: "Supermarket Chain", rating: "4.9" },
    { name: "Apex Pharma & Chemist", category: "Pharmacy Network", rating: "5.0" },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50/60 overflow-hidden border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block text-xs font-black tracking-widest text-red-600 uppercase mb-3">
          TRUSTED BY THE BEST
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Trusted by the biggest names{" "}
          <span className="text-red-600 block sm:inline">in the business</span>
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          From single checkout retail shops to multi-outlet enterprise chains processing thousands of bills daily.
        </p>
      </div>

      {/* Brand Pills Grid / Cloud */}
      <div className="mt-14 max-w-6xl mx-auto px-4 relative">
        {/* Center Glowing SaaSzo Badge */}
        <div className="relative flex justify-center mb-8">
          <div className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-red-500 shadow-2xl shadow-red-500/20 z-10">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              S
            </div>
            <div className="text-left">
              <div className="text-lg font-black tracking-tight text-slate-950">
                SAASZO <span className="text-red-600">POS</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Core Engine
              </div>
            </div>
          </div>
        </div>

        {/* Brand Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {brandsRow1.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-md transition-all duration-200 group cursor-default"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
              <div className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                {b.name}
              </div>
              <span className="text-slate-300 font-light">|</span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{b.rating}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          {brandsRow2.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-md transition-all duration-200 group cursor-default"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              <div className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                {b.name}
              </div>
              <span className="text-slate-300 font-light">|</span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{b.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
