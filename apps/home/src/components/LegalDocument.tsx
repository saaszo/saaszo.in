import React from "react";
import Link from "next/link";
import { ShowcaseNavbar } from "./ShowcaseNavbar";
import { MinimalFooter } from "./MinimalFooter";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export default function LegalDocument({
  eyebrow,
  title,
  summary,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      <ShowcaseNavbar />

      <main className="pt-24 pb-20">
        {/* Document Header */}
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{eyebrow}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
                  {title}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  {summary}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between min-w-[220px]">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Effective Date
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {lastUpdated}
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Legal Helpdesk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Document Content Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky Table of Contents (3 cols) */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contents
                </span>
                <nav className="mt-3 space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors py-1 truncate"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Document Body Sections (9 cols) */}
            <div className="lg:col-span-9 space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs scroll-mt-24"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
