import type { ReactNode } from "react";
import Link from "next/link";

type AuthCardProps = {
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  // 하단 안내 문구 위에 따로 두는 링크 (예: 비밀번호 찾기)
  extraLink?: { label: string; href: string };
  // 입력칸과 제출 버튼이 들어 있는 폼
  children: ReactNode;
};

// 로그인/회원가입 페이지에서 함께 쓰는 카드 (헤더·사이드바 없이 화면 가운데 배치)
export default function AuthCard({
  footerText,
  footerLinkLabel,
  footerHref,
  extraLink,
  children,
}: AuthCardProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-9">
      <section className="w-full max-w-[400px] rounded-[16px] bg-[var(--card)] px-6 py-9 shadow-[var(--shadow)] sm:px-8">
        <h1 className="mb-7 flex items-center justify-center gap-2 text-[26px] leading-[1.3] font-bold">
          <span aria-hidden className="h-3 w-3 rounded-full bg-[var(--point)]" />
          링크
        </h1>
        {children}
        {extraLink && (
          <p className="mt-5 text-center text-[13px] leading-[1.4]">
            <Link href={extraLink.href} className="text-link">
              {extraLink.label}
            </Link>
          </p>
        )}
        <p className={`${extraLink ? "mt-2" : "mt-5"} text-center text-[13px] leading-[1.4] text-[var(--text-sub)]`}>
          {footerText}{" "}
          <Link href={footerHref} className="text-link">
            {footerLinkLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}
