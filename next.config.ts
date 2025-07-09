import type { NextConfig } from "next";
 
const withPWA = require('next-pwa')({
  dest: 'public', 
  register: true, 
  skipWaiting: true,  
  disable: process.env.NODE_ENV === 'development',  
});


const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'ik.imagekit.io'], 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
