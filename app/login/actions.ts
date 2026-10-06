"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type LoginState = { error: string | null };

// Supabase Auth 오류 코드를 화면에 보여줄 한국어 문구로 바꿈
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  email_not_confirmed: "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.",
  validation_failed: "이메일 또는 비밀번호 형식이 올바르지 않습니다.",
  user_banned: "이용이 제한된 계정입니다.",
  email_provider_disabled: "현재 이메일 로그인을 할 수 없습니다.",
  over_request_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
};

const DEFAULT_ERROR = "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // 브라우저에서도 막지만, 서버로 직접 들어온 요청도 같은 규칙으로 막음
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해 주세요." };
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: (error.code && ERROR_MESSAGES[error.code]) || DEFAULT_ERROR };
  }

  redirect("/");
}

// 카카오 로그인 페이지로 보내고, 로그인을 마치면 /auth/confirm에서 세션을 만든 뒤 인덱스로 이동
export async function loginWithKakao(): Promise<LoginState> {
  const supabase = createClient(await cookies());
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo: origin ? `${origin}/auth/confirm` : undefined },
  });

  if (error || !data.url) {
    return { error: "카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect(data.url);
}
