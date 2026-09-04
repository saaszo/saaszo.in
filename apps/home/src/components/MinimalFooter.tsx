"use client";

import React from "react";
import Link from "next/link";
import { Shield, Smartphone, Monitor, Apple, ArrowUpRight, Phone, Mail, ChevronUp } from "lucide-react";

export function MinimalFooter() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-black text-slate-950 text-xl tracking-tight">
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              SAASZO <span className="text-amber-500 font-bold">POS</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm text-xs">
              Modern, offline-first GST Invoicing, Point of Sale, and smart inventory management for 1,50,000+ Indian retailers, restaurants, and wholesalers.
            </p>
            <div className="space-y-1 text-slate-500 text-[11px]">
              <div className="font-bold text-slate-800">SaaSzo Technologies Private Limited</div>
              <div>Tower-A, 4th Floor, Tech Park, Outer Ring Road, Bengaluru, Karnataka – 560103</div>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Product
            </div>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-amber-600 transition-colors">Counter POS</a></li>
              <li><a href="#features" className="hover:text-amber-600 transition-colors">100% Offline SQLite</a></li>
              <li><a href="#features" className="hover:text-amber-600 transition-colors">Thermal Printing (ESC/POS)</a></li>
              <li><a href="#features" className="hover:text-amber-600 transition-colors">Barcode Scanning</a></li>
              <li><a href="#comparison" className="hover:text-amber-600 transition-colors">Feature Comparison</a></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Solutions
            </div>
            <ul className="space-y-2.5">
              <li><a href="#solutions" className="hover:text-amber-600 transition-colors">Retail &amp; Supermarket</a></li>
              <li><a href="#solutions" className="hover:text-amber-600 transition-colors">Wholesale &amp; Distribution</a></li>
              <li><a href="#solutions" className="hover:text-amber-600 transition-colors">Pharmacy &amp; Chemist</a></li>
              <li><a href="#solutions" className="hover:text-amber-600 transition-colors">Electronics &amp; Hardware</a></li>
              <li><a href="#solutions" className="hover:text-amber-600 transition-colors">Services &amp; Agencies</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & CTA */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Direct Contact
            </div>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919104369797" className="flex items-center gap-2 text-slate-900 font-bold hover:text-amber-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+91 91043 69797</span>
                </a>
              </li>
              <li>
                <a href="mailto:getposs@saaszo.in" className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>getposs@saaszo.in</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="#demo"
                  className="inline-block px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition-colors shadow-xs"
                >
                  Take a Free Demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            COPYRIGHT &copy; 2026 &mdash; SaaSzo Technologies Pvt. Ltd., India. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookie Settings</Link>
            <Link href="/refund" className="hover:text-slate-900 transition-colors">Cancellation &amp; Refund</Link>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Scroll to Top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
