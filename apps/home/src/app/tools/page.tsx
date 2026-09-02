import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

const tools = [
  {
    title: "Growth Audit",
    href: "/audit",
    description: "Website and marketing audit request flow.",
  },
  {
    title: "Certificate Tool",
    href: "https://digital.saaszo.in/tools/certificate.php",
    description: "Legacy certificate generator tool.",
  },
  {
    title: "Letter Tool",
    href: "https://digital.saaszo.in/tools/letter.php",
    description: "Legacy letter generator tool.",
  },
  {
    title: "VCard Tool",
    href: "https://digital.saaszo.in/tools/vcard.php",
    description: "Legacy vCard generator tool.",
  },
  {
    title: "ICard Tool",
    href: "https://digital.saaszo.in/tools/icard.php",
    description: "Legacy ID card generator tool.",
  },
];

export const metadata = {
  title: "Digital Marketing Tools",
  description: "SaaSzo Digital tools and growth audit routes.",
};

export default function ToolsPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Tools"
        title="SaaSzo Digital tools and growth utilities."
        description="The growth audit is available inside the new frontend. Legacy document tools are linked until they are migrated into Laravel/Next."
      />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {tools.map((tool) => (
          <Link className="digital-card" href={tool.href} key={tool.title}>
            <h2 className="text-xl font-black text-slate-950">{tool.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {tool.description}
            </p>
          </Link>
        ))}
      </section>
    </DigitalMarketingShell>
  );
}
