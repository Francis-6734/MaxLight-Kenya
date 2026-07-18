import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/bx0aqcem/**",
      },
    ],
  },
  experimental: {
    // Disabled: this environment's disk I/O makes Turbopack's persistent
    // dev cache writes take minutes instead of milliseconds.
    turbopackFileSystemCacheForDev: false,
    // Default is 1MB; admin content/product image uploads go through
    // Server Actions and need headroom for the 5MB image cap in upload.ts.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
