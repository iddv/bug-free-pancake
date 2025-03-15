/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration for development server to be accessible on local network
  async rewrites() {
    return [];
  },
  // This will allow your dev server to accept connections from devices on your network
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig; 