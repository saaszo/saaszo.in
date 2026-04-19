import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  basePath: "/invoice",
  assetPrefix: "/invoice-static",
};

export default nextConfig;
