import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service | SaaSzo Invoice & POS",
  description:
    "Review the software license terms, usage conditions, tax compliance responsibilities, and service agreement for SaaSzo Invoice & POS.",
};

const sections = [
  {
    id: "license-grant",
    title: "1. Software License Grant",
    paragraphs: [
      "Subject to these Terms of Service, SaaSzo Technologies grants you a revocable, non-exclusive, non-transferable license to install, download, and operate SaaSzo Invoice & POS on your compatible Android, Windows PC, macOS, and iOS hardware for internal business billing and inventory operations.",
      "You agree not to reverse engineer, decompile, disassemble, or attempt to derive the source code of the binary applications, nor create unauthorized derivative works.",
    ],
  },
  {
    id: "account-and-counters",
    title: "2. Account Registration & Terminal Security",
    paragraphs: [
      "When creating a SaaSzo account, you agree to provide authentic and accurate business information, including your registered business name, authorized contact details, and applicable GSTIN.",
      "You are responsible for safeguarding all terminal login credentials, device PINs, and session tokens across your counter registers. Any action taken under your authenticated merchant profile is deemed your authorized business activity.",
    ],
  },
  {
    id: "offline-data-and-tax",
    title: "3. Offline Billing & GST Tax Compliance",
    paragraphs: [
      "SaaSzo Invoice & POS includes an offline SQLite billing engine designed to maintain counter sales during network outages. Merchants are responsible for reconnecting devices periodically to allow cloud ledger synchronization and central backup.",
      "While SaaSzo provides automated tax computation tables (CGST, SGST, IGST, and cess), you are solely responsible for ensuring the correctness of HSN/SAC codes, tax rates, and regulatory compliance of invoices submitted to government tax portals.",
    ],
    bullets: [
      "Merchants must verify applicable tax slabs before generating final customer tax invoices.",
      "SaaSzo does not act as a tax consultant or government filing intermediary.",
      "Exported GSTR-1 and GSTR-3B summaries should be reviewed by your licensed accountant before statutory filing.",
    ],
  },
  {
    id: "hardware-compatibility",
    title: "4. Hardware & Thermal Printer Compatibility",
    paragraphs: [
      "SaaSzo supports ESC/POS protocol thermal receipt printers (58mm and 80mm) via Bluetooth and USB, as well as optical barcode scanners. We do not manufacture physical printer hardware, paper rolls, or laser scanner devices.",
      "Hardware warranties, printer firmware defects, and mechanical repair remain the sole responsibility of the respective hardware manufacturer.",
    ],
  },
  {
    id: "service-availability",
    title: "5. Service Availability & Backups",
    paragraphs: [
      "We strive to maintain high availability (99.9% target) for our cloud sync servers (api.saaszo.in). Because our applications operate offline-first, temporary cloud downtime will not disrupt local counter billing or receipt printing.",
      "We perform routine, automated database backups; however, merchants are also encouraged to periodically export Excel or PDF copies of their sales ledgers for internal disaster recovery.",
    ],
  },
  {
    id: "termination",
    title: "6. Termination & Acceptable Use",
    paragraphs: [
      "You may terminate your account at any time from your account settings. We reserve the right to suspend or terminate accounts that engage in fraudulent billing, unlawful commercial trade, distribution of malicious software, or violation of applicable commercial laws.",
      "Upon termination, your local offline database remains on your device until uninstalled, while cloud synchronized backups are deleted in accordance with our Privacy Policy.",
    ],
  },
  {
    id: "governing-law",
    title: "7. Governing Law & Dispute Resolution",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes or claims arising under these terms shall be subject to the exclusive jurisdiction of the courts in India.",
      "For legal notices or questions regarding these terms, contact saaszo.in@gmail.com.",
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <LegalDocument
      eyebrow="Commercial License Agreement"
      title="Terms of Service"
      summary="Please read these software license terms and service conditions carefully before installing, downloading, or operating SaaSzo Invoice & POS across your devices."
      lastUpdated="September 2026"
      sections={sections}
    />
  );
}
