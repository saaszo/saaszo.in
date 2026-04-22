import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | SaaSzo",
  description:
    "Read how SaaSzo collects, uses, stores, and protects customer information.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We collect the account details you provide when you register for SaaSzo, such as your name, email address, phone number, company details, and profile preferences.",
      "We also collect operational data needed to deliver the product, including authentication events, account settings, subscription state, uploaded files, and support conversations.",
    ],
    bullets: [
      "Identity and contact details you provide during sign up or profile updates.",
      "Usage signals such as pages visited, feature usage, and error diagnostics.",
      "Billing and subscription metadata needed to manage your plan lifecycle.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "How we use your data",
    paragraphs: [
      "We use your information to operate the SaaSzo platform, secure user sessions, personalize the workspace experience, process account actions, and provide customer support.",
      "We may also use aggregated usage information to improve reliability, understand feature adoption, and prioritize product updates.",
    ],
  },
  {
    id: "sharing-and-processors",
    title: "Sharing and processors",
    paragraphs: [
      "We do not sell your personal data. We only share information with service providers that help us run the platform, such as hosting, storage, analytics, authentication, and email delivery partners.",
      "These providers may process data on our behalf under their own security and compliance obligations.",
    ],
  },
  {
    id: "security",
    title: "Security and retention",
    paragraphs: [
      "We use commercially reasonable measures to protect account data, including encrypted transport, access controls, and managed infrastructure services.",
      "We retain information only for as long as needed to provide the service, meet legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    paragraphs: [
      "You can update profile details from your SaaSzo dashboard, request account changes, and contact us if you need help accessing, correcting, or deleting personal information.",
      "If you have a privacy question or request, email saaszo.in@gmail.com and we will review it promptly.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Trust Center"
      title="Privacy Policy"
      summary="This policy explains what data SaaSzo collects, why we collect it, and how we protect it while delivering the platform."
      lastUpdated="April 22, 2026"
      sections={[...sections]}
    />
  );
}
