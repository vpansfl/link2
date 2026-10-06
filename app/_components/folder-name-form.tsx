"use client";

import { useState, type FormEvent } from "react";
import { FOLDER_NAME_MAX_LENGTH, validateFolderName, type Folder } from "@/app/_lib/data";
import Button from "./button";
import TextInput, { FieldError } from "./text-input";

type FolderNameFormProps = {
  // 이름 중복 검사 대상 (수정 시에는 자기 자신을 제외한 폴더)
  otherFolders: Folder[];
  defaultName?: string;
  // 저장에 실패하면 에러를 던지고, 그 메시지를 입력칸 아래에 보여줌
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
};

// 새 폴더/폴더 수정 팝업에서 함께 쓰는 폴더 이름 입력 폼
export default function FolderNameForm({
  otherFolders,
  defaultName = "",
  onSubmit,
  onCancel,
}: FolderNameFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    const validationError = validateFolderName(name, otherFolders);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPending(true);
    try {
      await onSubmit(name);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "저장하지 못했어요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        name="name"
        required
        autoFocus
        defaultValue={defaultName}
        onFocus={(event) => event.currentTarget.select()}
        maxLength={FOLDER_NAME_MAX_LENGTH}
        placeholder="폴더 이름"
        aria-label="폴더 이름"
        autoComplete="off"
        error={error}
        errorId="folder-name-error"
        onChange={() => setError(null)}
        className="w-full"
      />
      <FieldError id="folder-name-error" error={error} />
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
