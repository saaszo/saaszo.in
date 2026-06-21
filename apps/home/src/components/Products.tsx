"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: "invoice",
    badge: "Billing",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    accentColor: "#14b8a6",
    gradientFrom: "#0d9488",
    gradientTo: "#0891b2",
    glowColor: "rgba(20,184,166,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M7 8h.01M7 11h.01M11 8h6M11 11h4"/>
      </svg>
    ),
    name: "Invoice Manager",
    url: "https://invoice.saaszo.in",
    headline: "GST-ready invoicing. Get paid faster.",
    description: "Create professional GST invoices in seconds, track payments, send automatic reminders, and get real-time revenue insights — all built for Indian businesses.",
    features: [
      "Auto-calculated GST (IGST, CGST, SGST)",
      "One-click PDF generation & email delivery",
      "Payment tracking with overdue alerts",
      "Client management & recurring billing",
    ],
    screenshot: "/product-invoice.png",
    cta: "Open Invoice Manager",
    align: "left",
  },
  {
    id: "tasks",
    badge: "Productivity",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    accentColor: "#8b5cf6",
    gradientFrom: "#7c3aed",
    gradientTo: "#6d28d9",
    glowColor: "rgba(139,92,246,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="5" rx="1"/><rect x="10" y="3" width="5" height="5" rx="1"/><rect x="3" y="10" width="5" height="5" rx="1"/>
        <rect x="10" y="10" width="5" height="5" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>
      </svg>
    ),
    name: "Task Manager",
    url: "https://task.saaszo.in",
    headline: "Visual boards. Real-time collaboration.",
    description: "Drag-and-drop Kanban boards with live updates, nested comments, priority labels, assignees, and due dates. Your whole team, always in sync.",
    features: [
      "Live drag-and-drop Kanban boards",
      "Nested comments, @mentions & replies",
      "Priority, due date & assignee tracking",
      "Task activity timeline & notifications",
    ],
    screenshot: "/product-tasks.png",
    cta: "Open Task Manager",
    align: "right",
  },
  {
    id: "hrms",
    badge: "HR",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    accentColor: "#10b981",
    gradientFrom: "#059669",
    gradientTo: "#0891b2",
    glowColor: "rgba(16,185,129,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    name: "HRMS",
    url: "https://hrms.saaszo.in",
    headline: "Manage your people, not paperwork.",
    description: "Complete HR suite with employee directory, attendance tracking, leave management, payroll processing, and org charts — built for growing Indian teams.",
    features: [
      "Employee directory with roles & departments",
      "Attendance & leave tracking calendar",
      "Payroll processing with compliance",
      "Org chart & performance management",
    ],
    screenshot: "/product-hrms.png",
    cta: "Open HRMS",
    align: "left",
  },
  {
    id: "seller",
    badge: "Commerce",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    accentColor: "#f97316",
    gradientFrom: "#ea580c",
    gradientTo: "#dc2626",
    glowColor: "rgba(249,115,22,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h15l-1 7H6L3 6Z"/><path d="M6 6 7.5 3h6L15 6"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
      </svg>
    ),
    name: "Seller Hub",
    url: "https://seller.saaszo.in",
    headline: "Marketplace orders. Settlements without guesswork.",
    description: "Bring Amazon and marketplace operations into one clear view with orders, returns, settlements, fee tracking, and margin visibility for every SKU.",
    features: [
      "Orders, returns & refund tracking",
      "Settlement reconciliation across payouts",
      "Fee, chargeback & claim visibility",
      "SKU-level margin and profitability checks",
    ],
    screenshot: "/product-crm.png",
    cta: "Open Seller Hub",
    align: "right",
  },
  {
    id: "engage",
    badge: "Marketing",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    accentColor: "#ec4899",
    gradientFrom: "#db2777",
    gradientTo: "#f97316",
    glowColor: "rgba(236,72,153,0.18)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-8v18L3 13v-2Z"/><path d="m11 12 4 4"/><path d="m7 15 2.5 5 2-6"/>
      </svg>
    ),
    name: "Engage",
    url: "https://engage.saaszo.in",
    headline: "Broadcasts, journeys, and follow-ups that actually convert.",
    description: "Launch campaigns, build message automations, trigger follow-ups, and keep every customer journey moving from one shared engagement workspace.",
    features: [
      "Broadcast campaigns with delivery visibility",
      "Visual follow-up and automation journeys",
      "Audience segmentation and message templates",
      "Lead reactivation and nurture workflows",
    ],
    screenshot: "/product-connect.png",
    cta: "Open Engage",
    align: "left",
  },
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState(products[0].id);

  return (
    <section className="py-28 relative overflow-hidden" id="products">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/20 via-transparent to-surface-container-low/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            Our Products
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Five tools. One{" "}
            <span style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              login.
            </span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Every tool your business needs, deeply connected and available the moment you sign up — completely free.
          </p>
        </div>

        {/* Product Tab Nav */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProduct(p.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border"
              style={activeProduct === p.id ? {
                background: `linear-gradient(135deg, ${p.gradientFrom}22, ${p.gradientTo}22)`,
                borderColor: p.accentColor + "60",
                color: p.accentColor,
                boxShadow: `0 0 20px ${p.glowColor}`,
              } : {
                borderColor: "transparent",
                color: "var(--color-on-surface-variant)",
                background: "var(--color-surface-container-low)",
              }}
            >
              <span style={{ color: activeProduct === p.id ? p.accentColor : "inherit" }}>{p.icon}</span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Product Showcase */}
        {products.map((product) => (
          <div
            key={product.id}
            className={`transition-all duration-500 ${activeProduct === product.id ? "block" : "hidden"}`}
          >
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${product.align === "right" ? "lg:grid-flow-col-dense" : ""}`}>
              {/* Screenshot */}
              <div className={`relative ${product.align === "right" ? "lg:col-start-2" : ""}`}>
                <div
                  className="relative rounded-2xl overflow-hidden border border-outline-variant/20"
                  style={{
                    boxShadow: `0 0 80px ${product.glowColor}, 0 24px 60px rgba(0,0,0,0.3)`,
                  }}
                >
                  {/* Browser chrome bar */}
                  <div className="bg-surface-container-high px-4 py-3 flex items-center gap-2 border-b border-outline-variant/20">
                    <div className="w-3 h-3 rounded-full bg-red-400/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <div className="w-3 h-3 rounded-full bg-green-400/70" />
                    <div className="flex-1 mx-4 bg-surface-container rounded-md px-3 py-1 text-xs text-on-surface-variant font-mono truncate">
                      {product.url.replace("https://", "")}
                    </div>
                  </div>
                  <Image
                    src={product.screenshot}
                    alt={`${product.name} screenshot`}
                    width={800}
                    height={500}
                    className="w-full object-cover"
                    unoptimized
                  />
                  {/* Glow overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, transparent 60%, ${product.glowColor} 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Copy */}
              <div className={product.align === "right" ? "lg:col-start-1 lg:row-start-1" : ""}>
                {/* Badge */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${product.badgeColor} mb-6`}>
                  <span style={{ color: product.accentColor }}>{product.icon}</span>
                  {product.badge}
                </span>

                <h3 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">
                  {product.name}
                </h3>
                <p className="text-xl font-semibold mb-4" style={{ color: product.accentColor }}>
                  {product.headline}
                </p>
                <p className="text-on-surface-variant text-base leading-relaxed mb-8">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: product.accentColor + "22", color: product.accentColor }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-on-surface text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4">
                  <Link
                    href={product.url}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${product.gradientFrom} 0%, ${product.gradientTo} 100%)`,
                      boxShadow: `0 4px 20px ${product.glowColor}`,
                    }}
                  >
                    {product.cta}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </Link>
                  <span className="text-xs text-on-surface-variant">Free — No signup needed to explore</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
