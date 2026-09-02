import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { industryPages } from "@/lib/digital-marketing";

export const metadata = {
  title: "Industries",
  description:
    "Digital marketing industry pages for clinics, ecommerce, real estate, local services and more.",
};

export default function IndustriesPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Industries"
        title="Growth pages for the businesses SaaSzo Digital serves."
        description="Each industry page keeps messaging focused while contact and audit submissions flow into the same Laravel admin system."
      />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {industryPages.map((industry) => (
          <Link
            className="digital-card"
            href={`/industries/${industry.slug}`}
            key={industry.slug}
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {industry.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Lead generation, search visibility, conversion pages and follow-up
              workflows for {industry.title.toLowerCase()}.
            </p>
          </Link>
        ))}
      </section>
    </DigitalMarketingShell>
  );
}
