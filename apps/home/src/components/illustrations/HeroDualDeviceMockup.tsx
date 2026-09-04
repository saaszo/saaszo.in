"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Barcode,
  Printer,
  WifiOff,
  QrCode,
  CreditCard,
  Banknote,
  Sparkles,
  Zap,
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Receipt,
  Layers,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

interface PosItem {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  gst: string;
}

const POS_ITEMS: PosItem[] = [
  { id: "1", name: "Amul Gold Milk 500ml", category: "Dairy", price: 33, mrp: 34, stock: 64, gst: "0%" },
  { id: "2", name: "Fortune Sunflower Oil 1L", category: "Grocery", price: 145, mrp: 165, stock: 120, gst: "5%" },
  { id: "3", name: "Tata Salt 1kg", category: "Grocery", price: 28, mrp: 30, stock: 240, gst: "0%" },
  { id: "4", name: "Maggi Noodles 4x", category: "Snacks", price: 56, mrp: 60, stock: 85, gst: "12%" },
  { id: "5", name: "Aashirvaad Atta 5kg", category: "Grocery", price: 245, mrp: 275, stock: 38, gst: "5%" },
  { id: "6", name: "Good Day Cookies", category: "Snacks", price: 35, mrp: 40, stock: 110, gst: "18%" },
];

export function HeroDualDeviceMockup() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="relative w-full max-w-[760px] mx-auto select-none pt-4 pb-12">
      {/* Soft Studio Floor Shadow & Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[400px] bg-gradient-to-tr from-indigo-300/30 via-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-14 bg-slate-900/25 blur-2xl rounded-full pointer-events-none -z-10" />

      {/* Main Container for 3 Devices (Laptop + Tablet + Smartphone) */}
      <div className="relative flex items-end justify-center">
        
        {/* ==================================================== */}
        {/* 1. LAPTOP (Left-Center 3/4 Studio Mockup) */}
        {/* ==================================================== */}
        <div className="w-[85%] sm:w-[72%] z-10 transform sm:-rotate-1 sm:-translate-x-6 hover:rotate-0 transition-transform duration-300">
          {/* Laptop Lid Screen Frame */}
          <div className="bg-[#0f172a] rounded-t-2xl sm:rounded-t-3xl p-2 sm:p-3 shadow-2xl border border-slate-700/90 relative">
            {/* Top Bezel with Camera */}
            <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-800 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/90" />
                <span className="w-2 h-2 rounded-full bg-amber-500/90" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/90" />
                <span className="text-slate-600 ml-1">|</span>
                <span className="font-bold text-white text-[10px] ml-1">SaaSzo POS Pro</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[9px] font-bold">100% Offline SQLite</span>
              </div>
            </div>

            {/* Laptop Display (Touch Counter POS) */}
            <div className="bg-slate-900 rounded-lg overflow-hidden text-slate-100 font-sans shadow-inner">
              <div className="grid grid-cols-12 min-h-[260px] sm:min-h-[300px]">
                {/* Left Product Catalog Section */}
                <div className="col-span-7 p-2 sm:p-2.5 bg-slate-900 flex flex-col justify-between border-r border-slate-800">
                  <div className="space-y-1.5">
                    {/* Barcode Search Box */}
                    <div className="relative">
                      <Barcode className="w-3.5 h-3.5 text-[#6451f1] absolute left-2 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        value="[F1] Scan Barcode (EAN-13)..."
                        className="w-full pl-7 pr-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[9px] text-slate-300 font-mono focus:outline-hidden"
                      />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 text-[8px] font-bold overflow-x-auto no-scrollbar">
                      {["All", "Grocery", "Dairy", "Snacks"].map((cat) => (
                        <span
                          key={cat}
                          className={`px-2 py-0.5 rounded ${cat === "All" ? "bg-[#6451f1] text-white" : "bg-slate-800 text-slate-400"}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      {POS_ITEMS.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-800/90 p-1.5 rounded-lg border border-slate-700/80 flex flex-col justify-between text-[9px]"
                        >
                          <div>
                            <div className="text-[7px] text-emerald-400 font-semibold">{item.stock} in stock</div>
                            <div className="font-bold text-slate-200 line-clamp-1 leading-tight text-[9px] mt-0.5">
                              {item.name}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="font-black text-white text-[10px]">₹{item.price}</span>
                            <span className="w-3.5 h-3.5 rounded bg-[#6451f1] text-white flex items-center justify-center font-bold text-[9px]">
                              +
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keyboard Toolbar */}
                  <div className="mt-1 pt-1 border-t border-slate-800 flex items-center justify-between text-[7px] text-slate-400 font-mono">
                    <span>[F2] Cash</span>
                    <span>[F3] UPI QR</span>
                    <span>[F8] Drawer</span>
                  </div>
                </div>

                {/* Right Live Bill Summary */}
                <div className="col-span-5 p-2 bg-slate-950 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[9px]">
                      <span className="font-bold text-white">Bill #SZ-1084</span>
                      <span className="text-[8px] text-indigo-400 font-bold">3 ITEMS</span>
                    </div>

                    <div className="mt-1 space-y-1 text-[8px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Fortune Oil 1L</span>
                        <span className="font-bold">₹145.00</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Aashirvaad Atta 5kg</span>
                        <span className="font-bold">₹245.00</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Maggi Noodles 2x</span>
                        <span className="font-bold">₹112.00</span>
                      </div>
                    </div>

                    <div className="mt-1.5 pt-1 border-t border-dashed border-slate-800 text-[8px] space-y-0.5">
                      <div className="flex justify-between text-slate-400">
                        <span>Subtotal</span>
                        <span>₹502.00</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Discount</span>
                        <span>-₹27.70</span>
                      </div>
                      <div className="flex justify-between font-black text-white text-[10px] pt-0.5">
                        <span>Total</span>
                        <span className="text-emerald-400">₹498.70</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1.5">
                    <button className="w-full py-1.5 rounded-lg bg-[#6451f1] text-white text-[9px] font-black flex items-center justify-center gap-1 shadow-md">
                      <Printer className="w-3 h-3 text-white" />
                      <span>PRINT &amp; CUT (F2)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Bottom Aluminum Base & Trackpad Notch */}
          <div className="h-3 sm:h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl sm:rounded-b-2xl border-t border-slate-600 flex items-center justify-center shadow-md">
            <div className="w-16 sm:w-20 h-1 bg-slate-900/60 rounded-full" />
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. TABLET / IPAD PRO (Right Side Upright Mockup) */}
        {/* ==================================================== */}
        <div className="w-[44%] sm:w-[38%] absolute right-[-10px] sm:right-[-18px] top-6 sm:top-2 z-0 transform sm:rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="bg-[#1e293b] rounded-[24px] sm:rounded-[30px] p-2.5 sm:p-3 shadow-2xl border-2 border-slate-600/80">
            {/* Tablet Top Camera Dot */}
            <div className="flex justify-center pb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>

            {/* Tablet Screen: SaaSzo Business Analytics */}
            <div className="bg-slate-900 rounded-[18px] sm:rounded-[22px] p-2.5 sm:p-3 text-white font-sans overflow-hidden shadow-inner">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Store Analytics</span>
                </div>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  TODAY
                </span>
              </div>

              {/* Top Sales Metric */}
              <div className="mt-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <div className="text-[8px] text-slate-400 font-semibold uppercase">Total Counter Sales</div>
                <div className="text-base sm:text-lg font-black text-white flex items-center justify-between mt-0.5">
                  <span>₹38,450.00</span>
                  <span className="text-emerald-400 text-[9px] font-bold flex items-center">
                    +18.4% ↗
                  </span>
                </div>
                <div className="text-[8px] text-slate-400 mt-0.5">142 Invoices Billed</div>
              </div>

              {/* Mini Bar Chart Visualization */}
              <div className="mt-2 space-y-1">
                <div className="text-[8px] font-bold text-slate-400">Peak Hourly Volume</div>
                <div className="flex items-end gap-1.5 h-10 pt-1 pb-0.5 px-1 bg-slate-950/60 rounded-lg">
                  <div className="flex-1 bg-indigo-500/40 rounded-t h-[35%]" />
                  <div className="flex-1 bg-indigo-500/60 rounded-t h-[55%]" />
                  <div className="flex-1 bg-indigo-500/80 rounded-t h-[80%]" />
                  <div className="flex-1 bg-[#6451f1] rounded-t h-[100%]" />
                  <div className="flex-1 bg-indigo-500/70 rounded-t h-[65%]" />
                  <div className="flex-1 bg-indigo-500/50 rounded-t h-[45%]" />
                </div>
              </div>

              {/* Status Tags */}
              <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <PackageCheck className="w-3 h-3" />
                  Stock Synced
                </span>
                <span className="font-bold text-slate-300">GST Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. SMARTPHONE (Front-Center Overlaid iPhone Mockup) */}
        {/* ==================================================== */}
        <div className="w-[38%] sm:w-[32%] absolute left-[40%] sm:left-[38%] bottom-[-18px] sm:bottom-[-24px] z-30 transform hover:-translate-y-1.5 transition-transform duration-300">
          <div className="bg-[#0f172a] rounded-[28px] sm:rounded-[36px] p-2 shadow-2xl border-3 sm:border-4 border-slate-800">
            {/* Phone Dynamic Island / Notch */}
            <div className="flex justify-between items-center px-3 py-0.5 text-[8px] font-bold text-slate-400 font-mono">
              <span>10:24</span>
              <div className="w-8 sm:w-10 h-2.5 sm:h-3 bg-black rounded-full mx-auto" />
              <div className="text-emerald-400 text-[8px]">● 5G</div>
            </div>

            {/* Mobile Screen UI: Instant UPI QR & Mobile POS */}
            <div className="bg-white rounded-[22px] sm:rounded-[28px] overflow-hidden p-2 sm:p-2.5 text-slate-900 font-sans shadow-inner">
              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[9px]">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#6451f1]" />
                  Mobile POS
                </span>
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  READY
                </span>
              </div>

              {/* Amount Box */}
              <div className="mt-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-center">
                <div className="text-[8px] text-slate-500 font-medium">Bill #SZ-1084 Payable</div>
                <div className="text-sm sm:text-base font-black text-slate-950">₹498.70</div>
              </div>

              {/* Dynamic UPI QR Code */}
              <div className="mt-1.5 bg-white rounded-lg p-1.5 border border-slate-200 text-center shadow-2xs">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-slate-900 rounded-md p-1 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <rect x="0" y="0" width="30" height="30" rx="3" />
                    <rect x="5" y="5" width="20" height="20" fill="#0f172a" />
                    <rect x="10" y="10" width="10" height="10" fill="#ffffff" />
                    <rect x="70" y="0" width="30" height="30" rx="3" />
                    <rect x="75" y="5" width="20" height="20" fill="#0f172a" />
                    <rect x="80" y="10" width="10" height="10" fill="#ffffff" />
                    <rect x="0" y="70" width="30" height="30" rx="3" />
                    <rect x="5" y="75" width="20" height="20" fill="#0f172a" />
                    <rect x="10" y="80" width="10" height="10" fill="#ffffff" />
                    <rect x="40" y="10" width="10" height="20" />
                    <rect x="55" y="5" width="8" height="15" />
                    <rect x="40" y="40" width="20" height="20" rx="2" />
                    <rect x="65" y="40" width="15" height="10" />
                    <rect x="40" y="70" width="15" height="15" />
                    <rect x="65" y="65" width="20" height="20" />
                  </svg>
                </div>
                <div className="text-[7px] font-bold text-slate-600 mt-1">
                  Scan to Pay (UPI QR)
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-1.5">
                <button className="w-full py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[8px] sm:text-[9px] flex items-center justify-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>Paid &bull; Print Bluetooth</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
