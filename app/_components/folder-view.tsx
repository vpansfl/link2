"use client";

import { filterByFolder } from "@/app/_lib/data";
import { useLinkStore } from "./link-store";
import LinkGrid from "./link-grid";

type FolderViewProps = {
  folderId?: string;
};

export default function FolderView({ folderId }: FolderViewProps) {
  const { folders, bookmarks } = useLinkStore();
  const activeFolder = folders.find((folder) => folder.id === folderId);
  const visibleBookmarks = filterByFolder(bookmarks, activeFolder?.id);

  return (
    <>
      <div className="mb-5 flex items-center gap-2">
        <h2 className="text-[20px] leading-[1.4] font-bold">
          {activeFolder?.name ?? "All"}
        </h2>
        <span className="rounded-[8px] bg-[var(--hover-bg)] px-2.5 py-0.5 text-[13px] font-bold text-[var(--accent)]">
          {visibleBookmarks.length}
        </span>
      </div>
      <LinkGrid bookmarks={visibleBookmarks} />
    </>
  );
}
