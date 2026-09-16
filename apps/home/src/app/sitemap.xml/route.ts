import { getPublicSiteMapEntries, getSiteUrl } from "@/lib/site-map";

export const dynamic = "force-static";

export function GET() {
  const lastModified = new Date().toISOString();
  const urls = getPublicSiteMapEntries()
    .map(
      (entry) => `
  <url>
    <loc>${getSiteUrl(entry.path)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
