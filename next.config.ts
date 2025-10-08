import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  output: 'export', // Static site export for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  // PWA 지원을 위한 설정
  // Service Worker를 public/에 배치하여 루트 scope 허용

  // 성능 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 실험적 기능 (성능 향상)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withBundleAnalyzer(nextConfig);
