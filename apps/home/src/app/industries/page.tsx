import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  Zap,
  ArrowRight,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import Footer from "@/components/Footer";
import { IndustryDirectoryClient } from "@/components/IndustryDirectoryClient";

export const metadata = {
  title: "Industry Specific Billing, POS & Invoicing Software | SaaSzo",
  description:
    "Explore tailored billing, POS, and inventory management solutions for 17+ business types across Restaurants, Retail, Wholesalers, Pharmacy, Manufacturers and more.",
};

const CAPABILITY_HIGHLIGHTS = [
  {
    icon: WifiOff,
    title: "100% Offline SQLite Billing",
    desc: "Internet drop? Your counter never stops. Bills, KOTs, and barcodes process instantly in offline mode and auto-sync when back online.",
  },
  {
    icon: Printer,
    title: "All Hardware Supported",
    desc: "Plug-and-play support for 2-inch & 3-inch thermal printers (ESC/POS), USB/Bluetooth barcode scanners, weighing scales & cash drawers.",
  },
  {
    icon: RefreshCw,
    title: "Multi-Location Cloud Sync",
    desc: "Centralize inventory, sales tallies, customer ledgers, and staff permissions across all branches in one real-time cloud dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "GST, E-Way & E-Invoicing",
    desc: "100% compliant with Indian tax regulations. Generate IRN QR codes, E-Way bills, and auto-export GSTR-1 & GSTR-3B with zero stress.",
  },
];

export default function IndustriesDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ShowcaseNavbar />

      {/* Main Content Area */}
      <main className="pt-24 pb-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto pt-8 pb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#6451f1] text-xs font-bold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SaaSzo Industry Solutions Suite</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
              One Billing Software, Tailored for Every Industry
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Every business has unique operational needs. Discover our dedicated feature suites configured for 17+ restaurant, retail, wholesale, and service categories.
            </p>
          </div>

          {/* Directory Client Grid with Live Search and Filters */}
          <IndustryDirectoryClient />

          {/* Core Hardware & App Capabilities Section */}
          <section className="mt-24 pt-16 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6451f1]">
                Enterprise Grade Foundation
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
                Core Engine Powers Every Industry Solution
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                No matter your category, SaaSzo provides lightning-fast performance, offline reliability, and complete hardware interoperability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CAPABILITY_HIGHLIGHTS.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6451f1] mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Book a Demo & Support CTA Banner */}
          <section className="mt-20 rounded-3xl bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-[#6451f1]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free On-Site &amp; Remote Migration Assistance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Need a custom setup for your retail chain or restaurant?
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Our POS specialists will import your existing Excel / Tally item masters, configure your thermal printers and barcode scanners, and get your billing counter live in 10 minutes.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
                <a
                  href="/#demo"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#6451f1] hover:bg-[#5340eb] text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Request 10-Min Live Demo</span>
                </a>
                <a
                  href="https://invoice.saaszo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all"
                >
                  <span>Open Free Web App</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
