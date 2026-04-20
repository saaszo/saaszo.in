export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-container/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-6 max-w-4xl mx-auto leading-tight">
          The Operating System for <span className="text-gradient">Modern Business</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Unify your entire workflow. HRMS, CRM, advanced AI insights, and seamless internal chat—all in one powerful, beautifully designed platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a className="signature-pulse text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-[0_12px_32px_rgba(25,28,30,0.06)] w-full sm:w-auto text-center" href="/invoice">
            Get Started for Free
          </a>
          <a className="bg-surface-container-high text-on-surface px-8 py-4 rounded-lg font-semibold text-lg hover:bg-surface-container transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2" href="#">
            <span className="material-symbols-outlined">play_circle</span>
            Watch Demo
          </a>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-surface-container-lowest rounded-[24px] p-2 shadow-[0_24px_64px_rgba(25,28,30,0.08)] border border-outline-variant/15 relative z-10">
            <img alt="High-fidelity SaaS dashboard preview" className="w-full rounded-[16px] object-cover aspect-video" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAh5m8r36-09wLO1abUiTWnoW6Y7dEzEh5Ov5shaQ68lFNMaZRiGQ9HlSHhfqYjO24KNATZ8Y9oZNOCPsCEQ62GZ6L7HQvDLe0p-f4FmZOr-z_x0RJVvWhZjO3YvWBjOKy4FbeCLF7VPQdwjDsZngvpjVw41HbO68ftRL7vwcCcsMp8c35IpZyuQr6CyFTrMSZsbuFRMhZ1zVFTV_bATrKg_ZOlTY3OnGhcWS6iBRByduvJyEWjOHslOoz3nsoMttsAVbSMSIrKSwB"/>
          </div>
          <div className="absolute -right-8 top-12 bg-surface-container-lowest p-4 rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] border border-outline-variant/15 z-20 flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-on-surface">AI Insight Generated</p>
              <p className="text-xs text-on-surface-variant">Revenue projected +12%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
