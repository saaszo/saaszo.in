import Link from "next/link";
import type { ReactNode } from "react";
import {
  type DigitalMenuItem,
  getDigitalBootstrap,
  marketingContact,
  normalizeOldDigitalLink,
} from "@/lib/digital-marketing";

const navItems = [
  { href: "/", label: "Home", target: "_self" },
  { href: "/tools", label: "Tools", target: "_self" },
  { href: "/approach", label: "Approach", target: "_self" },
  { href: "/services", label: "Services", target: "_self" },
  { href: "/industries", label: "Industries", target: "_self" },
  { href: "/blog", label: "Blog", target: "_self" },
];

const moreItems = [
  { href: "/bussinsh_tool", label: "Premium Tools Beta", target: "_self" },
  { href: "/about", label: "About Us", target: "_self" },
  { href: "/team", label: "Our Team", target: "_self" },
  { href: "/careers", label: "Careers", target: "_self" },
  { href: "/packages", label: "Packages", target: "_self" },
  { href: "/creator-program", label: "Creator Program", target: "_self" },
  { href: "/contact", label: "Contact", target: "_self" },
  { href: "/audit", label: "Growth Audit", target: "_self" },
  { href: "/privacy", label: "Privacy Policy", target: "_self" },
  { href: "/terms", label: "Terms of Service", target: "_self" },
  { href: "/blog", label: "RSS Feed", target: "_self" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Our Team" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const importantLinks = [
  { href: "/bussinsh_tool", label: "Premium Tools Beta" },
  { href: "/creator-program", label: "Influencer Program" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/blog", label: "RSS Feed" },
];

const services = [
  { href: "/services/lead-generation-ads", label: "Lead Gen Ads" },
  { href: "/services/local-seo-gmb", label: "Local SEO" },
  { href: "/services/social-media-presence", label: "Social Media" },
  { href: "/audit", label: "Growth Audit" },
];

function toNavItems(items?: DigitalMenuItem[]) {
  return (items || [])
    .filter((item) => item.title && item.url)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((item) => ({
      href: normalizeOldDigitalLink(item.url),
      label: item.title,
      target: item.target || "_self",
    }));
}

export async function DigitalMarketingShell({
  children,
}: {
  children: ReactNode;
}) {
  const bootstrap = await getDigitalBootstrap();
  const menuByLocation = new Map(
    (bootstrap.menus || []).map((menu) => [menu.location, menu]),
  );
  const headerItems = toNavItems(
    menuByLocation.get("header")?.items || menuByLocation.get("main")?.items,
  );
  const footerQuickItems = toNavItems(
    menuByLocation.get("footer_quick")?.items ||
      menuByLocation.get("footer")?.items,
  );
  const footerImportantItems = toNavItems(
    menuByLocation.get("footer_important")?.items,
  );
  const activeNavItems = headerItems.length
    ? headerItems.slice(0, 6)
    : navItems;
  const activeMoreItems = headerItems.length
    ? headerItems.slice(6).concat(moreItems)
    : moreItems;
  const activeQuickLinks = footerQuickItems.length
    ? footerQuickItems
    : quickLinks;
  const activeImportantLinks = footerImportantItems.length
    ? footerImportantItems
    : importantLinks;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0c1425]/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2" href="/">
            <img
              alt="SaaSzo Digital"
              className="digital-brand-logo"
              src="/digital-assets/images/Saaszo_Digital_logo.svg"
            />
          </Link>
          <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-300 lg:flex">
            {activeNavItems.map((item) => (
              <Link
                className="transition hover:text-white"
                href={item.href}
                key={`${item.href}-${item.label}`}
                target={item.target === "_blank" ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <div className="digital-more-menu">
              <button type="button">More</button>
              <div>
                {activeMoreItems.map((item) => (
                  <Link
                    href={item.href}
                    key={`${item.href}-${item.label}`}
                    target={item.target === "_blank" ? "_blank" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <nav className="mobile-menu-strip lg:hidden" aria-label="Mobile menu">
            {[...activeNavItems, ...activeMoreItems.slice(0, 6)].map((item) => (
              <Link href={item.href} key={`${item.href}-${item.label}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              className="digital-whatsapp"
              href={marketingContact.whatsappHref}
            >
              <span className="material-symbols-rounded text-sm">chat</span>
              WhatsApp
            </a>
            <Link
              className="digital-primary digital-primary-compact"
              href="/audit"
            >
              Growth Audit
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white text-[#0e172a]">{children}</main>
      <footer className="bg-[#0b1222] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr]">
            <div>
              <Link className="flex items-center gap-2" href="/">
                <img
                  alt="SaaSzo Digital"
                  className="digital-footer-logo"
                  src="/digital-assets/images/Saaszo_Digital_logo.svg"
                />
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
                We blend creativity and strategy to help brands grow. Our ideas
                improve visibility, generate leads, and turn focus into results.
              </p>
              <div className="mt-5 flex gap-2 text-xs text-slate-400">
                {["f", "in", "ig", "x", "yt"].map((item) => (
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/5"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <FooterLinks title="Quick Links" items={activeQuickLinks} />
            <FooterLinks title="Important Links" items={activeImportantLinks} />
            <FooterLinks title="Services" items={services} />
            <div>
              <h2 className="footer-title">Get In Touch</h2>
              <div className="mt-5 grid gap-3 text-xs text-slate-300">
                <a className="footer-contact" href={marketingContact.phoneHref}>
                  <span className="material-symbols-rounded">call</span>
                  {marketingContact.phone}
                </a>
                <a
                  className="footer-contact"
                  href={`mailto:${marketingContact.email}`}
                >
                  <span className="material-symbols-rounded">mail</span>
                  {marketingContact.email}
                </a>
                <p className="footer-contact">
                  <span className="material-symbols-rounded">location_on</span>
                  Gaur City Center, Noida, U.P. - 201301
                </p>
              </div>
            </div>
          </div>
          <div className="digital-map-card">
            <span className="digital-map-pin">SaaSzo Digital Agency HQ</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500">
            <p>© 2026 SaaSzo. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/creator-program">Guest Post Registration</Link>
              <Link href="/blog">RSS Feed</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterLinks({
  title,
  items,
}: {
  title: string;
  items: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="footer-title">{title}</h2>
      <div className="mt-5 grid gap-3 text-xs text-slate-400">
        {items.map((item) => (
          <Link className="hover:text-white" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>
      </div>
    </section>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
