"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string | null;
  // 같은 문구가 다시 와도 새로 띄우기 위한 값 (바뀔 때마다 토스트를 다시 보여줌)
  showKey: number;
  // error: 실패 알림(빨강), info: 안내(액센트)
  tone?: "error" | "info";
  duration?: number;
};

const toneClassNames = {
  error: "bg-[var(--error)]",
  info: "bg-[var(--accent)]",
};

// 화면 중앙 상단에 잠깐 떴다가 사라지는 알림
export default function Toast({ message, showKey, tone = "error", duration = 3000 }: ToastProps) {
  // 처음엔 null이라, 첫 화면부터 문구가 있으면(예: 인증 링크 실패로 돌아온 경우) 바로 보여줌
  const [hiddenKey, setHiddenKey] = useState<number | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setHiddenKey(showKey), duration);
    return () => clearTimeout(timer);
  }, [message, showKey, duration]);

  const visible = Boolean(message) && hiddenKey !== showKey;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-5"
    >
      {visible && (
        <p
          key={showKey}
          className={`toast max-w-[400px] rounded-[12px] ${toneClassNames[tone]} px-5 py-3 text-center text-[14px] leading-[1.4] font-bold text-white shadow-[var(--shadow-hover)]`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
