import Link from "next/link";
import {
  DigitalMarketingShell,
  EmptyState,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { getDigitalJobs } from "@/lib/digital-marketing";

export const metadata = {
  title: "Careers",
  description: "Open roles at SaaSzo Digital.",
};

export default async function CareersPage() {
  const jobs = await getDigitalJobs();

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Careers"
        title="Work with the SaaSzo Digital team."
        description="Open jobs created from admin appear here, and applications submit to the Laravel digital jobs API."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {jobs.length ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link
                className="digital-card"
                href={`/careers/${job.slug}`}
                key={job.id}
              >
                <h2 className="text-xl font-semibold text-slate-950">
                  {job.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {[job.department, job.location, job.type]
                    .filter(Boolean)
                    .join(" - ") || "SaaSzo Digital role"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open jobs yet"
            description="Create active jobs from admin and they will show on this page."
          />
        )}
      </section>
    </DigitalMarketingShell>
  );
}
