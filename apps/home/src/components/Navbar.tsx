"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuthSession } from "./AuthProvider";

const PRODUCTS = [
  { label: "Invoice Manager", href: "https://invoice.saaszo.in", desc: "GST billing & payments", color: "#14b8a6" },
  { label: "Task Manager", href: "https://task.saaszo.in", desc: "Kanban & collaboration", color: "#8b5cf6" },
  { label: "HRMS", href: "https://hrms.saaszo.in", desc: "HR, payroll & attendance", color: "#10b981" },
  { label: "CRM", href: "https://crm.saaszo.in", desc: "Leads & sales pipeline", color: "#f97316" },
  { label: "Projects", href: "https://projects.saaszo.in", desc: "Gantt timelines", color: "#3b82f6" },
  { label: "Admin Panel", href: "https://admin.saaszo.in", desc: "Platform management", color: "#ec4899" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { authenticated, loading, profile, signOut } = useAuthSession();

  const displayName = profile?.fullName?.split(" ")[0] || "Dashboard";

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="font-black tracking-tighter shrink-0" style={{ fontSize: "20px" }}>
          <span style={{
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>SaaSzo</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors duration-200">
              Products
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {productsOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-3 grid grid-cols-2 gap-1.5"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
              >
                {PRODUCTS.map((p) => (
                  <Link
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: p.color }} />
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{p.label}</p>
                      <p className="text-xs text-on-surface-variant">{p.desc}</p>
                    </div>
                  </Link>
                ))}
                <div className="col-span-2 border-t border-outline-variant/20 mt-1 pt-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}
                  >
                    Open Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="#why" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            Why SaaSzo
          </Link>
          <Link href="#pricing" className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
            Pricing
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>Free</span>
          </Link>
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {authenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                {displayName}
              </Link>
              <button
                onClick={() => { void signOut(); }}
                className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
              >
                Dashboard
              </button>
            </>
          ) : !loading ? (
            <>
              <Link href="/auth" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold text-white px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}
              >
                Start Free →
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-6 py-4 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Products</p>
          {PRODUCTS.map((p) => (
            <Link key={p.label} href={p.href} target="_blank" onClick={() => setOpen(false)}
              className="flex items-center gap-3 py-1">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
              <span className="text-sm font-medium text-on-surface">{p.label}</span>
            </Link>
          ))}
          <hr className="border-outline-variant/30 my-2" />
          <Link href="#why" onClick={() => setOpen(false)} className="text-sm font-medium text-on-surface-variant">Why SaaSzo</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="text-sm font-medium text-on-surface-variant">Pricing</Link>
          <hr className="border-outline-variant/30" />
          {authenticated ? (
            <Link href="/dashboard" className="text-center text-white font-semibold px-5 py-2.5 rounded-lg" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>Open Dashboard</Link>
          ) : !loading ? (
            <>
              <Link href="/auth" className="text-on-surface-variant font-medium text-sm">Log In</Link>
              <Link href="/register" className="text-center text-white font-semibold px-5 py-2.5 rounded-lg" style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)" }}>Start Free →</Link>
            </>
          ) : null}
        </div>
      )}
    </nav>
  );
}
