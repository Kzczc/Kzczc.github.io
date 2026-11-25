import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 关闭 Next.js 图片优化，直接使用原始分辨率 */
  images: {
    unoptimized: true,
  },
  /* 小向导姿势图缓存一周；替换图片时请换文件名，否则老访客一周内仍会看到旧图 */
  async headers() {
    return [
      {
        source: "/images/companion/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
