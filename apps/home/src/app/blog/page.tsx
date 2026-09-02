import Link from "next/link";
import {
  DigitalMarketingShell,
  EmptyState,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { digitalAssetUrl, getDigitalBlogs } from "@/lib/digital-marketing";

export const metadata = {
  title: "Digital Marketing Blog",
  description:
    "Latest SaaSzo Digital marketing articles, SEO guides and growth ideas.",
};

export default async function BlogPage() {
  const blogs = await getDigitalBlogs();

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Blog"
        title="Digital marketing insights from the admin blog system."
        description="Published blog posts from the Laravel digital admin panel appear here automatically."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {blogs.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                className="digital-card"
                href={`/blog/${blog.slug}`}
                key={blog.id}
              >
                {blog.featured_image ? (
                  <div
                    className="mb-5 aspect-[16/9] w-full rounded-md bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${digitalAssetUrl(blog.featured_image)}")`,
                    }}
                  />
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                  {blog.category?.name || "Marketing"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  {blog.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {blog.excerpt || "Read the full SaaSzo Digital article."}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No published blogs yet"
            description="Create or publish blogs from admin and they will render on this page."
          />
        )}
      </section>
    </DigitalMarketingShell>
  );
}
