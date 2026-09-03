import { notFound } from "next/navigation";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";
import {
  DigitalToolBuilder,
  isDigitalToolType,
} from "@/components/digital/DigitalToolBuilder";

type ToolPageProps = {
  params: Promise<{ tool: string }>;
};

const titles: Record<string, string> = {
  certificate: "Certificate Tool",
  letter: "Letter Tool",
  vcard: "VCard Tool",
  icard: "ICard Tool",
};

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
