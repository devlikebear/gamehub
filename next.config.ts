import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static site export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
