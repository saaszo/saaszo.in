"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  CheckCircle2,
  Printer,
  WifiOff,
  Barcode,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function AppShowcaseHero() {
  const [detectedOs, setDetectedOs] = useState<"android" | "windows" | "mac" | "ios">("android");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("win")) setDetectedOs("windows");
      else if (ua.includes("mac") && !ua.includes("iphone") && !ua.includes("ipad")) setDetectedOs("mac");
      else if (ua.includes("iphone") || ua.includes("ipad")) setDetectedOs("ios");
      else setDetectedOs("android");
    }
  }, []);

  const getPrimaryDownloadInfo = () => {
    switch (detectedOs) {
      case "windows":
        return {
          label: "Download for Windows (.exe)",
          href: "#downloads",
          icon: Monitor,
          hint: "Windows 10, 11 (64-bit Installer)",
        };
      case "mac":
        return {
          label: "Download for macOS (.dmg)",
          href: "#downloads",
          icon: Apple,
          hint: "Apple Silicon & Intel DMG",
        };
      case "ios":
        return {
          label: "Download on iOS App Store",
          href: "#downloads",
          icon: Apple,
          hint: "Requires iOS 15.0 or later",
        };
      default:
        return {
          label: "Download Android App (.apk)",
          href: "/downloads/saaszo-invoice-pos.apk",
          icon: Smartphone,
          hint: "Android 8.0+ • Direct APK Installer",
        };
    }
  };

  const primaryDownload = getPrimaryDownloadInfo();
  const PrimaryIcon = primaryDownload.icon;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-50/70 via-blue-50/40 to-transparent blur-3xl opacity-70" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Kicker Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-800 text-xs font-semibold shadow-xs hover:border-slate-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Native Cross-Platform Billing Suite</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-indigo-600 font-medium">Free to Download</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
            Smart Invoicing &amp; Counter POS.{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Works 100% Offline.
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate GST invoices in seconds, scan barcodes with your camera, and print to Bluetooth thermal printers. Never pause sales when internet disconnects.
          </p>
        </div>

        {/* Primary Download CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href={primaryDownload.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-200 group"
          >
            <PrimaryIcon className="w-4 h-4 text-emerald-400 transition-transform group-hover:scale-110" />
            <span>{primaryDownload.label}</span>
          </a>

          <a
            href="#downloads"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>All Platforms</span>
          </a>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3 font-medium">
          {primaryDownload.hint} • No credit card required
        </p>

        {/* Platform Quick Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <a href="#downloads" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Smartphone className="w-3.5 h-3.5 text-slate-600" /> Android
          </a>
          <span className="text-slate-300">•</span>
          <a href="#downloads" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Monitor className="w-3.5 h-3.5 text-slate-600" /> Windows PC
          </a>
          <span className="text-slate-300">•</span>
          <a href="#downloads" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Apple className="w-3.5 h-3.5 text-slate-600" /> macOS
          </a>
          <span className="text-slate-300">•</span>
          <a href="#downloads" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
            <Apple className="w-3.5 h-3.5 text-slate-600" /> iOS
          </a>
        </div>

        {/* Realistic Flutter App Interactive Showcase Frame */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl p-2 sm:p-3 bg-slate-900/5 border border-slate-200/80 shadow-2xl backdrop-blur-xs">
            {/* Desktop Mockup Window */}
            <div className="rounded-xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
              {/* Window Controls & Bar */}
              <div className="h-10 bg-slate-50 border-b border-slate-200/80 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="ml-3 text-xs font-medium text-slate-600 tracking-tight">
                    SaaSzo Invoice &amp; POS — Counter Register #01
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="w-3 h-3" />
                    Local SQLite: Synced
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    <Printer className="w-3 h-3" />
                    Thermal 80mm: Ready
                  </span>
                </div>
              </div>

              {/* POS App Screen Representation */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
                {/* Left Area: Product Categories & Quick Catalog (7 cols) */}
                <div className="md:col-span-7 p-5 border-r border-slate-200/80 bg-slate-50/40">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                        Quick Items &amp; Barcode Ready
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Press F2 for Search</span>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-medium text-slate-600">
                    <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold shadow-xs">
                      All Items
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Groceries
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Electronics
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                      Beverages
                    </span>
                  </div>

                  {/* Item Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {[
                      { name: "Organic Basmati Rice", price: "185.00", tax: "5% GST", code: "890123" },
                      { name: "Cold Pressed Mustard Oil", price: "210.00", tax: "5% GST", code: "890124" },
                      { name: "Wheat Flour 5kg", price: "245.00", tax: "0% GST", code: "890125" },
                      { name: "USB Thermal Paper Rolls", price: "90.00", tax: "18% GST", code: "890126" },
                      { name: "Premium Green Tea 250g", price: "160.00", tax: "12% GST", code: "890127" },
                      { name: "Packaged Mineral Water 1L", price: "20.00", tax: "18% GST", code: "890128" },
                    ].map((item) => (
                      <div
                        key={item.code}
                        className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="text-[11px] font-mono text-slate-400">{item.code}</div>
                        <div className="font-semibold text-slate-900 text-xs mt-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                          <span className="text-xs font-bold text-slate-900">₹{item.price}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{item.tax}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Feature Strip Inside Mockup */}
                  <div className="mt-5 p-3 rounded-lg bg-white border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                      Offline Engine: Ready without internet
                    </span>
                    <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                      Camera Barcode Scanner Active
                    </span>
                  </div>
                </div>

                {/* Right Area: Active Cart & Checkout (5 cols) */}
                <div className="md:col-span-5 p-5 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">Current Sale</div>
                        <div className="text-[11px] text-slate-500">Walk-in Retail Customer</div>
                      </div>
                      <span className="font-mono text-xs text-slate-400">#INV-2026-0841</span>
                    </div>

                    {/* Cart Items */}
                    <div className="divide-y divide-slate-100 my-3 text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">Organic Basmati Rice (1kg)</div>
                          <div className="text-slate-400 text-[11px]">2 × ₹185.00</div>
                        </div>
                        <div className="font-bold text-slate-900">₹370.00</div>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">Wheat Flour 5kg</div>
                          <div className="text-slate-400 text-[11px]">1 × ₹245.00</div>
                        </div>
                        <div className="font-bold text-slate-900">₹245.00</div>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">USB Thermal Paper Rolls</div>
                          <div className="text-slate-400 text-[11px]">3 × ₹90.00 (18% GST)</div>
                        </div>
                        <div className="font-bold text-slate-900">₹270.00</div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations & Print Button */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">₹885.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total GST (CGST + SGST)</span>
                        <span className="font-medium">₹67.10</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-950 pt-1.5 border-t border-slate-100">
                        <span>Net Payable</span>
                        <span className="text-base text-indigo-600">₹952.10</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Thermal Bill (F10)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
