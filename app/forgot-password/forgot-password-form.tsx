"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Toast from "@/app/_components/toast";
import { sendResetLink } from "./actions";

// seq는 시도할 때마다 늘려서, 같은 문구가 반복돼도 토스트를 다시 띄우는 데 씀
type FormState = { error: string | null; notice?: string; seq: number };

async function submitForgotPassword(prev: FormState, formData: FormData): Promise<FormState> {
  const { error, notice } = await sendResetLink({ error: null }, formData);
  return { error, notice, seq: prev.seq + 1 };
}

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(submitForgotPassword, {
    error: null,
    seq: 0,
  });
  const [email, setEmail] = useState("");

  // form의 action 대신 onSubmit으로 보내서, 실패해도 입력한 값이 지워지지 않게 함
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <>
      <Toast
        message={state.error ?? state.notice ?? null}
        tone={state.error ? "error" : "info"}
        showKey={state.seq}
        // 메일 발송 안내는 읽을 시간이 필요해 더 오래 보여줌
        duration={state.error ? 3000 : 8000}
      />
      <p className="mb-5 text-center text-[13px] leading-[1.4] text-[var(--text-sub)]">
        가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내 드려요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextInput
          type="email"
          name="email"
          placeholder="이메일"
          aria-label="이메일"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="submit" disabled={email.trim() === "" || pending} className="mt-3.5 w-full">
          {pending ? "보내는 중..." : "비밀번호 재설정 링크 보내기"}
        </Button>
      </form>
    </>
  );
}
