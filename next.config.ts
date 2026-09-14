import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms-toolkit-artifacts.artlist.io" },
      { protocol: "https", hostname: "ai-toolkit-generations.imgix.net" },
    ],
  },
  async redirects() {
    return [
      // Legacy single-demo paths from before the factory: anything already sent
      // to a prospect keeps working.
      { source: "/app", destination: "/sousa/app", permanent: false },
      { source: "/manifest.json", destination: "/sousa/manifest.webmanifest", permanent: false },
      // English-speaking prospects reaching for the obvious spelling.
      { source: "/:slug/proposal", destination: "/:slug/propuesta", permanent: false },
    ];
  },
};

export default nextConfig;
