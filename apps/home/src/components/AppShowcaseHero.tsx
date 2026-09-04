"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  Smartphone,
  Monitor,
  CheckCircle2,
  Printer,
  WifiOff,
  Barcode,
  ArrowRight,
  Sparkles,
  Zap,
  QrCode,
  ShieldCheck,
  Building2,
  Send,
} from "lucide-react";
import { HeroDualDeviceMockup } from "./illustrations/HeroDualDeviceMockup";

export function AppShowcaseHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-[#fbfaff] via-white to-slate-50">
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl opacity-70" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Decorative Faint Delivery Cart / Cycle in Lower Left (as in reference image) */}
      <div className="absolute left-[-20px] bottom-6 pointer-events-none opacity-[0.12] hidden xl:block w-72 h-48 -z-10">
        <svg viewBox="0 0 300 200" fill="none" stroke="#6451f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Bicycle Wheels */}
          <circle cx="50" cy="150" r="38" />
          <circle cx="50" cy="150" r="4" fill="#6451f1" />
          <circle cx="210" cy="150" r="38" />
          <circle cx="210" cy="150" r="4" fill="#6451f1" />
          {/* Bike Frame & Pedals */}
          <path d="M50 150 L100 150 L130 100 L80 100 Z" />
          <path d="M130 100 L210 150" />
          <path d="M100 150 L120 70 L140 70" />
          <circle cx="100" cy="150" r="10" />
          {/* Front Cargo Box */}
          <rect x="180" y="60" width="100" height="60" rx="4" />
          <line x1="180" y1="80" x2="280" y2="80" />
          <line x1="180" y1="100" x2="280" y2="100" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ==================================================== */}
          {/* LEFT COLUMN: Catchy Headline, Download Badges & Pillars */}
          {/* ==================================================== */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Playful Handwritten Superscript & Main Heading */}
            <div className="space-y-1 relative">
              {/* (aur bhi) playful note badge */}
              <div className="inline-flex items-center gap-1.5 font-serif italic text-slate-700 text-lg sm:text-xl font-medium tracking-wide">
                <span>(aur bhi)</span>
              </div>

              {/* Main Heading with Caret accent */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-950 tracking-tight leading-[1.12]">
                Business hua<span className="text-[#6451f1] mx-1 font-bold">^</span>easy
              </h1>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
                with SaaSzo on Desktop &amp; Mobile
              </h2>
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              India’s high-speed GST Invoicing, digital bahi khata, and instant counter POS. Works 100% offline with local SQLite, thermal printing, and auto cloud sync.
            </p>

            {/* ==================================================== */}
            {/* DOWNLOAD BUTTONS (Google Play Store + Apple App Store + Web) */}
            {/* ==================================================== */}
            <div className="pt-2 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Download Free App &bull; Instant Setup:
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Google Play Store Button */}
                <a
                  href="#downloads"
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white shadow-md hover:shadow-xl transition-all duration-200 border border-slate-800 group"
                >
                  {/* Google Play Vector Icon */}
                  <svg className="w-6 h-6 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none">
                    <path d="M3.6 1.8A1.8 1.8 0 0 0 3 3.2v17.6a1.8 1.8 0 0 0 .6 1.4l9.7-9.8L3.6 1.8z" fill="#00d6ff" />
                    <path d="M16.8 9.1 13.3 12.4l3.5 3.3 4.1-2.3a1.5 1.5 0 0 0 0-2.6l-4.1-1.7z" fill="#ffce00" />
                    <path d="M3.6 22.2l9.7-9.8 3.5 3.3-11.4 6.5a1.8 1.8 0 0 1-1.8 0z" fill="#ff3333" />
                    <path d="M3.6 1.8a1.8 1.8 0 0 1 1.8 0l11.4 6.5-3.5 3.3L3.6 1.8z" fill="#00e676" />
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">GET IT ON</div>
                    <div className="text-sm font-bold text-white tracking-wide">Google Play</div>
                  </div>
                </a>

                {/* 2. Apple App Store Button */}
                <a
                  href="#downloads"
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white shadow-md hover:shadow-xl transition-all duration-200 border border-slate-800 group"
                >
                  {/* Apple Vector Icon */}
                  <svg className="w-6 h-6 shrink-0 fill-white transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.82-.98 2.91 1.07.08 2.13-.51 2.79-1.31z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Download on the</div>
                    <div className="text-sm font-bold text-white tracking-wide">App Store</div>
                  </div>
                </a>

                {/* 3. Windows / Web Desktop Button */}
                <a
                  href="https://invoice.saaszo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 shadow-xs hover:shadow-md transition-all duration-200 border border-slate-200 font-bold text-xs sm:text-sm"
                >
                  <Monitor className="w-4 h-4 text-[#6451f1]" />
                  <span>Open Web Desktop</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* ==================================================== */}
            {/* ONE PLATFORM FOR ALL YOUR BUSINESS NEEDS (White Card) */}
            {/* ==================================================== */}
            <div className="mt-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xl max-w-xl">
              <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                One platform for all your business needs
              </h3>

              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Pillar 1: Digital Bahi Khata & Fast Billing */}
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-8 rounded-full bg-[#6451f1] shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      Manage Digital Bahi Khata &amp; POS
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Customer khata ledger &amp; 8s GST counter billing
                    </div>
                  </div>
                </div>

                {/* Pillar 2: WhatsApp Payment Reminders */}
                <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 pt-3 sm:pt-0">
                  <div className="w-1.5 h-8 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      Send WhatsApp Payment Links
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                      Auto-collection via UPI QR &amp; payment reminders
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Free Lifetime Setup
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6451f1]" />
                Zero Cloud Lock-in (Local SQLite)
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Desktop + Mobile Mockup + Indian Merchant */}
          {/* ==================================================== */}
          <div className="lg:col-span-6 pt-4 lg:pt-0">
            <HeroDualDeviceMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
