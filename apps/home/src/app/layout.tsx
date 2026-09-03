import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "SaaSzo",
  title: {
    default: "SaaSzo — Smart Invoicing & Counter POS",
    template: "%s | SaaSzo",
  },
  description:
    "Offline & online GST invoicing, Bluetooth thermal printing, and barcode POS software for Android, Windows PC, Mac, and iOS.",
  keywords: ["POS Software", "GST Billing", "Thermal Printing", "SaaSzo Invoice", "Offline POS"],
  icons: {
    icon: [
      { url: "/digital-assets/favicon.svg", type: "image/svg+xml" },
      { url: "/icon" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background text-on-surface overflow-x-hidden min-h-screen flex flex-col antialiased"
      >
        <AuthProvider>
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
