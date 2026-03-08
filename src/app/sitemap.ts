import type { MetadataRoute } from "next";

/**
 * Next.js 内置 sitemap 生成器
 * 自动在 /sitemap.xml 提供站点地图
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kzczc.github.io";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/#publications`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#journey`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#awards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
