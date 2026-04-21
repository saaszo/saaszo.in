import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-28 pb-24 md:pt-40 md:pb-36 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse, rgba(70,72,212,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-container/20 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-8">
          <span className="material-symbols-outlined text-base">auto_awesome</span>
          Now with AI-powered insights
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-tight mb-6 max-w-4xl mx-auto">
          The Operating System for{" "}
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Modern Business
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Unify your entire workflow. HRMS, CRM, advanced AI insights, and
          seamless internal chat—all in one powerful, beautifully designed
          platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="w-full sm:w-auto text-center text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              boxShadow: "0 8px 32px rgba(70,72,212,0.3)",
            }}
          >
            Get Started for Free →
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-on-surface font-semibold text-base px-8 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:bg-surface-container transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-xl">play_circle</span>
            Watch Demo
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-surface-container-lowest rounded-2xl p-2 border border-outline-variant/20"
            style={{ boxShadow: "0 24px 80px rgba(25,28,30,0.10)" }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAh5m8r36-09wLO1abUiTWnoW6Y7dEzEh5Ov5shaQ68lFNMaZRiGQ9HlSHhfqYjO24KNATZ8Y9oZNOCPsCEQ62GZ6L7HQvDLe0p-f4FmZOr-z_x0RJVvWhZjO3YvWBjOKy4FbeCLF7VPQdwjDsZngvpjVw41HbO68ftRL7vwcCcsMp8c35IpZyuQr6CyFTrMSZsbuFRMhZ1zVFTV_bATrKg_ZOlTY3OnGhcWS6iBRByduvJyEWjOHslOoz3nsoMttsAVbSMSIrKSwB"
              alt="SaaSzo Dashboard Preview"
              className="w-full rounded-xl object-cover aspect-video"
            />
          </div>

          {/* Floating AI badge */}
          <div
            className="absolute -right-4 top-8 md:-right-10 md:top-12 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/20 flex items-center gap-3 animate-float z-10"
            style={{ boxShadow: "0 8px 32px rgba(25,28,30,0.10)" }}
          >
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">
                auto_awesome
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-on-surface">AI Insight Generated</p>
              <p className="text-xs text-on-surface-variant">Revenue projected +12%</p>
            </div>
          </div>

          {/* Floating users badge */}
          <div
            className="absolute -left-4 bottom-10 md:-left-10 bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/20 flex items-center gap-3 z-10"
            style={{ boxShadow: "0 8px 32px rgba(25,28,30,0.10)" }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary-container border-2 border-surface-container-lowest" />
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-on-surface">2,400+ teams</p>
              <p className="text-xs text-on-surface-variant">trust SaaSzo daily</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
