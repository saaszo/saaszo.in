export default function Pricing() {
  return (
    <>
      <section className="py-24 bg-surface-container-low/50" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">Transparent Pricing. Scalable Power.</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Start for free, upgrade when you need to. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 shadow-sm text-center">
              <h3 className="text-xl font-bold text-on-surface mb-2">Starter</h3>
              <div className="text-3xl font-bold text-on-surface mb-6">$0<span className="text-sm font-normal text-on-surface-variant">/mo</span></div>
              <ul className="text-left space-y-3 mb-8 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Up to 5 users</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Basic CRM features</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Standard support</li>
              </ul>
              <button className="w-full bg-surface-container-high text-on-surface py-2 rounded-lg font-medium hover:bg-surface-container transition-colors">Start Free</button>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-xl border-2 border-primary shadow-[0_16px_48px_rgba(70,72,212,0.15)] text-center relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Pro</h3>
              <div className="text-4xl font-bold text-on-surface mb-6">$49<span className="text-sm font-normal text-on-surface-variant">/user/mo</span></div>
              <ul className="text-left space-y-3 mb-8 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Unlimited users</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Full HRMS & CRM suite</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> AI Insights (10k credits)</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Priority support</li>
              </ul>
              <button className="w-full signature-pulse text-white py-3 rounded-lg font-bold shadow-md hover:opacity-90 transition-opacity">Start Free Trial</button>
            </div>
            
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 shadow-sm text-center">
              <h3 className="text-xl font-bold text-on-surface mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-on-surface mb-6">Custom</div>
              <ul className="text-left space-y-3 mb-8 text-sm text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Unlimited everything</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Custom integrations</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">check</span> Dedicated success manager</li>
              </ul>
              <button className="w-full bg-surface-container-high text-on-surface py-2 rounded-lg font-medium hover:bg-surface-container transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 signature-pulse opacity-5 -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-6">Ready to scale your business?</h2>
          <p className="text-xl text-on-surface-variant mb-10">Join thousands of modern teams operating at peak efficiency.</p>
          <button className="signature-pulse text-white px-10 py-4 rounded-lg font-bold text-lg shadow-[0_16px_48px_rgba(70,72,212,0.25)] hover:scale-105 transition-transform">
            Get Started for Free
          </button>
          <p className="mt-4 text-sm text-on-surface-variant">No credit card required. 14-day free trial on Pro plans.</p>
        </div>
      </section>
    </>
  );
}
