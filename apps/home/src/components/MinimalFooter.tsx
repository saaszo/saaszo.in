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
          {/* Col 1: Brand & Identity & Socials */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-black text-slate-950 text-xl tracking-tight">
              <span className="w-3 h-3 rounded-full bg-[#6451f1] inline-block" />
              SAASZO <span className="text-[#6451f1] font-bold">POS</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm text-xs">
              Modern, offline-first GST Invoicing, Point of Sale, and smart inventory management for 1,50,000+ Indian retailers, restaurants, and wholesalers.
            </p>
            <div className="space-y-1 text-slate-500 text-[11px]">
              <div className="font-bold text-slate-800">SaaSzo Technologies Private Limited</div>
              <div>Tower-A, 4th Floor, Tech Park, Outer Ring Road, Bengaluru, Karnataka – 560103</div>
            </div>

            {/* Social Media Links Strip */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Connect with us:
              </div>
              <div className="flex items-center gap-2.5">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@saaszo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SaaSzo on YouTube"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/saaszo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SaaSzo on Instagram"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-pink-600 flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/saaszo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SaaSzo on Facebook"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/saaszo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SaaSzo on LinkedIn"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-[#0A66C2] flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://x.com/saaszo_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SaaSzo on X (Twitter)"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919104369797?text=Hi%20SaaSzo%20Team%2C%20I%20want%20to%20know%20more%20about%20SaaSzo%20POS%20Software."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with SaaSzo on WhatsApp"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors border border-slate-200/80"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.939l-1.564 5.707 5.867-1.539c1.691.928 3.633 1.465 5.703 1.465 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 22c-1.874 0-3.626-.531-5.115-1.449l-.366-.224-3.799.996 1.014-3.7-.24-.382c-1.026-1.632-1.572-3.526-1.572-5.491 0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Product
            </div>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-[#6451f1] transition-colors">Counter POS</a></li>
              <li><a href="#features" className="hover:text-[#6451f1] transition-colors">100% Offline SQLite</a></li>
              <li><a href="#features" className="hover:text-[#6451f1] transition-colors">Thermal Printing (ESC/POS)</a></li>
              <li><a href="#features" className="hover:text-[#6451f1] transition-colors">Barcode Scanning</a></li>
              <li><a href="#comparison" className="hover:text-[#6451f1] transition-colors">Feature Comparison</a></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Solutions
            </div>
            <ul className="space-y-2.5">
              <li><Link href="/industries" className="hover:text-[#6451f1] transition-colors font-bold text-slate-900">All 17 Industries →</Link></li>
              <li><Link href="/industries/fine-dine" className="hover:text-[#6451f1] transition-colors">Restaurants &amp; Dine-In</Link></li>
              <li><Link href="/industries/qsr" className="hover:text-[#6451f1] transition-colors">QSR &amp; Fast Food</Link></li>
              <li><Link href="/industries/retailers-kirana" className="hover:text-[#6451f1] transition-colors">Retail &amp; Kirana</Link></li>
              <li><Link href="/industries/wholesalers-distributors" className="hover:text-[#6451f1] transition-colors">Wholesale &amp; Distribution</Link></li>
              <li><Link href="/industries/pharmacy-chemist" className="hover:text-[#6451f1] transition-colors">Pharmacy &amp; Chemist</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & CTA */}
          <div>
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3.5">
              Direct Contact
            </div>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919104369797" className="flex items-center gap-2 text-slate-900 font-bold hover:text-[#6451f1] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#6451f1]" />
                  <span>+91 91043 69797</span>
                </a>
              </li>
              <li>
                <a href="mailto:getposs@saaszo.in" className="flex items-center gap-2 text-slate-600 hover:text-[#6451f1] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#6451f1]" />
                  <span>getposs@saaszo.in</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919104369797"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WhatsApp Chat Live</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="#demo"
                  className="inline-block px-4 py-2 rounded-xl bg-[#6451f1] text-white font-bold text-xs hover:bg-[#5340e6] transition-colors shadow-xs"
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
