import { appConfig, toAbsoluteApiUrl } from "./config";

const productionDigitalApiBaseUrl = "https://api.saaszo.in/api";

export type DigitalBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  status?: string | null;
  reading_time?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  category?: { name?: string | null; slug?: string | null } | null;
  tags?: Array<{ name?: string | null; slug?: string | null }>;
};

export type DigitalJob = {
  id: number;
  title: string;
  slug: string;
  department?: string | null;
  location?: string | null;
  type?: string | null;
  experience_level?: string | null;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  skills?: string | null;
  salary_range?: string | null;
  deadline?: string | null;
};

export type DigitalBootstrap = {
  hero_slides: Array<{
    id: number;
    image_path: string;
    heading?: string | null;
    subheading?: string | null;
    cta_text?: string | null;
    cta_link?: string | null;
    cta_2_text?: string | null;
    cta_2_link?: string | null;
  }>;
  featured_blogs: DigitalBlog[];
  reviews: Array<{
    id: number;
    reviewer_name: string;
    reviewer_designation?: string | null;
    review_rating?: number | null;
    review_text: string;
    review_source?: string | null;
  }>;
  partners: Array<{
    id: number;
    company_name: string;
    logo_path?: string | null;
    website_url?: string | null;
  }>;
  team: Array<{
    id: number;
    full_name: string;
    designation: string;
    short_bio?: string | null;
    profile_image?: string | null;
  }>;
  menus?: DigitalMenu[];
  settings: Record<string, string>;
};

export type DigitalMenuItem = {
  id: number;
  title: string;
  url: string;
  target?: string | null;
  display_order?: number | null;
  children?: DigitalMenuItem[];
};

export type DigitalMenu = {
  id: number;
  name: string;
  location: string;
  items?: DigitalMenuItem[];
};

export const servicePages = [
  {
    slug: "lead-generation-ads",
    title: "Lead Generation Ads",
    eyebrow: "Paid growth",
    summary:
      "Performance campaigns built to generate qualified enquiries, calls, and sales opportunities.",
    points: [
      "Meta and Google ad funnels",
      "Landing page and offer testing",
      "Lead tracking and follow-up reporting",
    ],
  },
  {
    slug: "local-seo-gmb",
    title: "Local SEO and GMB",
    eyebrow: "Local discovery",
    summary:
      "Improve local visibility for clinics, service businesses, stores, and location-led brands.",
    points: [
      "Google Business Profile optimization",
      "Local landing pages",
      "Review and citation improvements",
    ],
  },
  {
    slug: "ppc-management",
    title: "PPC Management",
    eyebrow: "Search demand",
    summary:
      "Manage search campaigns with clear budgets, conversion tracking, and weekly performance decisions.",
    points: [
      "Keyword and intent structure",
      "Ad copy and landing page testing",
      "Spend, CPA, and ROAS reporting",
    ],
  },
  {
    slug: "seo-optimization",
    title: "SEO Optimization",
    eyebrow: "Organic growth",
    summary:
      "Build technical and content foundations that help your website earn qualified search traffic.",
    points: [
      "Technical SEO cleanup",
      "Content planning",
      "On-page and internal linking improvements",
    ],
  },
  {
    slug: "social-media-presence",
    title: "Social Media Presence",
    eyebrow: "Brand trust",
    summary:
      "Create a consistent social presence that supports awareness, leads, and customer trust.",
    points: [
      "Monthly content planning",
      "Creative direction",
      "Performance review and iteration",
    ],
  },
  {
    slug: "website-design",
    title: "Website Design",
    eyebrow: "Conversion websites",
    summary:
      "Design fast, responsive websites that explain the offer clearly and convert visitors into leads.",
    points: [
      "Responsive UI",
      "SEO-ready page structure",
      "Lead forms and analytics readiness",
    ],
  },
];

export const industryPages = [
  "b2b-services",
  "dental-clinics",
  "e-commerce",
  "fitness-coaches",
  "hair-clinics",
  "healthcare",
  "institutes-courses",
  "ivf-centers",
  "local-services",
  "real-estate",
  "skin-clinics",
  "travel-tourism",
].map((slug) => ({
  slug,
  title: slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export const fallbackBootstrap: DigitalBootstrap = {
  hero_slides: [
    {
      id: 1,
      image_path:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      heading: "Scale Your Business Online",
      subheading: "Performance marketing, SEO, and paid ads systems",
      cta_text: "Get Free Audit",
      cta_link: "/audit",
      cta_2_text: "Contact Us",
      cta_2_link: "/contact",
    },
  ],
  featured_blogs: [],
  reviews: [
    {
      id: 1,
      reviewer_name: "SaaSzo client",
      reviewer_designation: "Growth partner",
      review_rating: 5,
      review_text:
        "The team helped us turn scattered marketing activity into a measurable lead generation system.",
      review_source: "Client review",
    },
  ],
  partners: [],
  team: [],
  settings: {},
};

async function fetchDigital<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(digitalApiUrl(path), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return fallback;
    }

    const payload = await response.json();
    return payload?.data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getDigitalBootstrap() {
  return fetchDigital<DigitalBootstrap>(
    "/api/digital/bootstrap",
    fallbackBootstrap,
  );
}

export async function getDigitalBlogs() {
  const payload = await fetchDigital<{ data?: DigitalBlog[] }>(
    "/api/digital/blogs?per_page=24",
    { data: [] },
  );
  return payload.data || [];
}

export async function getDigitalBlog(slug: string) {
  return fetchDigital<DigitalBlog | null>(`/api/digital/blogs/${slug}`, null);
}

export async function getDigitalJobs() {
  const payload = await fetchDigital<{ data?: DigitalJob[] }>(
    "/api/digital/jobs?per_page=24",
    { data: [] },
  );
  return payload.data || [];
}

export async function getDigitalJob(slug: string) {
  return fetchDigital<DigitalJob | null>(`/api/digital/jobs/${slug}`, null);
}

export function normalizeOldDigitalLink(url?: string | null) {
  if (!url) {
    return "";
  }

  if (
    url.startsWith("https://wa.me/") ||
    url.startsWith("tel:") ||
    url.startsWith("mailto:")
  ) {
    return url;
  }

  const normalized = url
    .replace(/^https?:\/\/(www\.)?(digital\.)?saaszo\.in/i, "")
    .replace("/pages/audit.php", "/audit")
    .replace("/pages/industries.php", "/industries")
    .replace("/services.php", "/services")
    .replace("/about.php", "/about")
    .replace("/contact.php", "/contact")
    .replace("/blog.php", "/blog")
    .replace("/careers.php", "/careers")
    .replace("/approach.php", "/approach")
    .replace("/tools/index.php", "/tools")
    .replace(/\/tools\/([^/?#]+)\.php/i, "/tools/$1")
    .replace("/creator-program.php", "/creator-program")
    .replace("/guest-post.php", "/creator-program")
    .replace("/packages.php", "/packages")
    .replace("/rss.php", "/blog")
    .replace(".php", "");

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function digitalApiUrl(path: string) {
  const configuredDigitalApi = process.env.NEXT_PUBLIC_DIGITAL_API_URL;

  if (configuredDigitalApi) {
    const baseUrl = configuredDigitalApi.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
      return `${baseUrl}${normalizedPath.slice(4)}`;
    }

    return `${baseUrl}${normalizedPath}`;
  }

  if (
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api$/i.test(
      appConfig.apiBaseUrl,
    )
  ) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    if (normalizedPath.startsWith("/api/")) {
      return `${productionDigitalApiBaseUrl}${normalizedPath.slice(4)}`;
    }

    return `${productionDigitalApiBaseUrl}${normalizedPath}`;
  }

  return toAbsoluteApiUrl(path);
}

export function digitalAssetUrl(path?: string | null) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith("/assets/images/")) {
    return normalizedPath.replace("/assets/images/", "/digital-assets/images/");
  }

  if (normalizedPath.startsWith("/uploads/blog-images/")) {
    return normalizedPath.replace(
      "/uploads/blog-images/",
      "/digital-assets/blog-images/",
    );
  }

  if (normalizedPath.startsWith("/uploads/sliders/")) {
    return normalizedPath.replace(
      "/uploads/sliders/",
      "/digital-assets/sliders/",
    );
  }

  if (normalizedPath.startsWith("/uploads/team/")) {
    return normalizedPath.replace("/uploads/team/", "/digital-assets/team/");
  }

  return `https://digital.saaszo.in${normalizedPath}`;
}

export function contentToText(content?: string | null) {
  if (!content) {
    return "";
  }

  return content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li|ul|ol|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

export const marketingContact = {
  phone: "+91 7982417957",
  phoneHref: "tel:+917982417957",
  whatsappHref: "https://wa.me/917982417957",
  email: "support@saaszo.in",
  address: "OC-1208, Gaur City Center, Noida, Uttar Pradesh 201301, India",
  appUrl: appConfig.appUrl,
};
