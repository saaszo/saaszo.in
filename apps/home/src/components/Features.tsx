import Link from "next/link";

const features = [
  {
    icon: "groups",
    color: "bg-primary-container text-on-primary-container",
    accent: "text-primary",
    title: "Empower Your People",
    desc: "Modern HRMS that handles onboarding, payroll, and performance tracking without the administrative headache.",
    cta: "Learn HRMS",
    href: "#",
  },
  {
    icon: "trending_up",
    color: "bg-secondary-container text-on-secondary-container",
    accent: "text-secondary",
    title: "Accelerate Your Sales",
    desc: "A CRM built for speed. Track deals, manage pipelines, and automate follow-ups with intuitive precision.",
    cta: "Explore CRM",
    href: "#",
  },
  {
    icon: "psychology",
    color: "bg-tertiary-container text-on-tertiary-container",
    accent: "text-tertiary",
    title: "Harness Enterprise Intelligence",
    desc: "Proactive AI agents analyze your data to suggest optimizations, forecast trends, and draft communications.",
    cta: "Discover AI",
    href: "#",
  },
  {
    icon: "forum",
    color: "bg-primary-fixed-dim text-on-primary-fixed",
    accent: "text-primary",
    title: "Seamless Collaboration",
    desc: "Context-aware messaging embedded directly within your workflows. Discuss deals and candidates inline.",
    cta: "See Chat",
    href: "#",
  },
];

const logos = [
  { icon: "layers", name: "Acme Corp" },
  { icon: "public", name: "GlobalNet" },
  { icon: "bolt", name: "Zenith" },
  { icon: "eco", name: "Vertex" },
  { icon: "rocket_launch", name: "Nova" },
];

export default function Features() {
  return (
    <>
      {/* Trusted by section */}
      <section className="py-14 border-y border-outline-variant/20 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-10">
            Trusted by forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {logos.map((l) => (
              <div
                key={l.name}
                className="flex items-center gap-2 text-lg font-bold text-on-surface/40 hover:text-on-surface/80 transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-2xl">{l.icon}</span>
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-28 max-w-7xl mx-auto px-6" id="solutions">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            One Platform. Absolute Control.
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Replace fragmented tools with an integrated suite designed for flow
            state operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 hover:border-outline-variant/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(25,28,30,0.04)" }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6`}
              >
                <span className="material-symbols-outlined">{f.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-3">{f.title}</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">{f.desc}</p>

              <Link
                href={f.href}
                className={`${f.accent} font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200`}
              >
                {f.cta}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(90deg, #4648d4 0%, #6b38d4 100%)",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Integration visual */}
      <section className="py-28 bg-surface-container-low/50">
        <div className="max-w-7xl mx-auto px-6 lg:flex items-center gap-16">
          <div className="lg:w-1/2 mb-16 lg:mb-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Integrations
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-5">
              Deeply Connected.{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Effortlessly Synchronized.
              </span>
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
              Data shouldn't live in silos. When a deal closes in the CRM, HR
              is notified for capacity planning, and the AI drafts a welcome
              packet—instantly.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time bidirectional sync across all modules",
                "Unified global search finds everything, anywhere",
                "Single source of truth for business metrics",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span className="text-on-surface font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hub visual */}
          <div className="lg:w-1/2 relative h-80 flex items-center justify-center">
            {/* Center hub */}
            <div
              className="absolute w-32 h-32 bg-surface-container-lowest rounded-full flex items-center justify-center z-20 border border-outline-variant/20"
              style={{ boxShadow: "0 12px 48px rgba(25,28,30,0.08)" }}
            >
              <div className="w-20 h-20 rounded-full bg-primary-container/10 absolute animate-ping-slow" />
              <span className="material-symbols-outlined text-5xl text-primary">hub</span>
            </div>

            {/* Orbit modules */}
            {[
              { icon: "groups", label: "HRMS", top: "10%", left: "5%", color: "text-primary" },
              { icon: "trending_up", label: "CRM", bottom: "5%", right: "5%", color: "text-secondary" },
              { icon: "psychology", label: "AI", top: "10%", right: "15%", color: "text-tertiary" },
              { icon: "forum", label: "Chat", bottom: "5%", left: "15%", color: "text-primary" },
            ].map((mod) => (
              <div
                key={mod.label}
                className="absolute w-24 h-24 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center z-30"
                style={{
                  top: mod.top,
                  bottom: mod.bottom,
                  left: mod.left,
                  right: mod.right,
                  boxShadow: "0 8px 24px rgba(25,28,30,0.06)",
                }}
              >
                <span className={`material-symbols-outlined ${mod.color} mb-1`}>
                  {mod.icon}
                </span>
                <span className="text-xs font-semibold text-on-surface">{mod.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
