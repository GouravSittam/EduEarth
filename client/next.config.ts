import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import { getServerUrl } from "./lib/serverUrl";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const serverUrl = getServerUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${serverUrl}/:path*`,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
