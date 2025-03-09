import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [], // Empty array as we'll use local images only
    remotePatterns: [], // No remote patterns as we don't want external images
  },
  // Adding React strict mode to help identify issues
  reactStrictMode: true,
  // Adding onDemandEntries configuration to improve development experience
  onDemandEntries: {
    // Keep the pages in memory longer to avoid rebuilding them too often
    maxInactiveAge: 25 * 1000,
    // Limit the number of pages in memory
    pagesBufferLength: 5,
  },
};

export default nextConfig;
