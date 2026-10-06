"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// 브라우저 기본 <dialog>로 화면 가운데에 띄우는 모달 (배경 어둡게, ESC로 닫기)
export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      className="modal m-auto w-[calc(100%-40px)] max-w-[400px] rounded-[16px] bg-[var(--card)] p-7 text-[var(--text)] shadow-[var(--shadow-hover)]"
    >
      {/* 닫혀 있을 때는 내용을 비워 다시 열 때마다 입력값/에러가 초기화되도록 함 */}
      {open && (
        <>
          <h2 id={titleId} className="mb-5 text-[20px] leading-[1.4] font-bold">
            {title}
          </h2>
          {children}
        </>
      )}
    </dialog>
  );
}
