import Link from "next/link";

const footerLinks = {
  Products: [
    { label: "Invoice Manager", href: "https://invoice.saaszo.in" },
    { label: "Task Manager", href: "https://task.saaszo.in" },
    { label: "Seller Hub", href: "https://seller.saaszo.in" },
    { label: "HRMS", href: "https://hrms.saaszo.in" },
    { label: "Engage", href: "https://engage.saaszo.in" },
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
            Get all 5 products, completely free.
          </h2>
          <p className="text-white/70 text-lg mb-8">
            No credit card. No trial period. Invoice, Tasks, Seller, HRMS, and Engage — yours the moment you sign up.
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
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
              The operating system for modern Indian business. Five tools, one login, zero cost.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@saaszo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-7 h-7 rounded-lg bg-surface-container hover:text-red-500 flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/saaszo.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-7 h-7 rounded-lg bg-surface-container hover:text-pink-500 flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/saaszo.in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-7 h-7 rounded-lg bg-surface-container hover:text-blue-500 flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/saaszo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded-lg bg-surface-container hover:text-[#0A66C2] flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://x.com/saaszo_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-7 h-7 rounded-lg bg-surface-container hover:text-slate-900 flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
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
