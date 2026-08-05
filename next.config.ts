import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ilhjkquwcrpzueeptqqb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
