import type { Metadata } from "next";
import { pageMetadata } from "@/app/_lib/metadata";
import AuthCard from "@/app/_components/auth-card";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = pageMetadata({
  title: "비밀번호 찾기",
  description: "가입한 이메일로 비밀번호 재설정 링크를 받아 보세요.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthCard footerText="비밀번호가 기억났나요?" footerLinkLabel="로그인" footerHref="/login">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
