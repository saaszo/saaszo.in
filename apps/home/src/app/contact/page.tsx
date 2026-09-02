import { ContactForm } from "@/components/digital/DigitalForms";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import { marketingContact } from "@/lib/digital-marketing";

export const metadata = {
  title: "Contact SaaSzo Digital",
  description:
    "Contact SaaSzo Digital for SEO, PPC, website design and lead generation work.",
};

export default function ContactPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to grow."
        description="Contact form submissions go to the digital leads section in the SaaSzo admin panel."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <ContactForm source="/contact" />
        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Direct contact
          </h2>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
            <a
              className="font-semibold text-cyan-700"
              href={marketingContact.phoneHref}
            >
              {marketingContact.phone}
            </a>
            <a
              className="font-semibold text-cyan-700"
              href={`mailto:${marketingContact.email}`}
            >
              {marketingContact.email}
            </a>
            <p>{marketingContact.address}</p>
          </div>
        </aside>
      </section>
    </DigitalMarketingShell>
  );
}
