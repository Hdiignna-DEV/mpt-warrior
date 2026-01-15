import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    unoptimized: false,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  turbopack: {
    resolveAlias: {},
  },
};

export default nextConfig;
