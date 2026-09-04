"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Utensils,
  Store,
  Layers,
  Printer,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  INDUSTRY_SOLUTIONS,
  type IndustrySolution,
} from "@/lib/industrySolutionsData";
import { getIndustryIcon } from "@/components/illustrations/IndustryIcons";

export function IndustryDirectoryClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "food" | "retail">("all");

  const filteredIndustries = useMemo(() => {
    return INDUSTRY_SOLUTIONS.filter((item) => {
      // Category group filter
      if (activeCategory === "food" && item.categoryGroup !== "restaurant") {
        return false;
      }
      if (activeCategory === "retail" && item.categoryGroup !== "retail_wholesale") {
        return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchName = item.title.toLowerCase().includes(q) || item.shortName.toLowerCase().includes(q);
      const matchHeadline = item.headline.toLowerCase().includes(q);
      const matchBadge = item.heroBadge.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchFeatures = item.keyFeatures.some(
        (f) =>
          f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
      );

      return matchName || matchHeadline || matchBadge || matchDesc || matchFeatures;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div>
      {/* Search & Filter Controls */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business type or feature (e.g., KOT, Batch & Expiry, IMEI, Pizza, Barcode, Wholesale)..."
            className="block w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6451f1] focus:border-transparent text-sm sm:text-base shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-[#6451f1] text-white shadow-md shadow-indigo-500/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All 17 Industries</span>
          </button>
          <button
            onClick={() => setActiveCategory("food")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === "food"
                ? "bg-[#6451f1] text-white shadow-md shadow-indigo-500/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Restaurants &amp; Food Outlets (10)</span>
          </button>
          <button
            onClick={() => setActiveCategory("retail")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategory === "retail"
                ? "bg-[#6451f1] text-white shadow-md shadow-indigo-500/25"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Retail, Wholesale &amp; Supply Chain (7)</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-8 text-center text-xs font-semibold text-slate-500">
        Showing {filteredIndustries.length} tailored industry solution{filteredIndustries.length !== 1 ? "s" : ""}
      </div>

      {/* Industries Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndustries.map((ind) => (
          <div
            key={ind.slug}
            className="group flex flex-col justify-between bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6451f1] to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header row: Icon & Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6451f1] shrink-0 group-hover:scale-105 transition-transform">
                  {getIndustryIcon(ind.slug, "w-6 h-6")}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-[#6451f1] uppercase tracking-wide shrink-0">
                  {ind.heroBadge}
                </span>
              </div>

              {/* Title & Headline */}
              <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-[#6451f1] transition-colors">
                {ind.title}
              </h3>
              <p className="mt-1 text-xs font-bold text-slate-700">
                {ind.tagline}
              </p>
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
                {ind.description}
              </p>

              {/* Top 3 Feature Highlights */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Built-In App Features
                </p>
                {ind.keyFeatures.slice(0, 3).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700 leading-tight">
                      {feat.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-slate-900">
                  {ind.metrics[0]?.value}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {ind.metrics[0]?.label}
                </span>
              </div>

              <Link
                href={`/industries/${ind.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#6451f1] text-white text-xs font-bold transition-colors group-hover:shadow-md"
              >
                <span>View Features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredIndustries.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 mt-8">
          <p className="text-base font-bold text-slate-800">
            No matching industry found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for &quot;QSR&quot;, &quot;Pharmacy&quot;, &quot;Supermarket&quot;, or &quot;Wholesale&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#6451f1] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
