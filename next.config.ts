import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statisk eksport → ./out, serveres av nginx i containeren
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
