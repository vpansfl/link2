import type { Metadata } from "next";
import { pageMetadata } from "@/app/_lib/metadata";
import AuthCard from "@/app/_components/auth-card";
import KakaoLoginButton from "./kakao-login-button";
import LoginForm from "./login-form";

export const metadata: Metadata = pageMetadata({
  title: "로그인",
  description: "링크에 로그인하고 저장해 둔 북마크를 폴더별로 확인하세요. 이메일 또는 카카오 계정으로 간편하게 로그인할 수 있어요.",
  path: "/login",
});

// /auth/confirm에서 인증에 실패하면 ?error=confirm으로 돌아옴
const QUERY_ERRORS: Record<string, string> = {
  confirm: "인증 링크가 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.",
  oauth: "카카오 로그인에 실패했습니다. 다시 시도해 주세요.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const initialError = typeof error === "string" ? (QUERY_ERRORS[error] ?? null) : null;

  return (
    <AuthCard
      footerText="아직 계정이 없나요?"
      footerLinkLabel="회원가입"
      footerHref="/signup"
      extraLink={{ label: "비밀번호를 잊으셨나요?", href: "/forgot-password" }}
    >
      <LoginForm initialError={initialError} />
      <KakaoLoginButton />
    </AuthCard>
  );
}
