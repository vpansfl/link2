import type { Bookmark } from "@/app/_lib/data";

type LinkCardProps = {
  bookmark: Bookmark;
};

export default function LinkCard({ bookmark }: LinkCardProps) {
  const { hostname } = new URL(bookmark.url);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover flex h-full flex-col gap-1.5 rounded-[16px] bg-[var(--card)] p-5"
    >
      <h3 className="truncate text-[16px] leading-[1.4] font-bold text-[var(--text)]">
        {bookmark.title}
      </h3>
      {bookmark.description && (
        <p className="line-clamp-2 text-[13px] leading-[1.4] text-[var(--text-sub)]">
          {bookmark.description}
        </p>
      )}
      <span className="mt-auto max-w-full self-start truncate rounded-[8px] bg-[var(--hover-bg)] px-2.5 py-1 text-[13px] leading-[1.4] font-bold text-[var(--accent)]">
        {hostname}
      </span>
    </a>
  );
}
