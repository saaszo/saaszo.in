import type { Metadata } from "next";
import { ShowcaseNavbar } from "@/components/ShowcaseNavbar";
import { AppShowcaseHero } from "@/components/AppShowcaseHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { TrustAtScale } from "@/components/TrustAtScale";
import { TrustBanner } from "@/components/TrustBanner";
import { IndustrySolutions } from "@/components/IndustrySolutions";
import { CustomerStories } from "@/components/CustomerStories";
import { BentoFeatures } from "@/components/BentoFeatures";
import { RoiCalculator } from "@/components/RoiCalculator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DownloadCenter } from "@/components/DownloadCenter";
import { BookDemoSection } from "@/components/BookDemoSection";
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-600 selection:text-white antialiased">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMA) }}
      />

      {/* Top Fixed Header */}
      <ShowcaseNavbar />

      <main>
        {/* 1. Hero Section with SaaSzo Line Art Counter & Interactive Bill Switcher */}
        <AppShowcaseHero />

        {/* 2. Trusted by the Biggest Names (Brand Marquee / Cloud) */}
        <BrandMarquee />

        {/* 3. Trust at Scale across 1,50,000+ Businesses (Line Art Merchant + Dashboard) */}
        <TrustAtScale />

        {/* 4. Industry Solutions Showcase (Retail, Wholesale, Pharmacy, Electronics, Services) */}
        <div id="solutions">
          <IndustrySolutions />
        </div>

        {/* 5. Real Customer Video Stories (Businesses that switched never looked back) */}
        <CustomerStories />

        {/* 6. Bento Core Features with 3D Rendered Visuals */}
        <div id="features">
          <BentoFeatures />
        </div>

        {/* 7. Interactive ROI & Time Saved Calculator */}
        <div id="calculator">
          <RoiCalculator />
        </div>

        {/* 8. Direct Architectural Comparison (SaaSzo vs Tally vs Excel) */}
        <div id="comparison">
          <ComparisonTable />
        </div>

        {/* 9. Multi-Platform Download Center */}
        <div id="downloads">
          <DownloadCenter />
        </div>

        {/* 10. Book a Free 10-Minute Demo (Form + 24/7 Support Line Art Character) */}
        <BookDemoSection />

        {/* 11. FAQ Accordion for Search Rich Snippets */}
        <div id="faq">
          <ShowcaseFaq />
        </div>
      </main>

      {/* Structured Clean Footer */}
      <MinimalFooter />
    </div>
  );
}
