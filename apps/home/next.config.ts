import type { NextConfig } from "next";

const localInvoiceOrigin = "http://localhost:3001";
const invoiceAppOrigin = (
  process.env.INVOICE_APP_ORIGIN ?? localInvoiceOrigin
).replace(/\/$/, "");
const isVercelDeployment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "production";

  console.log("Invoice app origin:", invoiceAppOrigin);
if (
  isVercelDeployment &&
  (!process.env.INVOICE_APP_ORIGIN ||
    /^https?:\/\/localhost(?::\d+)?$/i.test(localInvoiceOrigin))
) {
  throw new Error(
    "INVOICE_APP_ORIGIN must point to the deployed invoice zone on Vercel. Deploy apps/invoice as a separate Vercel project and set INVOICE_APP_ORIGIN in the apps/home project to that deployment URL or custom domain.",
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
