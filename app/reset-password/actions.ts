"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ResetPasswordState = { error: string | null };

// Supabase Auth 오류 코드를 화면에 보여줄 한국어 문구로 바꿈
const ERROR_MESSAGES: Record<string, string> = {
  same_password: "이전과 다른 비밀번호를 입력해 주세요.",
  weak_password: "비밀번호가 너무 약합니다. 6자 이상으로 입력해 주세요.",
  session_not_found: "재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 진행해 주세요.",
  session_expired: "재설정 링크가 만료되었습니다. 비밀번호 찾기를 다시 진행해 주세요.",
  over_request_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
};

const DEFAULT_ERROR = "비밀번호를 바꾸지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  // 브라우저에서도 확인하지만, 서버로 직접 들어온 요청도 같은 규칙으로 막음
  if (!password || !passwordConfirm) {
    return { error: "새 비밀번호와 비밀번호 확인을 모두 입력해 주세요." };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  // 재설정 메일의 링크로 들어오며 만들어진 로그인 세션으로 비밀번호를 바꿈
  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: (error.code && ERROR_MESSAGES[error.code]) || DEFAULT_ERROR };
  }

  redirect("/");
}
