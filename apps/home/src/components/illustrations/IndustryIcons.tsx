import React from "react";

export function IndustryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  switch (name) {
    case "fine-dine":
      // Covered cloche dish with wine glasses
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 34h36" />
          <path d="M10 34c0-10 6-18 14-18s14 8 14 18" fill="currentColor" fillOpacity="0.1" />
          <path d="M24 10v6" />
          <circle cx="24" cy="8" r="3" fill="currentColor" />
          <path d="M8 20l3-6h4l-2 6" />
          <path d="M40 20l-3-6h-4l2 6" />
          <path d="M12 34v4h24v-4" />
        </svg>
      );
    case "qsr":
      // Fast Food Burger
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 18c0-8 6-12 14-12s14 4 14 12H10z" fill="currentColor" fillOpacity="0.1" />
          <path d="M10 18h28" />
          <path d="M8 24h32" stroke="#6451f1" strokeWidth="3" />
          <path d="M12 30h24" />
          <path d="M10 30c0 6 6 10 14 10s14-4 14-10H10z" fill="currentColor" fillOpacity="0.1" />
          <circle cx="18" cy="12" r="1" fill="currentColor" />
          <circle cx="24" cy="10" r="1" fill="currentColor" />
          <circle cx="30" cy="13" r="1" fill="currentColor" />
        </svg>
      );
    case "cafe":
      // Steaming Coffee Cup with Sleeve
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16l3 24h18l3-24H12z" fill="currentColor" fillOpacity="0.1" />
          <path d="M10 12h28v4H10z" fill="currentColor" fillOpacity="0.2" />
          <rect x="13.5" y="22" width="21" height="10" rx="2" fill="#6451f1" fillOpacity="0.2" stroke="#6451f1" />
          <circle cx="24" cy="27" r="3" fill="#6451f1" />
          <path d="M20 4c0 3 2 4 2 6" stroke="#6451f1" />
          <path d="M28 4c0 3 2 4 2 6" stroke="#6451f1" />
        </svg>
      );
    case "bakery":
      // Bread Loaf / Croissant
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 24c0-10 6-16 14-16s14 6 14 16v12H10V24z" fill="currentColor" fillOpacity="0.1" />
          <path d="M16 16l4 10" stroke="#6451f1" strokeWidth="3" />
          <path d="M24 14l4 12" stroke="#6451f1" strokeWidth="3" />
          <path d="M32 16l4 10" stroke="#6451f1" strokeWidth="3" />
          <path d="M8 36h32" />
        </svg>
      );
    case "ice-cream-desserts":
      // Ice cream pudding with cherry / soft-serve
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c2 14 5 20 12 20s10-6 12-20" fill="currentColor" fillOpacity="0.1" />
          <path d="M14 22c2-4 4-10 10-10s8 6 10 10" />
          <circle cx="24" cy="8" r="4" fill="#6451f1" stroke="#6451f1" />
          <path d="M12 22c4 4 8-2 12 2s8-2 12 2" stroke="#6451f1" strokeWidth="3" />
        </svg>
      );
    case "pizzeria":
      // Pizza Slice with Melting Cheese
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12c16-6 26-4 32 0L24 42 8 12z" fill="currentColor" fillOpacity="0.1" />
          <path d="M8 12c16-6 26-4 32 0" stroke="#6451f1" strokeWidth="4" />
          <circle cx="22" cy="20" r="3" fill="#6451f1" />
          <circle cx="28" cy="28" r="2.5" fill="#6451f1" />
          <circle cx="18" cy="28" r="2" fill="#6451f1" />
        </svg>
      );
    case "bar-brewery":
      // Frothing Beer Mug with Foam
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="12" y="16" width="20" height="24" rx="4" fill="currentColor" fillOpacity="0.1" />
          <path d="M32 20h6a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-6" />
          <path d="M10 16c0-4 4-6 8-6s6 3 8 0 6 3 8 6" fill="#6451f1" fillOpacity="0.2" stroke="#6451f1" strokeWidth="3" />
          <line x1="18" y1="22" x2="18" y2="34" stroke="#6451f1" strokeDasharray="3 3" />
          <line x1="26" y1="22" x2="26" y2="34" stroke="#6451f1" strokeDasharray="3 3" />
        </svg>
      );
    case "food-court":
      // Food Court Stall / Tray with Fork & Knife
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="14" width="32" height="26" rx="4" fill="currentColor" fillOpacity="0.1" />
          <path d="M4 14h40" stroke="#6451f1" strokeWidth="3.5" />
          <path d="M12 6h24v8H12z" fill="#6451f1" fillOpacity="0.2" stroke="#6451f1" />
          <circle cx="24" cy="27" r="7" />
          <line x1="16" y1="22" x2="16" y2="32" />
          <line x1="32" y1="22" x2="32" y2="32" />
        </svg>
      );
    case "cloud-kitchen":
      // Chef Hat with Flame
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 34h20v6H14z" fill="#6451f1" fillOpacity="0.2" stroke="#6451f1" />
          <path d="M14 34c-6 0-8-6-4-10-4-6 2-14 8-12 2-6 10-6 12 0 6-2 12 6 8 12 4 4 2 10-4 10H14z" fill="currentColor" fillOpacity="0.1" />
          <line x1="18" y1="36" x2="18" y2="38" stroke="#6451f1" />
          <line x1="24" y1="36" x2="24" y2="38" stroke="#6451f1" />
          <line x1="30" y1="36" x2="30" y2="38" stroke="#6451f1" />
        </svg>
      );
    case "large-chain":
      // Multi-store chain network
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="20" width="36" height="22" rx="3" fill="currentColor" fillOpacity="0.1" />
          <path d="M4 20l4-10h32l4 10" stroke="#6451f1" strokeWidth="3" />
          <path d="M8 20c0 3 2 5 5 5s5-2 5-5 2 5 5 5 5-2 5-5 2 5 5 5 5-2 5-5" fill="#6451f1" fillOpacity="0.2" />
          <rect x="18" y="28" width="12" height="14" fill="#ffffff" />
        </svg>
      );
    case "retailers-kirana":
      // Supermarket / Kirana Storefront
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 18h32l2 22H6L8 18z" fill="currentColor" fillOpacity="0.1" />
          <path d="M4 18h40" stroke="#6451f1" strokeWidth="3.5" />
          <path d="M6 18l4-10h28l4 10" fill="#6451f1" fillOpacity="0.15" />
          <circle cx="24" cy="30" r="4" fill="#6451f1" />
        </svg>
      );
    case "wholesalers-distributors":
      // Freight Delivery Truck
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="14" width="24" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
          <path d="M30 20h8l4 6v8h-12V20z" fill="#6451f1" fillOpacity="0.15" />
          <circle cx="14" cy="36" r="4" fill="#ffffff" stroke="#6451f1" strokeWidth="3" />
          <circle cx="36" cy="36" r="4" fill="#ffffff" stroke="#6451f1" strokeWidth="3" />
          <line x1="18" y1="36" x2="32" y2="36" />
        </svg>
      );
    case "manufacturers":
      // Factory Plant with Gear & Smokestack
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 38V18l10 8V18l10 8V10h16v28H6z" fill="currentColor" fillOpacity="0.1" />
          <line x1="36" y1="16" x2="36" y2="22" stroke="#6451f1" strokeWidth="3" />
          <line x1="42" y1="16" x2="42" y2="22" stroke="#6451f1" strokeWidth="3" />
          <circle cx="16" cy="32" r="3" fill="#6451f1" />
        </svg>
      );
    case "pharmacy-chemist":
      // Medical Capsule & Rx Cross
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 28l16-16a8.5 8.5 0 0 1 12 12L24 40a8.5 8.5 0 0 1-12-12z" fill="currentColor" fillOpacity="0.1" />
          <line x1="18" y1="22" x2="30" y2="34" stroke="#6451f1" strokeWidth="3" />
          <path d="M28 8h8M32 4v8" stroke="#ef4444" strokeWidth="3" />
        </svg>
      );
    case "electronics-hardware":
      // Smartphone & Screwdriver
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="14" y="8" width="20" height="34" rx="5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="24" cy="36" r="2" fill="#6451f1" />
          <line x1="20" y1="12" x2="28" y2="12" />
          <path d="M34 14l6-6M40 8l-2 2" stroke="#6451f1" strokeWidth="3" />
        </svg>
      );
    case "apparel-footwear":
      // Clothes Hanger & Garment
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="8" r="4" fill="none" />
          <path d="M24 12L8 24h32L24 12z" fill="currentColor" fillOpacity="0.1" stroke="#6451f1" strokeWidth="3" />
          <path d="M14 24v16h20V24" />
        </svg>
      );
    case "services-agencies":
      // Briefcase & Contract Pen
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="16" width="32" height="24" rx="4" fill="currentColor" fillOpacity="0.1" />
          <path d="M18 16V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
          <line x1="8" y1="26" x2="40" y2="26" stroke="#6451f1" strokeWidth="3" />
          <circle cx="24" cy="26" r="3" fill="#6451f1" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fillOpacity="0.1" />
          <circle cx="24" cy="24" r="8" fill="#6451f1" />
        </svg>
      );
  }
}

export function getIndustryIcon(name: string, className = "w-6 h-6") {
  return <IndustryIcon name={name} className={className} />;
}

