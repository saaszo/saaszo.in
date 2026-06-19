const WHY = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="7" height="7" rx="1"/><rect x="15" y="3" width="7" height="7" rx="1"/>
        <rect x="2" y="14" width="7" height="7" rx="1"/><rect x="15" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    title: "6 Tools, 1 Login",
    desc: "Invoice, Tasks, Seller, HRMS, Connect, and Engage — one account, instant SSO across all apps.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    title: "100% Free Forever",
    desc: "No trial limits, no credit card. Full access to every product while we're in beta — and beyond.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    title: "Setup in 60 Seconds",
    desc: "Sign up with Google or email, fill your company name, and every product is instantly ready to use.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    title: "Made for India",
    desc: "GST-ready invoicing, INR billing, Indian compliance built-in. Built by an Indian team for Indian businesses.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    title: "Real-time Everything",
    desc: "Live Kanban updates, instant notifications, real-time collaboration across your entire team.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    color: "#ec4899",
    bg: "rgba(236,72,153,0.12)",
    title: "Enterprise Security",
    desc: "Shared session SSO, encrypted tokens, role-based access control — enterprise-grade security for all team sizes.",
  },
];

export default function WhySaaSzo() {
  return (
    <section className="py-24 relative" id="why">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            Why SaaSzo
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Built different.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Not just another SaaS tool. A complete business operating system designed for the way Indian teams actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY.map((w) => (
            <div
              key={w.title}
              className="group relative rounded-2xl p-7 border border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: w.bg, color: w.color }}
              >
                {w.icon}
              </div>

              <h3 className="text-lg font-bold text-on-surface mb-2">{w.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{w.desc}</p>

              {/* Hover accent */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${w.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
