import type { ComponentProps } from "react";

type TextInputProps = ComponentProps<"input"> & {
  error?: string | null;
  errorId?: string;
};

export default function TextInput({
  error,
  errorId,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <input
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      className={`text-input min-w-0 rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3.5 py-3 text-[16px] text-[var(--text)] ${className}`}
      {...props}
    />
  );
}

export function FieldError({ id, error }: { id: string; error?: string | null }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-[13px] leading-[1.4] text-[var(--error)]">
      {error}
    </p>
  );
}
