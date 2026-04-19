import type { NextConfig } from "next";

const invoiceAppOrigin = (
  process.env.INVOICE_APP_ORIGIN ?? "http://localhost:3002"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
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
    ];
  },
};

export default nextConfig;
