create table public.folders (
  id bigint generated always as identity primary key,
  name text not null unique check (char_length(name) between 1 and 20),
  created_at timestamptz not null default now()
);

alter table public.folders disable row level security;

alter table public.bookmarks
  add column folder_id bigint references public.folders (id) on delete set null;

create index bookmarks_folder_id_idx on public.bookmarks (folder_id);
