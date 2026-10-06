import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "kakao";
type ButtonSize = "sm" | "md";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  kakao: "btn-kakao",
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "px-[18px] py-[10px] text-[14px]",
  md: "px-6 py-[14px] text-[16px]",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
) {
  return `${variantClassNames[variant]} ${sizeClassNames[size]} inline-flex items-center justify-center rounded-[12px] leading-none font-bold`;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClassName(variant, size)} ${className}`}
      {...props}
    />
  );
}
