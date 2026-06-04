import Link from "next/link";

const footerLinks = {
  Products: [
    { label: "Invoice Manager", href: "https://invoice.saaszo.in" },
    { label: "Task Manager", href: "https://task.saaszo.in" },
    { label: "HRMS", href: "https://hrms.saaszo.in" },
    { label: "CRM", href: "https://crm.saaszo.in" },
    { label: "Projects", href: "https://projects.saaszo.in" },
    { label: "Connect", href: "https://connect.saaszo.in" },
    { label: "Admin Panel", href: "https://admin.saaszo.in" },
  ],
  Company: [
    { label: "About", href: "/#why" },
    { label: "Blog", href: "/#" },
    { label: "Careers", href: "/#" },
    { label: "Contact", href: "mailto:hello@saaszo.in" },
  ],
  Resources: [
    { label: "Documentation", href: "/#" },
    { label: "API Reference", href: "https://api.saaszo.in/health" },
    { label: "Status", href: "https://api.saaszo.in/health" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Security", href: "/privacy#security" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 mt-auto">
      {/* CTA Banner */}
      <div
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">🎉 Limited Beta Access</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Get all 7 products, completely free.
          </h2>
          <p className="text-white/70 text-lg mb-8">
            No credit card. No trial period. Invoice, Tasks, HRMS, CRM, Projects, Connect — yours the moment you sign up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors duration-200 text-sm"
              style={{ color: "#0891b2" }}
            >
              Create Free Account →
            </Link>
            <Link
              href="/auth"
              className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors duration-200 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-black tracking-tighter mb-3 block" style={{ fontSize: "20px" }}>
              <span style={{
                background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>SaaSzo</span>
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              The operating system for modern Indian business. Seven tools, one login, zero cost.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

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
