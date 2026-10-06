import Link from "next/link";
import type { ReactNode } from "react";

type SidebarItemProps = {
  href: string;
  label: string;
  active: boolean;
  // 마우스를 올렸을 때 우측에 노출되는 버튼 (예: 폴더 수정/삭제)
  action?: ReactNode;
};

export default function SidebarItem({ href, label, active, action }: SidebarItemProps) {
  return (
    <div className="sidebar-row relative">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block truncate rounded-[12px] px-3.5 py-2.5 text-[15px] font-bold ${
          action ? "pr-[78px]" : ""
        } ${
          active
            ? "bg-[var(--hover-bg)] text-[var(--accent)]"
            : "nav-item text-[var(--text)]"
        }`}
      >
        {label}
      </Link>
      {action && (
        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5">
          {action}
        </div>
      )}
    </div>
  );
}
