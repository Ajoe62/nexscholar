/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Next.js 15 with Turbopack
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Reduce bundle size - Remove problematic modularizeImports for now
  // modularizeImports: {
  //   '@heroicons/react/24/outline': {
  //     transform: '@heroicons/react/24/outline/{{member}}',
  //   },
  //   '@heroicons/react/24/solid': {
  //     transform: '@heroicons/react/24/solid/{{member}}',
  //   },
  // },

  // Remove Turbopack CSS config as it conflicts with PostCSS
};

module.exports = nextConfig;
