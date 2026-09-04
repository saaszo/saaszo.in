"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, TrendingUp } from "lucide-react";

export function TrustAtScale() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block text-xs font-black tracking-widest text-red-600 uppercase">
              TRUST AT SCALE
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Trust earned across{" "}
              <span className="text-red-600">1,50,000+ businesses</span>
            </h2>

            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
              Every billing counter, every inventory rack, every GST filing cycle. We&apos;ve earned that trust by showing up every day, for all these years.
            </p>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">99.99% Offline Uptime</div>
                  <div className="text-xs text-slate-500 mt-0.5">Zero crash local SQLite architecture</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">₹500+ Cr Invoiced</div>
                  <div className="text-xs text-slate-500 mt-0.5">Processed securely every single month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: SaaSzo Editorial Line Art Illustration */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden bg-white border-2 border-slate-200/90 shadow-xl group">
              <Image
                src="/illustrations/trust-merchant-lineart.jpg"
                alt="SaaSzo Trust at Scale - Indian Retail Merchant Line Art"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
              {/* Floating Verified Pill */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-red-200 shadow-md flex items-center gap-1.5 text-xs font-bold text-red-600">
                <CheckCircle2 className="w-4 h-4 text-red-600" />
                <span>Verified Retail Partner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
