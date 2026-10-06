import type { Metadata } from "next";
import { pageMetadata } from "@/app/_lib/metadata";
import AppShell from "@/app/_components/app-shell";
import NewLinkForm from "@/app/_components/new-link-form";

export const metadata: Metadata = pageMetadata({
  title: "새 링크 추가",
  description: "저장하고 싶은 웹페이지의 주소를 붙여 넣어 링크에 추가하세요.",
  path: "/new",
  // 로그인한 사용자만 쓰는 화면이라 검색 결과에서 제외
  noindex: true,
});

export default function NewLinkPage() {
  return (
    <AppShell activeFolderId={null}>
      <section className="mx-auto max-w-[640px] rounded-[16px] bg-[var(--card)] p-7 shadow-[var(--shadow)]">
        <h2 className="text-[20px] leading-[1.4] font-bold">새 링크 추가</h2>
        <p className="mt-1 mb-5 text-[13px] leading-[1.4] text-[var(--text-sub)]">
          저장하고 싶은 페이지의 주소를 붙여 넣어 주세요.
        </p>
        <NewLinkForm />
      </section>
    </AppShell>
  );
}
