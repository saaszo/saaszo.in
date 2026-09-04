import type { Metadata } from "next";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { AppShowcaseHero } from "@/components/AppShowcaseHero";
import { TrustBanner } from "@/components/TrustBanner";
import { IndustrySolutions } from "@/components/IndustrySolutions";
import { BentoFeatures } from "@/components/BentoFeatures";
import { RoiCalculator } from "@/components/RoiCalculator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DownloadCenter } from "@/components/DownloadCenter";
import { ShowcaseFaq } from "@/components/ShowcaseFaq";
import { MinimalFooter } from "@/components/MinimalFooter";

export const metadata: Metadata = {
  title: "SaaSzo Invoice & POS — Offline & Online GST Billing Software",
  description:
    "High-speed GST Invoicing, Inventory & Counter POS billing app for Android, Windows PC, macOS, and iOS. Works 100% offline with local SQLite engine, Bluetooth thermal printing, and automatic cloud sync.",
  keywords: [
    "GST Billing App",
    "Offline POS Software",
    "Thermal Receipt Printer App",
    "Retail Billing Software",
    "Wholesale Khata Software",
    "Android POS App",
    "Windows Billing App",
    "GST Invoice Generator",
    "SaaSzo Invoice",
  ],
  authors: [{ name: "SaaSzo Technologies" }],
  openGraph: {
    title: "SaaSzo Invoice & POS — Offline & Online GST Billing App",
    description:
      "Fast counter checkout, Bluetooth thermal receipt printing, and local SQLite offline billing for modern businesses across Android, Windows, Mac, and iOS.",
    url: "https://www.saaszo.in",
    siteName: "SaaSzo",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSzo Invoice & POS — Offline & Online GST Billing App",
    description:
      "Fast counter checkout, Bluetooth thermal receipt printing, and local SQLite offline billing for modern businesses across Android, Windows, Mac, and iOS.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const JSON_LD_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SaaSzo Invoice & POS",
  "operatingSystem": "Android, Windows, macOS, iOS",
  "applicationCategory": "BusinessApplication",
  "softwareVersion": "1.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
  },
  "description":
    "Fast counter checkout, Bluetooth thermal receipt printing, and local SQLite offline billing for modern businesses across Android, Windows, Mac, and iOS.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "15420",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white antialiased">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMA) }}
      />

      {/* Top Fixed Header */}
      <ShowcaseNavbar />

      <main>
        {/* 1. Hero Section with 2D Character & Interactive Bill Switcher */}
        <AppShowcaseHero />

        {/* 2. Industry Trust & Stats Strip */}
        <TrustBanner />

        {/* 3. Industry Solutions Showcase (Retail, Wholesale, Pharmacy, Electronics, Services) */}
        <div id="solutions">
          <IndustrySolutions />
        </div>

        {/* 4. Bento Core Features with Clean Vector Line Art */}
        <div id="features">
          <BentoFeatures />
        </div>

        {/* 5. Interactive ROI & Time Saved Calculator */}
        <div id="calculator">
          <RoiCalculator />
        </div>

        {/* 6. Direct Architectural Comparison (SaaSzo vs Tally vs Excel) */}
        <div id="comparison">
          <ComparisonTable />
        </div>

        {/* 7. Multi-Platform Download Center */}
        <div id="downloads">
          <DownloadCenter />
        </div>

        {/* 8. FAQ Accordion for Search Rich Snippets */}
        <div id="faq">
          <ShowcaseFaq />
        </div>
      </main>

      {/* Minimal Clean Footer */}
      <MinimalFooter />
    </div>
  );
}
