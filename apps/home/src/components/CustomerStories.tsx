"use client";

import React, { useState } from "react";
import { Play, Pause, Volume2, Subtitles, Sparkles, Star } from "lucide-react";

export function CustomerStories() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const stories = [
    {
      title: "How Busy Beans Scaled to 12 Outlets",
      subtitle: "100% Offline POS & Central Inventory",
      merchant: "Rahul Sharma, Founder",
      badge: "Cafe & QSR",
      quote: "SaaSzo billing is blazing fast. Even during Diwali rush, our billing counters had zero lag.",
      bgGradient: "from-slate-900 via-slate-800 to-indigo-950",
    },
    {
      title: "How Desserts & More Cut Billing by 65%",
      subtitle: "3-Inch Thermal Bluetooth Auto-Cut",
      merchant: "Pooja Vora, Operations Head",
      badge: "Bakery & Sweets",
      quote: "Our staff learned it in 5 minutes. The barcode scanner and WhatsApp bill feature saved paper.",
      bgGradient: "from-slate-900 via-slate-800 to-purple-950",
    },
    {
      title: "Radhika's Boutique: Zero Tax Hassle",
      subtitle: "1-Click GSTR-1 & WhatsApp Invoices",
      merchant: "Radhika Mehra, Owner",
      badge: "Apparel & Retail",
      quote: "Automated GST filing helped our CA file returns in 10 minutes without manual data entry.",
      bgGradient: "from-slate-900 via-slate-800 to-rose-950",
    },
    {
      title: "Real Supermarket Story: Zero Queue Drop",
      subtitle: "Fast Barcode Scan & Cash Drawer Kick",
      merchant: "Anand Patel, Store Manager",
      badge: "Grocery & Mart",
      quote: "Customer queues dropped by 80%. Scans barcodes instantly even in dim light using phone camera.",
      bgGradient: "from-slate-900 via-slate-800 to-emerald-950",
    },
    {
      title: "SaaSzo in One Word: 'Flawless'",
      subtitle: "Multi-Godown Stock & UPI Soundbox",
      merchant: "Vikram Malhotra, MD",
      badge: "Electronics Chain",
      quote: "Switched from legacy desktop software. Offline SQLite sync is an absolute game-changer.",
      bgGradient: "from-slate-900 via-slate-800 to-blue-950",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Businesses that switched{" "}
            <span className="text-[#6451f1] block sm:inline">never looked back</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Real stories from business owners who transformed their counter billing and cash flow with SaaSzo.
          </p>
        </div>

        {/* 5 Vertical Story Reel Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stories.map((s, idx) => {
            const isPlaying = playingIndex === idx;
            return (
              <div
                key={s.title}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-b ${s.bgGradient} text-white p-5 flex flex-col justify-between aspect-[9/16] shadow-xl border border-slate-700/50 group transition-all duration-300 hover:-translate-y-1.5`}
              >
                {/* Top Video Controls Bar */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#6451f1] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      Story #{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                    <Subtitles className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>

                {/* Center Play Button Overlay */}
                <div className="my-auto flex flex-col items-center justify-center z-10">
                  <button
                    onClick={() => setPlayingIndex(isPlaying ? null : idx)}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:bg-[#6451f1] group-hover:text-white group-hover:border-[#6451f1] transition-all duration-300 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>
                  <span className="text-[11px] font-bold text-white/80 mt-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                    {s.badge}
                  </span>
                </div>

                {/* Bottom Story Info & Subtitle Overlay */}
                <div className="z-10 bg-black/60 backdrop-blur-md -mx-5 -mb-5 p-4 border-t border-white/10">
                  <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-indigo-300 mt-1 font-semibold">
                    {s.subtitle}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-2 line-clamp-2 italic">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{s.merchant}</span>
                    <div className="flex text-amber-400">
                      {"★★★★★"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
