const testimonials = [
  {
    quote:
      "SaaSzo replaced four different tools for us. The UI is cleaner, the data actually talks to each other, and the AI insights are genuinely useful, not just a gimmick.",
    name: "Sarah J.",
    role: "VP of Operations, TechFlow",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDx-plZVwFHUvxZW2waR7tnsc0k5QQv4oqQCIbj5xNQLUofL-G5e3BcANBl5PLKhH4Yjxb3o9PrMimT4mYJATG9f_50v7coQM6L9_N-Z03z2WGVRQDrxPTvhM-toBkYb8zmvumTYxHgtiWND4egy6AAthtWZKV_TYXr94tQPNiksLHIlQjlDW-gTkXLc43NZb-sJ5eKX9w8vpqdT9O27M51WXk64dphk6Eh1EuBOiYsSAORIzpNmrk9y9Jhc7r3gpHdPAAqVoNUzoav",
  },
  {
    quote:
      "The CRM interface is the fastest I've ever used. My team actually updates their pipelines now because it doesn't feel like a chore. Highly recommended.",
    name: "Michael R.",
    role: "Sales Director, Zenith Corp",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA3HIdh3iVLEXfOAuA_fckf_FMb1xAElzaZxMJ3pTNDer4EUx52edJ_fUnumLe33fGtqVh18RgY4Luca1RhTWAXQ4VKn97zzGWfs6WHqPeR2HRCCnRU9wrVbLh2D901XoapN0TFjcXwWwApBi2lVW-Y_6TmOUicVxd8pYpM9HEu9EmHd4KC0pnJuEYthIpw7HaVEAJh3h8Wm3z0s4lnsmgGv6_-XbMb9uaZlNFQCi0eZMD6d4Fg7JFPbR_6WqJxWJik15zWAsIzBBf",
  },
  {
    quote:
      "Onboarding new hires via the HRMS module takes minutes instead of hours. It sets an incredibly professional tone for our company from day one.",
    name: "Elena C.",
    role: "HR Lead, Nexus Digital",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkIFZAqobEC5tODVJtQa8uJfi2NG2ka4wg3KdfBcxbP_XhUsIYqf7MRp4W8Wc4Wyn__PV5pNU5UJRLIDbTsgoJFZyNfrMWeu2fyE6wtY6dfnH-MinVfUMo-qcjROf_34d-sUOxxfcRaJJIHQSvLBoCQRqMKfD0NP5ReYzaR0iV2HSX5FX5njXe-nSslkY8g7aS3LLgIA8DgFg4w1IPnccbcoYRNVihKIvAQnwb0uUDi-wGR_PVnjRAceG4M-oeBKq0kH5RO3D-Nrxy",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6" id="testimonials">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
          Built for teams that demand excellence.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 flex flex-col hover:-translate-y-1 transition-transform duration-300"
            style={{ boxShadow: "0 4px 12px rgba(25,28,30,0.04)" }}
          >
            {/* Stars */}
            <div className="flex items-center gap-0.5 text-amber-400 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>

            <p className="text-on-surface-variant italic leading-relaxed mb-8 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="flex items-center gap-3 mt-auto">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover bg-surface-container-high"
              />
              <div>
                <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                <p className="text-xs text-on-surface-variant">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
