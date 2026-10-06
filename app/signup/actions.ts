"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// notice는 실패가 아닌 안내(인증 메일 발송) 문구
export type SignupState = { error: string | null; notice?: string };

// Supabase Auth 오류 코드를 화면에 보여줄 한국어 문구로 바꿈
const ERROR_MESSAGES: Record<string, string> = {
  user_already_exists: "이미 가입된 이메일입니다.",
  email_exists: "이미 가입된 이메일입니다.",
  email_address_invalid: "올바른 이메일 주소를 입력해 주세요.",
  validation_failed: "이메일 또는 비밀번호 형식이 올바르지 않습니다.",
  weak_password: "비밀번호가 너무 약합니다. 6자 이상으로 입력해 주세요.",
  signup_disabled: "현재 회원가입을 할 수 없습니다.",
  email_provider_disabled: "현재 이메일 회원가입을 할 수 없습니다.",
  over_email_send_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  over_request_rate_limit: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
};

const DEFAULT_ERROR = "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  // 브라우저에서도 확인하지만, 서버로 직접 들어온 요청도 같은 규칙으로 막음
  if (!email || !password || !passwordConfirm) {
    return { error: "이메일, 비밀번호, 비밀번호 확인을 모두 입력해 주세요." };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  const supabase = createClient(await cookies());
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // 인증 메일의 링크를 누르면 /auth/confirm에서 인증을 마치고 인덱스로 이동
    options: { emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined },
  });

  if (error) {
    return { error: (error.code && ERROR_MESSAGES[error.code]) || DEFAULT_ERROR };
  }
  // 이메일 인증이 켜져 있으면 이미 가입된 이메일도 오류 없이 identities가 빈 사용자로 돌아옴
  if (data.user?.identities?.length === 0) {
    return { error: ERROR_MESSAGES.user_already_exists };
  }
  // 이메일 인증이 켜져 있으면 세션 없이 가입만 되므로, 메일 확인을 안내하고 페이지에 머무름
  if (!data.session) {
    return {
      error: null,
      notice: `${email}로 인증 메일을 보냈습니다. 메일의 링크를 눌러 가입을 완료해 주세요.`,
    };
  }

  redirect("/");
}
