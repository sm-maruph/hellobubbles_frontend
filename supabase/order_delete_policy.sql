-- Run once in the Supabase SQL Editor for the Hello Bubbles project.
-- The admin UI already requires an authenticated Supabase session.

grant select, delete on table public.orders to authenticated;

drop policy if exists "Authenticated admins can delete orders" on public.orders;

create policy "Authenticated admins can delete orders"
on public.orders
for delete
to authenticated
using (true);
