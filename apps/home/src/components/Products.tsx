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
    id: "crm",
    badge: "Sales",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    accentColor: "#f97316",
    gradientFrom: "#ea580c",
    gradientTo: "#dc2626",
    glowColor: "rgba(249,115,22,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    name: "CRM",
    url: "https://crm.saaszo.in",
    headline: "Close more deals, faster.",
    description: "Visual sales pipeline to track leads, manage contacts, move deals across stages, and forecast revenue — with conversion funnels and team performance metrics.",
    features: [
      "Drag-and-drop sales pipeline (Kanban)",
      "Lead scoring & contact management",
      "Deal probability & revenue forecasting",
      "Activity timeline & follow-up reminders",
    ],
    screenshot: "/product-crm.png",
    cta: "Open CRM",
    align: "right",
  },
  {
    id: "projects",
    badge: "Projects",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    accentColor: "#3b82f6",
    gradientFrom: "#2563eb",
    gradientTo: "#7c3aed",
    glowColor: "rgba(59,130,246,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>
      </svg>
    ),
    name: "Projects",
    url: "https://projects.saaszo.in",
    headline: "Gantt timelines. On-time delivery.",
    description: "Track multiple projects simultaneously with interactive Gantt charts, milestone tracking, team workload view, and automatic progress reporting.",
    features: [
      "Interactive Gantt chart timelines",
      "Milestone & deadline management",
      "Team workload & capacity planning",
      "Progress reports & status updates",
    ],
    screenshot: "/product-projects.png",
    cta: "Open Projects",
    align: "left",
  },
  {
    id: "connect",
    badge: "Communication",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    accentColor: "#f43f5e",
    gradientFrom: "#e11d48",
    gradientTo: "#9f1239",
    glowColor: "rgba(244,63,94,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    name: "Connect",
    url: "https://connect.saaszo.in",
    headline: "Team chat. Zero switching cost.",
    description: "Real-time messaging, channels, direct messages, and file sharing — all connected to your SaaSzo workspace. No extra app, no extra login, no Slack bill.",
    features: [
      "Channels, DMs & group threads",
      "File sharing & media previews",
      "@mentions & smart notifications",
      "Integrated with Tasks, Projects & HRMS",
    ],
    screenshot: "/product-connect.png",
    cta: "Open Connect",
    align: "right",
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
            Six tools. One{" "}
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
