import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, 
        },
      },
    },
    {
      urlPattern: "/^https?:\/\/.*/api\/.*/",
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-calls',
        expiration: {
          maxEntries: 50, 
          maxAgeSeconds: 5 * 60,
        },
        // Optionally, add a background sync plugin for POST/PATCH if needed
        // plugins: [
        //   {
        //     cacheWillUpdate: async ({ request, response }) => {
        //       // Only cache 200 OK responses
        //       if (response.ok) {
        //         return response;
        //       }
        //       return null;
        //     },
        //   },
        // ],
      }
    },
  ],
});

 
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'ik.imagekit.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};
 
module.exports = withBundleAnalyzer(withPWA(nextConfig));
