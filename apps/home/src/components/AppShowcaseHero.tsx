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
  Zap,
  FileText,
  Receipt,
  Truck,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import { HeroMerchantIllustration } from "./illustrations/VectorIllustrations";

type TemplateType = "a4-gst" | "thermal" | "challan";
type IllustrationView = "lineart-counter" | "3d-terminal" | "2d-merchant";

export function AppShowcaseHero() {
  const [detectedOs, setDetectedOs] = useState<"android" | "windows" | "mac" | "ios">("android");
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("a4-gst");
  const [activeIllustration, setActiveIllustration] = useState<IllustrationView>("lineart-counter");

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
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-indigo-100/60 via-blue-50/40 to-transparent blur-3xl opacity-75" />
        <div
          className="absolute inset-0 opacity-[0.03]"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-900 text-xs font-semibold shadow-xs hover:border-indigo-300 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>India’s Most Trusted GST Billing &amp; Counter POS</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-indigo-600 font-bold">100% Offline Ready</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mt-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
            Billing &amp; Accounting Software{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 bg-clip-text text-transparent">
              Built for Speed.
            </span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Create professional GST bills in <strong>8 seconds</strong>, scan barcodes with your camera, manage inventory with batch expiry, and print to Bluetooth thermal printers.
          </p>
        </div>

        {/* Quick Feature Pillars Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>8s Instant Bill</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
            <WifiOff className="w-4 h-4 text-indigo-600" />
            <span>Works 100% Offline</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Thermal &amp; A4 Print</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
            <QrCode className="w-4 h-4 text-purple-600" />
            <span>WhatsApp UPI Links</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a
            href={primaryDownload.href}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-sm shadow-md hover:bg-slate-800 hover:shadow-lg transition-all duration-200 group cursor-pointer"
          >
            <PrimaryIcon className="w-4 h-4 text-emerald-400 transition-transform group-hover:scale-110" />
            <span>{primaryDownload.label}</span>
          </a>

          <a
            href="https://invoice.saaszo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs"
          >
            <span>Open Web Cloud App</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        <p className="text-center text-xs text-slate-400 mt-3 font-medium">
          {primaryDownload.hint} • Free download • No credit card needed
        </p>

        {/* Hero Visual Section: 2D Vector Illustration + Live Interactive Bill Template Switcher */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-2xl">
            {/* Left Column: Premium 3D & 2D Illustration Showcase */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-1 sm:p-2">
              {/* Illustration Type Switcher */}
              <div className="w-full flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Interactive POS Preview</span>
                </div>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setActiveIllustration("lineart-counter")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeIllustration === "lineart-counter"
                        ? "bg-red-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    SaaSzo Line Art
                  </button>
                  <button
                    onClick={() => setActiveIllustration("3d-terminal")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeIllustration === "3d-terminal"
                        ? "bg-indigo-600 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    3D Smart Terminal
                  </button>
                </div>
              </div>

              {/* Main Illustration Display Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-md group">
                {activeIllustration === "lineart-counter" ? (
                  <Image
                    src="/illustrations/hero-counter-lineart.jpg"
                    alt="SaaSzo Invoice Retail Store Counter Line Art Illustration"
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <Image
                    src="/illustrations/hero-pos-terminal-3d.jpg"
                    alt="SaaSzo 3D Smart POS Terminal and GST Invoicing System"
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                )}

                {/* Floating Micro-Badges */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-sm flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Offline SQLite</span>
                </div>

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-200/80 shadow-sm flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>Instant UPI QR</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>GST Bill in 8s</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>ESC/POS Thermal</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Cloud Dependency for Counter Billing • Automatic Real-Time Cloud Sync</span>
              </div>
            </div>

            {/* Right Column: Live Interactive Invoice Template Preview */}
            <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200/80">
              {/* Template Switcher Tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Bill Templates:
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTemplate("a4-gst")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTemplate === "a4-gst"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>A4 GST Invoice</span>
                  </button>

                  <button
                    onClick={() => setActiveTemplate("thermal")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTemplate === "thermal"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>3&quot; Thermal Slip</span>
                  </button>

                  <button
                    onClick={() => setActiveTemplate("challan")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTemplate === "challan"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Challan</span>
                  </button>
                </div>
              </div>

              {/* Template Rendering */}
              {activeTemplate === "a4-gst" && (
                <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4 font-sans text-xs">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-base font-black text-slate-950">SHREE GANESH ENTERPRISES</div>
                      <div className="text-[11px] text-slate-500">GSTIN: 27AABCS1429B1Z8 • Mumbai, MH</div>
                      <div className="text-[10px] text-slate-400">Phone: +91 98765 43210 • info@shreeganesh.com</div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] tracking-wider uppercase">
                        TAX INVOICE
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 mt-1">INV #2026/0412</div>
                      <div className="text-[10px] text-slate-400">Date: 05-Sep-2026</div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] flex justify-between">
                    <div>
                      <span className="text-slate-400 font-medium">Billed To:</span>{" "}
                      <span className="font-bold text-slate-800">Apex Traders &amp; Retail Ltd</span>
                      <div className="text-slate-500 text-[10px]">GSTIN: 27ABCDE1234F1Z5 • Place of Supply: 27-Maharashtra</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Due Date:</span> <span className="font-semibold text-slate-700">Immediate</span>
                    </div>
                  </div>

                  {/* Line items Table */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                      <div className="col-span-6">Item Description</div>
                      <div className="col-span-2 text-center">HSN</div>
                      <div className="col-span-1 text-center">Qty</div>
                      <div className="col-span-3 text-right">Amount (₹)</div>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] text-slate-800 py-1">
                      <div className="col-span-6 font-medium">Smart WiFi Security Camera 4K</div>
                      <div className="col-span-2 text-center text-slate-400">8525</div>
                      <div className="col-span-1 text-center font-bold">2</div>
                      <div className="col-span-3 text-right font-semibold">₹4,998.00</div>
                    </div>

                    <div className="grid grid-cols-12 text-[11px] text-slate-800 py-1">
                      <div className="col-span-6 font-medium">Wireless Barcode Scanner USB</div>
                      <div className="col-span-2 text-center text-slate-400">8471</div>
                      <div className="col-span-1 text-center font-bold">1</div>
                      <div className="col-span-3 text-right font-semibold">₹2,450.00</div>
                    </div>
                  </div>

                  {/* Totals & GST Split */}
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-end">
                    <div className="space-y-1 text-[10px] text-slate-500">
                      <div>CGST (9%): <span className="font-semibold text-slate-700">₹335.16</span></div>
                      <div>SGST (9%): <span className="font-semibold text-slate-700">₹335.16</span></div>
                      <div className="text-emerald-600 font-bold">Total Tax: ₹670.32</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Total Amount Payable</div>
                      <div className="text-xl font-black text-slate-950">₹7,448.00</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTemplate === "thermal" && (
                <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 max-w-sm mx-auto font-mono text-xs space-y-3">
                  <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                    <div className="font-black text-sm text-slate-900">SAASZO SUPERMART</div>
                    <div className="text-[10px] text-slate-500">Main Road, Sector 18, Noida</div>
                    <div className="text-[10px] text-slate-500">GSTIN: 09AAACS1234A1Z1</div>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>RCPT #POS-8841</span>
                    <span>05-Sep 08:30 PM</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-800 border-b border-dashed border-slate-300 pb-2">
                    <div className="flex justify-between">
                      <span>Organic Almonds 500g</span>
                      <span>₹450.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cold Pressed Olive Oil 1L</span>
                      <span>₹820.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Brown Sugar 1Kg</span>
                      <span>₹110.00</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex justify-between">
                      <span>Subtotal (3 Items)</span>
                      <span>₹1,380.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>GST (5% Included)</span>
                      <span>₹65.71</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-300">
                      <span>NET AMOUNT</span>
                      <span>₹1,380.00</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center border-t border-dashed border-slate-300 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-600">PAID VIA UPI QR CODE</div>
                    <div className="text-[9px] text-slate-400">Thank you for shopping with us!</div>
                  </div>
                </div>
              )}

              {activeTemplate === "challan" && (
                <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4 font-sans text-xs">
                  <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-base font-black text-slate-950">MAHESHWARI LOGISTICS</div>
                      <div className="text-[11px] text-slate-500">Warehouse Godown #4 • Surat, Gujarat</div>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] tracking-wider uppercase">
                        DELIVERY CHALLAN
                      </div>
                      <div className="text-[11px] font-bold text-slate-800 mt-1">DC #DC-2026-901</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] flex justify-between">
                    <div>
                      <span className="text-slate-400 font-medium">Consignee:</span>{" "}
                      <span className="font-bold text-slate-800">Reliance Digital Warehouse</span>
                      <div className="text-slate-500 text-[10px]">Vehicle No: GJ-05-BX-4421 • E-Way Bill: 884920194821</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-800 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>1. Copper Wire Rolls (Heavy Gauge)</span>
                      <span className="font-bold">50 Rolls (2,500 Kg)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>2. Industrial Switchgear Panels</span>
                      <span className="font-bold">12 Units</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2">
                    <span>Verified &amp; Dispatched by SaaSzo Inventory</span>
                    <span className="font-bold text-slate-700">Driver Signature: ____________</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
