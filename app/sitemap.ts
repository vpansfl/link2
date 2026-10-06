import type { MetadataRoute } from "next";
import { SITE_URL } from "./_lib/metadata";

// 검색 결과에 노출할 페이지 목록 (/sitemap.xml)
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/signup`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
