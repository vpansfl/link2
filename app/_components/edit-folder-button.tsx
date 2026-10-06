"use client";

import { useState } from "react";
import type { Folder } from "@/app/_lib/data";
import FolderNameForm from "./folder-name-form";
import IconButton from "./icon-button";
import { PencilIcon } from "./icons";
import { useLinkStore } from "./link-store";
import Modal from "./modal";

type EditFolderButtonProps = {
  folder: Folder;
};

export default function EditFolderButton({ folder }: EditFolderButtonProps) {
  const { folders, renameFolder } = useLinkStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton label={`${folder.name} 폴더 이름 수정`} onClick={() => setOpen(true)}>
        <PencilIcon />
      </IconButton>

      <Modal open={open} onClose={() => setOpen(false)} title="폴더 이름 수정">
        <FolderNameForm
          otherFolders={folders.filter((f) => f.id !== folder.id)}
          defaultName={folder.name}
          onSubmit={async (name) => {
            await renameFolder(folder.id, name);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
