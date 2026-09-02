import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { servicePages } from "@/lib/digital-marketing";

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  return {
    title: service?.title || "Digital Marketing Service",
    description: service?.summary || "SaaSzo Digital marketing service.",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.summary}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">
            What we handle
          </h2>
          <div className="mt-6 grid gap-4">
            {service.points.map((point) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5"
                key={point}
              >
                <p className="font-semibold text-slate-900">{point}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Planned, executed and reviewed with a clear conversion goal so
                  your team can see what is working.
                </p>
              </div>
            ))}
          </div>
          <Link className="digital-secondary mt-8 inline-flex" href="/services">
            View all services
          </Link>
        </div>
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Get a plan for this service
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Submit your details and the lead will appear in the digital
            marketing admin panel.
          </p>
          <div className="mt-6">
            <ContactForm source={`/services/${service.slug}`} />
          </div>
        </aside>
      </section>
    </DigitalMarketingShell>
  );
}
