import type { Metadata } from "next";
import Link from "next/link";
import { MinimalFooter } from "@/components/MinimalFooter";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { getPublicSiteMapEntries } from "@/lib/site-map";

export const metadata: Metadata = {
  title: "Sitemap | SaaSzo",
  description:
    "Browse all public SaaSzo billing, POS, invoicing, industry, and policy pages.",
};

export default function SiteMapPage() {
  const entries = getPublicSiteMapEntries();
  const groups = ["Main", "Industry Solutions", "Legal"] as const;

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <ShowcaseNavbar />

      <main className="pt-24 pb-20">
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              Public Pages
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Sitemap
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Find every public SaaSzo page for billing, POS, industries, and
              policies in one place.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {groups.map((group) => {
              const groupEntries = entries.filter(
                (entry) => entry.group === group,
              );

              return (
                <div
                  key={group}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <h2 className="text-lg font-extrabold text-slate-950">
                    {group}
                  </h2>
                  <div className="mt-5 space-y-4">
                    {groupEntries.map((entry) => (
                      <Link
                        key={entry.path}
                        href={entry.path}
                        className="block rounded-xl border border-slate-100 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
                      >
                        <span className="block text-sm font-bold text-slate-950">
                          {entry.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {entry.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
