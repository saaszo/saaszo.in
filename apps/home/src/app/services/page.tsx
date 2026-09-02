import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { servicePages } from "@/lib/digital-marketing";

export const metadata = {
  title: "Digital Marketing Services",
  description:
    "SEO, PPC, lead generation, social media and website design services by SaaSzo Digital.",
};

export default function ServicesPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Services"
        title="Digital marketing services built around qualified leads."
        description="Choose the channel your business needs now, then connect campaigns, content and reporting into one measurable growth system."
      />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {servicePages.map((service) => (
          <Link
            className="digital-card"
            href={`/services/${service.slug}`}
            key={service.slug}
          >
            <p className="text-sm font-semibold text-cyan-700">
              {service.eyebrow}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">
              {service.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {service.summary}
            </p>
          </Link>
        ))}
      </section>
    </DigitalMarketingShell>
  );
}
