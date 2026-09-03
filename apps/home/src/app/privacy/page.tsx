import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | SaaSzo Invoice & POS",
  description:
    "Learn how SaaSzo protects your business data, local SQLite database, device hardware permissions, and cloud sync.",
};

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    paragraphs: [
      "When you create an account on SaaSzo, we collect necessary business profile details such as your business trade name, registered GSTIN, owner name, contact email address, phone number, and physical billing address.",
      "To provide point-of-sale functionality, the SaaSzo application processes transaction information including item descriptions, HSN/SAC codes, applicable GST rates, sales amounts, and customer/supplier ledger balances.",
    ],
    bullets: [
      "Business Profile & Identity: Registered GSTIN, business name, phone number, and login credentials.",
      "Device Hardware Permissions: Bluetooth access strictly used to discover and send print jobs to thermal receipt printers; Camera access strictly used to scan product barcodes and QR codes.",
      "Operational Billing Records: Item catalogs, inventory counts, retail sales receipts, and tax computations.",
    ],
  },
  {
    id: "offline-data-ownership",
    title: "2. Offline-First Architecture & Data Ownership",
    paragraphs: [
      "SaaSzo is engineered with a local SQLite database engine. All sales receipts, cash drawer transactions, party balances, and product inventories are stored directly on your local device (Android, Windows PC, macOS, or iOS).",
      "You retain 100% ownership of your business data. We do not sell, rent, monetize, or share your customer ledgers, sales numbers, or inventory records with any third parties or advertisers.",
    ],
  },
  {
    id: "cloud-sync-security",
    title: "3. Cloud Synchronization & Encryption",
    paragraphs: [
      "When your device connects to the internet, SaaSzo performs background synchronization with our secure servers (api.saaszo.in) using industry-standard TLS 1.3 encryption.",
      "This synchronization ensures multi-device consistency (allowing simultaneous counter billing) and protects your business records in the event of hardware loss, device theft, or physical damage.",
    ],
    bullets: [
      "All network data in transit is encrypted using 256-bit SSL/TLS.",
      "Cloud database backups are stored in enterprise-grade data centers with strict access controls.",
      "Sensitive tokens and session keys are secured using native OS secure storage.",
    ],
  },
  {
    id: "device-permissions",
    title: "4. Device Hardware Permissions Usage",
    paragraphs: [
      "SaaSzo requests specific hardware permissions exclusively to enable native billing functions:",
    ],
    bullets: [
      "Bluetooth & Nearby Devices: Required solely to communicate with wireless 58mm and 80mm ESC/POS thermal printers.",
      "Camera: Required solely to recognize optical barcodes and QR codes on physical products and invoices. Camera streams are processed in real time and are never recorded or uploaded.",
      "Storage & Files: Required to generate and save downloadable PDF tax invoices and Excel accounting reports on your device.",
    ],
  },
  {
    id: "data-retention-export",
    title: "5. Data Retention, Portability & Deletion",
    paragraphs: [
      "You can export your complete transaction ledger, customer directory, product inventory, and GSTR tax summaries at any time in standard Excel or PDF formats without lock-in.",
      "If you choose to delete your SaaSzo account, you may request complete erasure of your cloud-stored data by contacting our team. Once verified, all cloud records are permanently purged within 30 days.",
    ],
  },
  {
    id: "compliance-contact",
    title: "6. Indian Legal Compliance & Contact",
    paragraphs: [
      "SaaSzo adheres to the Digital Personal Data Protection Act (DPDP) and Indian GST compliance norms. For any privacy queries, grievance redressal, or data assistance, please reach out to our privacy officer:",
      "Email: saaszo.in@gmail.com | WhatsApp Helpdesk: Available via official website channels.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Compliance & Data Protection"
      title="Privacy Policy"
      summary="Transparent disclosure on how SaaSzo Invoice & POS secures your business data, local offline database, hardware device permissions, and encrypted cloud synchronization."
      lastUpdated="September 2026"
      sections={sections}
    />
  );
}
