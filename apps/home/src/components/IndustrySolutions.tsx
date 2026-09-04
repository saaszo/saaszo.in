"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  Utensils,
  Store,
  ChevronRight,
  Clock,
  Receipt,
  FileCheck2,
} from "lucide-react";
import {
  INDUSTRY_SOLUTIONS,
  RESTAURANT_INDUSTRIES,
  RETAIL_WHOLESALE_INDUSTRIES,
  type IndustrySolution,
} from "@/lib/industrySolutionsData";
import { getIndustryIcon } from "@/components/illustrations/IndustryIcons";

export function IndustrySolutions() {
  const [selectedGroup, setSelectedGroup] = useState<"food" | "retail">("food");
  const [activeSlug, setActiveSlug] = useState<string>("fine-dine");

  const currentList =
    selectedGroup === "food"
      ? RESTAURANT_INDUSTRIES
      : RETAIL_WHOLESALE_INDUSTRIES;

  // If the activeSlug is not in currentList, fall back to first item in currentList
  const currentIndustry: IndustrySolution =
    currentList.find((item) => item.slug === activeSlug) || currentList[0];

  const handleGroupChange = (group: "food" | "retail") => {
    setSelectedGroup(group);
    const targetList =
      group === "food" ? RESTAURANT_INDUSTRIES : RETAIL_WHOLESALE_INDUSTRIES;
    setActiveSlug(targetList[0].slug);
  };

  return (
    <section id="solutions" className="py-20 md:py-28 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6451f1]" />
            <span>Dedicated POS &amp; Invoicing for 17+ Industries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            One Billing Software Across Industries
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether you run a dine-in restaurant with KOTs, a fast-paced QSR, a chemist with batch tracking, or a multi-godown wholesale trading house, SaaSzo has pre-configured workflows for your business.
          </p>
        </div>

        {/* Group Selector Switcher */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <button
              onClick={() => handleGroupChange("food")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedGroup === "food"
                  ? "bg-[#6451f1] text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Restaurants &amp; Food (10)</span>
            </button>
            <button
              onClick={() => handleGroupChange("retail")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedGroup === "retail"
                  ? "bg-[#6451f1] text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Retail &amp; Supply Chain (7)</span>
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="mt-8 flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto pb-4 pt-1 no-scrollbar">
          {currentList.map((industry) => {
            const isActive = industry.slug === currentIndustry.slug;
            return (
              <button
                key={industry.slug}
                onClick={() => setActiveSlug(industry.slug)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md scale-[1.02]"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center ${isActive ? "text-indigo-400" : "text-[#6451f1]"}`}>
                  {getIndustryIcon(industry.slug, "w-4 h-4")}
                </div>
                <span>{industry.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="mt-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-[#6451f1] text-xs font-bold uppercase tracking-wider">
                <div className="w-4 h-4">{getIndustryIcon(currentIndustry.slug, "w-3.5 h-3.5")}</div>
                <span>{currentIndustry.heroBadge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
                {currentIndustry.headline}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {currentIndustry.description}
              </p>

              {/* Benefit / Feature Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentIndustry.keyFeatures.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{feature.title}</p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Link & Metrics */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {currentIndustry.metrics.map((m, idx) => (
                    <div key={idx} className="border-l-2 border-[#6451f1] pl-3">
                      <div className="text-lg sm:text-xl font-black text-slate-950">{m.value}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/industries/${currentIndustry.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6451f1] hover:bg-[#5340eb] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-500/20 group"
                >
                  <span>Explore All {currentIndustry.shortName} Features</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup / Vector Graphic Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 sm:p-7 bg-indigo-50/70 border border-indigo-200/80 relative overflow-hidden shadow-inner">
                {/* Decorative header */}
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200/60">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-slate-700 ml-1.5">SaaSzo POS • {currentIndustry.shortName}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    LIVE SYSTEM
                  </span>
                </div>

                {/* Simulated Invoice / POS Slip card inside illustration */}
                <div className="mt-4 bg-white rounded-xl p-4 shadow-md border border-slate-200/80 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                      <Receipt className="w-3.5 h-3.5 text-[#6451f1]" />
                      <span>{selectedGroup === "food" ? "KOT #42 • Table T-08" : "INV #SZ-2026-904"}</span>
                    </div>
                    <span className="text-emerald-600 font-bold text-[10px]">
                      {selectedGroup === "food" ? "COOKING (KDS)" : "PAID (UPI QR)"}
                    </span>
                  </div>

                  {/* Dynamic line items depending on industry */}
                  <div className="space-y-2 text-[11px] text-slate-700">
                    {selectedGroup === "food" ? (
                      <>
                        <div className="flex justify-between font-sans">
                          <span className="font-semibold text-slate-900">1x Farmhouse Special Pan Pizza</span>
                          <span>₹420.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Extra Cheese + Garlic Dip</span>
                          <span className="text-indigo-600 font-medium">Captain: Amit R.</span>
                        </div>

                        <div className="flex justify-between font-sans pt-1">
                          <span className="font-semibold text-slate-900">2x Hazelnut Iced Cold Brew</span>
                          <span>₹380.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Oat Milk Sub • Less Sugar</span>
                          <span className="text-emerald-600 font-medium">Station: Barista</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between font-sans">
                          <span className="font-semibold text-slate-900">1x Wireless Thermal Scanner 2D</span>
                          <span>₹2,499.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>SN: SC2026-X992 • GST 18%</span>
                          <span className="text-indigo-600 font-medium">Warranty: 1 Yr</span>
                        </div>

                        <div className="flex justify-between font-sans pt-1">
                          <span className="font-semibold text-slate-900">5x 3-Inch Thermal Paper Rolls</span>
                          <span>₹450.00</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>Batch: BT-882 • HSN: 4802</span>
                          <span className="text-emerald-600 font-medium">Stock: 124 left</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-dashed border-slate-200 space-y-1 text-slate-600">
                    <div className="flex justify-between text-[11px]">
                      <span>Subtotal</span>
                      <span>{selectedGroup === "food" ? "₹800.00" : "₹2,949.00"}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#6451f1] font-medium">
                      <span>GST (5% / 18%)</span>
                      <span>{selectedGroup === "food" ? "₹40.00 (CGST+SGST)" : "₹450.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                      <span>Grand Total</span>
                      <span className="text-emerald-600">{selectedGroup === "food" ? "₹840.00" : "₹2,949.00"}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 font-sans">
                    Auto-synced to Cloud • SQLite Offline Active
                  </div>
                </div>

                {/* Floating Fast Tag */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-600 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-indigo-100">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Billed in under 3.2 seconds
                  </span>
                  <span className="font-mono text-emerald-600 font-bold text-xs">✓ Auto-Printed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View All Directory Link CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-indigo-200/90 text-slate-900 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:border-[#6451f1] group"
          >
            <Layers className="w-4 h-4 text-[#6451f1]" />
            <span>Browse All 17+ Industry Dedicated Pages &amp; Capability Guides</span>
            <ChevronRight className="w-4 h-4 text-[#6451f1] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
