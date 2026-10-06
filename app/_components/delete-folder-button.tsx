"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Folder } from "@/app/_lib/data";
import Button from "./button";
import IconButton from "./icon-button";
import { TrashIcon } from "./icons";
import { useLinkStore } from "./link-store";
import Modal from "./modal";

type DeleteFolderButtonProps = {
  folder: Folder;
  active: boolean;
};

export default function DeleteFolderButton({ folder, active }: DeleteFolderButtonProps) {
  const router = useRouter();
  const { bookmarks, removeFolder } = useLinkStore();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const linkCount = bookmarks.filter((b) => b.folderId === folder.id).length;

  function close() {
    setOpen(false);
    setError(null);
  }

  async function handleDelete() {
    setPending(true);
    try {
      await removeFolder(folder.id);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "삭제하지 못했어요.");
      return;
    } finally {
      setPending(false);
    }
    close();
    // 보고 있던 폴더를 지웠으면 All로 이동
    if (active) router.replace("/");
  }

  return (
    <>
      <IconButton
        label={`${folder.name} 폴더 삭제`}
        tone="danger"
        onClick={() => setOpen(true)}
      >
        <TrashIcon />
      </IconButton>

      <Modal open={open} onClose={close} title="폴더를 삭제할까요?">
        <p className="text-[16px] leading-[1.6]">
          <strong className="font-bold">{folder.name}</strong> 폴더를 삭제합니다.
        </p>
        <p className="mt-1 text-[13px] leading-[1.4] text-[var(--text-sub)]">
          {linkCount > 0
            ? `폴더 안의 링크 ${linkCount}개는 삭제되지 않고 All에 남아요.`
            : "폴더 안에 링크가 없어요."}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-[13px] leading-[1.4] text-[var(--error)]">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" autoFocus onClick={close}>
            취소
          </Button>
          <Button variant="danger" disabled={pending} onClick={handleDelete}>
            {pending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
