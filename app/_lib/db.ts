import type { SupabaseClient } from "@supabase/supabase-js";
import type { Bookmark, Folder } from "./data";

type FolderRow = { id: number; name: string; user_id: string | null };
type LinkRow = {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  folder_id: number | null;
};

const LINK_COLUMNS = "id, url, title, description, folder_id";
const FOLDER_COLUMNS = "id, name, user_id";

// DB의 숫자 id를 화면에서 쓰는 문자열 id(URL의 ?folder= 값)로 바꿈
function toFolder(row: FolderRow): Folder {
  return { id: String(row.id), name: row.name, shared: row.user_id === null };
}

function toBookmark(row: LinkRow): Bookmark {
  return {
    id: String(row.id),
    url: row.url,
    title: row.title ?? new URL(row.url).hostname,
    description: row.description ?? "",
    folderId: row.folder_id === null ? undefined : String(row.folder_id),
  };
}

// 조회는 주인 없는 기본 데이터(user_id가 null) + 로그인한 사용자 본인의 데이터만,
// 변경은 본인의 데이터만 다룸 (RLS가 꺼져 있으므로 이 조건이 사용자 간 데이터를 나누는 유일한 장치임)
function visibleTo(userId: string | null): string {
  return userId ? `user_id.is.null,user_id.eq.${userId}` : "user_id.is.null";
}

// 폴더 이름 중복(unique 제약 위반)은 화면에 그대로 보여줄 수 있는 문구로 바꿔 던짐
function throwIfError(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code === "23505") throw new Error("이미 있는 폴더 이름입니다.");
  throw new Error(error.message);
}

export async function fetchFolders(
  supabase: SupabaseClient,
  userId: string | null,
): Promise<Folder[]> {
  const { data, error } = await supabase
    .from("folders")
    .select(FOLDER_COLUMNS)
    .or(visibleTo(userId))
    .order("created_at")
    .order("id");
  throwIfError(error);
  return (data ?? []).map(toFolder);
}

// 페이지 제목에 쓸 폴더 이름 (볼 수 없는 폴더거나 없는 id면 null)
export async function fetchFolderName(
  supabase: SupabaseClient,
  userId: string | null,
  folderId: string,
): Promise<string | null> {
  if (!/^\d+$/.test(folderId)) return null;
  const { data } = await supabase
    .from("folders")
    .select("name")
    .eq("id", folderId)
    .or(visibleTo(userId))
    .maybeSingle();
  return data?.name ?? null;
}

export async function fetchBookmarks(
  supabase: SupabaseClient,
  userId: string | null,
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from("links")
    .select(LINK_COLUMNS)
    .or(visibleTo(userId))
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(toBookmark);
}

export async function insertFolder(
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<Folder> {
  const { data, error } = await supabase
    .from("folders")
    .insert({ name, user_id: userId })
    .select(FOLDER_COLUMNS)
    .single();
  throwIfError(error);
  return toFolder(data!);
}

export async function updateFolderName(
  supabase: SupabaseClient,
  userId: string,
  folderId: string,
  name: string,
): Promise<void> {
  const { error } = await supabase
    .from("folders")
    .update({ name })
    .eq("id", folderId)
    .eq("user_id", userId);
  throwIfError(error);
}

// 연결된 링크의 folder_id는 외래키의 on delete set null로 DB가 비워줌
export async function deleteFolder(
  supabase: SupabaseClient,
  userId: string,
  folderId: string,
): Promise<void> {
  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .eq("user_id", userId);
  throwIfError(error);
}

export async function insertBookmark(
  supabase: SupabaseClient,
  userId: string,
  url: string,
): Promise<Bookmark> {
  const { data, error } = await supabase
    .from("links")
    .insert({ url, title: new URL(url).hostname, user_id: userId })
    .select(LINK_COLUMNS)
    .single();
  throwIfError(error);
  return toBookmark(data!);
}
