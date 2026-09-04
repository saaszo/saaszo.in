"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Menu, X, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

export function ShowcaseNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-xs">
            S
          </div>
          <span className="font-extrabold text-slate-950 text-xl tracking-tight">
            SaaSzo
          </span>
          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full ml-1 tracking-wider">
            Billing &amp; POS
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#solutions" className="hover:text-indigo-600 transition-colors">
            Industry Solutions
          </a>
          <a href="#calculator" className="hover:text-indigo-600 transition-colors">
            ROI Calculator
          </a>
          <a href="#comparison" className="hover:text-indigo-600 transition-colors">
            Why SaaSzo
          </a>
          <a href="#downloads" className="hover:text-indigo-600 transition-colors">
            Downloads
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://invoice.saaszo.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>Web Login</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <a
            href="#downloads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Free</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 focus:outline-hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-800">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Industry Solutions
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              ROI Calculator
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Why SaaSzo
            </a>
            <a
              href="#downloads"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Downloads
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href="https://invoice.saaszo.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-900 text-sm font-bold"
            >
              <span>Open Web App</span>
            </a>
            <a
              href="#downloads"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-950 text-white text-sm font-bold"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Free App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
