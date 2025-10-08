import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Static site export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // PWA 지원을 위한 설정
  // Service Worker를 public/에 배치하여 루트 scope 허용
};

export default nextConfig;
