import { notFound } from "next/navigation";
import { JobApplicationForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { contentToText, getDigitalJob } from "@/lib/digital-marketing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getDigitalJob(slug);
  return {
    title: job?.title || "Career",
    description: job?.description || "SaaSzo Digital career opening.",
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getDigitalJob(slug);

  if (!job) {
    notFound();
  }

  const requirements = contentToText(job.requirements);
  const responsibilities = contentToText(job.responsibilities);

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Open role"
        title={job.title}
        description={
          job.description || "Apply for this SaaSzo Digital opening."
        }
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="grid gap-6">
          {[
            ["Department", job.department],
            ["Location", job.location],
            ["Type", job.type],
            ["Experience", job.experience_level],
            ["Salary", job.salary_range],
          ].map(([label, value]) =>
            value ? (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5"
                key={label}
              >
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 font-semibold text-slate-950">{value}</p>
              </div>
            ) : null,
          )}
          {requirements ? (
            <section className="digital-prose rounded-lg border border-slate-200 bg-white p-6">
              <h2>Requirements</h2>
              {requirements.split(/\n{2,}|\n/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ) : null}
          {responsibilities ? (
            <section className="digital-prose rounded-lg border border-slate-200 bg-white p-6">
              <h2>Responsibilities</h2>
              {responsibilities.split(/\n{2,}|\n/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ) : null}
        </div>
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">Apply now</h2>
          <div className="mt-6">
            <JobApplicationForm jobId={job.id} />
          </div>
        </aside>
      </section>
    </DigitalMarketingShell>
  );
}
