const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Founder, TechVenture India",
    avatar: "PS",
    avatarColor: "#06b6d4",
    rating: 5,
    quote:
      "We replaced 4 separate SaaS subscriptions with SaaSzo. Invoice, Tasks, HRMS — all in one place. Our team went from scattered tools to one dashboard overnight. Literally ₹0.",
    highlight: "Replaced 4 subscriptions",
  },
  {
    name: "Rahul Mehta",
    role: "Operations Head, BuildFast Co.",
    avatar: "RM",
    avatarColor: "#8b5cf6",
    rating: 5,
    quote:
      "The SSO across all tools is the game changer. My team opens invoice from the dashboard, no separate login, no password reset tickets. That alone saves us hours a week.",
    highlight: "One login for everything",
  },
  {
    name: "Ananya Krishnan",
    role: "HR Manager, GrowthStack",
    avatar: "AK",
    avatarColor: "#10b981",
    rating: 5,
    quote:
      "HRMS on SaaSzo is genuinely excellent — attendance, leaves, payroll all in one place and it's Indian compliance ready. I was using expensive tools for this before. Now ₹0.",
    highlight: "Indian compliance built-in",
  },
  {
    name: "Siddharth Jain",
    role: "CEO, Nexus Digital",
    avatar: "SJ",
    avatarColor: "#f97316",
    rating: 5,
    quote:
      "Setup took literally 2 minutes. Created company, added my team, opened CRM. The Kanban pipeline is clean and fast. Clients are already impressed by the GST invoices.",
    highlight: "2 minutes to fully live",
  },
  {
    name: "Meera Patel",
    role: "Project Lead, Softedge Labs",
    avatar: "MP",
    avatarColor: "#3b82f6",
    rating: 5,
    quote:
      "Projects + Task Manager together is powerful. Gantt for planning, Kanban for day-to-day — and my whole team is in the same system. No more copying updates between tools.",
    highlight: "Gantt + Kanban combined",
  },
  {
    name: "Vikram Nair",
    role: "Sales Director, CloudPilot",
    avatar: "VN",
    avatarColor: "#ec4899",
    rating: 5,
    quote:
      "The CRM pipeline is as good as tools costing ₹5,000/month. Lead scoring, deal forecasting, activity timeline — everything a sales team needs. And it's free. It's unreal.",
    highlight: "As good as ₹5,000/mo tools",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-28 relative overflow-hidden" id="testimonials">
      {/* Right-side glow */}
      <div
        className="absolute right-0 top-1/4 w-[500px] h-[500px] pointer-events-none -z-10 opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            Real Teams, Real Results
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Loved by Indian businesses.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            From freelancers to 50-person teams — see how SaaSzo is replacing expensive tool stacks across India.
          </p>
        </div>

        {/* Aggregate stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-14">
          {[
            { val: "5.0", label: "Average rating", suffix: "★" },
            { val: "100%", label: "Free forever", suffix: "" },
            { val: "6", label: "Products included", suffix: "" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-on-surface">
                {s.val}
                <span style={{ color: "#f59e0b" }}>{s.suffix}</span>
              </p>
              <p className="text-sm text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative rounded-2xl p-7 border border-outline-variant/20 bg-surface-container-lowest hover:-translate-y-1 transition-all duration-300 flex flex-col"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
            >
              {/* Highlight badge */}
              <div
                className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: `${t.avatarColor}18`,
                  color: t.avatarColor,
                }}
              >
                {t.highlight}
              </div>

              <StarRow count={t.rating} />

              <blockquote className="text-on-surface text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
