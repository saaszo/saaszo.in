import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | SaaSzo Invoice & POS",
  description:
    "Review SaaSzo's transparent cancellation, return, and refund policies for software licenses and subscriptions.",
};

const sections = [
  {
    id: "free-tier-evaluation",
    title: "1. Free Download & Evaluation",
    paragraphs: [
      "We believe every merchant should test software on their own cash counter and hardware before spending money. SaaSzo Invoice & POS provides a free download tier with core invoicing, offline billing, and thermal printing capabilities.",
      "We encourage all businesses to download the app and verify compatibility with their receipt printers and barcode scanners during their daily counter operations.",
    ],
  },
  {
    id: "subscription-cancellation",
    title: "2. Subscription Cancellation",
    paragraphs: [
      "You can cancel your paid plan or recurring subscription at any time directly from your SaaSzo account dashboard or by submitting a cancellation request to saaszo.in@gmail.com.",
      "When you cancel a subscription, your paid features will remain active until the end of the current paid billing cycle. You will not be billed again for subsequent billing periods.",
    ],
    bullets: [
      "Zero Cancellation Penalties: No hidden fees or exit penalties are charged upon cancellation.",
      "Data Access Post-Cancellation: Even after paid plan cancellation, your local offline database remains on your device, and you can export your data anytime.",
    ],
  },
  {
    id: "7-day-money-back",
    title: "3. 7-Day Money-Back Guarantee",
    paragraphs: [
      "If you upgrade to a paid software license or multi-branch plan and find that SaaSzo does not satisfy your operational requirements, you may request a 100% full refund within 7 days of the initial purchase transaction.",
      "Refund requests submitted within this 7-day window will be honored with no questions asked.",
    ],
    bullets: [
      "Eligibility: Applies to your initial paid plan subscription or software license upgrade.",
      "Exclusions: Renewal payments after the initial 7-day period are non-refundable, but can be cancelled at any time to prevent future charges.",
    ],
  },
  {
    id: "how-to-request-refund",
    title: "4. How to Request a Refund",
    paragraphs: [
      "To initiate a refund under our 7-day guarantee, simply send an email to saaszo.in@gmail.com with the following details:",
    ],
    bullets: [
      "Registered Business Name and Mobile Number.",
      "Payment Invoice or Transaction Reference Number (from UPI, Razorpay, or card statement).",
      "Brief reason for refund (optional, to help our engineering team improve).",
    ],
  },
  {
    id: "hardware-disclaimer",
    title: "5. Third-Party Hardware & Peripherals",
    paragraphs: [
      "SaaSzo is an independent software application. Any physical thermal printers, thermal paper rolls, USB cords, cash drawers, or barcode scanners purchased from third-party manufacturers, dealers, or online retail stores are governed by that merchant's own warranty and return policies.",
      "SaaSzo does not issue refunds or replacements for physical hardware manufactured by third parties.",
    ],
  },
  {
    id: "processing-timeline",
    title: "6. Refund Processing Timelines",
    paragraphs: [
      "Once approved by our billing team, refunds are processed immediately. Depending on your banking institution, funds typically reflect in your original payment method (Bank Account, UPI, or Card) within 5 to 7 business days.",
      "For refund status updates or questions, contact our billing desk at saaszo.in@gmail.com.",
    ],
  },
] as const;

export default function RefundPage() {
  return (
    <LegalDocument
      eyebrow="Consumer Protection & Guarantee"
      title="Cancellation & Refund Policy"
      summary="Clear, straightforward cancellation rules, our 7-day money-back guarantee, and refund processing timelines for SaaSzo Invoice & POS."
      lastUpdated="September 2026"
      sections={sections}
    />
  );
}
