import { getDigitalBlogs, marketingContact } from "@/lib/digital-marketing";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const blogs = await getDigitalBlogs();
  const siteUrl = marketingContact.appUrl.replace(/\/$/, "");
  const items = blogs
    .map((blog) => {
      const link = `${siteUrl}/blog/${blog.slug}`;
      const pubDate = blog.published_at || blog.created_at;

      return `
        <item>
          <title>${escapeXml(blog.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid>${escapeXml(link)}</guid>
          <description>${escapeXml(blog.excerpt || "")}</description>
          ${pubDate ? `<pubDate>${new Date(pubDate).toUTCString()}</pubDate>` : ""}
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>SaaSzo Digital Blog</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Digital marketing, SEO, ads, and growth articles from SaaSzo.</description>
    <language>en-IN</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
