import { InfluencerForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

export const metadata = {
  title: "Creator Program",
  description: "Apply to the SaaSzo Digital creator and influencer program.",
};

export default function CreatorProgramPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Creator program"
        title="Partner with SaaSzo Digital as a creator."
        description="Creator applications are saved to the digital influencer applications API for admin review."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <InfluencerForm />
      </section>
    </DigitalMarketingShell>
  );
}
