"use client";

import React from "react";
import {
  FastBillingVector,
  InventoryStockVector,
  PaymentRecoveryVector,
  ThermalPrinterVector,
  GstrAccountingVector,
  OfflineEngineVector,
} from "./illustrations/VectorIllustrations";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
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
          {/* Card 1: 8-Second GST Billing */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <FastBillingVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                  8-Sec Bill
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Lightning-Fast GST Invoicing
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Generate professional tax invoices in under 8 seconds. Automatic HSN lookup, state-wise CGST/SGST/IGST tax routing, and multiple customizable invoice themes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-indigo-600">
              <span>Auto HSN &amp; Tax Calculation</span>
            </div>
          </div>

          {/* Card 2: 100% Offline SQLite Architecture */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <OfflineEngineVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Zero Lag
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Works 100% Offline with SQLite
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Never lose a sale when your internet goes down. All data is saved instantly to your local device database, then automatically syncs to cloud whenever connected.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-emerald-600">
              <span>Zero Internet Downtime</span>
            </div>
          </div>

          {/* Card 3: Bluetooth Thermal POS Printing */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <ThermalPrinterVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                  ESC/POS
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Bluetooth &amp; USB Thermal Printing
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Direct printing to 2-inch (58mm) and 3-inch (80mm) thermal receipt printers, A4/A5 laser printers, and PDF exports with company logo and UPI payment QR.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-purple-600">
              <span>Auto-Cutter &amp; Cash Drawer Kick</span>
            </div>
          </div>

          {/* Card 4: WhatsApp & UPI Payment Recovery */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <PaymentRecoveryVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
                  3x Faster
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Automated Payment Reminders
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Share bills and ledger statements directly on WhatsApp. Include instant UPI payment QR codes and automated due date reminders to recover outstanding cash faster.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-amber-600">
              <span>Dynamic UPI Intent Links</span>
            </div>
          </div>

          {/* Card 5: Inventory & Batch Expiry Tracking */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <InventoryStockVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Smart Stock
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                Batch, Expiry &amp; Rack Locator
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Track stock across multiple godowns. Get proactive low-stock alerts and batch expiry notifications. Find items in seconds using rack and aisle coordinates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-emerald-600">
              <span>Proactive Expiry Alerts</span>
            </div>
          </div>

          {/* Card 6: CA & GSTR Accounting Reports */}
          <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <GstrAccountingVector className="w-16 h-16 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                  CA Ready
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">
                1-Click GST Returns &amp; P&amp;L Reports
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Generate audit-ready GSTR-1, GSTR-3B, Profit &amp; Loss, Balance Sheet, Cash Flow, and Day Book summaries in Excel/JSON for effortless tax filing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-bold text-blue-600">
              <span>Government Portal JSON Export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
