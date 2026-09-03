import type { Metadata } from "next";
import Link from "next/link";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { MinimalFooter } from "@/components/MinimalFooter";
import {
  Zap,
  WifiOff,
  Printer,
  ShieldCheck,
  Layers,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About SaaSzo | Offline-First POS & Invoicing Platform",
  description:
    "Learn why SaaSzo was created to give Indian merchants, supermarkets, and retailers a dependable, offline-first billing operating system.",
};

export default function AboutPage() {
  const VALUES = [
    {
      title: "100% Offline Resilience",
      icon: WifiOff,
      description:
        "Retail counters cannot afford to wait for loading spinners when WiFi drops or servers lag. SaaSzo is built on a local SQLite engine so you can scan items and print receipts completely offline.",
    },
    {
      title: "Sub-5 Second Billing Speed",
      icon: Zap,
      description:
        "Every interaction is tuned for rapid cashier keystrokes and fast barcode scanning. Customers clear checkout lines quickly, increasing store throughput and satisfaction.",
    },
    {
      title: "Native Hardware Harmony",
      icon: Printer,
      description:
        "Direct ESC/POS protocol support for Bluetooth and USB 58mm/80mm thermal receipt printers means zero driver hell, zero third-party spoolers, and immediate jam-free printing.",
    },
    {
      title: "True Cross-Platform Parity",
      icon: Smartphone,
      description:
        "Run the same modern software across your Windows PC billing terminals, floor staff Android tablets, and mobile owner phones with real-time central synchronization.",
    },
    {
      title: "Complete Data Ownership",
      icon: ShieldCheck,
      description:
        "Your transactions, customer directory, and margins are your business. We never sell, monetize, or broker merchant transaction data to outside advertisers or lenders.",
    },
    {
      title: "Statutory Indian Tax Compliance",
      icon: Layers,
      description:
        "Pre-configured with CGST, SGST, IGST tax slabs, HSN/SAC lookups, and one-click GSTR-1 and GSTR-3B tax report exports ready for your chartered accountant.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <ShowcaseNavbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Engineered for Indian Commerce</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Built for speed at the counter.{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Resilient when the cloud goes down.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
              SaaSzo was engineered to solve a fundamental frustration in Indian retail: modern cloud billing software that freezes when internet drops, and clunky 90s desktop software that cannot sync across devices.
            </p>
          </div>
        </section>

        {/* Engineering Philosophy & Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mt-2">
              How We Build SaaSzo
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Every design decision in our platform prioritizes cashier velocity and hardware reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      {val.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to experience faster counter billing?
              </h3>
              <p className="mt-2 text-slate-400 text-sm">
                Download SaaSzo free today for Android, Windows PC, macOS, or iOS with zero credit card required.
              </p>
            </div>
            <Link
              href="/#downloads"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap"
            >
              <span>Download Free App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
