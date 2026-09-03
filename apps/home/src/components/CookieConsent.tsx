"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("saaszo_cookie_consent");
      if (!consent) {
        // Slight delay so it does not jump abruptly on page load
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if localStorage is inaccessible
    }
  }, []);

  const handleAccept = (type: "all" | "essential") => {
    try {
      localStorage.setItem("saaszo_cookie_consent", type);
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-5 text-slate-800 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">
              Cookie &amp; Storage Preferences
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              Zero tracking cookies sold
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAccept("essential")}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
        We use strictly essential session cookies and local SQLite storage to maintain secure authentication and allow you to bill customers offline. Learn more in our{" "}
        <Link
          href="/cookies"
          className="text-indigo-600 font-medium underline underline-offset-2 hover:text-indigo-700"
        >
          Cookie Policy
        </Link>
        .
      </p>

      <div className="mt-4 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleAccept("all")}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs text-center"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleAccept("essential")}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors text-center"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
