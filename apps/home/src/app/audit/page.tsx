import { AuditForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

export const metadata = {
  title: "Free Digital Marketing Audit",
  description:
    "Request a free website and marketing audit from SaaSzo Digital.",
};

export default function AuditPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Free audit"
        title="Get a practical website and marketing audit."
        description="Submit your site and contact details. The request is saved to the digital audit leads API for admin follow-up."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <AuditForm />
      </section>
    </DigitalMarketingShell>
  );
}
