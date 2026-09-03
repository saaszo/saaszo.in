"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Does SaaSzo Invoice require an active internet connection to create bills?",
    answer:
      "No. SaaSzo is built with a local SQLite database engine that operates 100% offline. You can scan barcodes, create GST invoices, accept cash payments, and print thermal receipts even during complete network or power cuts. Once internet is restored, all offline transactions auto-sync to the cloud in the background.",
  },
  {
    question: "Which thermal receipt printers and barcode scanners are supported?",
    answer:
      "SaaSzo supports all standard 58mm (2-inch) and 80mm (3-inch) thermal printers via Bluetooth, USB, and LAN (ESC/POS protocol). It is compatible with TVS, TSC, Epson, Posiflex, and generic Bluetooth thermal printers. Barcode scanning works using your device camera or any plug-and-play USB laser scanner.",
  },
  {
    question: "Can multiple cashiers or counters bill simultaneously without data conflicts?",
    answer:
      "Yes. You can run counter registers on Windows PC terminals alongside mobile tablet billers in the aisles. Each register uses unique transaction sequencing, ensuring that multi-device sales sync cleanly into your central ledger without overlapping bill numbers.",
  },
  {
    question: "How do I export GST reports for my tax accountant?",
    answer:
      "SaaSzo automatically computes CGST, SGST, IGST, and HSN/SAC summaries for every sale. You can export complete GSTR-1, GSTR-3B, Balance Sheet, and Profit & Loss reports in Excel or PDF formats with a single click.",
  },
  {
    question: "Is there any setup or installation fee to download the app?",
    answer:
      "No. SaaSzo Invoice is free to download and install on Android, Windows, macOS, and iOS with no credit card required.",
  },
  {
    question: "Can I share digital bills directly with customers on WhatsApp?",
    answer:
      "Yes. In addition to thermal paper printing, you can send professional PDF tax invoices directly to your customer's WhatsApp number with one tap.",
  },
];

export function ShowcaseFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50/50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear answers about offline billing, thermal hardware compatibility, and tax reporting.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-xl bg-white border border-slate-200/90 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
