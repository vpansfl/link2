import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 로그인 없이 들어갈 수 있는 경로 (하위 경로 포함)
// 인덱스(/, 폴더별 /?folder=)는 따로 허용: 로그아웃 상태에선 기본 데이터만 보여줌
// 공유 썸네일·robots.txt·sitemap.xml·manifest는 검색엔진·외부 서비스가 로그인 없이 가져가야 함
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/auth",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

// 요청마다 Supabase 로그인 세션을 확인하고, 만료된 토큰은 갱신해 쿠키에 다시 담아 보냄
export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        // 토큰이 담긴 응답이 캐시되지 않도록 Supabase가 주는 헤더도 함께 설정
        Object.entries(headers ?? {}).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        );
      },
    },
  });

  // 이 호출이 있어야 세션 확인/갱신이 실제로 일어남 (이 사이에 다른 코드를 넣지 말 것)
  const { data } = await supabase.auth.getClaims();

  // 로그인하지 않았으면 공개 페이지(로그인·회원가입·메일 인증) 외에는 로그인 페이지로 보냄
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === "/" ||
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!data?.claims && !isPublic) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    // 갱신된 세션 쿠키가 있으면 리다이렉트 응답에도 그대로 실어 보냄
    supabaseResponse.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return supabaseResponse;
};
