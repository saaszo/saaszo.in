import React from "react";

// 1. Hero 2D Character Illustration: Modern Indian Retailer / Business Owner using Tablet POS & Barcode Scanner
export function HeroMerchantIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="heroBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.08" floodColor="#1E1B4B" />
        </filter>
      </defs>

      {/* Background Decorative Blob */}
      <rect x="20" y="20" width="500" height="360" rx="28" fill="url(#heroBgGrad)" opacity="0.7" />
      <circle cx="460" cy="80" r="48" fill="#C7D2FE" opacity="0.4" />
      <circle cx="80" cy="320" r="36" fill="#FDE68A" opacity="0.5" />

      {/* Grid pattern backdrop */}
      <g stroke="#CBD5E1" strokeWidth="1" opacity="0.4" strokeDasharray="4 4">
        <line x1="60" y1="80" x2="480" y2="80" />
        <line x1="60" y1="160" x2="480" y2="160" />
        <line x1="60" y1="240" x2="480" y2="240" />
        <line x1="60" y1="320" x2="480" y2="320" />
      </g>

      {/* Retail Counter Base */}
      <rect x="70" y="250" width="400" height="110" rx="16" fill="#1E293B" filter="url(#shadowFilter)" />
      <rect x="85" y="265" width="370" height="8" rx="4" fill="#334155" />
      <rect x="100" y="290" width="120" height="50" rx="8" fill="#0F172A" />
      <rect x="240" y="290" width="210" height="50" rx="8" fill="#0F172A" />

      {/* POS Terminal Screen (Desktop / Tablet) */}
      <rect x="130" y="110" width="180" height="125" rx="12" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" filter="url(#shadowFilter)" />
      <rect x="140" y="120" width="160" height="24" rx="6" fill="#4F46E5" />
      <circle cx="152" cy="132" r="4" fill="#F87171" />
      <circle cx="164" cy="132" r="4" fill="#FBBF24" />
      <circle cx="176" cy="132" r="4" fill="#34D399" />
      <rect x="200" y="128" width="60" height="8" rx="4" fill="#C7D2FE" />
      {/* Tablet Content Lines */}
      <rect x="142" y="152" width="75" height="8" rx="4" fill="#E2E8F0" />
      <rect x="142" y="166" width="95" height="8" rx="4" fill="#E2E8F0" />
      <rect x="142" y="180" width="60" height="8" rx="4" fill="#E2E8F0" />
      <rect x="235" y="152" width="65" height="58" rx="8" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
      <rect x="245" y="162" width="45" height="12" rx="4" fill="#10B981" />
      <rect x="245" y="182" width="45" height="16" rx="4" fill="#4F46E5" />
      {/* POS Stand */}
      <polygon points="205,235 235,235 245,260 195,260" fill="#64748B" />

      {/* Thermal Receipt Printer with Paper Coming Out */}
      <rect x="80" y="195" width="45" height="42" rx="8" fill="#334155" stroke="#1E293B" strokeWidth="2" />
      <rect x="88" y="202" width="29" height="4" rx="2" fill="#10B981" />
      {/* Curled Thermal Bill */}
      <path d="M 87 200 L 87 150 Q 87 145 92 145 L 113 145 Q 118 145 118 150 L 118 200 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="92" y1="156" x2="113" y2="156" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="92" y1="164" x2="108" y2="164" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="92" y1="172" x2="113" y2="172" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="92" y1="180" x2="105" y2="180" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

      {/* 2D Flat Character: Business Owner / Shopkeeper */}
      {/* Body / Shirt */}
      <path d="M 335 300 L 335 220 Q 335 180 375 175 Q 415 180 415 220 L 415 300 Z" fill="#4F46E5" />
      {/* Collar */}
      <polygon points="375,190 360,175 390,175" fill="#FFFFFF" />
      <polygon points="375,190 370,240 380,240" fill="#312E81" />
      {/* Character Neck */}
      <rect x="366" y="145" width="18" height="22" rx="4" fill="#FDBA74" />
      {/* Character Head */}
      <circle cx="375" cy="125" r="28" fill="#FDBA74" />
      {/* Hair */}
      <path d="M 347 122 Q 350 95 375 95 Q 402 95 403 120 Q 395 105 375 105 Q 355 105 347 122 Z" fill="#1E1B4B" />
      {/* Eyeglasses */}
      <rect x="358" y="118" width="14" height="10" rx="3" fill="none" stroke="#1E1B4B" strokeWidth="2" />
      <rect x="378" y="118" width="14" height="10" rx="3" fill="none" stroke="#1E1B4B" strokeWidth="2" />
      <line x1="372" y1="123" x2="378" y2="123" stroke="#1E1B4B" strokeWidth="2" />
      {/* Smile */}
      <path d="M 368 138 Q 375 144 382 138" fill="none" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />

      {/* Character Left Arm holding Barcode Scanner */}
      <path d="M 345 205 Q 320 220 300 200" fill="none" stroke="#4F46E5" strokeWidth="18" strokeLinecap="round" />
      <circle cx="295" cy="195" r="8" fill="#FDBA74" />
      {/* Barcode Scanner Gun */}
      <rect x="270" y="180" width="30" height="16" rx="4" fill="#0F172A" transform="rotate(-15 270 180)" />
      <rect x="282" y="192" width="10" height="22" rx="3" fill="#334155" transform="rotate(-15 282 192)" />
      {/* Red Laser Scan Beam */}
      <line x1="260" y1="175" x2="185" y2="170" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.85" />

      {/* Floating Feature Badges around character */}
      {/* Badge 1: 100% Offline Badge */}
      <g filter="url(#shadowFilter)">
        <rect x="36" y="55" width="135" height="38" rx="19" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="55" cy="74" r="11" fill="#10B981" />
        <path d="M 50 74 L 54 78 L 61 70" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="73" y="79" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">100% Offline</text>
      </g>

      {/* Badge 2: UPI Instant QR Badge */}
      <g filter="url(#shadowFilter)">
        <rect x="365" y="45" width="145" height="42" rx="21" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="387" cy="66" r="13" fill="#4F46E5" />
        <text x="382" y="71" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="sans-serif">₹</text>
        <text x="408" y="65" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="sans-serif">Instant UPI QR</text>
        <text x="408" y="78" fill="#10B981" fontSize="10" fontWeight="600" fontFamily="sans-serif">Auto-settled</text>
      </g>

      {/* Badge 3: 8-Second GST Bill Badge */}
      <g filter="url(#shadowFilter)">
        <rect x="380" y="275" width="135" height="38" rx="19" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="1.5" />
        <circle cx="399" cy="294" r="11" fill="#F59E0B" />
        <text x="395" y="298" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">⚡</text>
        <text x="417" y="298" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="sans-serif">GST Bill in 8s</text>
      </g>
    </svg>
  );
}

// 2. Fast Invoicing Line Art Illustration
export function FastBillingVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#EEF2FF" />
      <rect x="22" y="16" width="36" height="48" rx="6" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
      <line x1="30" y1="26" x2="50" y2="26" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="45" y2="34" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="42" x2="48" y2="42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="48" cy="50" r="12" fill="#10B981" />
      <path d="M 43 50 L 46 53 L 53 46" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 3. Smart Inventory & Stock Vector
export function InventoryStockVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
      {/* 3D Flat Box Isometric */}
      <polygon points="40,20 60,30 40,40 20,30" fill="#10B981" stroke="#047857" strokeWidth="2" />
      <polygon points="20,30 40,40 40,62 20,52" fill="#059669" stroke="#047857" strokeWidth="2" />
      <polygon points="60,30 40,40 40,62 60,52" fill="#34D399" stroke="#047857" strokeWidth="2" />
      {/* Barcode Tape on Box */}
      <line x1="36" y1="36" x2="44" y2="32" stroke="#FFFFFF" strokeWidth="2" />
      <line x1="38" y1="39" x2="46" y2="35" stroke="#FFFFFF" strokeWidth="2" />
      {/* Alert Badge */}
      <circle cx="56" cy="24" r="10" fill="#F59E0B" />
      <text x="53" y="28" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">!</text>
    </svg>
  );
}

// 4. WhatsApp & UPI Payment Recovery Vector
export function PaymentRecoveryVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#FEF3C7" />
      {/* Smartphone */}
      <rect x="26" y="16" width="28" height="48" rx="6" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
      <rect x="30" y="24" width="20" height="30" rx="3" fill="#25D366" opacity="0.15" />
      {/* WhatsApp Message Bubble */}
      <rect x="32" y="28" width="16" height="12" rx="3" fill="#25D366" />
      <text x="36" y="37" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">₹</text>
      {/* Success Tick Badge */}
      <circle cx="52" cy="50" r="11" fill="#10B981" />
      <path d="M 47 50 L 50 53 L 57 46" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 5. Bluetooth Thermal POS Printing Vector
export function ThermalPrinterVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#F3E8FF" />
      {/* Thermal Printer body */}
      <rect x="20" y="32" width="40" height="32" rx="8" fill="#1E293B" stroke="#7C3AED" strokeWidth="2.5" />
      <rect x="28" y="38" width="24" height="4" rx="2" fill="#10B981" />
      {/* Feed receipt paper */}
      <rect x="26" y="14" width="28" height="22" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="30" y1="19" x2="48" y2="19" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="24" x2="42" y2="24" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="29" x2="50" y2="29" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 6. CA & GSTR Accounting Vector
export function GstrAccountingVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#EFF6FF" />
      <rect x="20" y="18" width="40" height="44" rx="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
      {/* Bar charts inside */}
      <rect x="28" y="42" width="5" height="12" rx="2" fill="#93C5FD" />
      <rect x="36" y="34" width="5" height="20" rx="2" fill="#3B82F6" />
      <rect x="44" y="26" width="5" height="28" rx="2" fill="#1D4ED8" />
      {/* Trend upward arrow */}
      <path d="M 27 34 L 37 26 L 47 20 L 53 22" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 7. Offline SQLite Engine Vector
export function OfflineEngineVector({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#F1F5F9" />
      {/* Database cylinders */}
      <ellipse cx="40" cy="24" rx="18" ry="7" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
      <path d="M 22 24 L 22 40 Q 40 48 58 40 L 58 24" fill="#475569" stroke="#0F172A" strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="18" ry="7" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
      <path d="M 22 40 L 22 56 Q 40 64 58 56 L 58 40" fill="#334155" stroke="#0F172A" strokeWidth="2" />
      <ellipse cx="40" cy="56" rx="18" ry="7" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
      {/* Green lightning bolt on top */}
      <path d="M 42 12 L 35 24 L 41 24 L 37 36 L 47 22 L 41 22 Z" fill="#10B981" stroke="#065F46" strokeWidth="1" />
    </svg>
  );
}
