import Link from "next/link";
import { notFound } from "next/navigation";
import { DigitalMarketingShell } from "@/components/digital/DigitalMarketingShell";
import {
  contentToText,
  digitalAssetUrl,
  getDigitalBlog,
} from "@/lib/digital-marketing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getDigitalBlog(slug);
  return {
    title: blog?.title || "Digital Marketing Blog",
    description: blog?.excerpt || "SaaSzo Digital blog article.",
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getDigitalBlog(slug);

  if (!blog) {
    notFound();
  }

  const content = contentToText(blog.content);

  return (
    <DigitalMarketingShell>
      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Link
          className="text-sm font-semibold text-cyan-700 hover:text-cyan-900"
          href="/blog"
        >
          Back to blog
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-cyan-700">
          {blog.category?.name || "Marketing"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
          {blog.title}
        </h1>
        {blog.excerpt ? (
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {blog.excerpt}
          </p>
        ) : null}
        {blog.featured_image ? (
          <div
            className="mt-8 aspect-[16/9] w-full rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url("${digitalAssetUrl(blog.featured_image)}")`,
            }}
          />
        ) : null}
        <div className="digital-prose mt-10">
          {content ? (
            content
              .split(/\n{2,}|\n/)
              .map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>This article has no content yet.</p>
          )}
        </div>
      </article>
    </DigitalMarketingShell>
  );
}
