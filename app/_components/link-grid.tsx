import type { Bookmark } from "@/app/_lib/data";
import LinkCard from "./link-card";

type LinkGridProps = {
  bookmarks: Bookmark[];
};

export default function LinkGrid({ bookmarks }: LinkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-[16px] bg-[var(--card)] py-16 text-center shadow-[var(--shadow)]">
        <p className="text-[16px] font-bold text-[var(--text)]">
          등록된 링크가 없습니다.
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-sub)]">
          오른쪽 위 Add Link 버튼으로 첫 링크를 추가해 보세요.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <LinkCard bookmark={bookmark} />
        </li>
      ))}
    </ul>
  );
}
