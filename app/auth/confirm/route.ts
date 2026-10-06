import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 인증·비밀번호 재설정 메일의 링크, 카카오 로그인을 마치면 들어오는 곳:
// 인증을 마치고 로그인 세션을 쿠키에 담은 뒤 인덱스(재설정 메일이면 ?next=로 받은 재설정 페이지)로 보냄
// 기본 메일 템플릿은 ?code=, token_hash 방식 템플릿은 ?token_hash=&type= 으로 들어옴

// 다른 사이트로 보내는 데 악용되지 않도록 ?next=는 정해진 경로만 허용
const ALLOWED_NEXT_PATHS = ["/reset-password"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next");
  const next = nextParam && ALLOWED_NEXT_PATHS.includes(nextParam) ? nextParam : "/";

  // 카카오 등 소셜 로그인을 취소했거나 실패하면 ?error=로 돌아옴
  if (searchParams.has("error")) {
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  const supabase = createClient(await cookies());
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    failed = Boolean(error);
  }

  return NextResponse.redirect(failed ? `${origin}/login?error=confirm` : `${origin}${next}`);
}
