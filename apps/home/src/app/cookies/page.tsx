import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";

export const metadata: Metadata = {
  title: "Cookie Policy | SaaSzo Invoice & POS",
  description:
    "Learn about the essential cookies, local storage mechanisms, and offline caching technologies used by SaaSzo.",
};

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What are Cookies & Local Storage?",
    paragraphs: [
      "Cookies are small text files placed on your device by websites you visit. Local storage (such as HTML5 localStorage and native SQLite storage) allows client applications to store key operational data on your computer or mobile phone.",
      "SaaSzo utilizes these technologies primarily to maintain authenticated sessions and enable our offline-first architecture, allowing you to bill customers without an active internet connection.",
    ],
  },
  {
    id: "cookies-we-use",
    title: "2. Cookies & Storage Keys Used by SaaSzo",
    paragraphs: [
      "We categorize our cookies and local storage tokens into the following technical functions:",
    ],
    bullets: [
      "Strictly Necessary Session Cookies: 'saaszo_session' and 'invoice_saaszo_session' maintain your secure authenticated merchant identity and route requests across our API infrastructure.",
      "Local Storage Auth Tokens: 'invoice_saaszo_token' stores your cryptographic Bearer token securely on your device for rapid app loading.",
      "Offline SQLite Cache: Stores product catalogs, item prices, customer ledgers, and queued offline receipts locally so counter billing never freezes during internet cuts.",
      "User Preference & Consent: 'saaszo_cookie_consent' records your acceptance of our cookie banner so you are not prompted repeatedly.",
    ],
  },
  {
    id: "zero-ad-trackers",
    title: "3. Zero Third-Party Advertising Trackers",
    paragraphs: [
      "We do not sell, rent, or trade your browsing habits or billing operations to third-party ad networks or data brokers.",
      "Our cookies and local storage mechanisms are strictly operational, security-oriented, and focused on making your billing counter fast and dependable.",
    ],
  },
  {
    id: "managing-cookies",
    title: "4. Managing & Clearing Your Cookies",
    paragraphs: [
      "Most modern web browsers allow you to control cookies through their browser settings. You can choose to block or delete cookies at any time.",
      "Please note that disabling strictly necessary session cookies will prevent you from signing in to the merchant portal or synchronizing local offline bills with the central cloud.",
    ],
    bullets: [
      "To clear cookies in Google Chrome: Settings > Privacy & Security > Clear Browsing Data.",
      "To clear cookies in Apple Safari: Preferences > Privacy > Manage Website Data.",
      "To clear local app storage on Android/iOS: App Settings > SaaSzo Invoice > Storage > Clear Cache.",
    ],
  },
  {
    id: "cookie-inquiries",
    title: "5. Inquiries & Contact",
    paragraphs: [
      "If you have questions regarding our use of cookies or client-side storage technologies, please contact our engineering and compliance team at saaszo.in@gmail.com.",
    ],
  },
] as const;

export default function CookiesPage() {
  return (
    <LegalDocument
      eyebrow="Transparency & Technical Storage"
      title="Cookie & Storage Policy"
      summary="Detailed disclosure of the essential session cookies, local storage tokens, and offline caching mechanisms used to power SaaSzo Invoice & POS."
      lastUpdated="September 2026"
      sections={sections}
    />
  );
}
