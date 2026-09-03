import React from "react";
import {
  Zap,
  Printer,
  WifiOff,
  Share2,
  Barcode,
  FileSpreadsheet,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";

export function BentoFeatures() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Engineered for High-Speed Counters
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Everything your business needs to bill, print, and balance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Every feature in SaaSzo is tuned for lightning-fast cashier operation, offline dependability, and zero setup friction.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Offline Billing (Wide - 2 cols on md) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <WifiOff className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                100% Offline SQLite Architecture
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
                Never lose a customer during power cuts or WiFi dropouts. Bills, products, parties, and barcodes are stored securely inside the app’s local SQLite database. Once your connection returns, data auto-syncs to the cloud in the background.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200/70 flex items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Zero-lag local database
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Background auto-sync
              </span>
            </div>
          </div>

          {/* Card 2: 5-Second POS */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                5-Second Counter POS
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Clear customer lines in seconds. Rapid item lookup, hotkey quantity adjustments, custom discounts, and one-touch split payment between Cash, Card, and UPI QR codes.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200/70 text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Day-End cash tally &amp; register closing included
            </div>
          </div>

          {/* Card 3: Thermal Receipt Printing */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Instant Thermal Receipts
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Connect directly to 58mm (2-inch) and 80mm (3-inch) thermal receipt printers via Bluetooth or USB. Uses standard ESC/POS commands for instant, jam-free printing.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200/70 text-xs text-slate-500 font-medium">
              Supports TSC, TVS, Epson, and all generic thermal printers
            </div>
          </div>

          {/* Card 4: Barcode Scanning */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Barcode className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Camera &amp; Laser Scanning
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Use your smartphone or tablet camera for fast optical barcode and QR recognition, or plug in a standard USB/Bluetooth handheld barcode scanner.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200/70 text-xs text-slate-500 font-medium">
              EAN-13, UPC, Code-128, and QR support
            </div>
          </div>

          {/* Card 5: WhatsApp Sharing */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                One-Tap WhatsApp Share
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Save on paper rolls by dispatching professional PDF tax invoices, payment receipt links, and ledger balance reminders directly to your customer’s WhatsApp.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-200/70 text-xs text-slate-500 font-medium">
              Automated PDF generation with company branding
            </div>
          </div>

          {/* Card 6: Complete Accounting & GSTR (Span full on md/lg) */}
          <div className="md:col-span-3 p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Double-Entry Accounting &amp; GST Return Data
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Every invoice, expense, and purchase automatically updates your Party Ledgers, Profit &amp; Loss statements, and Balance Sheet. Export GSTR-1 and GSTR-3B tax summaries in one click for your accountant.
                  </p>
                </div>
              </div>
              <a
                href="#downloads"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold shadow-xs hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
