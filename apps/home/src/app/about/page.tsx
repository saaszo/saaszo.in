import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

export const metadata = {
  title: "About SaaSzo Digital",
  description: "About SaaSzo Digital marketing services.",
};

export default function AboutPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="About"
        title="A digital marketing team connected to the SaaSzo platform."
        description="The public marketing website now runs on the SaaSzo frontend while data, leads and admin work are handled through the Laravel API and admin panel."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          "Performance focus",
          "Admin-managed content",
          "Platform-safe migration",
        ].map((title) => (
          <div className="digital-card" key={title}>
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              SaaSzo Digital pages are built to preserve the main SaaSzo auth
              system while moving marketing content into a maintainable
              frontend.
            </p>
          </div>
        ))}
      </section>
    </DigitalMarketingShell>
  );
}
