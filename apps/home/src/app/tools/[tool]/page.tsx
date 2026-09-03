import { notFound } from "next/navigation";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import {
  DigitalToolBuilder,
} from "@/components/digital/DigitalToolBuilder";

type ToolPageProps = {
  params: Promise<{ tool: string }>;
};

type ToolType = "certificate" | "letter" | "vcard" | "icard";

const titles: Record<ToolType, string> = {
  certificate: "Certificate Tool",
  letter: "Letter Tool",
  vcard: "VCard Tool",
  icard: "ICard Tool",
};

function isDigitalToolType(value: string): value is ToolType {
  return Object.hasOwn(titles, value);
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { tool } = await params;
  if (!isDigitalToolType(tool)) {
    return {};
  }

  return {
    title: `${titles[tool]} | SaaSzo Digital`,
    description: `${titles[tool]} migrated to saaszo.in with Laravel API support.`,
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { tool } = await params;
  if (!isDigitalToolType(tool)) {
    notFound();
  }

  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Tools"
        title={titles[tool]}
        description="This tool now runs on saaszo.in and sends requests to the migrated Laravel API instead of the old PHP URL."
      />
      <DigitalToolBuilder type={tool} />
    </DigitalMarketingShell>
  );
}
