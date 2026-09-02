import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

const betaTools = [
  {
    title: "Invoice and Billing Suite",
    description:
      "Create invoices, manage billing flows, and test the premium workspace experience.",
  },
  {
    title: "Task and Team Workspace",
    description:
      "Preview how teams can organize daily work, follow-ups, and internal operations.",
  },
  {
    title: "Business Growth Console",
    description:
      "Explore leads, digital growth workflows, and upcoming automation features.",
  },
  {
    title: "Commerce and CRM Preview",
    description:
      "See how SaaSzo premium tools will connect sales, customers, and business records.",
  },
];

export const metadata = {
  title: "Premium Tools Beta Tester | SaaSzo",
  description:
    "Try SaaSzo premium business tools in beta through login and signup access.",
};

export default function BusinessToolPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Premium tools beta"
        title="Try SaaSzo premium business tools before launch."
        description="This beta area lets users experience the upcoming SaaSzo premium tool ecosystem while the full product suite is still in development."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="digital-card bg-[#0b1222] text-white">
            <p className="section-kicker text-indigo-300">Beta access</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Join as a tester and explore premium tools.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              Existing users can sign in and new users can create an account.
              The flow uses the current SaaSzo auth pages so users understand
              these tools are part of the SaaSzo premium platform.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link className="digital-primary" href="/auth">
                Login to try tools
              </Link>
              <Link className="white-button text-center" href="/register">
                Create beta account
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {betaTools.map((tool) => (
              <article className="digital-card" key={tool.title}>
                <span className="material-symbols-rounded text-indigo-600">
                  deployed_code
                </span>
                <h2 className="mt-4 text-xl font-black text-slate-950">
                  {tool.title}
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {tool.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </DigitalMarketingShell>
  );
}
