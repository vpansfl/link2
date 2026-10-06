create table public.bookmarks (
  id bigint generated always as identity primary key,
  url text not null,
  title text,
  description text,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

alter table public.bookmarks disable row level security;
