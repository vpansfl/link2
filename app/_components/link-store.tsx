"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";
import type { Bookmark, Folder } from "@/app/_lib/data";
import {
  deleteFolder,
  insertBookmark,
  insertFolder,
  updateFolderName,
} from "@/app/_lib/db";
import { createClient } from "@/utils/supabase/client";

type LinkStore = {
  // 로그인한 사용자 id (로그아웃 상태면 null)
  userId: string | null;
  folders: Folder[];
  bookmarks: Bookmark[];
  addFolder: (name: string) => Promise<Folder>;
  renameFolder: (folderId: string, name: string) => Promise<void>;
  removeFolder: (folderId: string) => Promise<void>;
  addBookmark: (url: string) => Promise<Bookmark>;
};

type LinkStoreProviderProps = {
  // 로그인한 사용자 id: 저장·수정·삭제를 이 사용자의 데이터로만 한정 (로그아웃 상태면 null)
  userId: string | null;
  initialFolders: Folder[];
  initialBookmarks: Bookmark[];
  children: ReactNode;
};

const LinkStoreContext = createContext<LinkStore | null>(null);

// 로그아웃 상태에선 화면에서 변경 버튼을 막지만, 혹시 호출돼도 저장하지 않음
function requireUser(userId: string | null): string {
  if (!userId) throw new Error("로그인이 필요합니다.");
  return userId;
}

// 처음 데이터는 서버((main) 레이아웃)에서 Supabase로 읽어 오고,
// 변경은 Supabase에 먼저 저장한 뒤 성공하면 화면 상태에 반영함
export function LinkStoreProvider({
  userId,
  initialFolders,
  initialBookmarks,
  children,
}: LinkStoreProviderProps) {
  const [supabase] = useState(createClient);
  const [folders, setFolders] = useState(initialFolders);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);

  const store = useMemo<LinkStore>(
    () => ({
      userId,
      folders,
      bookmarks,
      async addFolder(name) {
        const folder = await insertFolder(supabase, requireUser(userId), name);
        setFolders((prev) => [...prev, folder]);
        return folder;
      },
      async renameFolder(folderId, name) {
        await updateFolderName(supabase, requireUser(userId), folderId, name);
        setFolders((prev) =>
          prev.map((folder) => (folder.id === folderId ? { ...folder, name } : folder)),
        );
      },
      // 폴더만 삭제하고, 그 안의 링크는 폴더 지정만 해제해 All에 남김
      async removeFolder(folderId) {
        await deleteFolder(supabase, requireUser(userId), folderId);
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
        setBookmarks((prev) =>
          prev.map((bookmark) =>
            bookmark.folderId === folderId
              ? { ...bookmark, folderId: undefined }
              : bookmark,
          ),
        );
      },
      async addBookmark(url) {
        const bookmark = await insertBookmark(supabase, requireUser(userId), url);
        setBookmarks((prev) => [bookmark, ...prev]);
        return bookmark;
      },
    }),
    [supabase, userId, folders, bookmarks],
  );

  return <LinkStoreContext value={store}>{children}</LinkStoreContext>;
}

export function useLinkStore(): LinkStore {
  const store = use(LinkStoreContext);
  if (!store) throw new Error("useLinkStore는 LinkStoreProvider 안에서만 사용할 수 있습니다.");
  return store;
}
