"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Menu, X, ArrowRight } from "lucide-react";

export function ShowcaseNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
            S
          </div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">
            SaaSzo
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-1 tracking-wider">
            Invoice
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-950 transition-colors">
            Features
          </a>
          <a href="#comparison" className="hover:text-slate-950 transition-colors">
            Comparison
          </a>
          <a href="#downloads" className="hover:text-slate-950 transition-colors">
            Downloads
          </a>
          <a href="#faq" className="hover:text-slate-950 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth"
            className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
          >
            Sign In
          </Link>
          <a
            href="#downloads"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download App</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-950 focus:outline-hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-800">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Features
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Comparison
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
            <Link
              href="/auth"
              className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800"
            >
              Sign In
            </Link>
            <a
              href="#downloads"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-950 text-white text-sm font-semibold"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download App Free</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
