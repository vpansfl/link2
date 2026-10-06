"use client";

import Link from "next/link";
import { buttonClassName } from "./button";
import DeleteFolderButton from "./delete-folder-button";
import EditFolderButton from "./edit-folder-button";
import { useLinkStore } from "./link-store";
import SidebarItem from "./sidebar-item";

type SidebarProps = {
  // null이면 아무 항목도 선택하지 않음 (예: /new)
  activeFolderId?: string | null;
  // 로그인하지 않았을 때만 하단에 로그인/회원가입 버튼을 보여줌
  loggedIn: boolean;
};

export default function Sidebar({ activeFolderId, loggedIn }: SidebarProps) {
  const { folders } = useLinkStore();
  // 없는 폴더 id(예: 새로고침으로 사라진 폴더)는 All로 취급
  const currentFolderId =
    activeFolderId === null
      ? null
      : folders.find((folder) => folder.id === activeFolderId)?.id;

  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--card)] px-3 py-5">
      <nav className="flex flex-col gap-1">
        <SidebarItem href="/" label="All" active={currentFolderId === undefined} />

        <p className="mt-5 mb-1.5 px-3.5 text-[13px] font-bold text-[var(--text-sub)]">
          Folders
        </p>
        <ul className="flex flex-col gap-1">
          {folders.map((folder) => (
            <li key={folder.id}>
              <SidebarItem
                href={`/?folder=${folder.id}`}
                label={folder.name}
                active={folder.id === currentFolderId}
                action={
                  // 기본 폴더(모두가 보는 폴더)는 수정·삭제할 수 없음
                  !folder.shared && (
                  <>
                    <EditFolderButton folder={folder} />
                    <DeleteFolderButton
                      folder={folder}
                      active={folder.id === currentFolderId}
                    />
                  </>
                  )
                }
              />
            </li>
          ))}
        </ul>
      </nav>

      {!loggedIn && (
        <div className="mt-auto flex flex-col gap-2 border-t border-[var(--border)] pt-4">
          <Link href="/login" className={`${buttonClassName("primary", "sm")} w-full`}>
            로그인
          </Link>
          <Link href="/signup" className={`${buttonClassName("secondary", "sm")} w-full`}>
            회원가입
          </Link>
        </div>
      )}
    </aside>
  );
}
