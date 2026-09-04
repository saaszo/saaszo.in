"use client";

import React from "react";
import { Star, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  category: string;
  rating: string;
  reviews: string;
  outlets: string;
  badgeColor: string;
  accentColor: string;
  icon: React.ReactNode;
}

export function BrandMarquee() {
  const brandsRow1: BrandItem[] = [
    {
      id: "haldirams",
      name: "Haldiram's",
      category: "Sweets & Namkeen",
      rating: "4.9",
      reviews: "18.4k",
      outlets: "250+ Stores",
      badgeColor: "from-amber-600 to-red-700",
      accentColor: "border-red-200 text-red-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1 7.2 18.6l.9-5.3L4.3 9.6l5.3-.8L12 2z" />
          <circle cx="12" cy="12" r="3" fill="#fff" opacity="0.9" />
        </svg>
      ),
    },
    {
      id: "chaipoint",
      name: "Chai Point",
      category: "Beverages & QSR",
      rating: "4.8",
      reviews: "12.1k",
      outlets: "180+ Outlets",
      badgeColor: "from-emerald-600 to-teal-700",
      accentColor: "border-emerald-200 text-emerald-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      ),
    },
    {
      id: "wowmomo",
      name: "Wow! Momo",
      category: "Fast Food Chain",
      rating: "4.9",
      reviews: "24.6k",
      outlets: "450+ Counters",
      badgeColor: "from-orange-500 to-amber-600",
      accentColor: "border-orange-200 text-orange-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 4.1 2.76 7.56 6.55 8.63.4.07.6-.17.6-.37v-1.34c-2.67.58-3.23-1.29-3.23-1.29-.44-1.11-1.07-1.41-1.07-1.41-.87-.6.07-.58.07-.58.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.8.09-.62.34-1.05.61-1.29-2.13-.24-4.38-1.07-4.38-4.75 0-1.05.37-1.91.99-2.58-.1-.24-.43-1.22.09-2.54 0 0 .81-.26 2.64.99A9.2 9.2 0 0 1 12 6.8c.83.01 1.66.11 2.44.33 1.83-1.25 2.64-.99 2.64-.99.53 1.32.2 2.3.1 2.54.61.67.98 1.53.98 2.58 0 3.69-2.25 4.51-4.4 4.74.35.3.66.89.66 1.79v2.66c0 .2.2.44.6.37C20.24 19.56 23 16.1 23 12c0-4.97-4.03-9-9-9z" />
        </svg>
      ),
    },
    {
      id: "theobroma",
      name: "Theobroma",
      category: "Patisserie & Bakery",
      rating: "4.9",
      reviews: "15.3k",
      outlets: "95+ Outlets",
      badgeColor: "from-amber-800 to-amber-950",
      accentColor: "border-amber-200 text-amber-900",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      id: "social",
      name: "Social Offline",
      category: "Bar & Restaurant",
      rating: "4.8",
      reviews: "32.0k",
      outlets: "60+ Outlets",
      badgeColor: "from-indigo-600 to-violet-800",
      accentColor: "border-indigo-200 text-indigo-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2h8l4 6-8 14L4 8l4-6z" />
          <line x1="4" y1="8" x2="20" y2="8" />
        </svg>
      ),
    },
    {
      id: "faasos",
      name: "Faasos Kitchen",
      category: "Cloud Kitchen & QSR",
      rating: "4.7",
      reviews: "41.2k",
      outlets: "320+ Outlets",
      badgeColor: "from-purple-600 to-pink-700",
      accentColor: "border-purple-200 text-purple-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      id: "barbequenation",
      name: "Barbeque Nation",
      category: "Grill & Casual Dining",
      rating: "4.9",
      reviews: "29.7k",
      outlets: "190+ Outlets",
      badgeColor: "from-rose-600 to-amber-700",
      accentColor: "border-rose-200 text-rose-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
    },
    {
      id: "naturals",
      name: "Naturals Ice Cream",
      category: "Artisan Desserts",
      rating: "5.0",
      reviews: "22.8k",
      outlets: "140+ Outlets",
      badgeColor: "from-emerald-500 to-green-700",
      accentColor: "border-green-200 text-green-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="5" />
          <path d="M12 13l-4 8h8l-4-8z" />
        </svg>
      ),
    },
  ];

  const brandsRow2: BrandItem[] = [
    {
      id: "bikanervala",
      name: "Bikanervala",
      category: "Ethnic Sweets & Dining",
      rating: "4.9",
      reviews: "27.5k",
      outlets: "150+ Outlets",
      badgeColor: "from-amber-500 to-rose-600",
      accentColor: "border-amber-200 text-amber-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      id: "lapinoz",
      name: "La Pino'z Pizza",
      category: "Pizza Retail Chain",
      rating: "4.8",
      reviews: "38.9k",
      outlets: "500+ Outlets",
      badgeColor: "from-green-600 to-red-600",
      accentColor: "border-green-200 text-green-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 11h.01M11 15h.01M16 16h.01M2 16l20 6-6-20A20 20 0 0 0 2 16z" />
        </svg>
      ),
    },
    {
      id: "keventers",
      name: "Keventers 1925",
      category: "Dairy & Shakes",
      rating: "4.9",
      reviews: "19.3k",
      outlets: "230+ Outlets",
      badgeColor: "from-sky-600 to-blue-800",
      accentColor: "border-sky-200 text-sky-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 2h6v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V2z" />
          <path d="M7 7h10l1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L7 7z" />
        </svg>
      ),
    },
    {
      id: "behrouz",
      name: "Behrouz Biryani",
      category: "Royal Gourmet Dining",
      rating: "4.8",
      reviews: "34.1k",
      outlets: "280+ Outlets",
      badgeColor: "from-amber-600 to-purple-800",
      accentColor: "border-amber-200 text-amber-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
          <path d="M5 19h14v2H5v-2z" />
        </svg>
      ),
    },
    {
      id: "shreeganesh",
      name: "Shree Ganesh Retail",
      category: "Supermarket & Mart",
      rating: "4.9",
      reviews: "9.8k",
      outlets: "18 Hypermarkets",
      badgeColor: "from-emerald-600 to-teal-800",
      accentColor: "border-emerald-200 text-emerald-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      ),
    },
    {
      id: "apexpharma",
      name: "Apex Pharma & Chemist",
      category: "Pharmacy Network",
      rating: "5.0",
      reviews: "14.2k",
      outlets: "42 Stores",
      badgeColor: "from-cyan-600 to-blue-700",
      accentColor: "border-cyan-200 text-cyan-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      id: "apollopharmacy",
      name: "Apollo Healthcare",
      category: "Chemist & Wellness",
      rating: "4.9",
      reviews: "68.5k",
      outlets: "5,000+ Outlets",
      badgeColor: "from-rose-600 to-red-800",
      accentColor: "border-rose-200 text-rose-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      id: "reliancefresh",
      name: "Reliance Retail",
      category: "Grocery & Department",
      rating: "4.8",
      reviews: "95.0k",
      outlets: "850+ Stores",
      badgeColor: "from-blue-600 to-indigo-800",
      accentColor: "border-blue-200 text-blue-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
  ];

  const renderBrandPill = (b: BrandItem, index: number) => (
    <div
      key={`${b.id}-${index}`}
      className="inline-flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-[#6451f1] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300 group cursor-default mx-2.5 flex-shrink-0"
    >
      {/* Custom Vector Brand Logo Badge */}
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${b.badgeColor} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
      >
        {b.icon}
      </div>

      {/* Brand Name & Outlets */}
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-slate-950 group-hover:text-[#6451f1] transition-colors whitespace-nowrap">
            {b.name}
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 flex-shrink-0" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-medium whitespace-nowrap">
          <span>{b.category}</span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-700">{b.outlets}</span>
        </div>
      </div>

      {/* Vertical Divider */}
      <span className="h-7 w-px bg-slate-200 ml-1" />

      {/* Rating Pill */}
      <div className="flex items-center gap-1 bg-amber-50/80 border border-amber-200/60 px-2 py-1 rounded-lg text-xs font-black text-amber-800 flex-shrink-0">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span>{b.rating}</span>
      </div>
    </div>
  );

  return (
    <section className="py-20 md:py-28 bg-slate-50/70 overflow-hidden border-y border-slate-200/80 relative">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#6451f1] text-xs font-black tracking-widest uppercase mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#6451f1] animate-ping" />
          <span>TRUSTED BY 1,50,000+ MERCHANTS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Trusted by the biggest names{" "}
          <span className="text-[#6451f1] block sm:inline">in the business</span>
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg font-normal">
          From single checkout retail shops to multi-outlet enterprise chains processing thousands of bills daily.
        </p>
      </div>

      {/* Center Glowing SaaSzo POS Badge */}
      <div className="relative flex justify-center mb-10 z-20">
        <div className="relative inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 rounded-full bg-white border-2 border-[#6451f1] shadow-2xl shadow-indigo-500/20">
          <div className="w-8 h-8 rounded-full bg-[#6451f1] flex items-center justify-center text-white font-black text-sm shadow-md">
            S
          </div>
          <div className="text-left">
            <div className="text-base sm:text-lg font-black tracking-tight text-slate-950 flex items-center gap-1.5">
              <span>SAASZO</span>
              <span className="text-[#6451f1]">POS</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Engine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Container with Gradient Side Masks */}
      <div className="relative w-full overflow-hidden marquee-track">
        {/* Left Fade Gradient Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-44 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Right Fade Gradient Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-44 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-10" />

        {/* Track 1: Smooth Left Scrolling Infinite Loop */}
        <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] py-2">
          {brandsRow1.map((b, i) => renderBrandPill(b, i))}
          {brandsRow1.map((b, i) => renderBrandPill(b, i + brandsRow1.length))}
          {brandsRow1.map((b, i) => renderBrandPill(b, i + brandsRow1.length * 2))}
        </div>

        {/* Track 2: Smooth Right Scrolling Infinite Loop */}
        <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] py-2 mt-4">
          {brandsRow2.map((b, i) => renderBrandPill(b, i))}
          {brandsRow2.map((b, i) => renderBrandPill(b, i + brandsRow2.length))}
          {brandsRow2.map((b, i) => renderBrandPill(b, i + brandsRow2.length * 2))}
        </div>
      </div>
    </section>
  );
}
