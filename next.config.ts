import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms-toolkit-artifacts.artlist.io" },
      { protocol: "https", hostname: "ai-toolkit-generations.imgix.net" },
    ],
  },
};

export default nextConfig;
