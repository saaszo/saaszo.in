import {
  DigitalMarketingShell,
  EmptyState,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { digitalAssetUrl, getDigitalBootstrap } from "@/lib/digital-marketing";

export const metadata = {
  title: "Team",
  description: "SaaSzo Digital team members.",
};

export default async function TeamPage() {
  const bootstrap = await getDigitalBootstrap();

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Team"
        title="Meet the team behind SaaSzo Digital."
        description="Team members managed from admin are shown here from the public bootstrap API."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {bootstrap.team.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bootstrap.team.map((member) => (
              <div className="digital-card" key={member.id}>
                {member.profile_image ? (
                  <div
                    className="mb-5 aspect-square w-full rounded-md bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${digitalAssetUrl(member.profile_image)}")`,
                    }}
                  />
                ) : null}
                <h2 className="text-xl font-semibold text-slate-950">
                  {member.full_name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-cyan-700">
                  {member.designation}
                </p>
                {member.short_bio ? (
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {member.short_bio}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No team members yet"
            description="Add active team members from admin and they will appear here."
          />
        )}
      </section>
    </DigitalMarketingShell>
  );
}
