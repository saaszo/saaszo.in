import React from "react";
import {
  Download,
  Smartphone,
  Monitor,
  Apple,
  QrCode,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
} from "lucide-react";

export function DownloadCenter() {
  const PLATFORMS = [
    {
      id: "android",
      title: "Android Mobile & Tablet",
      os: "Android 8.0 or later",
      icon: Smartphone,
      primaryAction: {
        label: "Download APK (.apk)",
        sublabel: "Version 1.0 • Direct Installer",
        href: "/downloads/saaszo-invoice-pos.apk",
      },
      secondaryAction: {
        label: "Google Play Store",
        href: "#",
      },
      features: [
        "Optimized for 5-inch phones up to 12-inch tablets",
        "Camera barcode scanning with flashlight support",
        "Bluetooth wireless thermal printer connectivity",
      ],
      badge: "Popular for Retail Counters",
    },
    {
      id: "windows",
      title: "Windows PC & POS Counter",
      os: "Windows 10 / 11 (64-bit)",
      icon: Monitor,
      primaryAction: {
        label: "Download for Windows (.exe)",
        sublabel: "Standalone Installer • 68 MB",
        href: "#",
      },
      secondaryAction: {
        label: "Portable Zip Version",
        href: "#",
      },
      features: [
        "Fast counter billing with keyboard hotkeys",
        "Direct USB thermal receipt & laser printer support",
        "Cash drawer trigger & dual-screen support",
      ],
      badge: "Recommended for Cash Counters",
    },
    {
      id: "mac",
      title: "macOS Desktop",
      os: "Apple Silicon (M1/M2/M3/M4) & Intel",
      icon: Apple,
      primaryAction: {
        label: "Download for macOS (.dmg)",
        sublabel: "Universal Binary • 64 MB",
        href: "#",
      },
      secondaryAction: {
        label: "System Requirements",
        href: "#",
      },
      features: [
        "Native macOS performance with Retina rendering",
        "Thermal receipt print via Bluetooth and USB",
        "Full offline SQLite database storage",
      ],
      badge: "Apple Silicon Optimized",
    },
    {
      id: "ios",
      title: "Apple iOS (iPhone & iPad)",
      os: "iOS 15.0 or later",
      icon: Apple,
      primaryAction: {
        label: "Download on App Store",
        sublabel: "iPhone & iPad POS Edition",
        href: "#",
      },
      secondaryAction: {
        label: "TestFlight Early Access",
        href: "#",
      },
      features: [
        "Sleek mobile point-of-sale interface",
        "AirPrint & Bluetooth thermal printer support",
        "Real-time cloud synchronization",
      ],
      badge: "App Store Available",
    },
  ];

  return (
    <section id="downloads" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            Universal App Center
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Download SaaSzo for Your Device
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            One single account syncs across all your counter terminals, phones, and tablets. Download is free with zero credit card required.
          </p>
        </div>

        {/* 4 Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Top Bar with Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {platform.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {platform.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    {platform.os}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
                    {platform.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Download Actions */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                  <a
                    href={platform.primaryAction.href}
                    className="w-full inline-flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <span>{platform.primaryAction.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                      {platform.primaryAction.sublabel}
                    </span>
                  </a>

                  <a
                    href={platform.secondaryAction.href}
                    className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs transition-colors"
                  >
                    {platform.secondaryAction.label}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Installation Guarantee */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-900">Verified &amp; Safe Installer</span>
              <p className="text-slate-500 mt-0.5">
                Every release binary is code-signed and scanned against viruses and malware.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>SHA-256 Checksums Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
