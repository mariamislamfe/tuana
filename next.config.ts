import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Dashboard video uploads (up to 50MB) go through a Server Action.
    serverActions: { bodySizeLimit: "55mb" },
  },
  images: {
    // Dashboard-managed images can be uploads (/uploads/...) or any https URL
    // an admin pastes in, so remote images are allowed from any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
