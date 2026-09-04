"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Printer,
  Smartphone,
  CheckCircle2,
  QrCode,
  ArrowRight,
} from "lucide-react";

export function HeroDualDeviceMockup() {
  return (
    <div className="relative w-full max-w-[740px] mx-auto select-none pt-2 pb-6 group">
      {/* Ambient Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-gradient-to-tr from-indigo-300/40 via-purple-200/30 to-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Main 3D Studio Showcase Image Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white/60 backdrop-blur-xs transition-transform duration-500 hover:scale-[1.015]">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
          <Image
            src="/illustrations/saaszo-hero-showcase-3d.jpg"
            alt="SaaSzo Digital Invoicing, Desktop POS & Mobile Billing 3D Workspace Setup"
            fill
            sizes="(max-width: 768px) 100vw, 740px"
            className="object-contain sm:object-cover transition-all duration-500 group-hover:scale-105"
            priority
          />
        </div>

        {/* Floating Top-Left Micro Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-1.5 text-xs font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GST, E-Invoice &amp; E-Way Bill</span>
        </div>

        {/* Floating Top-Right Micro Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-200/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-[#6451f1]">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Thermal &amp; UPI QR</span>
        </div>

        {/* Floating Bottom-Right Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sync Across Laptop, Mobile &amp; Thermal POS</span>
        </div>
      </div>

      {/* Trust Micro-Row under visual */}
      <div className="mt-3 flex items-center justify-between px-2 text-[11px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Offline-First SQLite Engine
        </span>
        <span className="flex items-center gap-1.5">
          <Printer className="w-3.5 h-3.5 text-[#6451f1]" />
          2&quot; &amp; 3&quot; Bluetooth Thermal Printing
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
          iOS &amp; Android Ready
        </span>
      </div>
    </div>
  );
}
