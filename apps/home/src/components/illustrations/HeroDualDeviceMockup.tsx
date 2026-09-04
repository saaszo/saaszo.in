"use client";

import React from "react";
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
  FileSpreadsheet,
  CheckCircle2,
  Smartphone,
  QrCode,
  Bell,
  Clock,
  Send,
} from "lucide-react";

export function HeroDualDeviceMockup() {
  return (
    <div className="relative w-full max-w-[660px] mx-auto select-none">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Indian Merchant Character Illustration (Positioned on the Left-Center pointing at screens) */}
      <div className="absolute -left-6 sm:-left-10 bottom-2 sm:bottom-6 z-20 pointer-events-none w-36 sm:w-48 h-56 sm:h-72">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          {/* Subtle Background City / Shop silhouette */}
          <rect x="0" y="80" width="60" height="200" rx="4" fill="#6451f1" fillOpacity="0.08" />
          <rect x="70" y="110" width="50" height="170" rx="4" fill="#6451f1" fillOpacity="0.06" />

          {/* Character Body / Kurta */}
          <path d="M70 170 L130 160 L145 300 L55 300 Z" fill="#e27c68" />
          <path d="M70 170 L100 200 L130 160" stroke="#b85341" strokeWidth="3" />
          {/* Turban (Pagri) - Indian Orange/Saffron */}
          <path d="M85 85 C70 80, 60 95, 65 110 C60 120, 75 135, 95 135 C115 135, 130 125, 130 110 C135 95, 125 80, 105 80 Z" fill="#d93829" />
          <path d="M70 100 C80 90, 115 90, 125 105" stroke="#b02619" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 112 C80 105, 118 105, 128 115" stroke="#b02619" strokeWidth="4" strokeLinecap="round" />
          {/* Top Turban Crest */}
          <path d="M92 78 C92 70, 102 70, 104 78 Z" fill="#d93829" />

          {/* Face */}
          <path d="M78 108 C78 135, 118 135, 118 108 Z" fill="#c88266" />
          {/* Beard & Mustache */}
          <path d="M78 118 C85 140, 112 140, 118 118 C115 145, 82 145, 78 118 Z" fill="#221e22" />
          <path d="M84 122 C92 126, 104 126, 112 122" stroke="#221e22" strokeWidth="4" strokeLinecap="round" />
          {/* Eyes & Smile */}
          <circle cx="88" cy="112" r="2.5" fill="#1e1e1e" />
          <circle cx="106" cy="112" r="2.5" fill="#1e1e1e" />
          <path d="M93 126 C97 129, 101 129, 103 126" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

          {/* Pointing Arm & Hand (Pointing towards the Laptop/Mobile screen) */}
          <path d="M125 175 C145 160, 160 140, 168 120" stroke="#c88266" strokeWidth="16" strokeLinecap="round" />
          <circle cx="168" cy="118" r="8" fill="#c88266" />
          {/* Index finger pointing up-right */}
          <path d="M168 118 L184 96" stroke="#c88266" strokeWidth="7" strokeLinecap="round" />
          {/* Other folded fingers */}
          <circle cx="172" cy="120" r="4" fill="#a86750" />
          <circle cx="168" cy="124" r="4" fill="#a86750" />
          {/* Kurta Sleeve Cuff */}
          <path d="M122 170 L134 185" stroke="#2b2b2b" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      {/* 2. Desktop / Laptop Screen Mockup */}
      <div className="relative ml-8 sm:ml-16 bg-[#161a23] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl border border-slate-700/80">
        {/* Laptop Top Bezel & Camera Dot */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span className="font-mono text-[11px] text-slate-300 font-semibold">saaszo.in/desktop</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online Sync</span>
          </div>
        </div>

        {/* Laptop Inner Screen Application UI */}
        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden font-sans text-slate-900 shadow-inner">
          <div className="grid grid-cols-12 min-h-[300px] sm:min-h-[360px]">
            {/* Dark Left Sidebar */}
            <div className="col-span-3 bg-[#0f172a] text-slate-300 p-2 sm:p-3 flex flex-col justify-between text-[10px] sm:text-xs">
              <div className="space-y-3">
                {/* Brand Logo inside app */}
                <div className="flex items-center gap-1.5 px-1 py-1 font-black text-white text-xs sm:text-sm tracking-tight">
                  <div className="w-5 h-5 rounded-md bg-[#6451f1] flex items-center justify-center text-white text-[10px] font-bold">
                    S
                  </div>
                  <span>SaaSzo</span>
                </div>

                {/* Business Selector Pill */}
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      S
                    </span>
                    <span className="text-[10px] font-bold text-white truncate">Super Kirana...</span>
                  </div>
                  <span className="text-[9px] text-slate-400">▾</span>
                </div>

                {/* Sidebar Navigation items */}
                <div className="space-y-1 text-[10px] font-medium pt-1">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-1.5">
                    Ledger &amp; Billing
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#6451f1] text-white font-bold flex items-center gap-1.5">
                    <span>👥 Customers</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
                    <span>🚚 Suppliers</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
                    <span>💰 Expenses</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
                    <span>📖 Cashbook</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
                    <span>📊 Reports</span>
                  </div>
                  <div className="px-2 py-1 rounded-md text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
                    <span>⚙️ Settings</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400">
                v2.6 Desktop • GST Ready
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-span-9 bg-slate-50/70 p-3 sm:p-4 flex flex-col justify-between">
              <div>
                {/* Top Tabs: Customers (120) vs Suppliers (0) */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-slate-900 border-b-2 border-[#6451f1] pb-1">
                      Customers <span className="text-slate-500 font-normal">120</span>
                    </span>
                    <span className="text-slate-400 pb-1">
                      Suppliers <span className="font-normal">0</span>
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs cursor-pointer">❓</span>
                </div>

                {/* Summary Metrics Banner: You'll Give & You'll Get */}
                <div className="mt-2.5 p-2 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-around text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold">You&apos;ll Give</div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center justify-center gap-0.5">
                      <span>₹13,480</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold">You&apos;ll Get</div>
                    <div className="text-xs sm:text-sm font-black text-red-600 flex items-center justify-center gap-0.5">
                      <span>₹2,340</span>
                      <ArrowDownLeft className="w-3 h-3 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      readOnly
                      value="Search name or phone..."
                      className="w-full pl-7 pr-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[9px] text-slate-600 font-semibold flex items-center gap-1">
                    <span>Filter by: All</span>
                    <span>▾</span>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[9px] text-slate-600 font-semibold flex items-center gap-1">
                    <span>Sort: Recent</span>
                    <span>▾</span>
                  </div>
                </div>

                {/* Customer Ledger Rows */}
                <div className="mt-2 space-y-1.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px]">
                        AS
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">Arya Sharma</div>
                        <div className="text-[8px] text-slate-400">Just now • Bill #104</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600 text-[11px]">₹300</div>
                      <div className="text-[8px] text-slate-400">YOU&apos;LL GET</div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[9px]">
                        KO
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">Kapil Ojha</div>
                        <div className="text-[8px] text-slate-400">2 mins ago • UPI</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-red-600 text-[11px]">₹75</div>
                      <div className="text-[8px] text-slate-400">YOU&apos;LL GIVE</div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[9px]">
                        PJ
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">Priyanka Jadhav</div>
                        <div className="text-[8px] text-slate-400">1 hour ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-red-600 text-[11px]">₹140</div>
                      <div className="text-[8px] text-slate-400">YOU&apos;LL GIVE</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <button className="flex-1 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-[10px] font-bold hover:bg-slate-50 flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>Bulk Import Excel</span>
                </button>
                <button className="flex-1 py-1.5 rounded-lg bg-[#6451f1] text-white text-[10px] font-bold hover:bg-[#5340eb] flex items-center justify-center gap-1 shadow-xs">
                  <Plus className="w-3 h-3 text-white" />
                  <span>+ Add Customer / Bill</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Overlaid Smartphone Mobile Screen Mockup (Positioned on the Right-Center Foreground) */}
      <div className="absolute right-0 sm:-right-4 bottom-[-16px] sm:bottom-[-24px] w-48 sm:w-60 bg-[#0f172a] rounded-[32px] sm:rounded-[40px] p-2.5 shadow-2xl border-4 border-slate-800 z-30 transform hover:-translate-y-1 transition-transform">
        {/* Phone Top Notch / Speaker Bar */}
        <div className="flex justify-between items-center px-4 py-1 text-[9px] font-bold text-slate-400 font-mono">
          <span>9:30</span>
          <div className="w-12 h-3.5 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile App Screen Content */}
        <div className="bg-white rounded-[24px] sm:rounded-[30px] overflow-hidden p-2.5 sm:p-3 text-slate-900 font-sans shadow-inner">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-900">
              <span>My Business Name</span>
              <span className="text-[8px] text-slate-400">▾</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-600">
                🔍
              </span>
              <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-600">
                QR
              </span>
            </div>
          </div>

          {/* Customer / Supplier Sub-Tabs */}
          <div className="mt-1.5 flex text-[9px] font-bold text-center border-b border-slate-200">
            <div className="flex-1 pb-1 text-[#6451f1] border-b-2 border-[#6451f1]">
              CUSTOMERS
            </div>
            <div className="flex-1 pb-1 text-slate-400">
              SUPPLIERS
            </div>
          </div>

          {/* Quick Metrics Bar in Mobile */}
          <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[9px]">
            <div>
              <div className="text-[8px] text-slate-500 font-medium">You will get</div>
              <div className="text-[11px] font-extrabold text-emerald-600">₹1,200</div>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <div className="text-[8px] text-slate-500 font-medium">You will give</div>
              <div className="text-[11px] font-extrabold text-red-600">₹3,070</div>
            </div>
            <div className="h-5 w-px bg-slate-200" />
            <div className="text-[8px] font-bold text-indigo-600 flex items-center gap-0.5">
              <span>REPORTS</span>
              <span>›</span>
            </div>
          </div>

          {/* Mobile Customer Contact List */}
          <div className="mt-2 space-y-1.5 text-[9px]">
            <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-[8px]">
                  AB
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-none">Arun Batra</div>
                  <div className="text-[7px] text-slate-400">Yesterday</div>
                </div>
              </div>
              <div className="font-bold text-emerald-600 text-[10px]">₹200</div>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[8px]">
                  RJ
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-none">Rajat Jha</div>
                  <div className="text-[7px] text-slate-400">Just now</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-red-600 px-1.5 py-0.5 rounded-full bg-red-50">
                  ₹70 Remind &gt;
                </span>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center font-bold text-[8px]">
                  BJ
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-none">Babita Jain</div>
                  <div className="text-[7px] text-slate-400">2 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-red-600 px-1.5 py-0.5 rounded-full bg-red-50">
                  ₹3,000 Remind &gt;
                </span>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[8px]">
                  AK
                </span>
                <div>
                  <div className="font-bold text-slate-900 leading-none">Aruna Kumar</div>
                  <div className="text-[7px] text-slate-400">4 days ago</div>
                </div>
              </div>
              <div className="font-bold text-emerald-600 text-[10px]">₹1,000</div>
            </div>
          </div>

          {/* Floating Pink/Purple Add Customer Pill on Mobile */}
          <div className="mt-2.5 text-center">
            <button className="w-full py-1.5 rounded-full bg-[#6451f1] text-white text-[9px] font-bold flex items-center justify-center gap-1 shadow-md hover:bg-[#5340eb]">
              <Plus className="w-3 h-3 text-white" />
              <span>+ ADD CUSTOMER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
