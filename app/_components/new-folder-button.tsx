"use client";

import { useState } from "react";
import Link from "next/link";
import Button, { buttonClassName } from "./button";
import FolderNameForm from "./folder-name-form";
import { useLinkStore } from "./link-store";
import Modal from "./modal";

export default function NewFolderButton() {
  const { userId, folders, addFolder } = useLinkStore();
  const [open, setOpen] = useState(false);

  // 로그아웃 상태에선 폴더를 만들 수 없으니 로그인 페이지로 안내
  if (!userId) {
    return (
      <Link href="/login" className={buttonClassName("secondary", "sm")}>
        + 새 폴더
      </Link>
    );
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        + 새 폴더
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="새 폴더">
        <FolderNameForm
          otherFolders={folders}
          onSubmit={async (name) => {
            await addFolder(name);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
