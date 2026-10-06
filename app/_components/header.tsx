import Link from "next/link";
import { logout } from "@/app/_lib/auth-actions";
import AddLinkButton from "./add-link-button";
import Button from "./button";
import NewFolderButton from "./new-folder-button";

type HeaderProps = {
  loggedIn: boolean;
};

export default function Header({ loggedIn }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between bg-[var(--card)] px-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[20px] font-bold text-[var(--text)]"
      >
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full bg-[var(--point)]"
        />
        링크
      </Link>
      <div className="flex items-center gap-2">
        <NewFolderButton />
        <AddLinkButton />
        {loggedIn && (
          <form action={logout}>
            <Button type="submit" variant="secondary" size="sm">
              로그아웃
            </Button>
          </form>
        )}
      </div>
    </header>
  );
}
