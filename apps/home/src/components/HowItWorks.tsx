const STEPS = [
  {
    step: "01",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    title: "Create your account",
    desc: "Sign up in 10 seconds with Google or email. No credit card, no trial — instant access from day one.",
    detail: "We set up your company workspace, your first branch, and your admin profile automatically.",
  },
  {
    step: "02",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="7" height="7" rx="1"/><rect x="15" y="3" width="7" height="7" rx="1"/>
        <rect x="2" y="14" width="7" height="7" rx="1"/><rect x="15" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    title: "Pick your tools",
    desc: "Open Invoice, Tasks, Seller, HRMS, Connect, or Engage directly from your dashboard — all pre-connected to your account.",
    detail: "Single Sign-On means one click from the dashboard opens any product — no separate logins ever.",
  },
  {
    step: "03",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.25)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    title: "Invite your team & grow",
    desc: "Add teammates, assign roles, and collaborate in real time across every product — all under one company account.",
    detail: "Your team gets their own login. You control permissions. Everyone stays in sync across all six tools.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 relative overflow-hidden" id="how-it-works">
      {/* Background glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Up and running in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              60 seconds.
            </span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            No onboarding calls, no setup fees, no IT team required. Three steps and your entire business is running on SaaSzo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px" style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.4), rgba(139,92,246,0.4))" }} />
          <div className="hidden md:block absolute top-16 left-2/3 right-0 h-px" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.4), rgba(16,185,129,0.4))" }} />

          {STEPS.map((s, i) => (
            <div key={s.step} className="relative flex flex-col">
              {/* Step number + icon */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 relative z-10"
                  style={{ background: s.bg, borderColor: s.border, color: s.color }}
                >
                  {s.icon}
                </div>
                <span
                  className="text-4xl font-black opacity-20 select-none"
                  style={{ color: s.color }}
                >
                  {s.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-3">{s.title}</h3>
              <p className="text-on-surface-variant text-base leading-relaxed mb-4">{s.desc}</p>

              {/* Detail card */}
              <div
                className="mt-auto rounded-xl p-4 border text-sm text-on-surface-variant leading-relaxed"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <span style={{ color: s.color }}>💡 </span>
                {s.detail}
              </div>
            </div>
          ))}
        </div>

        {/* CTA below */}
        <div className="text-center mt-16">
          <a
            href="/register"
            className="inline-flex items-center gap-2 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              boxShadow: "0 8px 32px rgba(6,182,212,0.3)",
            }}
          >
            Start for Free — Takes 60 seconds
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
