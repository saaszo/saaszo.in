import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  INDUSTRY_SOLUTIONS,
  getIndustryBySlug,
  getAllIndustrySlugs,
  IndustrySolution,
} from "@/lib/industrySolutionsData";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { MinimalFooter } from "@/components/MinimalFooter";
import { IndustryIcon } from "@/components/illustrations/IndustryIcons";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Printer,
  ChevronRight,
  Phone,
  HelpCircle,
} from "lucide-react";

// Alias mapping for backward compatibility with old marketing slugs
const SLUG_ALIASES: Record<string, string> = {
  "b2b-services": "services-agencies",
  "dental-clinics": "pharmacy-chemist",
  "e-commerce": "retailers-kirana",
  "fitness-coaches": "services-agencies",
  "hair-clinics": "services-agencies",
  "healthcare": "pharmacy-chemist",
  "institutes-courses": "services-agencies",
  "ivf-centers": "pharmacy-chemist",
  "local-services": "retailers-kirana",
  "real-estate": "services-agencies",
  "skin-clinics": "pharmacy-chemist",
  "travel-tourism": "services-agencies",
  "retail": "retailers-kirana",
  "wholesale": "wholesalers-distributors",
  "manufacturing": "manufacturers",
  "pharmacy": "pharmacy-chemist",
  "electronics": "electronics-hardware",
  "services": "services-agencies",
};

export function generateStaticParams() {
  const primarySlugs = getAllIndustrySlugs().map((slug) => ({ slug }));
  const aliasSlugs = Object.keys(SLUG_ALIASES).map((slug) => ({ slug }));
  return [...primarySlugs, ...aliasSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = SLUG_ALIASES[slug] || slug;
  const industry = getIndustryBySlug(targetSlug);

  if (!industry) {
    return {
      title: "Industry Solutions — SaaSzo POS & Invoicing",
      description: "Explore industry-specific POS billing and inventory features.",
    };
  }

  return {
    title: `${industry.title} Billing Software & POS — SaaSzo`,
    description: `${industry.headline}. ${industry.tagline} 100% offline SQLite billing, thermal printing, and GST compliance for ${industry.title}.`,
    keywords: [
      `${industry.title} Billing Software`,
      `${industry.title} POS App`,
      "GST Invoicing Software",
      "Offline POS Software",
      "SaaSzo POS",
      `${industry.shortName} billing app`,
    ],
    openGraph: {
      title: `${industry.title} Billing Software & POS — SaaSzo`,
      description: industry.headline,
      url: `https://www.saaszo.in/industries/${industry.slug}`,
      siteName: "SaaSzo",
      type: "website",
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const targetSlug = SLUG_ALIASES[slug] || slug;
  const industry = getIndustryBySlug(targetSlug);

  if (!industry) {
    notFound();
  }

  // Get other related industries in the same or opposite group
  const relatedIndustries = INDUSTRY_SOLUTIONS.filter(
    (item) => item.slug !== industry.slug
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#6451f1] selection:text-white antialiased">
      <ShowcaseNavbar />

      <main className="pt-24 pb-20">
        {/* 1. Breadcrumb Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#6451f1] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/industries" className="hover:text-[#6451f1] transition-colors">
              Industries
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-950 font-bold">{industry.title}</span>
          </nav>
        </div>

        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-16 md:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-[#6451f1] text-xs font-black tracking-widest uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#6451f1] animate-ping" />
                  <span>{industry.heroBadge}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
                  {industry.headline}
                </h1>

                <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
                  {industry.tagline}
                </p>

                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {industry.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
                    >
                      <div className="text-lg sm:text-2xl font-black text-[#6451f1]">
                        {m.value}
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {m.subtext}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="https://invoice.saaszo.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#6451f1] hover:bg-[#5340e6] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer group"
                  >
                    <span>Try SaaSzo POS Free</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>

                  <a
                    href="#demo"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>Book 10-Min Demo</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Visual Card with Industry Icon */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md rounded-3xl bg-white border-2 border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-[#6451f1] shadow-xs">
                        <IndustryIcon name={industry.iconSvg} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950 text-base">
                          {industry.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {industry.categoryGroupLabel}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      100% Offline
                    </span>
                  </div>

                  {/* Feature Checklist inside Card */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Included in SaaSzo Core Engine:
                    </div>
                    {industry.keyFeatures.slice(0, 4).map((feat) => (
                      <div key={feat.title} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#6451f1] flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-900">{feat.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Floating Testimonial Micro-Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex text-amber-400">{"★★★★★"}</div>
                    <p className="italic text-slate-600 text-[11px] leading-relaxed">
                      &ldquo;{industry.testimonial.quote}&rdquo;
                    </p>
                    <div className="font-bold text-slate-900 text-[11px]">
                      — {industry.testimonial.author}, {industry.testimonial.business}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Key Feature Grid (6 Dedicated Cards) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 text-[#6451f1] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#6451f1]" />
                <span>Tailored Feature Set</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
                Everything Built for {industry.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Explore the powerful billing, inventory, and management features ready out of the box.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {industry.keyFeatures.map((feat, idx) => (
                <div
                  key={feat.title}
                  className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200/90 hover:border-[#6451f1] hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-[#6451f1] shadow-xs">
                        0{idx + 1}
                      </span>
                      {feat.badge && (
                        <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-[#6451f1] text-[10px] font-extrabold uppercase tracking-wider">
                          {feat.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-[#6451f1] transition-colors leading-snug">
                      {feat.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-[#6451f1]">
                    <span>100% Available in App</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Step-by-Step Industry Workflow */}
        <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                How It Works in Your Daily Routine
              </h2>
              <p className="mt-3 text-base text-slate-600">
                From order punch to final settlement and daily accounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {industry.sampleWorkflow.map((wf) => (
                <div
                  key={wf.step}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative space-y-4"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#6451f1] text-white flex items-center justify-center font-black text-sm shadow-md">
                    {wf.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">
                    {wf.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {wf.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Core Platform Capabilities */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Why SaaSzo is the #1 Choice for {industry.title}
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Built with local SQLite offline speed, thermal printing, and automatic cloud backup.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {industry.appCapabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3"
                >
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                    {cap.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-950">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Industry Specific FAQs */}
        <section className="py-20 bg-slate-50/60 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6451f1] uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950">
                Got Questions about {industry.shortName}?
              </h2>
            </div>

            <div className="space-y-4">
              {industry.faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-2"
                >
                  <h3 className="text-base font-bold text-slate-950 flex items-start gap-2">
                    <span className="text-[#6451f1]">Q{i + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-sm text-slate-600 pl-6 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Book a Demo Form Section */}
        <section id="demo" className="py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#6451f1] flex items-center justify-center mx-auto shadow-md">
                <IndustryIcon name={industry.iconSvg} className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to Upgrade Your {industry.shortName} Operations?
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Join 1,50,000+ businesses across India who trust SaaSzo for lightning-fast billing and error-free accounting.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://invoice.saaszo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#6451f1] hover:bg-[#5340e6] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  Start Free Online App
                </a>
                <a
                  href="tel:+919104369797"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call +91 91043 69797</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Browse Other Industries */}
        <section className="py-20 bg-slate-50/60 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Explore Other Industry Solutions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tailored POS software for every business type in India.
                </p>
              </div>
              <Link
                href="/industries"
                className="text-xs font-bold text-[#6451f1] hover:underline flex items-center gap-1"
              >
                <span>View All 17 Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedIndustries.map((item) => (
                <Link
                  key={item.slug}
                  href={`/industries/${item.slug}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#6451f1] hover:shadow-md transition-all group flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6451f1] group-hover:scale-110 transition-transform">
                    <IndustryIcon name={item.iconSvg} className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#6451f1] transition-colors leading-tight">
                    {item.shortName}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MinimalFooter />
    </div>
  );
}
