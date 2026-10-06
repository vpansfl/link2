import type { Metadata } from "next";

export const SITE_NAME = "링크";
export const SITE_DESCRIPTION =
  "자주 찾는 웹페이지를 폴더별로 저장하고 한눈에 모아 보는 무료 북마크 서비스. 개발, 디자인, 뉴스 등 관심사별로 링크를 정리해 보세요.";
// 대표 주소(canonical), sitemap, 썸네일 등 절대 주소의 기준 (배포 시 NEXT_PUBLIC_SITE_URL에 실제 도메인 설정)
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
export const SITE_KEYWORDS = [
  "북마크",
  "북마크 관리",
  "링크 저장",
  "링크 정리",
  "즐겨찾기",
  "즐겨찾기 정리",
  "웹페이지 저장",
  "폴더 정리",
];

// app/opengraph-image.tsx가 만드는 공유 썸네일
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "링크 - 자주 찾는 웹페이지를 폴더별로 저장하는 북마크 서비스",
};

type PageMetadataOptions = {
  // 없으면 사이트 기본 제목("링크")을 그대로 사용
  title?: string;
  description: string;
  // 이 페이지의 대표 주소 경로 (검색엔진이 같은 내용의 다른 주소를 이 주소로 묶음)
  path: string;
  // 검색 결과에 노출하지 않을 페이지 (로그인 후 화면, 계정 복구 화면 등)
  noindex?: boolean;
};

// 페이지마다 제목·설명·대표 주소·검색 노출 여부를 검색엔진용 태그와 공유용 태그(og:, twitter:)에 함께 넣어줌
// (페이지의 openGraph는 상위 설정을 통째로 덮어쓰므로 사이트 공통 값과 썸네일도 함께 지정)
export function pageMetadata({ title, description, path, noindex }: PageMetadataOptions): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    robots: noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE] },
  };
}

// 검색엔진이 사이트 정보를 이해하도록 돕는 구조화 데이터 (schema.org JSON-LD)
export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "ko-KR",
    },
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      inLanguage: "ko-KR",
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
  ],
};
