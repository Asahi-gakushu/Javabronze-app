import type { NextConfig } from "next";

// Static export so the site can be hosted for free (GitHub Pages, Cloudflare Pages, Vercel).
// NEXT_PUBLIC_BASE_PATH is set by the GitHub Pages workflow (e.g. "/Javabronze-app").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
