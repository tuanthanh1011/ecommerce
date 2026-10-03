import type { NextConfig } from "next";
import { resolve } from "path";
import { config as loadEnv } from "dotenv";

// Single `.env` lives at the monorepo root, not per-app.
loadEnv({ path: resolve(__dirname, "../../.env"), quiet: true });

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
