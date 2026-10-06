import type { ComponentProps } from "react";

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> & {
  label: string;
  tone?: "default" | "danger";
};

// 사이드바 항목 우측에 마우스를 올렸을 때 노출되는 아이콘 버튼
export default function IconButton({
  label,
  tone = "default",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`sidebar-row-action ${tone === "danger" ? "is-danger" : ""} flex h-8 w-8 items-center justify-center rounded-[8px] ${className}`}
      {...props}
    />
  );
}
