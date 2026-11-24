import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps generated build output separate from source files.
  distDir: ".next-build",
};

export default nextConfig;
