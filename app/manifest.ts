import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "./_lib/metadata";

// 웹 앱 정보 (/manifest.webmanifest): 홈 화면 추가 시 이름·아이콘·색상
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - 폴더별로 정리하는 북마크 서비스`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "ko",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#ffffff",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
