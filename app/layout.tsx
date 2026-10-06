import type { Metadata, Viewport } from "next";
import {
  pageMetadata,
  SITE_DESCRIPTION,
  SITE_JSON_LD,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "./_lib/metadata";
import "./globals.css";

// 아이콘은 app/favicon.ico, 공유 썸네일은 app/opengraph-image.tsx,
// robots.txt·sitemap.xml·manifest는 app/robots.ts·sitemap.ts·manifest.ts가 파일 규칙으로 자동 연결됨
export const metadata: Metadata = {
  ...pageMetadata({ description: SITE_DESCRIPTION, path: "/" }),
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 폴더별로 정리하는 북마크 서비스`,
    // 하위 페이지의 title이 "로그인"이면 "로그인 | 링크"로 표시
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  category: "productivity",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // 숫자·주소를 전화번호 등으로 자동 링크 처리하지 않음
  formatDetection: { telephone: false, email: false, address: false },
  // 구글 서치 콘솔·네이버 서치어드바이저 소유 확인 (환경 변수에 발급받은 값을 넣으면 태그가 생성됨)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // 모바일 브라우저 주소창 색 (globals.css의 --card)
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // 문자열 안의 "<"를 이스케이프해 스크립트 주입을 막음
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
