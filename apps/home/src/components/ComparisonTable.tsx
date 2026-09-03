import React from "react";
import { Check, X, ShieldCheck } from "lucide-react";

interface ComparisonRow {
  feature: string;
  category: string;
  saaszo: {
    supported: boolean;
    detail: string;
  };
  traditional: {
    supported: boolean;
    detail: string;
  };
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "True Offline-First Architecture",
    category: "Reliability",
    saaszo: {
      supported: true,
      detail: "Built-in local SQLite database. Create bills, scan items, and print receipts with zero internet.",
    },
    traditional: {
      supported: false,
      detail: "Cloud-only apps freeze during internet cuts; legacy software requires manual daily backups.",
    },
  },
  {
    feature: "Full Multi-Platform Availability",
    category: "Platforms",
    saaszo: {
      supported: true,
      detail: "Native apps for Android, iOS, Windows PC, and macOS. One account across all devices.",
    },
    traditional: {
      supported: false,
      detail: "Locked to a single Windows PC or basic Android phone with no cross-platform sync.",
    },
  },
  {
    feature: "Native Bluetooth & USB Thermal Printing",
    category: "Hardware",
    saaszo: {
      supported: true,
      detail: "Direct ESC/POS protocol support for 2-inch and 3-inch thermal receipt printers out of the box.",
    },
    traditional: {
      supported: false,
      detail: "Requires complex Windows printer drivers, third-party spoolers, and frequent paper cut errors.",
    },
  },
  {
    feature: "Camera & Laser Barcode Scanning",
    category: "Hardware",
    saaszo: {
      supported: true,
      detail: "Scan barcodes directly via phone/tablet camera or plug-and-play USB hardware scanners.",
    },
    traditional: {
      supported: false,
      detail: "Mandates external handheld scanner hardware; phone camera scanning unavailable or sluggish.",
    },
  },
  {
    feature: "Automatic Real-Time Cloud Sync",
    category: "Data & Security",
    saaszo: {
      supported: true,
      detail: "Background sync immediately pushes offline bills to the cloud once internet connectivity is restored.",
    },
    traditional: {
      supported: false,
      detail: "Manual database export/import via pen drives or Google Drive, risking data corruption.",
    },
  },
  {
    feature: "5-Second Rapid Counter Checkout",
    category: "Performance",
    saaszo: {
      supported: true,
      detail: "Optimized for high-volume retail queues with quick-add items, keyboard shortcuts, and instant split tenders.",
    },
    traditional: {
      supported: false,
      detail: "Heavy ERP screens with multiple confirmation modals that delay counter customer queues.",
    },
  },
  {
    feature: "Automated Day-End Register Closing",
    category: "Accounting",
    saaszo: {
      supported: true,
      detail: "Automated cash drawer reconciliation, cash denomination count, and daily shift summary report.",
    },
    traditional: {
      supported: false,
      detail: "Manual pen-and-paper end-of-day register tallying prone to cash discrepancy errors.",
    },
  },
  {
    feature: "Modern Minimalist Interface",
    category: "User Experience",
    saaszo: {
      supported: true,
      detail: "Clean typography, zero training required, lightning-fast response times with no visual bloat.",
    },
    traditional: {
      supported: false,
      detail: "Cluttered menus designed in the 1990s requiring multi-week staff onboarding.",
    },
  },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="py-24 bg-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Direct Architectural Comparison
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Modern Businesses Switch to SaaSzo
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            See how SaaSzo compares with traditional desktop billing tools and fragile cloud-only solutions.
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-5 px-6 text-sm font-semibold text-slate-700 w-2/5">
                    Feature & Capability
                  </th>
                  <th className="py-5 px-6 text-sm font-bold text-indigo-600 bg-indigo-50/40 border-x border-indigo-100/80 w-3/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      SaaSzo Invoice & POS
                    </div>
                  </th>
                  <th className="py-5 px-6 text-sm font-semibold text-slate-500 w-3/10">
                    Traditional / Legacy Software
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_DATA.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={`transition-colors hover:bg-slate-50/50 ${
                      index % 2 === 1 ? "bg-slate-50/20" : ""
                    }`}
                  >
                    {/* Feature Name & Category */}
                    <td className="py-4 px-6 align-top">
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">
                        {row.feature}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5 font-medium">
                        {row.category}
                      </div>
                    </td>

                    {/* SaaSzo Column */}
                    <td className="py-4 px-6 align-top bg-indigo-50/20 border-x border-indigo-100/60">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {row.saaszo.detail}
                        </p>
                      </div>
                    </td>

                    {/* Traditional Column */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <X className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          {row.traditional.detail}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-slate-900 text-sm">
                Built specifically for Indian Retailers, Wholesalers & Service Providers
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Full compliance with GST rates, HSN codes, and standard thermal paper sizes.
              </p>
            </div>
            <a
              href="#downloads"
              className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Download SaaSzo Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
