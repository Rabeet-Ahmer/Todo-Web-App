import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "./",
  },
  // Fix for Prisma "Cannot find module" error
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;