"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Toast from "@/app/_components/toast";
import { login } from "./actions";

// seq는 시도할 때마다 늘려서, 같은 오류 문구가 반복돼도 토스트를 다시 띄우는 데 씀
type FormState = { error: string | null; seq: number };

async function submitLogin(prev: FormState, formData: FormData): Promise<FormState> {
  // 성공하면 서버 액션이 인덱스 페이지로 이동시킴
  const { error } = await login({ error: null }, formData);
  return { error, seq: prev.seq + 1 };
}

type LoginFormProps = {
  // 다른 곳에서 넘어오며 처음부터 보여줄 오류 (예: 인증 링크 실패)
  initialError?: string | null;
};

export default function LoginForm({ initialError = null }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(submitLogin, {
    error: initialError,
    seq: 0,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const filled = email.trim() !== "" && password !== "";

  // form의 action 대신 onSubmit으로 보내서, 실패해도 입력한 값이 지워지지 않게 함
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <>
      <Toast message={state.error} showKey={state.seq} />
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
        <TextInput
          type="password"
          name="password"
          placeholder="비밀번호"
          aria-label="비밀번호"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button type="submit" disabled={!filled || pending} className="mt-3.5 w-full">
          {pending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </>
  );
}
