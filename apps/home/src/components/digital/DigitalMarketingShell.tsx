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

const socialLinks = [
  {
    href: "https://www.facebook.com/saaszo",
    icon: "facebook",
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/saaszo",
    icon: "linkedin",
    label: "LinkedIn",
  },
  {
    href: "https://www.instagram.com/saaszo",
    icon: "instagram",
    label: "Instagram",
  },
  {
    href: "https://x.com/saaszo",
    icon: "x",
    label: "X",
  },
  {
    href: "https://www.youtube.com/@saaszo",
    icon: "youtube",
    label: "YouTube",
  },
] as const;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "facebook") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M14 8.5V6.8c0-.8.2-1.3 1.3-1.3H17V2.1C16.7 2.1 15.6 2 14.5 2 12 2 10.3 3.5 10.3 6.3v2.2H7.5V12h2.8v10h3.5V12h2.9l.4-3.5H14Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.9 8.9H3.4V20h3.5V8.9ZM5.2 7.4A2 2 0 1 0 5.2 3.5a2 2 0 0 0 0 3.9ZM20.6 20v-6.1c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5 1-2.9 1.7h-.1V8.9h-3.3V20H14v-5.5c0-1.5.3-2.9 2.1-2.9 1.7 0 1.8 1.6 1.8 3V20h2.7Z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.9 2.4a1 1 0 1 1 0 2.1 1 1 0 0 1 0-2.1ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M13.7 10.6 20.4 3h-1.6L13 9.6 8.4 3H3l7 10-7 8h1.6l6.1-7 4.9 7H21l-7.3-10.4Zm-2.2 2.5-.7-1L5.2 4.2h2.4l4.5 6.4.7 1 5.9 8.3h-2.4l-4.8-6.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.8 4 12 4 12 4h0s-3.8 0-6.7.2c-.4.1-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.9v1.7c0 1.8.2 3.7.2 3.7s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.8.2 6.4.2 6.4.2s3.8 0 6.7-.3c.4 0 1.3 0 2.1-.8.6-.6.8-2.1.8-2.1s.2-1.9.2-3.7v-1.7c0-1.9-.2-3.7-.2-3.7ZM10.1 14.7V8.4l5.9 3.1-5.9 3.2Z" />
    </svg>
  );
}

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
              <div className="mt-5 flex gap-2 text-slate-400">
                {socialLinks.map((item) => (
                  <a
                    aria-label={item.label}
                    className="digital-social-link"
                    href={item.href}
                    key={item.label}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={item.label}
                  >
                    <SocialIcon icon={item.icon} />
                  </a>
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
