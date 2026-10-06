import type { MetadataRoute } from "next";
import { SITE_URL } from "./_lib/metadata";

// 검색엔진 수집 규칙 (/robots.txt)
// 로그인해야 하는 화면과 인증 처리 경로는 수집하지 않음
// (비밀번호 찾기처럼 noindex 태그로 제외하는 페이지는 태그를 읽을 수 있게 막지 않음)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/new", "/reset-password", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
