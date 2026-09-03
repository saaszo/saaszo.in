import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

const tools = [
  {
    title: "Premium Tools Beta Tester",
    href: "/bussinsh_tool",
    description:
      "Early access preview for upcoming SaaSzo premium business tools.",
  },
  {
    title: "Growth Audit",
    href: "/audit",
    description: "Website and marketing audit request flow.",
  },
  {
    title: "Certificate Tool",
    href: "/tools/certificate",
    description: "Generate certificate documents from the new SaaSzo API.",
  },
  {
    title: "Letter Tool",
    href: "/tools/letter",
    description: "Create downloadable letters from the migrated backend.",
  },
  {
    title: "VCard Tool",
    href: "/tools/vcard",
    description: "Build a contact vCard without leaving saaszo.in.",
  },
  {
    title: "ICard Tool",
    href: "/tools/icard",
    description: "Generate ID card documents through the new API system.",
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
        description="Growth audit and document tools now run from the new saaszo.in frontend with Laravel API support."
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
