import React from "react";
import Link from "next/link";
import { Shield, Smartphone, Monitor, Apple, ArrowUpRight } from "lucide-react";

export function MinimalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Identity (2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-black text-slate-900 text-base tracking-tight">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              SaaSzo
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Modern, offline-first GST Invoicing, Point of Sale, and inventory management for Indian retailers, wholesalers, and businesses.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted &amp; GST Ready</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Product
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Counter POS
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Offline SQLite Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Thermal Printing (ESC/POS)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-950 transition-colors">
                  Barcode Scanner
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-slate-950 transition-colors">
                  Feature Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Platforms */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Platforms
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#downloads" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Android (.apk)</span>
                </a>
              </li>
              <li>
                <a href="#downloads" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors">
                  <Monitor className="w-3.5 h-3.5 text-slate-400" />
                  <span>Windows (.exe)</span>
                </a>
              </li>
              <li>
                <a href="#downloads" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors">
                  <Apple className="w-3.5 h-3.5 text-slate-400" />
                  <span>macOS (.dmg)</span>
                </a>
              </li>
              <li>
                <a href="#downloads" className="flex items-center gap-1.5 hover:text-slate-950 transition-colors">
                  <Apple className="w-3.5 h-3.5 text-slate-400" />
                  <span>Apple iOS</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Support &amp; Legal
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="hover:text-slate-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-950 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-slate-950 transition-colors"
                >
                  <span>WhatsApp Helpdesk</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SaaSzo Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Engineered with precision in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
