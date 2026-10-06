"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// 로그인 세션 쿠키를 지우고 로그인 페이지로 이동
export async function logout() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/login");
}
