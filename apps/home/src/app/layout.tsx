import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaaSzo — The Operating System for Modern Business",
  description:
    "Unify your entire workflow. HRMS, CRM, advanced AI insights, and seamless internal chat—all in one powerful, beautifully designed platform.",
  keywords: ["SaaS", "HRMS", "CRM", "AI", "Business Platform", "SaaSzo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background text-on-surface overflow-x-hidden min-h-screen flex flex-col antialiased"
      >
        {children}
      </body>
    </html>
  );
}
