import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms & Conditions | SaaSzo",
  description:
    "Review the terms governing access to the SaaSzo platform and related services.",
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    paragraphs: [
      "By accessing or using SaaSzo, you agree to these Terms and Conditions. If you do not agree, you should not use the platform.",
      "You are responsible for ensuring that the information you provide is accurate and that your use of the service complies with applicable laws.",
    ],
  },
  {
    id: "accounts-and-security",
    title: "Accounts and security",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that happens under your account.",
      "If you believe your account has been compromised, contact us immediately so we can help secure access.",
    ],
    bullets: [
      "Use accurate business and contact information.",
      "Do not share credentials with unauthorized users.",
      "Notify us promptly if you suspect misuse or unauthorized access.",
    ],
  },
  {
    id: "service-usage",
    title: "Permitted use of the service",
    paragraphs: [
      "SaaSzo is provided to help teams manage operations, workflows, data, and communication. You may not use the service for unlawful activity, abuse, fraud, or attempts to disrupt the platform.",
      "We may suspend or restrict access if we detect behavior that threatens platform integrity, security, or other users.",
    ],
  },
  {
    id: "subscriptions-and-billing",
    title: "Subscriptions and billing",
    paragraphs: [
      "Paid features, plan limits, and billing cycles are governed by the subscription details shown in your workspace or order flow.",
      "Unless otherwise stated in a separate agreement, fees are non-refundable once a billing period has started.",
    ],
  },
  {
    id: "content-and-liability",
    title: "Content, availability, and liability",
    paragraphs: [
      "You retain responsibility for the data you upload or manage through the platform. We may remove content that violates these terms or applicable law.",
      "SaaSzo is provided on an as-is and as-available basis. To the fullest extent permitted by law, we limit liability for indirect, incidental, or consequential damages.",
    ],
  },
  {
    id: "updates-and-contact",
    title: "Updates and contact",
    paragraphs: [
      "We may update these terms from time to time to reflect product, legal, or operational changes. Continued use after updates means you accept the revised terms.",
      "For questions about these terms, contact saaszo.in@gmail.com.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms & Conditions"
      summary="These terms explain the rules for using SaaSzo, managing your account, and accessing platform features and subscriptions."
      lastUpdated="April 22, 2026"
      sections={[...sections]}
    />
  );
}
