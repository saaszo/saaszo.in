"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Sparkles, Send, PhoneCall, Headphones, Calendar } from "lucide-react";

export function BookDemoSection() {
  const [selectedProduct, setSelectedProduct] = useState<string>("POS");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    businessName: "",
  });

  const products = ["POS", "Invoice", "Payroll", "Tasks", "Purchase"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="demo" className="py-20 md:py-28 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Book a Free Demo
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Book a 10-minute live demo to see how SaaSzo POS can work for your business.*
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50/70 rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-xl">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-md text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">Demo Request Confirmed!</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Our POS specialist will call you at <strong>+91 {formData.phone || "your number"}</strong> within 15 minutes to schedule your live screen share.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Book Another Demo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Name<span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email<span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@shreeganesh.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone number<span className="text-amber-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-bold text-slate-600">
                        India (+91)
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-r-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      City<span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Start typing your city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Business Name<span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shree Ganesh Supermarket"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-xs"
                  />
                </div>

                {/* Product Interest Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Which product are you interested in?<span className="text-amber-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {products.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setSelectedProduct(p)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          selectedProduct === p
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-yellow-400/30 transition-all duration-200 cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: SaaSzo 24/7 Support Line Art Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-lg group">
              <Image
                src="/illustrations/demo-support-lineart.jpg"
                alt="SaaSzo 24/7 Support and Demo Team"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600">
              <Headphones className="w-4 h-4 text-amber-500" />
              <span>Dedicated 24/7 Onboarding &amp; Training Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
