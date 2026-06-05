import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',       // 静态导出，生成纯 HTML/CSS/JS，可部署任意静态托管
  trailingSlash: true,    // 保证静态路由兼容
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,    // 静态导出必须禁用 Next.js 图片优化服务
  },
};

export default nextConfig;
