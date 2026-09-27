import type { NextConfig } from "next";

// 静的エクスポートにして無料でホスティングできるようにする（GitHub Pages / Cloudflare Pages / Vercel）。
// NEXT_PUBLIC_BASE_PATH は GitHub Pages のワークフローが設定する（例: "/Javabronze-app"）。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
