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
