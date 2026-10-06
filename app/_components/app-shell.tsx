import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Header from "./header";
import Sidebar from "./sidebar";

type AppShellProps = {
  activeFolderId?: string | null;
  children: ReactNode;
};

export default async function AppShell({ activeFolderId, children }: AppShellProps) {
  // 로그인 여부에 따라 헤더의 로그아웃 버튼, 사이드바의 로그인/회원가입 버튼을 바꿔 보여줌
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);

  return (
    <div className="flex h-screen flex-col">
      <Header loggedIn={loggedIn} />
      <div className="flex min-h-0 flex-1">
        <Sidebar activeFolderId={activeFolderId} loggedIn={loggedIn} />
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] px-5 pt-9 pb-12 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
