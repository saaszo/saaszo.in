"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Printer, QrCode, Boxes, FileSpreadsheet } from "lucide-react";

export function BentoFeatures() {
  const features = [
    {
      title: "Lightning-Fast GST Invoicing",
      tag: "8-Sec Bill",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Generate professional tax invoices in under 8 seconds. Automatic HSN lookup, state-wise CGST/SGST/IGST tax routing, and multiple customizable invoice themes.",
      image: "/illustrations/fast-billing-pos-lineart.jpg",
      alt: "Fast GST Billing & Barcode Scanning",
      footer: "Auto HSN & Tax Calculation",
      footerColor: "text-[#6451f1]",
      icon: Zap,
    },
    {
      title: "Works 100% Offline with SQLite",
      tag: "Zero Lag",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Never lose a sale when internet goes down. All records are saved locally with millisecond speed and automatically synchronized to the cloud when online.",
      image: "/illustrations/offline-sqlite-sync-lineart.svg",
      alt: "100% Offline SQLite Engine with Cloud Sync",
      footer: "Zero Internet Downtime",
      footerColor: "text-[#6451f1]",
      icon: ShieldCheck,
    },
    {
      title: "Bluetooth & USB Thermal Printing",
      tag: "ESC/POS",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Direct printing to 2-inch (58mm) and 3-inch (80mm) thermal receipt printers, A4/A5 laser printers, and PDF exports with company logo and UPI payment QR.",
      image: "/illustrations/thermal-printer-lineart.svg",
      alt: "Smart POS Terminal & Thermal Printing",
      footer: "Auto-Cutter & Cash Drawer Kick",
      footerColor: "text-[#6451f1]",
      icon: Printer,
    },
    {
      title: "Automated Payment Reminders",
      tag: "3x Faster",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Share bills and ledger statements directly on WhatsApp. Include instant UPI payment QR codes and automated due date reminders to recover outstanding cash faster.",
      image: "/illustrations/whatsapp-upi-recovery-lineart.svg",
      alt: "WhatsApp Payment Reminders and UPI Collection",
      footer: "Dynamic UPI Intent Links",
      footerColor: "text-[#6451f1]",
      icon: QrCode,
    },
    {
      title: "Batch, Expiry & Rack Locator",
      tag: "Smart Stock",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Track stock across multiple godowns. Get proactive low-stock alerts and batch expiry notifications. Find items in seconds using rack and aisle coordinates.",
      image: "/illustrations/inventory-stock-lineart.svg",
      alt: "Smart Inventory Warehouse and Stock Management",
      footer: "Proactive Expiry Alerts",
      footerColor: "text-[#6451f1]",
      icon: Boxes,
    },
    {
      title: "1-Click GST Returns & P&L Reports",
      tag: "CA Ready",
      tagColor: "bg-indigo-50 text-[#6451f1] border border-indigo-200",
      description:
        "Generate audit-ready GSTR-1, GSTR-3B, Profit & Loss, Balance Sheet, Cash Flow, and Day Book summaries in Excel/JSON for effortless tax filing.",
      image: "/illustrations/gst-accounting-lineart.svg",
      alt: "GST Returns GSTR-1 GSTR-3B Filing & Balance Sheet",
      footer: "Government Portal JSON Export",
      footerColor: "text-[#6451f1]",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-[#6451f1] border border-indigo-200/80 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#6451f1]" />
            <span>Engineered for Maximum Reliability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Everything You Need to Run &amp; Grow Your Business
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Replace slow paper bills, complicated software, and messy registers with one unified billing &amp; accounting solution.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#6451f1] hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden shadow-xs"
              >
                <div>
                  {/* Illustration Image Container */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-slate-200/80 mb-6 group-hover:shadow-md transition-all duration-300">
                    <Image
                      src={feat.image}
                      alt={feat.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      unoptimized={feat.image.endsWith(".svg")}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${feat.tagColor} uppercase tracking-wider shadow-xs backdrop-blur-md`}>
                        {feat.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-[#6451f1]" />
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#6451f1] transition-colors">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold ${feat.footerColor}`}>
                  <span>{feat.footer}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

