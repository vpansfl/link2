"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Toast from "@/app/_components/toast";
import { resetPassword } from "./actions";

// seq는 시도할 때마다 늘려서, 같은 오류 문구가 반복돼도 토스트를 다시 띄우는 데 씀
type FormState = { error: string | null; seq: number };

async function submitResetPassword(prev: FormState, formData: FormData): Promise<FormState> {
  // 비밀번호가 다르면 서버에 요청하지 않고 바로 알려줌
  if (formData.get("password") !== formData.get("passwordConfirm")) {
    return { error: "비밀번호가 일치하지 않습니다.", seq: prev.seq + 1 };
  }
  // 성공하면 서버 액션이 인덱스 페이지로 이동시킴
  const { error } = await resetPassword({ error: null }, formData);
  return { error, seq: prev.seq + 1 };
}

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(submitResetPassword, {
    error: null,
    seq: 0,
  });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const filled = password !== "" && passwordConfirm !== "";

  // form의 action 대신 onSubmit으로 보내서, 실패해도 입력한 값이 지워지지 않게 함
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <>
      <Toast message={state.error} showKey={state.seq} />
      <p className="mb-5 text-center text-[13px] leading-[1.4] text-[var(--text-sub)]">
        새로 사용할 비밀번호를 입력해 주세요.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <TextInput
          type="password"
          name="password"
          placeholder="새 비밀번호"
          aria-label="새 비밀번호"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextInput
          type="password"
          name="passwordConfirm"
          placeholder="새 비밀번호 확인"
          aria-label="새 비밀번호 확인"
          autoComplete="new-password"
          required
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
        <Button type="submit" disabled={!filled || pending} className="mt-3.5 w-full">
          {pending ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </form>
    </>
  );
}
