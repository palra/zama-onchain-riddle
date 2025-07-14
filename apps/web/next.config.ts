import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['jotai-devtools', '@repo/contracts'],
};

export default nextConfig;
