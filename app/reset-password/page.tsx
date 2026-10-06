import type { Metadata } from "next";
import { pageMetadata } from "@/app/_lib/metadata";
import AuthCard from "@/app/_components/auth-card";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = pageMetadata({
  title: "비밀번호 재설정",
  description: "링크 계정에서 사용할 새 비밀번호를 설정하세요.",
  path: "/reset-password",
  noindex: true,
});

// 재설정 메일의 링크(/auth/confirm)를 거쳐 로그인된 상태로 들어오는 페이지
// 로그인 세션이 없으면 proxy가 로그인 페이지로 보냄
export default function ResetPasswordPage() {
  return (
    <AuthCard footerText="나중에 바꿀까요?" footerLinkLabel="홈으로" footerHref="/">
      <ResetPasswordForm />
    </AuthCard>
  );
}
