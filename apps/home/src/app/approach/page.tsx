import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

const steps = [
  "Deep market research and strategy",
  "High-converting funnel setup",
  "Campaign launch with tracking",
  "Lead quality review",
  "Weekly optimization",
  "Scale profitable channels",
];

export const metadata = {
  title: "Growth Approach",
  description: "SaaSzo Digital growth methodology and campaign process.",
};

export default function ApproachPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Approach"
        title="We do not guess. We engineer growth."
        description="A focused process for research, launch, analysis and scaling so marketing activity connects to revenue."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4">
          {steps.map((step, index) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-5"
              key={step}
            >
              <p className="text-sm font-black text-indigo-600">
                Step {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-950">{step}</h2>
            </div>
          ))}
        </div>
        <Link className="digital-primary mt-8" href="/audit">
          Start With Growth Audit
        </Link>
      </section>
    </DigitalMarketingShell>
  );
}
