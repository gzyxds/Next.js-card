/**
 * 网站地图（Sitemap）
 *
 * 自动生成为搜索引擎提供完整站点 URL 索引。
 * 符合 sitemap.org XML 协议标准，Next.js App Router 自动输出为 /sitemap.xml。
 */
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  /** 站点基础 URL（生产环境请替换为实际域名） */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.urlka.cn";

  /* ===== 优先级定义 ===== */
  /** 首页 — 最高优先级 */
  const HOME = 1;
  /** 大流量卡列表页 — 高优先级 */
  const FLOW_CARD_LIST = 0.9;
  /** 代理加盟 — 高优先级 */
  const AGENT = 0.8;
  /** 其他功能页 — 中优先级 */
  const FUNCTIONAL = 0.7;
  /** 辅助页面 — 较低优先级 */
  const AUXILIARY = 0.6;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: HOME,
    },
    {
      url: `${baseUrl}/haoka`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/lotml`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/linxi`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/kakatx`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/yky`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: AGENT,
    },
    {
      url: `${baseUrl}/cps`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: AUXILIARY,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: FUNCTIONAL,
    },
    {
      url: `${baseUrl}/cooperate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: FUNCTIONAL,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: FLOW_CARD_LIST,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: FUNCTIONAL,
    },
  ];
}
