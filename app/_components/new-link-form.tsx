"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateBookmarkUrl } from "@/app/_lib/data";
import Button from "./button";
import { useLinkStore } from "./link-store";
import TextInput, { FieldError } from "./text-input";

export default function NewLinkForm() {
  const router = useRouter();
  const { addBookmark } = useLinkStore();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = String(new FormData(event.currentTarget).get("url") ?? "").trim();
    const validationError = validateBookmarkUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    try {
      await addBookmark(url);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "저장하지 못했어요.");
      setPending(false);
      return;
    }
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3.5 sm:flex-row">
        <TextInput
          type="url"
          name="url"
          required
          placeholder="https://example.com"
          aria-label="링크 URL"
          error={error}
          errorId="url-error"
          onChange={() => setError(null)}
          className="flex-1"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장"}
        </Button>
      </div>
      <FieldError id="url-error" error={error} />
    </form>
  );
}
