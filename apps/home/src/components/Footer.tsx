import Link from "next/link";

const footerLinks = {
  Product: ["Platform", "HRMS", "CRM", "AI Insights", "Team Chat", "Pricing"],
  Company: ["About", "Blog", "Careers", "Press", "Partners"],
  Resources: ["Documentation", "API Reference", "Status", "Changelog"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 mt-auto">
      {/* CTA Banner */}
      <div
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to transform your business?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join 2,400+ teams already using SaaSzo to run their entire operation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invoice"
              className="bg-white font-bold text-primary px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors duration-200 text-sm"
            >
              Start for Free — No credit card needed
            </Link>
            <Link
              href="#"
              className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors duration-200 text-sm"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-black tracking-tighter text-primary mb-3 block"
            >
              SaaSzo
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              The operating system for modern business. Unify, automate, and
              grow—all in one platform.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/20 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} SaaSzo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
