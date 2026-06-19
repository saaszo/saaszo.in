"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Is SaaSzo really free? What's the catch?",
    a: "Yes — 100% free during our beta. No credit card, no hidden fees, no feature lockouts. We're building SaaSzo with real Indian businesses and offering full access while we grow. When we introduce pricing in the future, existing users will be grandfathered at their current plan.",
  },
  {
    q: "Do I need a separate login for each product?",
    a: "No. That's the entire point of SaaSzo. One account, one login, instant SSO access to all six products. Open Invoice, Task Manager, Seller Hub, HRMS, Connect, or Engage from your dashboard — no extra passwords, no re-authentication.",
  },
  {
    q: "How many users can I add to my account?",
    a: "During beta, you can add up to 50 users on the Growth tier. Each user gets their own login and access to whichever products you grant them. Roles and permissions are managed from the Admin Panel.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade security: encrypted tokens, role-based access control, shared-session SSO with domain-scoped cookies, and industry-standard data handling. Your data is yours — we never sell or share it.",
  },
  {
    q: "Does Invoice Manager support GST?",
    a: "Absolutely. The Invoice Manager auto-calculates IGST, CGST, and SGST based on your transaction type (intra-state or inter-state). It generates GST-compliant PDFs, supports HSN/SAC codes, and sends invoices directly to clients via email.",
  },
  {
    q: "Can I use SaaSzo for my existing team?",
    a: "Yes. You can invite your entire team immediately after signup. Each member gets a dedicated login, and you can assign them to specific products and roles. There's no migration required — start fresh or import your existing data.",
  },
  {
    q: "What happens to my data if I stop using SaaSzo?",
    a: "You can export your data at any time from the Admin Panel — invoices as PDF/CSV, contacts, HR records, and task exports. We don't hold your data hostage. You're always in control.",
  },
  {
    q: "Is SaaSzo available as a mobile app?",
    a: "All SaaSzo products are fully responsive and work great on mobile browsers. Dedicated iOS and Android apps are on the roadmap — sign up to be notified when they launch.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 relative" id="faq">
      {/* BG */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.03) 50%, transparent)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            FAQ
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Questions? Answered.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Everything you need to know about SaaSzo. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="mailto:hello@saaszo.in" className="underline underline-offset-2" style={{ color: "#06b6d4" }}>
              Email us.
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: isOpen ? "0 4px 24px rgba(6,182,212,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                  borderColor: isOpen ? "rgba(6,182,212,0.3)" : undefined,
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-on-surface">{item.q}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(6,182,212,0.15)" : "var(--color-surface-container)",
                      color: isOpen ? "#06b6d4" : "var(--color-on-surface-variant)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-outline-variant/20 mb-4" />
                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
