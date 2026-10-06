"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Button from "@/app/_components/button";
import TextInput from "@/app/_components/text-input";
import Toast from "@/app/_components/toast";
import { signup } from "./actions";

// seq는 시도할 때마다 늘려서, 같은 오류 문구가 반복돼도 토스트를 다시 띄우는 데 씀
type FormState = { error: string | null; notice?: string; seq: number };

async function submitSignup(prev: FormState, formData: FormData): Promise<FormState> {
  // 비밀번호가 다르면 서버에 요청하지 않고 바로 알려줌
  if (formData.get("password") !== formData.get("passwordConfirm")) {
    return { error: "비밀번호가 일치하지 않습니다.", seq: prev.seq + 1 };
  }
  // 성공하면 서버 액션이 인덱스 페이지로 이동시킴
  const { error, notice } = await signup({ error: null }, formData);
  return { error, notice, seq: prev.seq + 1 };
}

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(submitSignup, { error: null, seq: 0 });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const filled = email.trim() !== "" && password !== "" && passwordConfirm !== "";

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
        // 인증 메일 안내는 읽을 시간이 필요해 더 오래 보여줌
        duration={state.error ? 3000 : 8000}
      />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextInput
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          aria-label="비밀번호 확인"
          autoComplete="new-password"
          required
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
        />
        <Button type="submit" disabled={!filled || pending} className="mt-3.5 w-full">
          {pending ? "가입 중..." : "회원가입"}
        </Button>
      </form>
    </>
  );
}
