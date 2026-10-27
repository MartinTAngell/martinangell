import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      { source: '/resume', destination: '/resume.pdf'},
      { source: '/learnsph', destination: '/publications/learnsph.pdf'}
    ]
  }
};

export default nextConfig;
