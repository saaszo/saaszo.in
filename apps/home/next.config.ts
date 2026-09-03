import type { NextConfig } from "next";

const localInvoiceOrigin = "http://localhost:3001";
const hostedInvoiceOrigin = "https://saaszo-invoice.vercel.app";
const isVercelDeployment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "production";
const invoiceAppOrigin = (
  process.env.INVOICE_APP_ORIGIN ??
  (isVercelDeployment ? hostedInvoiceOrigin : localInvoiceOrigin)
).replace(/\/$/, "");
const digitalApiOrigin = (() => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_DIGITAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configuredUrl) return null;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return null;
  }
})();
const connectSrcOrigins = [
  "https://api.saaszo.in",
  "https://*.googleapis.com",
  "https://identitytoolkit.googleapis.com",
  "https://securetoken.googleapis.com",
  "https://*.firebaseio.com",
  "wss://*.firebaseio.com",
  "https://accounts.google.com",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://www.googletagmanager.com",
  ...(digitalApiOrigin && digitalApiOrigin !== "https://api.saaszo.in"
    ? [digitalApiOrigin]
    : []),
];
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com https://www.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Firebase SDK + reCAPTCHA load scripts from apis.google.com and gstatic.com
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://apis.google.com https://www.gstatic.com https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com",
  "script-src-elem 'self' 'unsafe-inline' blob: https://apis.google.com https://www.gstatic.com https://www.google.com https://www.googletagmanager.com https://www.google-analytics.com",
  "worker-src 'self' blob:",
  // frame-src: Firebase Auth popup uses hidden iframes on firebaseapp.com;
  // Google OAuth popup embeds accounts.google.com; phone OTP uses google.com reCAPTCHA
  "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com",
  `connect-src 'self' ${connectSrcOrigins.join(" ")}`,
  "form-action 'self' https://www.saaszo.in https://saaszo.in",
  "upgrade-insecure-requests",
].join("; ");

if (isVercelDeployment && !process.env.INVOICE_APP_ORIGIN) {
  console.warn(
    `INVOICE_APP_ORIGIN is missing for the apps/home Vercel project in ${process.env.VERCEL_ENV}. Falling back to ${hostedInvoiceOrigin}. Set INVOICE_APP_ORIGIN explicitly in Vercel to override this.`,
  );
}

if (
  isVercelDeployment &&
  /^https?:\/\/localhost(?::\d+)?$/i.test(invoiceAppOrigin)
) {
  throw new Error(
    "INVOICE_APP_ORIGIN cannot point to localhost on Vercel. Set it to the deployed apps/invoice URL or custom domain instead.",
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    // Firebase signInWithPopup requires window.closed polling and window.close()
    // on the cross-origin Google OAuth popup. COOP "same-origin-allow-popups"
    // blocks these calls (Chrome shows COOP policy warnings and popup may hang).
    // "unsafe-none" is the browser default — it removes COOP restrictions so
    // Firebase's popup flow works correctly on all browsers.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
      {
        source: "/register",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
      {
        source: "/forgot-password",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
      {
        source: "/reset-password",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "saaszo.in",
          },
        ],
        destination: "https://www.saaszo.in/:path*",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/register",
        permanent: false,
      },
      {
        source: "/login",
        destination: "/auth",
        permanent: false,
      },
      {
        source: "/setup",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/pricing",
        destination: "/dashboard/billing",
        permanent: false,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/about.php",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/approach.php",
        destination: "/approach",
        permanent: true,
      },
      {
        source: "/blog.php",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog-single.php",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/careers.php",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/contact.php",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/creator-program.php",
        destination: "/creator-program",
        permanent: true,
      },
      {
        source: "/guest-post.php",
        destination: "/creator-program",
        permanent: true,
      },
      {
        source: "/job.php",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/packages.php",
        destination: "/packages",
        permanent: true,
      },
      {
        source: "/rss.php",
        destination: "/rss.xml",
        permanent: true,
      },
      {
        source: "/services.php",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/team.php",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/pages/audit.php",
        destination: "/audit",
        permanent: true,
      },
      {
        source: "/pages/industries.php",
        destination: "/industries",
        permanent: true,
      },
      {
        source: "/pages/privacy.php",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/pages/terms.php",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/pages/services/:slug.php",
        destination: "/services/:slug",
        permanent: true,
      },
      {
        source: "/pages/industries/:slug.php",
        destination: "/industries/:slug",
        permanent: true,
      },
      {
        source: "/tools/index.php",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/tools/:slug.php",
        destination: "/tools/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/invoice",
          destination: `${invoiceAppOrigin}/invoice`,
        },
        {
          source: "/invoice/:path+",
          destination: `${invoiceAppOrigin}/invoice/:path+`,
        },
        {
          source: "/invoice-static/:path+",
          destination: `${invoiceAppOrigin}/invoice-static/:path+`,
        },
      ],
    };
  },
};

export default nextConfig;
