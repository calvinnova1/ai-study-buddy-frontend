/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Environment variables accessible in the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Disable ESLint during builds (optional - remove in production)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Optimize images
  images: {
    domains: [],
  },

  // Enable experimental features if needed
  experimental: {
    // Add experimental features here if needed
  },
};

module.exports = nextConfig;