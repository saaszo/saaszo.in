export default function Features() {
  return (
    <>
      <section className="py-12 bg-surface-container-low/50 border-y border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-on-surface-variant mb-8 tracking-wider uppercase">Trusted by forward-thinking companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="font-headline font-bold text-xl flex items-center gap-2"><span className="material-symbols-outlined text-3xl">layers</span> Acme Corp</div>
            <div className="font-headline font-bold text-xl flex items-center gap-2"><span className="material-symbols-outlined text-3xl">public</span> GlobalNet</div>
            <div className="font-headline font-bold text-xl flex items-center gap-2"><span className="material-symbols-outlined text-3xl">bolt</span> Zenith</div>
            <div className="font-headline font-bold text-xl flex items-center gap-2"><span className="material-symbols-outlined text-3xl">eco</span> Vertex</div>
            <div className="font-headline font-bold text-xl flex items-center gap-2 hidden sm:flex"><span className="material-symbols-outlined text-3xl">rocket_launch</span> Nova</div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">One Platform. Absolute Control.</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Replace fragmented tools with an integrated suite designed for flow state operations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container-low transition-colors duration-300 relative group overflow-hidden border border-outline-variant/15">
            <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container mb-6 relative z-10">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3 relative z-10">Empower Your People</h3>
            <p className="text-on-surface-variant mb-6 relative z-10">Modern HRMS that handles onboarding, payroll, and performance tracking without the administrative headache.</p>
            <a className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all relative z-10" href="#">Learn HRMS <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            <div className="absolute -bottom-2 -left-2 w-1 h-0 bg-primary group-hover:h-full transition-all duration-300 z-0 opacity-50"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container-low transition-colors duration-300 relative group overflow-hidden border border-outline-variant/15">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container mb-6 relative z-10">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3 relative z-10">Accelerate Your Sales</h3>
            <p className="text-on-surface-variant mb-6 relative z-10">A CRM built for speed. Track deals, manage pipelines, and automate follow-ups with intuitive precision.</p>
            <a className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all relative z-10" href="#">Explore CRM <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            <div className="absolute -bottom-2 -left-2 w-1 h-0 bg-secondary group-hover:h-full transition-all duration-300 z-0 opacity-50"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container-low transition-colors duration-300 relative group overflow-hidden border border-outline-variant/15">
            <div className="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center text-on-tertiary-container mb-6 relative z-10">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3 relative z-10">Harness Enterprise Intelligence</h3>
            <p className="text-on-surface-variant mb-6 relative z-10">Proactive AI agents analyze your data to suggest optimizations, forecast trends, and draft communications.</p>
            <a className="text-tertiary font-medium flex items-center gap-1 group-hover:gap-2 transition-all relative z-10" href="#">Discover AI <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            <div className="absolute -bottom-2 -left-2 w-1 h-0 bg-tertiary group-hover:h-full transition-all duration-300 z-0 opacity-50"></div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-8 hover:bg-surface-container-low transition-colors duration-300 relative group overflow-hidden border border-outline-variant/15">
            <div className="w-12 h-12 bg-primary-fixed-dim rounded-lg flex items-center justify-center text-on-primary-fixed mb-6 relative z-10">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-3 relative z-10">Seamless Collaboration</h3>
            <p className="text-on-surface-variant mb-6 relative z-10">Context-aware messaging embedded directly within your workflows. Discuss deals and candidates inline.</p>
            <a className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all relative z-10" href="#">See Chat <span className="material-symbols-outlined text-sm">arrow_forward</span></a>
            <div className="absolute -bottom-2 -left-2 w-1 h-0 bg-primary-fixed group-hover:h-full transition-all duration-300 z-0 opacity-50"></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:flex items-center gap-16">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-6">Deeply Connected. Effortlessly Synchronized.</h2>
            <p className="text-on-surface-variant text-lg mb-8">Data shouldn't live in silos. When a deal closes in the CRM, HR is notified for capacity planning, and the AI drafts a welcome packet—instantly.</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <span className="text-on-surface font-medium">Real-time bidirectional sync across all modules</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <span className="text-on-surface font-medium">Unified global search finds everything, anywhere</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <span className="text-on-surface font-medium">Single source of truth for business metrics</span>
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 relative h-[400px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-surface-container-lowest rounded-full shadow-[0_24px_64px_rgba(25,28,30,0.08)] flex items-center justify-center z-20">
              <div className="w-48 h-48 bg-primary-container rounded-full flex items-center justify-center opacity-10 animate-ping absolute"></div>
              <span className="material-symbols-outlined text-6xl text-primary">hub</span>
            </div>
            <div className="absolute top-10 left-10 w-24 h-24 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] flex flex-col items-center justify-center border border-outline-variant/15 z-30">
              <span className="material-symbols-outlined text-primary mb-1">groups</span>
              <span className="text-xs font-semibold text-on-surface">HRMS</span>
            </div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] flex flex-col items-center justify-center border border-outline-variant/15 z-30">
              <span className="material-symbols-outlined text-secondary mb-1">trending_up</span>
              <span className="text-xs font-semibold text-on-surface">CRM</span>
            </div>
            <div className="absolute top-10 right-20 w-24 h-24 bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(25,28,30,0.06)] flex flex-col items-center justify-center border border-outline-variant/15 z-30">
              <span className="material-symbols-outlined text-tertiary mb-1">psychology</span>
              <span className="text-xs font-semibold text-on-surface">AI</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
