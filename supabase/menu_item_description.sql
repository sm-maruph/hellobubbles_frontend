-- Run once in the Supabase SQL Editor for the Hello Bubbles project.

alter table public.menu_items
add column if not exists description text;
