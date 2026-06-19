import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹0",
    period: "/mo",
    badge: null,
    badgeStyle: {},
    description: "Perfect for freelancers & solo founders",
    features: [
      "All 6 products included",
      "Up to 5 users",
      "Invoice Manager (unlimited)",
      "Task Manager, Connect & Engage",
      "5 GB storage",
      "Email support",
    ],
    cta: "Start Free →",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹0",
    period: "/mo",
    badge: "Most Popular — Free in Beta",
    badgeStyle: {
      background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    },
    description: "For growing teams who need everything",
    features: [
      "Everything in Starter",
      "Up to 50 users",
      "Full HRMS + Payroll",
      "Seller, Connect & Engage workspaces",
      "Real-time team collaboration",
      "50 GB storage",
      "Priority support",
    ],
    cta: "Get Started Free →",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "₹0",
    period: "/mo during beta",
    badge: null,
    badgeStyle: {},
    description: "Tailored for large organisations",
    features: [
      "Everything in Growth",
      "Unlimited users",
      "Admin panel access",
      "SSO + Advanced security",
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited storage",
    ],
    cta: "Contact Us →",
    href: "/register",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-28 relative" id="pricing">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(6,182,212,0.03) 50%, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Completely Free.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              No tricks, no limits.
            </span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            We&apos;re in beta and every plan is ₹0. Sign up today, get full access to all 6 products, no credit card ever.
          </p>
        </div>

        {/* Free beta banner */}
        <div
          className="max-w-2xl mx-auto mb-12 rounded-2xl px-6 py-4 flex items-center gap-4 border"
          style={{
            background: "rgba(6,182,212,0.08)",
            borderColor: "rgba(6,182,212,0.25)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(6,182,212,0.2)", color: "#06b6d4" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: "#06b6d4" }}>
            🎉 <strong>Beta launch pricing:</strong> All plans are ₹0/month. No expiry, no credit card, no catch. Prices may change in the future for new signups — but existing users stay on current pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/40"
                  : "border-outline-variant/20"
              } bg-surface-container-lowest`}
              style={{
                boxShadow: plan.highlighted
                  ? "0 8px 48px rgba(6,182,212,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={plan.badgeStyle}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-on-surface mb-1">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-on-surface">{plan.price}</span>
                  <span className="text-on-surface-variant mb-1.5 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: plan.highlighted ? "rgba(6,182,212,0.15)" : "rgba(139,92,246,0.15)",
                        color: plan.highlighted ? "#06b6d4" : "#8b5cf6",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-on-surface-variant text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-95"
                style={plan.highlighted
                  ? {
                      background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(6,182,212,0.3)",
                    }
                  : {
                      border: "1px solid var(--color-outline-variant)",
                      color: "var(--color-on-surface)",
                    }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
