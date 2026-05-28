import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '/home/marco/launchly',
  },
  // Exclude API and contracts from the build
  webpack: (config) => {
    config.externals = [...(config.externals || []), "express", "cors"];
    return config;
  },
};

export default nextConfig;
