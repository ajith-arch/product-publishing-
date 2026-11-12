import type { NextConfig } from "next";

/**
 * Static export so the prototype can be hosted on GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH is set by the Pages workflow (e.g. "/product-publishing-");
 * it is empty for local development.
 * When server-side AI calls are added (Milestone 4), static export must be revisited.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
