"use client";

import { useActionState } from "react";
import Button from "@/app/_components/button";
import Toast from "@/app/_components/toast";
import { loginWithKakao } from "./actions";

// seq는 시도할 때마다 늘려서, 같은 오류 문구가 반복돼도 토스트를 다시 띄우는 데 씀
type FormState = { error: string | null; seq: number };

async function submitKakaoLogin(prev: FormState): Promise<FormState> {
  // 성공하면 서버 액션이 카카오 로그인 페이지로 이동시킴
  const { error } = await loginWithKakao();
  return { error, seq: prev.seq + 1 };
}

// 카카오 말풍선 심볼 (카카오 로그인 디자인 가이드: 노란 배경 + 검정 심볼)
function KakaoSymbol() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="fill-black">
      <path d="M12 3C6.201 3 1.5 6.665 1.5 11.185c0 2.876 1.905 5.405 4.785 6.866l-.892 3.678c-.206.649-.03.678.472.413l4.408-2.883c.563.073 1.14.11 1.727.11 5.8 0 10.5-3.664 10.5-8.184C22.5 6.665 17.8 3 12 3z" />
    </svg>
  );
}

export default function KakaoLoginButton() {
  const [state, formAction, pending] = useActionState(submitKakaoLogin, {
    error: null,
    seq: 0,
  });

  return (
    <>
      <Toast message={state.error} showKey={state.seq} />
      <form action={formAction} className="mt-2.5">
        <Button type="submit" variant="kakao" disabled={pending} className="w-full gap-2">
          <KakaoSymbol />
          {pending ? "카카오로 이동 중..." : "카카오 로그인"}
        </Button>
      </form>
    </>
  );
}
