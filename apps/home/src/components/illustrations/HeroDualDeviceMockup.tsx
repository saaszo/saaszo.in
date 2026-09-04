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
} from "lucide-react";

interface PosItem {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  gst: string;
  tag?: string;
  color: string;
}

const POS_CATALOG: PosItem[] = [
  { id: "1", name: "Amul Gold Milk 500ml", category: "Dairy", price: 33, mrp: 34, stock: 64, gst: "0%", color: "bg-blue-500" },
  { id: "2", name: "Fortune Sunflower Oil 1L", category: "Grocery", price: 145, mrp: 165, stock: 120, gst: "5%", tag: "Best Seller", color: "bg-amber-500" },
  { id: "3", name: "Tata Salt Vacuum Evap 1kg", category: "Grocery", price: 28, mrp: 30, stock: 240, gst: "0%", color: "bg-emerald-500" },
  { id: "4", name: "Maggi 2-Min Noodles 4x", category: "Snacks", price: 56, mrp: 60, stock: 85, gst: "12%", tag: "Fast Move", color: "bg-red-500" },
  { id: "5", name: "Aashirvaad Chakki Atta 5kg", category: "Grocery", price: 245, mrp: 275, stock: 38, gst: "5%", color: "bg-yellow-600" },
  { id: "6", name: "Britannia Good Day 200g", category: "Snacks", price: 35, mrp: 40, stock: 110, gst: "18%", color: "bg-purple-500" },
];

export function HeroDualDeviceMockup() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="relative w-full max-w-[700px] mx-auto select-none">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[360px] bg-indigo-300/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Main Laptop / Desktop Screen Frame (Touch POS Interface) */}
      <div className="relative bg-[#0f172a] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 shadow-2xl border border-slate-700/80">
        {/* Laptop Header Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-white font-bold text-[11px]">
              <div className="w-4 h-4 rounded bg-[#6451f1] flex items-center justify-center text-white text-[9px] font-black">
                S
              </div>
              <span>SaaSzo POS Pro</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline-block">
              &bull; Counter #01 (Main Store)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Offline SQLite Active</span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:flex items-center gap-1">
              <Printer className="w-3 h-3 text-[#6451f1]" />
              <span>3&quot; Thermal Ready</span>
            </div>
          </div>
        </div>

        {/* Laptop Inner Screen Body */}
        <div className="bg-slate-900 rounded-xl overflow-hidden font-sans text-slate-100 shadow-inner">
          <div className="grid grid-cols-12 min-h-[340px] sm:min-h-[400px]">
            
            {/* ==================================================== */}
            {/* LEFT 7 COLUMNS: Product Grid & Fast Category Selector */}
            {/* ==================================================== */}
            <div className="col-span-12 sm:col-span-7 bg-slate-900/90 p-3 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-slate-800">
              <div className="space-y-2.5">
                {/* Search / Barcode Input Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Barcode className="w-4 h-4 text-[#6451f1]" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="[F1] Scan Barcode (EAN-13) or Search Item..."
                    className="w-full pl-8 pr-16 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-[11px] text-slate-300 placeholder-slate-500 focus:outline-hidden font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#6451f1]/30 text-indigo-300 border border-indigo-500/40">
                      SCANNER ON
                    </span>
                  </div>
                </div>

                {/* Quick Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10px] font-semibold">
                  {["All Items", "Grocery", "Dairy", "Snacks", "Beverages"].map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        activeCategory === cat || (idx === 0 && activeCategory === "All")
                          ? "bg-[#6451f1] text-white font-bold"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Catalog Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POS_CATALOG.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-slate-800/80 hover:bg-slate-750 p-2 rounded-xl border border-slate-700/70 hover:border-indigo-500/80 transition-all flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Tag / Category Badge */}
                        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                          <span className="font-mono text-[8px] px-1 rounded bg-slate-900 text-slate-400">
                            GST {item.gst}
                          </span>
                          <span className="text-emerald-400 text-[8px] font-semibold">
                            {item.stock} in stock
                          </span>
                        </div>

                        {/* Product Title */}
                        <h4 className="text-[11px] font-bold text-slate-100 line-clamp-2 leading-tight group-hover:text-indigo-300">
                          {item.name}
                        </h4>
                      </div>

                      {/* Price & Add Button */}
                      <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black text-white">₹{item.price}.00</div>
                          <div className="text-[8px] text-slate-500 line-through">₹{item.mrp}.00</div>
                        </div>
                        <div className="w-5 h-5 rounded-md bg-[#6451f1] group-hover:bg-[#5340eb] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          +
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Keyboard Shortcut Toolbar */}
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>[F2] Cash</span>
                <span>[F3] UPI QR</span>
                <span>[F4] Hold (0)</span>
                <span>[F8] Cash Drawer</span>
              </div>
            </div>

            {/* ==================================================== */}
            {/* RIGHT 5 COLUMNS: Live Bill Cart & Payment Tender */}
            {/* ==================================================== */}
            <div className="col-span-12 sm:col-span-5 bg-slate-950 p-3 flex flex-col justify-between">
              <div>
                {/* Bill Header info */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px]">
                  <div>
                    <div className="font-bold text-white text-[11px] flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5 text-[#6451f1]" />
                      <span>Bill #SZ-1084</span>
                    </div>
                    <div className="text-[9px] text-slate-400">Customer: Walk-in / Rahul S.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-bold text-[9px]">
                    3 ITEMS
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="mt-2 space-y-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between text-[10px]">
                    <div className="truncate max-w-[110px]">
                      <div className="font-bold text-white truncate">Fortune Oil 1L</div>
                      <div className="text-[8px] text-slate-400">₹145 &bull; GST 5%</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-300">1x</span>
                      <span className="font-black text-white">₹145.00</span>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between text-[10px]">
                    <div className="truncate max-w-[110px]">
                      <div className="font-bold text-white truncate">Aashirvaad Atta 5kg</div>
                      <div className="text-[8px] text-slate-400">₹245 &bull; GST 5%</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-300">1x</span>
                      <span className="font-black text-white">₹245.00</span>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between text-[10px]">
                    <div className="truncate max-w-[110px]">
                      <div className="font-bold text-white truncate">Maggi 2-Min Noodles</div>
                      <div className="text-[8px] text-slate-400">₹56 &bull; GST 12%</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-300">2x</span>
                      <span className="font-black text-white">₹112.00</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-slate-800 space-y-1 text-[10px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>₹502.00</span>
                  </div>
                  <div className="flex justify-between text-indigo-400">
                    <span>GST (CGST + SGST)</span>
                    <span>₹24.40</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Special Discount</span>
                    <span>-₹27.70</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-white pt-1.5 border-t border-slate-800">
                    <span>Grand Total</span>
                    <span className="text-emerald-400 text-sm">₹498.70</span>
                  </div>
                </div>
              </div>

              {/* Tender Buttons & Auto Print */}
              <div className="mt-3 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <button className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 border border-slate-700">
                    <Banknote className="w-3 h-3 text-emerald-400" />
                    <span>Cash [F2]</span>
                  </button>
                  <button className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 border border-slate-700">
                    <QrCode className="w-3 h-3 text-indigo-400" />
                    <span>UPI QR [F3]</span>
                  </button>
                </div>

                <button className="w-full py-2 rounded-xl bg-[#6451f1] hover:bg-[#5340eb] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30">
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span>PRINT &amp; CUT RECEIPT (F2)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. OVERLAID MOBILE / TABLET DEVICE (Fast Counter Billing) */}
      {/* ==================================================== */}
      <div className="absolute right-0 sm:-right-4 bottom-[-20px] sm:bottom-[-28px] w-48 sm:w-56 bg-[#0f172a] rounded-[32px] sm:rounded-[36px] p-2 shadow-2xl border-4 border-slate-800 z-30 transform hover:-translate-y-1 transition-transform">
        {/* Mobile Header / Notch */}
        <div className="flex justify-between items-center px-3 py-1 text-[8px] font-bold text-slate-400 font-mono">
          <span>10:24</span>
          <div className="w-10 h-3 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1 text-emerald-400">
            <span>● 5G</span>
          </div>
        </div>

        {/* Mobile Screen App UI */}
        <div className="bg-white rounded-[24px] overflow-hidden p-2.5 text-slate-900 font-sans shadow-inner">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px]">
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <span className="w-2 h-2 rounded-full bg-[#6451f1]" />
              <span>Mobile POS</span>
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              LIVE
            </span>
          </div>

          {/* Quick Bill Info Box */}
          <div className="mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200/90 text-center">
            <div className="text-[9px] text-slate-500 font-medium">Payable Amount</div>
            <div className="text-base font-black text-slate-950">₹498.70</div>
            <div className="text-[8px] text-slate-400 font-medium">Bill #SZ-1084 &bull; 3 Items</div>
          </div>

          {/* Simulated Dynamic UPI QR Code */}
          <div className="mt-2 bg-white rounded-xl p-2 border border-slate-200 text-center shadow-2xs">
            <div className="w-20 h-20 mx-auto bg-slate-900 rounded-lg p-1.5 flex items-center justify-center">
              {/* Dynamic QR SVG Pattern */}
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
            <div className="mt-1 text-[8px] font-bold text-slate-600">
              Scan with GPay / PhonePe / Paytm
            </div>
          </div>

          {/* Quick Collect & Print Button */}
          <div className="mt-2">
            <button className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center gap-1 shadow-md">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Paid &bull; Print Bluetooth Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
