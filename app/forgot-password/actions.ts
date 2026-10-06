"use server";

import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// notice는 실패가 아닌 안내(메일 발송 완료) 문구
export type ForgotPasswordState = { error: string | null; notice?: string };

// Supabase Auth 오류 코드를 화면에 보여줄 한국어 문구로 바꿈
const ERROR_MESSAGES: Record<string, string> = {
  email_address_invalid: "올바른 이메일 주소를 입력해 주세요.",
  validation_failed: "올바른 이메일 주소를 입력해 주세요.",
  over_email_send_rate_limit: "메일 발송 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  over_request_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
};

const DEFAULT_ERROR = "메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.";

export async function sendResetLink(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "이메일을 입력해 주세요." };
  }

  const supabase = createClient(await cookies());
  const origin = (await headers()).get("origin");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // 메일의 링크를 누르면 /auth/confirm에서 로그인 처리 후 비밀번호 재설정 페이지로 이동
    redirectTo: origin ? `${origin}/auth/confirm?next=/reset-password` : undefined,
  });

  if (error) {
    return { error: (error.code && ERROR_MESSAGES[error.code]) || DEFAULT_ERROR };
  }
  // 가입 여부를 알려주지 않도록, 없는 이메일이어도 Supabase는 성공으로 응답함
  return {
    error: null,
    notice: `${email}로 비밀번호 재설정 링크를 보냈습니다. 메일함을 확인해 주세요.`,
  };
}
