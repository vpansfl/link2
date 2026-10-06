import { cookies } from "next/headers";
import { fetchBookmarks, fetchFolders } from "@/app/_lib/db";
import { LinkStoreProvider } from "@/app/_components/link-store";
import { createClient } from "@/utils/supabase/server";

// 인덱스, 폴더별, 새 링크 페이지의 공통 레이아웃
// 로그아웃 상태면 기본 데이터만, 로그인 상태면 기본 데이터 + 본인 데이터를 불러옴
// (새 링크 페이지는 proxy가 로그인한 사용자만 들여보냄)
export default async function MainLayout({ children }: LayoutProps<"/">) {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub ?? null;

  const [folders, bookmarks] = await Promise.all([
    fetchFolders(supabase, userId),
    fetchBookmarks(supabase, userId),
  ]);

  return (
    <LinkStoreProvider userId={userId} initialFolders={folders} initialBookmarks={bookmarks}>
      {children}
    </LinkStoreProvider>
  );
}
