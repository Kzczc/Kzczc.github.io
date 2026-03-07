import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 关闭 Next.js 图片优化，直接使用原始分辨率 */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
