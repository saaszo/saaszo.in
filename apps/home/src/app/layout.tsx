import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaSzo - The Operating System for Modern Business",
  description: "Unify your entire workflow. HRMS, CRM, advanced AI insights, and seamless internal chat—all in one powerful, beautifully designed platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body suppressHydrationWarning className="bg-surface font-sans text-on-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
