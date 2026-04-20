"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Platform", href: "#" },
  { label: "Solutions", href: "#solutions" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-primary shrink-0"
        >
          SaaSzo
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            href="/invoice"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/invoice"
            className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              boxShadow: "0 4px 20px rgba(70,72,212,0.35)",
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-outline-variant/30" />
          <Link href="/invoice" className="text-on-surface-variant font-medium">
            Log In
          </Link>
          <Link
            href="/invoice"
            className="text-center text-white font-semibold px-5 py-2.5 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
            }}
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
