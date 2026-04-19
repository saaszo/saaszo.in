import type { NextConfig } from "next";

const localInvoiceOrigin = "http://localhost:3001";
const invoiceAppOrigin = (
  process.env.INVOICE_APP_ORIGIN ?? localInvoiceOrigin
).replace(/\/$/, "");
const isVercelDeployment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "production";

if (isVercelDeployment && !process.env.INVOICE_APP_ORIGIN) {
  throw new Error(
    `INVOICE_APP_ORIGIN is missing for the apps/home Vercel project in ${process.env.VERCEL_ENV}. Vercel environment variables are scoped per project and environment, so set INVOICE_APP_ORIGIN on the home project for this environment to the deployed invoice URL or custom domain.`,
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
