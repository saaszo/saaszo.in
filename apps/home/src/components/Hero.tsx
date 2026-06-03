import Link from "next/link";

const STATS = [
  { value: "6", label: "Products" },
  { value: "1", label: "Login" },
  { value: "₹0", label: "Forever" },
  { value: "∞", label: "Users" },
];

export default function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Animated background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
        }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Free badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold mb-8 border"
          style={{
            background: "rgba(6,182,212,0.1)",
            borderColor: "rgba(6,182,212,0.3)",
            color: "#06b6d4",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          100% Free — No credit card required
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.08] mb-6 max-w-5xl mx-auto">
          Every business tool{" "}
          <br className="hidden md:block" />
          your team needs.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            All in one place.
          </span>
        </h1>

        {/* Sub */}
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Invoice, Tasks, HRMS, CRM, Projects — built for Indian businesses, unified under one login, completely free while we grow.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="w-full sm:w-auto text-center text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              boxShadow: "0 8px 32px rgba(6,182,212,0.35)",
            }}
          >
            Start for Free — No card needed →
          </Link>
          <Link
            href="#products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-on-surface font-semibold text-base px-8 py-4 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="7" height="7" rx="1"/><rect x="15" y="3" width="7" height="7" rx="1"/>
              <rect x="2" y="14" width="7" height="7" rx="1"/><rect x="15" y="14" width="7" height="7" rx="1"/>
            </svg>
            Explore Products
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className="inline-grid grid-cols-4 gap-px rounded-2xl overflow-hidden border border-outline-variant/30 mb-20"
          style={{ background: "var(--color-outline-variant)" }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest px-8 py-5 text-center">
              <div
                className="text-3xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Product preview carousel - browser mockup */}
        <div className="relative mx-auto max-w-5xl">
          {/* Floating badge top right */}
          <div
            className="absolute -right-4 top-8 md:-right-14 md:top-12 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/20 flex items-center gap-3 animate-float z-10"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-on-surface">GST Invoice Created</p>
              <p className="text-xs text-on-surface-variant">₹24,500 · Sent to client</p>
            </div>
          </div>

          {/* Floating badge bottom left */}
          <div
            className="absolute -left-4 bottom-8 md:-left-14 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/20 flex items-center gap-3 z-10"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            <div className="flex -space-x-2">
              {["#06b6d4", "#8b5cf6", "#10b981"].map((c) => (
                <div key={c} className="w-8 h-8 rounded-full border-2 border-surface-container-lowest" style={{ background: c }} />
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-on-surface">Task assigned</p>
              <p className="text-xs text-on-surface-variant">3 team members notified</p>
            </div>
          </div>

          {/* Main screenshot */}
          <div
            className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/20"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(6,182,212,0.1)" }}
          >
            {/* Browser bar */}
            <div className="bg-surface-container-high px-4 py-3 flex items-center gap-2 border-b border-outline-variant/20">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
              <div className="flex-1 mx-4 bg-surface-container rounded-md px-3 py-1.5 text-xs text-on-surface-variant font-mono">
                task.saaszo.in/task-manager/board
              </div>
            </div>
            <img
              src="/product-tasks.png"
              alt="SaaSzo Task Manager"
              className="w-full object-cover"
              style={{ aspectRatio: "16/9" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
