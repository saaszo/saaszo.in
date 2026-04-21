import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹1,999",
    period: "/mo",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 users",
      "Basic HRMS",
      "CRM (100 contacts)",
      "5 GB storage",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "₹5,999",
    period: "/mo",
    description: "For growing teams who need more power",
    features: [
      "Up to 50 users",
      "Full HRMS + Payroll",
      "CRM (unlimited)",
      "AI Insights (Basic)",
      "Team Chat",
      "50 GB storage",
      "Priority support",
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored for large organisations",
    features: [
      "Unlimited users",
      "Advanced AI + Automation",
      "Custom integrations",
      "Dedicated CSM",
      "SLA guarantee",
      "SSO + Advanced Security",
      "Unlimited storage",
    ],
    cta: "Contact Sales",
    href: "#",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-28 bg-surface-container-low/30" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            No hidden fees. Pay for what you use. Scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/50 bg-surface-container-lowest"
                  : "border-outline-variant/20 bg-surface-container-lowest"
              }`}
              style={{
                boxShadow: plan.highlighted
                  ? "0 8px 48px rgba(70,72,212,0.15)"
                  : "0 2px 12px rgba(25,28,30,0.04)",
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-on-surface mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-on-surface">
                    {plan.price}
                  </span>
                  <span className="text-on-surface-variant mb-1">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0">
                      check_circle
                    </span>
                    <span className="text-on-surface-variant text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-95 ${
                  plan.highlighted
                    ? "text-white"
                    : "text-on-surface border border-outline-variant hover:bg-surface-container"
                }`}
                style={
                  plan.highlighted
                    ? {
                        background:
                          "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
                        boxShadow: "0 4px 20px rgba(70,72,212,0.3)",
                      }
                    : {}
                }
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
