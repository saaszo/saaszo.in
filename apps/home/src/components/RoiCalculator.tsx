"use client";

import React, { useState } from "react";
import { Calculator, Clock, IndianRupee, TrendingUp, Sparkles, CheckCircle } from "lucide-react";

export function RoiCalculator() {
  const [dailyBills, setDailyBills] = useState<number>(35);
  const [avgBillValue, setAvgBillValue] = useState<number>(1200);

  // Formulas
  // Manual billing time: ~4 minutes per bill vs SaaSzo: ~15 seconds per bill.
  // Savings: ~3.75 mins per bill * dailyBills * 30 days
  const hoursSavedPerMonth = Math.round((dailyBills * 3.75 * 30) / 60);
  
  // Payment Recovery speed: ~5% faster recovery of outstanding dues
  const monthlyRevenue = dailyBills * avgBillValue * 30;
  const fasterRecoveryAmount = Math.round(monthlyRevenue * 0.08);

  // Accounting & CA audit prep savings (hours + paper + printing cost)
  const estimatedCostSavings = Math.round(dailyBills * 4.5 * 30 + 3500);

  return (
    <section className="py-20 md:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Business ROI Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight">
            Calculate How Much Time &amp; Money SaaSzo Saves You
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            See the direct impact of high-speed counter billing, automated WhatsApp payment reminders, and instant GSTR reporting.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Sliders Input Side */}
            <div className="lg:col-span-6 space-y-8">
              {/* Slider 1: Daily Bills */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Average Invoices / Bills per Day
                  </label>
                  <span className="text-xl font-bold text-indigo-400 bg-indigo-950/70 px-3 py-1 rounded-lg border border-indigo-800">
                    {dailyBills} bills
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={dailyBills}
                  onChange={(e) => setDailyBills(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>5 bills/day (Small Store)</span>
                  <span>200 bills/day (Supermarket / Wholesaler)</span>
                </div>
              </div>

              {/* Slider 2: Average Bill Value */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-300">
                    Average Invoice Value (₹)
                  </label>
                  <span className="text-xl font-bold text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-800">
                    ₹{avgBillValue.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="25000"
                  step="200"
                  value={avgBillValue}
                  onChange={(e) => setAvgBillValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>₹200 (Retail)</span>
                  <span>₹25,000+ (Wholesale / B2B)</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes WhatsApp payment reminder automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Includes local offline SQLite engine &amp; thermal POS print</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% GSTR-1, GSTR-3B &amp; Profit/Loss accounting export</span>
                </div>
              </div>
            </div>

            {/* Results Display Side */}
            <div className="lg:col-span-6 bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Your Estimated Monthly Gains</span>
              </h3>

              {/* Metric 1 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-indigo-900/60 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Billing Time Saved</div>
                    <div className="text-sm text-slate-300 font-semibold">Over manual entry</div>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-400">
                  {hoursSavedPerMonth} hrs<span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-900/60 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Faster Payment Recovery</div>
                    <div className="text-sm text-slate-300 font-semibold">Via auto WhatsApp UPI</div>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ₹{fasterRecoveryAmount.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-900/60 text-amber-400">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Monthly Cost Reduction</div>
                    <div className="text-sm text-slate-300 font-semibold">Paper, errors &amp; prep</div>
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  ₹{estimatedCostSavings.toLocaleString("en-IN")}
                </div>
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <a
                  href="#downloads"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg transition-all"
                >
                  Start Saving Time with SaaSzo Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
