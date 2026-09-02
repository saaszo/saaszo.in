import { notFound } from "next/navigation";
import { AuditForm, ContactForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { industryPages, servicePages } from "@/lib/digital-marketing";

export function generateStaticParams() {
  return industryPages.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industryPages.find((item) => item.slug === slug);
  return {
    title: industry
      ? `${industry.title} Digital Marketing`
      : "Industry Digital Marketing",
    description: industry
      ? `Digital marketing and lead generation for ${industry.title}.`
      : "SaaSzo Digital industry marketing.",
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industryPages.find((item) => item.slug === slug);

  if (!industry) {
    notFound();
  }

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Industry growth"
        title={`${industry.title} Digital Marketing`}
        description={`Campaigns, SEO and lead capture pages designed for ${industry.title.toLowerCase()} businesses.`}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            Recommended focus
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {servicePages.slice(0, 4).map((service) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5"
                key={service.slug}
              >
                <p className="text-sm font-semibold text-cyan-700">
                  {service.eyebrow}
                </p>
                <h3 className="mt-2 font-semibold text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.summary}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">
              Request an audit
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Audit requests are saved to the digital audit leads table.
            </p>
            <div className="mt-5">
              <AuditForm />
            </div>
          </div>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Discuss this industry
          </h2>
          <div className="mt-6">
            <ContactForm source={`/industries/${industry.slug}`} />
          </div>
        </aside>
      </section>
    </DigitalMarketingShell>
  );
}
