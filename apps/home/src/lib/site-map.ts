import { appConfig } from "@/lib/config";
import { INDUSTRY_SOLUTIONS } from "@/lib/industrySolutionsData";

export type PublicSiteMapEntry = {
  path: string;
  title: string;
  description: string;
  group: "Main" | "Industry Solutions" | "Legal";
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

const staticEntries: PublicSiteMapEntry[] = [
  {
    path: "/",
    title: "Home",
    description: "SaaSzo billing, POS, invoices, inventory, and business tools.",
    group: "Main",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    title: "About SaaSzo",
    description: "Learn about SaaSzo's offline-first billing platform.",
    group: "Main",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Contact SaaSzo support for billing, POS, and printer help.",
    group: "Main",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/industries",
    title: "Industry Solutions",
    description: "Explore SaaSzo POS and invoicing solutions by business type.",
    group: "Main",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/privacy",
    title: "Privacy Policy",
    description: "How SaaSzo protects and handles customer data.",
    group: "Legal",
    priority: 0.4,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    title: "Terms of Service",
    description: "Terms and conditions for using SaaSzo.",
    group: "Legal",
    priority: 0.4,
    changeFrequency: "yearly",
  },
  {
    path: "/cookies",
    title: "Cookie Policy",
    description: "Cookie and storage policy for SaaSzo.",
    group: "Legal",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/refund",
    title: "Cancellation & Refund",
    description: "Cancellation and refund policy for SaaSzo subscriptions.",
    group: "Legal",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/sitemap",
    title: "Sitemap",
    description: "All public pages available on SaaSzo.",
    group: "Legal",
    priority: 0.3,
    changeFrequency: "weekly",
  },
];

const industryEntries: PublicSiteMapEntry[] = INDUSTRY_SOLUTIONS.map(
  (industry) => ({
    path: `/industries/${industry.slug}`,
    title: industry.title,
    description: industry.headline,
    group: "Industry Solutions",
    priority: 0.8,
    changeFrequency: "weekly",
  }),
);

export function getPublicSiteMapEntries() {
  return [...staticEntries, ...industryEntries];
}

export function getSiteUrl(path: string) {
  const baseUrl = appConfig.appUrl.replace(/\/$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
