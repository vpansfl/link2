alter table public.bookmarks rename to links;
alter index public.bookmarks_folder_id_idx rename to links_folder_id_idx;
alter table public.links rename constraint bookmarks_pkey to links_pkey;
alter table public.links rename constraint bookmarks_folder_id_fkey to links_folder_id_fkey;
