import type { Metadata } from "next";
import { pageMetadata } from "@/app/_lib/metadata";
import AuthCard from "@/app/_components/auth-card";
import SignupForm from "./signup-form";

export const metadata: Metadata = pageMetadata({
  title: "회원가입",
  description: "링크에 무료로 가입하고 자주 찾는 웹페이지를 나만의 폴더에 저장해 보세요.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <AuthCard footerText="이미 계정이 있나요?" footerLinkLabel="로그인" footerHref="/login">
      <SignupForm />
    </AuthCard>
  );
}
