alter table public.folders
  add column user_id uuid default auth.uid() references auth.users (id) on delete cascade;
alter table public.links
  add column user_id uuid default auth.uid() references auth.users (id) on delete cascade;

-- 폴더 이름 중복 금지를 전체 기준에서 사용자별 기준으로 변경
alter table public.folders drop constraint folders_name_key;
alter table public.folders add constraint folders_user_id_name_key unique (user_id, name);

create index links_user_id_idx on public.links (user_id);
