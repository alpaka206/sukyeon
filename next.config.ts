import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

function nextConfig(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    experimental: {
      serverActions: {
        bodySizeLimit: "21mb",
      },
    },
    images: {
      remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
      unoptimized: true,
    },
  };
}

export default nextConfig;
