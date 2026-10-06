import type { Metadata } from "next";
import { cookies } from "next/headers";
import AppShell from "@/app/_components/app-shell";
import FolderView from "@/app/_components/folder-view";
import { fetchFolderName } from "@/app/_lib/db";
import { pageMetadata } from "@/app/_lib/metadata";
import { createClient } from "@/utils/supabase/server";

function getFolderId(folder: string | string[] | undefined): string | undefined {
  return typeof folder === "string" ? folder : undefined;
}

// 전체 보기는 사이트 기본 제목·설명, 폴더별 보기(?folder=)는 "폴더 이름 | 링크"로 표시
// 폴더별 보기는 전체 목록을 걸러 보는 화면이라(중복 콘텐츠) 검색 결과에서 제외
export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const folderId = getFolderId((await searchParams).folder);
  if (!folderId) return {};

  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const name = await fetchFolderName(supabase, data?.claims.sub ?? null, folderId);
  if (!name) return {};

  return pageMetadata({
    title: name,
    description: `링크의 '${name}' 폴더에 저장된 북마크 모음`,
    path: `/?folder=${folderId}`,
    noindex: true,
  });
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const folderId = getFolderId((await searchParams).folder);

  return (
    <AppShell activeFolderId={folderId}>
      <FolderView folderId={folderId} />
    </AppShell>
  );
}
